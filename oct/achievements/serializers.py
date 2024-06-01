from .models import *
from common import serializer


@serializer
class AchievementSerializer:
    model = Achievement
    fields = ["name", "category"]


@serializer
class AchievementCompletionSerializer:
    model = AchievementCompletion
    fields = ["time_completed"]


@serializer
class TeamSerializer:
    model = Team
    fields = ["name", "icon"]


@serializer
class PlayerSerializer:
    model = Player
    fields = ["completed_achievements"]
