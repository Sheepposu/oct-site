from .models import *
from common import serializer


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
    # involvements should be selected by default
    fields = ['osu_id', 'osu_username', 'osu_avatar', 'osu_cover', 'is_admin', 'involvements', 'roles']


@serializer
class StaticPlayerSerializer:
    model = StaticPlayer
    fields = ['osu_rank', 'is_captain', 'tier']


@serializer
class TournamentTeamSerializer:
    model = TournamentTeam
    fields = ['id', 'name', 'icon', 'seed']


@serializer
class TournamentMatchSerializer:
    model = TournamentMatch
    fields = [
        'match_id',
        'team_order',
        'starting_time',
        'is_losers',
        'osu_match_id',
        'bans',
        'picks',
        'wins',
        'finished',
        'winner',
        'progress',
        'has_started',
        'round_str'
    ]

@serializer
class TournamentRoundSerializer:
    model = TournamentRound
    fields = ['name', 'full_name', 'start_date']


@serializer
class TournamentBracketSerializer:
    model = TournamentBracket
    fields = []


@serializer
class TournamentIterationSerializer:
    model = TournamentIteration
    fields = ['name', 'full_name', 'start_date', 'end_date', 'thumbnail', 'links', 'date_span']


@serializer
class TournamentInvolvementSerializer:
    model = TournamentInvolvement
    fields = ['roles', 'join_date']
