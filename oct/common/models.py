from django.db.models import Model, ForeignKey
from django.db import connection

from typing import Iterable

from collections import defaultdict


__all__ = ("RelationCachingModel",)


def _group_related_fields(related_fields: Iterable):
    groupings = {}
    for field in related_fields:
        result = field.split(".", 1)
        now, later = result if len(result) == 2 else (result[0], None)
        if now in groupings and later is not None:
            groupings[now].append(later)
        else:
            groupings[now] = [later] if later is not None else []
    return groupings


def _get_columns(model, related_fields: Iterable, table_as=None):
    columns = (model, [])
    joins = []
    includes = _group_related_fields(related_fields)
    for field in model._meta.fields+tuple(filter(lambda f: f.one_to_many, model._meta.related_objects)):
        try:
            include = includes.pop(field.name)  # key error if not include

            # add join before getting next columns
            is_one_to_one = isinstance(field, ForeignKey)
            target_column, column = (field.target_field.column, field.column) if is_one_to_one else \
                (field.field.column, field.target_field.column)
            child_table_as = field.name if table_as is None else table_as+"_"+field.name
            joins.append(
                (field.related_model._meta.db_table, target_column, table_as or model._meta.db_table, column, is_one_to_one, child_table_as)
            )

            new_columns, new_joins = _get_columns(field.related_model, include, child_table_as)
            columns[1].append((field, new_columns))
            joins += new_joins
        except KeyError:
            if hasattr(field, "column"):
                columns[1].append((field, f"{table_as or model._meta.db_table}.{field.column}"))

    if len(includes) != 0:
        raise ValueError(f"Invalid field {next(iter(includes.keys()))}")
    
    return columns, joins


def _parse_rows(rows, columns, many):
    model, columns = columns
    grouped_rows = defaultdict(list)

    pk_i = 0
    for item in columns:
        if item[0].primary_key:
            break
        if isinstance(item[1], str):
            pk_i += 1

    for row in rows:
        grouped_rows[row[pk_i]].append(row)

    # def iter_row_groupings():
    #     pk_i = 0
    #     for item in columns:
    #         if item[0].primary_key:
    #             break
    #         if isinstance(item[1], str):
    #             pk_i += 1
    #     last_pk = None
    #     for i, row in enumerate(rows):
    #         if row[pk_i] != last_pk:
    #             yield i
    #             last_pk = row[pk_i]
    #     yield len(rows)

    objs = []
    for rows in grouped_rows.values():
        values = {}
        reverse_values = {}
        value_i = 0
        for field, child_columns in columns:
            if isinstance(child_columns, tuple):
                is_reverse = not isinstance(field, ForeignKey)
                (reverse_values if is_reverse else values)[field.name] = _parse_rows(
                    [row[value_i:] for row in rows],
                    child_columns,
                    is_reverse
                )
                
                count_values = lambda columns: sum([1 if isinstance(column[1], str) else count_values(column[1]) for column in columns[1]])
                value_i += count_values(child_columns)
            else:
                value = rows[0][value_i]
                try:
                    value = field.from_db_value(value, None, None)
                except AttributeError:
                    pass
                values[field.name+"_id" if isinstance(field, ForeignKey) else field.name] = value
                value_i += 1

        # LEFT JOIN that returned empty columns for the query
        if all(map(lambda value: value is None, values.values())):
            continue

        obj = model(**values)
        obj._state.adding = False
        obj._state.db = "default"
        for attr, value in reverse_values.items():
            obj._relation_cache[attr] = value
        objs.append(obj)
    return objs if many else (objs[0] if len(objs) > 0 else None)


def _get_field(m, attr):
    if attr == "pk":
        return next(filter(lambda f: f.primary_key, m._meta.fields))
    else:
        return getattr(m, attr).field
    

def _deconstruct(model, kw):
    field_name = kw.split("__", 1)[0]
    
    last_model = model
    field = _get_field(model,  field_name)
    table = field_name if isinstance(field, ForeignKey) else ""
    is_fk = isinstance(field, ForeignKey)
    for attr in kw.split("__")[1:]:
        last_model = field.target_field.model if is_fk and last_model._meta.db_table != field.target_field.model._meta.db_table else field.model
        field = _get_field(
            last_model,
            attr
        )

        is_fk = isinstance(field, ForeignKey)
        if is_fk:
            table = table if table == "" else table + "_" + field.name
    return (field.target_field if isinstance(field, ForeignKey) else field), table


def _get_where(model, **kwargs):
    if len(kwargs) == 0:
        return "", None
    return "WHERE " + ",".join((
        f"{table or field.model._meta.db_table}."+field.column + " = %s"
        for field, table in map(lambda kw: _deconstruct(model, kw), kwargs.keys())
    )), tuple(kwargs.values())


class RelationCachingModel(Model):
    def __init__(self, *args, call_super=True, **kwargs):
        self._relation_cache = {}

        if call_super:
            super().__init__(*args, **kwargs)

    def __getattribute__(self, item):
        try:
            return object.__getattribute__(self, "_relation_cache")[item]
        except KeyError:
            return super().__getattribute__(item)

    # TODO: use querysets maybe
    @classmethod
    def select_with(cls, related_fields: Iterable, limit=None, offset=None, **kwargs):
        def stringify(columns):
            return ','.join(map(lambda item: item[1] if isinstance(item[1], str) else stringify(item[1]), columns[1]))

        columns, joins = _get_columns(cls, related_fields)

        joins = ' '.join(map(
            lambda
                join: f"{'INNER' if join[4] else 'LEFT'} JOIN {join[0]}{'' if join[5] == join[0] else ' AS '+join[5]} ON ({join[5]}.{join[1]} = {join[2]}.{join[3]})",
            joins
        ))
        columns_str = stringify(columns)
        where_str, vars = _get_where(cls, **kwargs)
        with connection.cursor() as cursor:
            cursor.execute(
                f"SELECT {columns_str} FROM {cls._meta.db_table} {joins} {where_str}"
                f"{'' if limit is None else ' LIMIT %d' % limit}"
                f"{'' if offset is None else ' OFFSET %d' % offset}",
                vars
            )
            return _parse_rows(cursor.fetchall(), columns, True)

    class Meta:
        abstract = True
