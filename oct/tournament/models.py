from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.conf import settings

import uuid
from enum import IntFlag, IntEnum, auto
from osu import Client, AuthHandler, GameModeStr, Mods
from datetime import datetime, timezone

from common import get_auth_handler, enum_field, date_to_string


OSU_CLIENT: Client = settings.OSU_CLIENT


class UserRoles(IntFlag):
    # max 15 fields cuz small integer field
    REGISTERED_PLAYER = auto()
    REFEREE = auto()
    STREAMER = auto()
    COMMENTATOR = auto()
    PLAYTESTER = auto()
    MAPPOOLER = auto()
    HOST = auto()
    CUSTOM_MAPPER = auto()

    def get_roles(self):
        count = 1
        value = self.value
        while count <= value:
            if count & value:
                yield UserRoles(count)
            count <<= 1


class BracketType(IntEnum):
    DOUBLE_ELIMINATION = 0


@enum_field(UserRoles, models.PositiveSmallIntegerField)
class UserRolesField:
    pass


@enum_field(BracketType, models.PositiveSmallIntegerField)
class BracketTypeField:
    pass


class UserManager(BaseUserManager):
    def create_user(self, code):
        auth: AuthHandler = get_auth_handler()
        try:
            auth.get_auth_token(code)
            client = Client(auth)
            user = client.get_own_data(GameModeStr.STANDARD)
        except:
            return
        try:
            user_obj = User.objects.get(osu_id=user.id)
            user_obj.refresh_token = auth.refresh_token
            user_obj.osu_username = user.username
            user_obj.osu_avatar = user.avatar_url
            user_obj.osu_cover = user.cover["url"]
        except User.DoesNotExist:
            user_obj = User(osu_id=user.id, osu_username=user.username, osu_avatar=user.avatar_url, osu_cover=user.cover["url"],
                            refresh_token=auth.refresh_token)
        user_obj.save()
        return user_obj


