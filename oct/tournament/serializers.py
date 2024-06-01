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
    fields = ['osu_id', 'osu_username', 'osu_avatar', 'osu_cover', 'is_admin', 'user_roles']


@serializer
class StaticPlayerSerializer:
    model = StaticPlayer
    fields = ['user', 'team', 'osu_rank', 'is_captain', 'tier']


@serializer
class TournamentTeamSerializer:
    model = TournamentTeam
    fields = ['id', 'name', 'icon', 'seed', 'players']
    excludes = ["players.team"]


@serializer
class TournamentMatchSerializer:
    model = TournamentMatch
    fields = [
        'tournament_round',
        'match_id',
        'teams',
        'team_order',
        'starting_time',
        'is_losers',
        'osu_match_id',
        'bans',
        'picks',
        'wins',
        'finished',
        'referee',
        'streamer',
        'commentator1',
        'commentator2',
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
    fields = ['tournament_iteration']


@serializer
class TournamentIterationSerializer:
    model = TournamentIteration
    fields = ['name', 'full_name', 'users', 'start_date', 'end_date', 'thumbnail', 'links', 'date_span']


@serializer
class TournamentInvolvementSerializer:
    model = TournamentInvolvement
    fields = ['user', 'tournament_iteration', 'roles', 'join_date']
