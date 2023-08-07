from .models import *

from typing import Type, List, Union, Iterable
from django.db.models.fields.related_descriptors import ForwardManyToOneDescriptor, ManyToManyDescriptor
from time import monotonic


_SERIALIZERS: List[Type['Serializer']] = []


class Serializer:
    model: Type[models.Model]
    fields: List[str]

    def __init__(self, obj: Union[models.Model, Iterable], many: bool = False):
        self.obj: Union[models.Model, Iterable] = obj
        self.many: bool = many

    def _get_serializer_of_obj(self, obj) -> Type['Serializer']:
        for serializer in _SERIALIZERS:
            if isinstance(obj, serializer.model):
                return serializer
        raise NotImplementedError(f"Could not find serializer for {obj.__class__.__name__}")

    def _get_serializer_of_model(self, model) -> Type['Serializer']:
        for serializer in _SERIALIZERS:
            if model == serializer.model:
                return serializer
        raise NotImplementedError(f"Could not find serializer for {model}")

    def _transform(self, obj, fields):
        data = {}
        for field in fields:
            field_type = getattr(self.model, field)
            value = getattr(obj, field)
            if value is None:
                data[field] = value
                continue
            if isinstance(field_type, ForwardManyToOneDescriptor):
                serializer = self._get_serializer_of_obj(value)
                data[field] = serializer(value).serialize()
            elif isinstance(field_type, ManyToManyDescriptor):
                serializer = self._get_serializer_of_model(value.model)
                data[field] = serializer(value.all(), many=True).serialize()
            else:
                data[field] = value
        return data

    def serialize(self, exclude=None, extra=None):
        if exclude is None:
            exclude = []
        if extra is None:
            extra = []
        fields = list(self.fields)
        for field in exclude:
            fields.remove(field)
        for field in extra:
            fields.append(field)

        transform = lambda obj: self._transform(obj, fields)
        ret = transform(self.obj) if not self.many else list(map(transform, self.obj))
        return ret

def serializer(cls):
    new_cls = type(cls.__name__, (Serializer, cls), {})
    _SERIALIZERS.append(new_cls)
    return new_cls


@serializer
class MappoolBeatmapSerializer:
    model = MappoolBeatmap
    fields = [
        'beatmap_id',
        'modification',
        'artist',
        'title',
        'difficulty',
        'star_rating',
        'overall_difficulty',
        'approach_rate',
        'circle_size',
        'health_drain',
        'cover'
    ]


@serializer
class UserSerializer:
    model = User
    fields = ['osu_id', 'osu_username', 'osu_avatar', 'osu_cover', 'is_admin']

@serializer
class StaticPlayerSerializer:
    model = StaticPlayer
    fields = ['user', 'team', 'osu_rank', 'is_captain', 'tier']

@serializer
class TeamSerializer:
    model = TournamentTeam
    fields = ['name']

@serializer
class TournamentMatchSerializer:
    model = TournamentMatch
    fields = [
        'tournament_round',
        'match_id',
        'teams',
        'starting_time',
        'is_losers',
        'osu_match_id',
        'bans',
        'picks',
        'wins',
        'referee',
        'streamer',
        'commentator1',
        'commentator2'
    ]

@serializer
class TournamentRoundSerializer:
    model = TournamentRound
    fields = ['bracket', 'name', 'full_name', 'start_date']

@serializer
class TournamentBracketSerializer:
    model = TournamentBracket
    fields = ['tournament_iteration']

@serializer
class TournamentIterationSerializer:
    model = TournamentIteration
    fields = ['name', 'full_name', 'users', 'start_date', 'end_date', 'thumbnail', 'links']


@serializer
class TournamentInvolvementSerializer:
    model = TournamentInvolvement
    fields = ['user', 'tournament_iteration', 'roles', 'join_date']