class User(AbstractBaseUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    osu_id = models.PositiveIntegerField(unique=True, editable=False)
    osu_username = models.CharField(max_length=15, unique=True)
    osu_avatar = models.CharField(default="")
    osu_cover = models.CharField(default="")

    refresh_token = models.CharField(default="")

    is_admin = models.BooleanField(default=False)

    USERNAME_FIELD = "osu_username"
    EMAIL_FIELD = None
    REQUIRED_FIELDS = [
        "osu_id",
    ]

    objects = UserManager()

    def get_tournament_involvement(self, **kwargs):
        return TournamentInvolvement.objects.filter(user=self, **kwargs)

    def __str__(self):
        return self.osu_username


class TournamentIteration(models.Model):
    name = models.CharField(max_length=8, primary_key=True)
    full_name = models.CharField(max_length=32)
    users = models.ManyToManyField(User, through="TournamentInvolvement")
    start_date = models.DateField()
    end_date = models.DateField()
    thumbnail = models.CharField(max_length=32)
    links = models.JSONField(default=list)

    def get_brackets(self, **kwargs):
        return TournamentBracket.objects.filter(tournament_iteration=self, **kwargs)

    def __str__(self):
        return self.name

    @property
    def date_span(self):
        return f"{date_to_string(self.start_date)} - {date_to_string(self.end_date)}"


class TournamentInvolvement(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    tournament_iteration = models.ForeignKey(TournamentIteration, on_delete=models.CASCADE)
    roles = UserRolesField(default=0)
    join_date = models.DateTimeField(null=True)

    def __str__(self):
        return f"{self.user} {self.tournament_iteration} Involvement"


class TournamentBracket(models.Model):
    # one-to-many relationship in case multiple brackets are used
    # in the future
    tournament_iteration = models.ForeignKey(TournamentIteration, on_delete=models.CASCADE)
    type = BracketTypeField(default=BracketType.DOUBLE_ELIMINATION)

    def get_rounds(self, **kwargs):
        return TournamentRound.objects.filter(bracket=self, **kwargs)

    def __str__(self):
        return f"{self.tournament_iteration} Bracket"


class TournamentTeam(models.Model):
    bracket = models.ForeignKey(TournamentBracket, on_delete=models.RESTRICT)
    name = models.CharField(max_length=64)
    icon = models.CharField(max_length=64, null=True)

    def get_players_with_user(self):
        return StaticPlayer.objects.select_related("user").filter(team=self)

    def __str__(self):
        return self.name


class StaticPlayer(models.Model):
    user = models.ForeignKey(User, on_delete=models.RESTRICT)
    team = models.ForeignKey(TournamentTeam, on_delete=models.CASCADE)
    osu_rank = models.PositiveIntegerField()
    is_captain = models.BooleanField(default=False)
    tier = models.CharField(max_length=1, null=True)

    def __str__(self):
        return f"{self.team}: {self.user} #{self.osu_rank}"


class Mappool(models.Model):
    def get_rounds(self, **kwargs):
        return TournamentRound.objects.filter(mappool=self, **kwargs)

    def get_beatmaps(self, **kwargs):
        return MappoolBeatmap.objects.filter(mappool=self, **kwargs)


class TournamentRound(models.Model):
    bracket = models.ForeignKey(TournamentBracket, on_delete=models.CASCADE)
    mappool = models.ForeignKey(Mappool, on_delete=models.RESTRICT)
    name = models.CharField(max_length=16)
    full_name = models.CharField(max_length=32)
    start_date = models.DateField()

    def get_matches(self, **kwargs):
        return TournamentMatch.objects.filter(tournament_round=self, **kwargs)

    def __str__(self):
        return f"{self.bracket.tournament_iteration.name}: {self.name}"

    @property
    def str_date(self):
        return date_to_string(self.start_date)


class TournamentMatch(models.Model):
    tournament_round = models.ForeignKey(TournamentRound, on_delete=models.CASCADE)
    match_id = models.PositiveSmallIntegerField()
    teams = models.ManyToManyField(TournamentTeam)
    starting_time = models.DateTimeField(null=True)
    is_losers = models.BooleanField(default=False)
    osu_match_id = models.PositiveIntegerField(null=True)

    bans = models.CharField(max_length=32, null=True)
    picks = models.CharField(max_length=64, null=True)
    wins = models.CharField(max_length=16, null=True)

    referee = models.ForeignKey(User, on_delete=models.RESTRICT, null=True, related_name="+")
    streamer = models.ForeignKey(User, on_delete=models.RESTRICT, null=True, related_name="+")
    commentator1 = models.ForeignKey(User, on_delete=models.RESTRICT, null=True, related_name="+")
    commentator2 = models.ForeignKey(User, on_delete=models.RESTRICT, null=True, related_name="+")
    
    @property
    def color(self):
        return "#8A8AFF" if self.starting_time is not None and \
                            datetime.now(tz=timezone.utc) > self.starting_time else "#AAAAAA"

    @property
    def time_str(self):
        return self.starting_time.strftime("%m/%d %H:%M (%Z)") \
            if self.starting_time else "No scheduled time"

    def __str__(self):
        return f"{self.tournament_round} Match {self.match_id}"


class MappoolBeatmap(models.Model):
    mappool = models.ForeignKey(Mappool, on_delete=models.CASCADE)
    beatmap_id = models.PositiveIntegerField()
    modification = models.CharField(max_length=4)
    artist = models.CharField()
    title = models.CharField()
    difficulty = models.CharField()
    star_rating = models.FloatField()
    overall_difficulty = models.FloatField()
    approach_rate = models.FloatField()
    circle_size = models.FloatField()
    health_drain = models.FloatField()
    cover = models.CharField()

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        self.color = {
            "NM": "#52a1ff",
            "HD": "#ffe599",
            "HR": "#ea9999",
            "DT": "#b4a7d6",
            "FM": "",
            "EZ": "99ea99",
            "TB": "#d5a6bd"
        }[self.modification[:2]]
        self.cs_percent = str(self.circle_size * 10)+"%"
        self.ar_percent = str(round(
            self.approach_rate / (11 if self.modification.startswith("DT") else 10) * 100, 1
        ))+"%"
        self.od_percent = str(round(
            self.overall_difficulty / (11 if self.modification.startswith("DT") else 10) * 100, 1
        ))+"%"
        self.hp_percent = str(self.health_drain * 10)+"%"
        self.rounded_sr = round(self.star_rating, 2)

    @property
    def rounded_ar(self):
        return round(self.approach_rate, 1)

    @property
    def rounded_od(self):
        return round(self.overall_difficulty, 1)

    @property
    def rounded_cs(self):
        return round(self.circle_size, 1)

    @property
    def rounded_hp(self):
        return round(self.health_drain, 1)

    @classmethod
    def from_beatmap_id(cls, mappool: Mappool, modification: str, beatmap_id: int):
        modification = modification.upper()
        beatmap = OSU_CLIENT.get_beatmap(beatmap_id)
        mod = modification[:2]
        beatmap_difficulty = OSU_CLIENT.get_beatmap_attributes(
            beatmap_id,
            mods=Mods.get_from_abbreviation(mod) if mod not in ("NM", "FM", "TB") else None,
            ruleset=GameModeStr.STANDARD
        )
        circle_size = beatmap.cs
        health_drain = beatmap.drain
        if mod == "HR":
            circle_size = min(circle_size * 1.3, 10)
            health_drain = min(health_drain * 1.4, 10)
        elif mod == "EZ":
            circle_size *= 0.5
            health_drain *= 0.5
        return cls(
            mappool=mappool,
            beatmap_id=beatmap_id,
            modification=modification,
            artist=beatmap.beatmapset.artist,
            title=beatmap.beatmapset.title,
            difficulty=beatmap.version,
            star_rating=beatmap_difficulty.star_rating,
            overall_difficulty=beatmap_difficulty.mode_attributes.overall_difficulty,
            approach_rate=beatmap_difficulty.mode_attributes.approach_rate,
            circle_size=circle_size,
            health_drain=health_drain,
            cover=beatmap.beatmapset.covers.cover_2x
        )

    def __str__(self):
        return f"{self.modification}"
