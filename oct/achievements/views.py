from django.db import connection
from django.http import JsonResponse
from .models import *


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
    
    with connection.cursor() as cursor:
        cursor.execute(
            f"""
            SELECT
                achievements_team.id,
                name,
                icon,
                achievements_player.id,
                user_id,
                osu_id,
                osu_username,
                osu_avatar,
                osu_cover
            FROM achievements_team
            INNER JOIN achievements_player ON (achievements_player.team_id = achievements_team.id)
            INNER JOIN tournament_user ON (tournament_user.id = achievements_player.user_id)
            WHERE user_id = '{req.user.id}'
            """
        )

        team = cursor.fetchall()
        if not team:
            return JsonResponse({"team": None}, safe=False)
        
        return JsonResponse({
            "id": int(team[0][0]),
            "name": team[0][1],
            "icon": team[0][2],
            "players": [
                {
                    "id": int(player[3]),
                    "user": {
                        "id": player[4],
                        "osu_id": int(player[5]),
                        "osu_username": player[6],
                        "osu_avatar": player[7],
                        "osu_cover": player[8]
                    }
                } for player in team
            ]
        }, safe=False)