from django.db import connection
from django.http import JsonResponse
from django.views.decorators.http import require_POST

import secrets

from .models import *
from .serializers import *


def _serialize_team(team):
    return TeamSerializer(team).serialize(include=["players.user"], exclude=["players.user.roles", "players.user.involvements"])


def achievements(req):
    with connection.cursor() as cursor:
        cursor.execute(
            """
            SELECT
                achievements_achievement.id,
                name,
                category,
                COUNT(achievements_achievementcompletion.achievement_id)
            FROM achievements_achievement
            LEFT JOIN achievements_achievementcompletion ON (achievements_achievementcompletion.achievement_id = achievements_achievement.id)
            GROUP BY achievements_achievement.id
            """
        )
        return JsonResponse(
            [{
                "id": int(achievement[0]),
                "name": achievement[1],
                "category": achievement[2],
                "completions": achievement[3]
            } for achievement in cursor.fetchall()],
            safe=False
        )


def team(req):
    if not req.user.is_authenticated:
        return JsonResponse({"team": None}, safe=False)
    
    team = Team.select_with(("players.user",), players__user_id=req.user.id)[0]
    if team is not None:
        team = _serialize_team(team)
    return JsonResponse({"team": team}, safe=False)


@require_POST
def join_team(req):
    invite = req.POST.get("invite")
    print(invite)
    team = None
    if invite is not None:
        team = Team.select_with(("players.user"), invite=invite)[0]
    if team is None:
        return JsonResponse({"error": "invalid invite"}, status=400, safe=False)
    
    player = Player.objects.filter(user_id=req.user.id).first()
    if player is not None:
        return JsonResponse({"error": "already on a team"}, status=400, safe=False)
    
    player = Player(user=req.user, team_id=team["id"])
    player.save()
    team.players.append(player)
    return JsonResponse({"team": _serialize_team(team)}, safe=False)


@require_POST
def leave_team(req):
    # TODO: maybe make this into a postgresql function
    team = None
    if req.user.is_authenticated:
        team = Team.select_with(("players.user",), players__user_id=req.user.id)[0]
    if team is None:
        return JsonResponse({"error": "not on a team"}, status=400, safe=False)
    
    player = next(filter(lambda player: player.user.id == req.user.id, team.players))
    player.delete()
    if len(team.players) == 1:
        team.delete()

    return JsonResponse({}, safe=False)


@require_POST
def create_team(req):
    name = req.POST.get("name")
    if name is None or len(name) == 0 or len(name) > 31:
        return JsonResponse({"error": "invalid name"}, status=400, safe=False)
    
    player = Player.objects.filter(user_id=req.user.id).first()
    if player is not None:
        return JsonResponse({"error": "already on a team"}, status=400, safe=False)
    
    try:
        invite = secrets.token_urlsafe(12)
        team = Team(name=name, icon="", invite=invite)
        team.save()
    except Exception as e:
        return JsonResponse({"error": "team name taken"}, status=400, safe=False)
    
    player = Player(user=req.user, team_id=team.id)
    player.save()
    
    team = TeamSerializer(team).serialize()
    player = PlayerSerializer(player).serialize(include=["user"], exclude=["user.involvements", "user.roles"])
    player["completions"] = 0
    team["players"] = [player]
    return JsonResponse(team, safe=False)
