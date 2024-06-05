from django.db import models
from django.contrib.auth import get_user_model

from common import RelationCachingModel

User = get_user_model()

class Team(RelationCachingModel):
    name = models.CharField(max_length=32, unique=True)
    icon = models.CharField(max_length=64, null=True)
    invite = models.CharField(max_length=16)
    

class Achievement(RelationCachingModel):
    name = models.CharField(max_length=32)
    category = models.CharField(max_length=64)


class AchievementCompletion(RelationCachingModel):
    player = models.ForeignKey("Player", on_delete=models.RESTRICT)
    achievement = models.ForeignKey(Achievement, on_delete=models.CASCADE)
    time_completed = models.DateTimeField()
    
    
class Player(RelationCachingModel):
    user = models.ForeignKey(User, on_delete=models.RESTRICT)
    team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name="players")
    completed_achievements = models.ManyToManyField(Achievement, through=AchievementCompletion, related_name="players_completed")
