from django.db import connection
from django.http import JsonResponse
from django.views.decorators.http import require_POST

import secrets

from .models import *
from .serializers import *


def get_full_team(user_id: int | None = None, invite: str | None = None):
    where = f"WHERE user_id = '{user_id}'" if invite is None else f"WHERE invite = '{invite}'"
    print(where)
    with connection.cursor() as cursor:
        cursor.execute(
            f"""
            SELECT
                achievements_team.id,
                name,
                icon,
                invite,
                achievements_player.id,
                user_id,
                osu_id,
                osu_username,
                osu_avatar,
                osu_cover
            FROM achievements_team
            INNER JOIN achievements_player ON (achievements_player.team_id = achievements_team.id)
            INNER JOIN tournament_user ON (tournament_user.id = achievements_player.user_id)
            {where}
            """
        )

        team = cursor.fetchall()
        print(team)
        if not team:
            return
        
        return {
            "id": int(team[0][0]),
            "name": team[0][1],
            "icon": team[0][2],
            "invite": team[0][3],
            "players": [
                {
                    "id": int(player[4]),
                    "user": {
                        "id": player[5],
                        "osu_id": int(player[6]),
                        "osu_username": player[7],
                        "osu_avatar": player[8],
                        "osu_cover": player[9]
                    }
                } for player in team
            ]
        }


def achievements(req):
    with connection.cursor() as cursor:
        cursor.execute(
            """
            SELECT
                achievements_achievement.id,
                name,
                category,
                COUNT(achievements_achievementcompletion.achievement_id) AS n_completed  
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
    
    return JsonResponse({"team": get_full_team(user_id=req.user.id)}, safe=False)


def join_team(req):
    invite = req.GET.get("invite")
    print(invite)
    team = None
    if invite is not None:
        team = get_full_team(invite=invite)
    if team is None:
        return JsonResponse({"error": "invalid invite"}, status=400, safe=False)
    
    player = Player.objects.filter(user_id=req.user.id).first()
    if player is not None:
        return JsonResponse({"error": "already on a team"}, status=400, safe=False)
    
    player = Player(user=req.user, team_id=team["id"])
    player.save()
    team["players"].append(PlayerSerializer(player).serialize())
    return JsonResponse({"team": team}, safe=False)


def leave_team(req):
    team = None
    if req.user.is_authenticated:
        team = get_full_team(user_id=req.user.id)
    if team is None:
        return JsonResponse({"error": "not on a team"}, status=400, safe=False)
    
    with connection.cursor() as cursor:
        cursor.execute(f"DELETE FROM achievements_player WHERE user_id = '{req.user.id}'")
        if len(team["players"]) == 1:
            cursor.execute(f"DELETE FROM achievements_team WHERE id = {team['id']}")

    return JsonResponse({}, safe=False)


def create_team(req):
    name = req.GET.get("name")
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
        print(e)
        return JsonResponse({"error": "team name taken"}, status=400, safe=False)
    
    player = Player(user=req.user, team_id=team.id)
    player.save()
    
    team = TeamSerializer(team).serialize()
    player = PlayerSerializer(player).serialize(include=["user"])
    player["completions"] = 0
    team["players"] = [player]
    return JsonResponse(team, safe=False)

