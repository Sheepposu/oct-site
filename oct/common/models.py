from django.db.models import Model, ForeignKey
from django.db import connection

from typing import Iterable


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


def _get_columns(model, related_fields: Iterable):
    columns = (model, [])
    joins = []
    includes = _group_related_fields(related_fields)
    for field in model._meta.fields+tuple(filter(lambda f: f.one_to_many, model._meta.related_objects)):
        try:
            include = includes[field.name]  # key error if not include

            # add join before getting next columns
            is_one_to_one = isinstance(field, ForeignKey)
            target_column, column = (field.target_field.column, field.column) if is_one_to_one else \
                (field.field.column, field.target_field.column)
            joins.append(
                (field.related_model._meta.db_table, target_column, model._meta.db_table, column, is_one_to_one)
            )

            new_columns, new_joins = _get_columns(field.related_model, include)
            columns[1].append((field, new_columns))
            joins += new_joins
        except KeyError:
            if hasattr(field, "column"):
                columns[1].append((field, f"{model._meta.db_table}.{field.column}"))
    return columns, joins


def _parse_rows(rows, columns, many):
    model, columns = columns

    def iter_row_groupings():
        pk_i = 0
        for item in columns:
            if item[0].primary_key:
                break
            if isinstance(item[1], str):
                pk_i += 1
        last_pk = None
        for i, row in enumerate(rows):
            if row[pk_i] != last_pk:
                yield i
                last_pk = row[pk_i]
        yield len(rows)

    objs = []

    row_groupings = iter_row_groupings()
    next_row_grouping_i = next(row_groupings)
    for row_i, row in enumerate(rows):
        if row_i != next_row_grouping_i:
            continue

        next_row_grouping_i = next(row_groupings)

        values = {}
        reverse_values = {}
        value_i = 0
        for field, child_columns in columns:
            if isinstance(child_columns, tuple):
                is_reverse = not isinstance(field, ForeignKey)
                (reverse_values if is_reverse else values)[field.name] = _parse_rows(
                    [row[value_i:] for row in rows[row_i:next_row_grouping_i]],
                    child_columns,
                    is_reverse
                )
                value_i += len([column for column in child_columns[1] if isinstance(column[1], str)])
            else:
                value = rows[row_i][value_i]
                try:
                    value = field.from_db_value(value, None, None)
                except AttributeError:
                    pass
                values[field.name+"_id" if isinstance(field, ForeignKey) else field.name] = value
                value_i += 1

        obj = model(**values)
        obj._state.adding = False
        obj._state.db = "default"
        for attr, value in reverse_values.items():
            obj._relation_cache[attr] = value
        objs.append(obj)
    return objs if many else (objs[0] if len(objs) > 0 else None)


def _get_where(model, **kwargs):
    return "WHERE " + ",".join(
        (f"{model._meta.db_table}."+next(filter(lambda f: f.name == kw or (kw == "pk" and f.primary_key), model._meta.fields)).column + " = %s"
         for kw in kwargs.keys())
    ), tuple(kwargs.values())


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
    def select_with(cls, related_fields: tuple, **kwargs):
        def stringify(columns):
            return ','.join(map(lambda item: item[1] if isinstance(item[1], str) else stringify(item[1]), columns[1]))

        columns, joins = _get_columns(cls, related_fields)

        joins = ' '.join(map(
            lambda
                join: f"{'INNER' if join[4] else 'LEFT'} JOIN {join[0]} ON ({join[0]}.{join[1]} = {join[2]}.{join[3]})",
            joins
        ))
        columns_str = stringify(columns)
        where_str, vars = _get_where(cls, **kwargs)
        with connection.cursor() as cursor:
            cursor.execute(f"SELECT {columns_str} FROM {cls._meta.db_table} {joins} {where_str}", vars)
            return _parse_rows(cursor.fetchall(), columns, True)

    class Meta:
        abstract = True
