from django.db import connection
from django.http import JsonResponse


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
            [dict(zip(("id", "name", "category", "completions"), achievement)) for achievement in cursor.fetchall()],
            safe=False
        )


def team(req):
    pass