import json
from django.db import connection
from django.http import JsonResponse, HttpResponse
from django.views.decorators.http import require_POST, require_http_methods
from django.conf import settings

import secrets
import struct
import random
import base64
from nacl.secret import SecretBox

from .models import *
from .serializers import *


def _serialize_team(team, many=False, include=None):
    if include is None:
        include = []
    return TeamSerializer(team, many).serialize(include=["players.user"]+include)


def error(msg: str, status=400):
    return JsonResponse({"error": msg}, status=status, safe=False)


def parse_body(body: bytes, require_has: tuple | list):
    try:
        data = json.loads(body.decode("utf-8"))
        if not isinstance(data, dict):
            return
        
        for require in require_has:
            if require not in data:
                return

        return data
    except (UnicodeDecodeError, json.JSONDecodeError):
        return


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
            {"data": [{
                "id": int(achievement[0]),
                "name": achievement[1],
                "category": achievement[2],
                "completions": achievement[3]
            } for achievement in cursor.fetchall()]},
            safe=False
        )


def team(req):
    if not req.user.is_authenticated:
        return JsonResponse({"data": None}, safe=False)
    
    team = Team.select_with((
        "players.user",
        "players.completions"
    ), players__user_id=req.user.id)

    if team == []:
        return JsonResponse({"data": None}, safe=False)
    
    team = _serialize_team(team[0], include=[
        "players.completions",
        "players.completions.achievement_id"
    ])
    return JsonResponse({"data": team}, safe=False)

def teams(req):
    teams = Team.select_with(("players.user",))

    serialized_teams = [
        TeamSerializer(team).serialize(*(
            (None, ["players.user"])
            if any(map(lambda p: p.user.id == req.user.id, team.players))
            else (["invite"], None)
        ))
        for team in teams
    ]
    sorted_teams = sorted(serialized_teams, key=lambda t: t['points'], reverse=True)

    return JsonResponse({"data": sorted_teams}, safe=False)
    
@require_POST
def join_team(req):
    data = parse_body(req.body, ("invite",))
    if data is None or data["invite"] is None:
        return JsonResponse({"error": "invalid invite"}, status=400, safe=False)
    
    try:
        team = Team.select_with(("players.user",), invite=data["invite"])[0]
    except IndexError:
        return JsonResponse({"error": "invalid invite"}, status=400, safe=False)
    
    player = Player.objects.filter(user_id=req.user.id).first()
    if player is not None:
        return JsonResponse({"error": "already on a team"}, status=400, safe=False)
    
    player = Player(user=req.user, team_id=team.id)
    player.save()
    team.players.append(player)
    return JsonResponse({"data": _serialize_team(team)}, safe=False)


@require_http_methods(["DELETE"])
def leave_team(req):
    # TODO: maybe make this into a postgresql function
    team = None
    if req.user.is_authenticated:
        team = Team.select_with(("players.user",), players__user_id=req.user.id)[0]
    if team is None:
        return JsonResponse({"error": "not on a team"}, status=400, safe=False)
    
    player = next(filter(lambda player: player.user.id == req.user.id, team.players))
    

    team_with_players = Team.select_with(("players",), id=team.id)[0]
    if len(team_with_players.players) == 1:
        team.delete()
    else:
        player.delete()
    return JsonResponse({"data": None}, safe=False)


@require_POST
def create_team(req):
    data = parse_body(req.body, ("name",))
    if data is None or (name := data["name"]) is None or len(name) == 0 or len(name) > 32:
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
    player = PlayerSerializer(player).serialize(include=["user"])
    player["completions"] = 0
    team["players"] = [player]
    return JsonResponse({"data": team}, safe=False)


def get_auth_packet(req):
    if not req.user.is_authenticated:
        return HttpResponse(status=403)
    
    player = Player.objects.filter(user_id=req.user.id).first()
    if player is None:
        return JsonResponse({"error": "no associated player"}, status=400, safe=False)
    
    packet = settings.WS_CONNECTION_VALIDATOR.encode("ascii") + struct.pack("<II", 5, random.randint(0, 0xFFFFFFFF))
    msg = SecretBox(settings.SECRET_KEY[:32].encode('ascii')).encrypt(packet)

    return JsonResponse({
        "code": 0,
        "data": base64.b64encode(msg.ciphertext).decode("ascii"),
        "nonce": base64.b64encode(msg.nonce).decode("ascii")
    }, safe=False)
