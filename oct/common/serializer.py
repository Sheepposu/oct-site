from django.db import models
from typing import Type, List, Union, Iterable, Dict
from django.db.models.fields.related_descriptors import ForwardManyToOneDescriptor, ReverseManyToOneDescriptor
from collections import defaultdict
from datetime import datetime


_SERIALIZERS: List[Type['Serializer']] = []


class Serializer:
    # TODO: incorporate select_related
    model: Type[models.Model]
    fields: List[str]
    excludes: List[str] = []
    transforms: Dict[str, str] = {}

    def __init__(self, obj: Union[models.Model, Iterable], many: bool = False):
        self.obj: Union[models.Model, Iterable] = obj
        self.many: bool = many

    def _get_serializer_of_obj(self, obj) -> Type['Serializer']:
        for serializer in _SERIALIZERS:
            if isinstance(obj, serializer.model):
                return serializer
        raise ValueError(f"Could not find serializer for {obj.__class__.__name__}")

    def _get_serializer_of_model(self, model) -> Type['Serializer']:
        for serializer in _SERIALIZERS:
            if model == serializer.model:
                return serializer
        raise ValueError(f"Could not find serializer for {model}")

    def _transform(self, obj, fields, exclude, include):
        data = {}
        for field in fields:
            field_type = getattr(self.model, field)
            json_name = self.transforms[field] if field in self.transforms else field
            value = getattr(obj, field)
            if value is None:
                data[json_name] = None
                continue
            if isinstance(field_type, ForwardManyToOneDescriptor):
                serializer = self._get_serializer_of_obj(value)
                data[json_name] = serializer(value).serialize(
                    exclude.get(field, [])+serializer.excludes,
                    include.get(field)
                )
            elif isinstance(field_type, ReverseManyToOneDescriptor):
                try:
                    serializer = self._get_serializer_of_model(value.model)(value.all(), many=True)
                except AttributeError:  # value is a list (cached value)
                    if len(value) == 0:
                        data[json_name] = []
                        continue
                    serializer = self._get_serializer_of_obj(value[0])(value, many=True)
                data[json_name] = serializer.serialize(
                    exclude.get(field, []) + serializer.excludes,
                    include.get(field)
                )
            elif isinstance(value, datetime):
                data[json_name] = value.isoformat()
            else:
                data[json_name] = value
        return data

    def _separate_field_args(self, fields, only_include_last=False):
        now = []
        later = defaultdict(list)
        for field in fields:
            split = field.split(".", 1)
            if len(split) > 1:
                later[split[0]].append(split[1])
            if not only_include_last or len(split) == 1:
                now.append(split[0])
        return now, later

    def serialize(self, exclude=None, include=None):
        if exclude is None:
            exclude = self.excludes
        if include is None:
            include = []
        exclude_now, exclude_later = self._separate_field_args(exclude, only_include_last=True)
        include_now, include_later = self._separate_field_args(include)

        fields = list(self.fields)
        for field in exclude_now:
            fields.remove(field)
        for field in include_now:
            fields.append(field)

        transform = lambda obj: self._transform(obj, fields, exclude_later, include_later)
        ret = transform(self.obj) if not self.many else list(map(transform, self.obj))
        return ret


def serializer(cls):
    new_cls = type(cls.__name__, (cls, Serializer), {})
    _SERIALIZERS.append(new_cls)
    return new_cls