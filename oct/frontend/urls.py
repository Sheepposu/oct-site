from django.urls import re_path
from django.shortcuts import render
from django.conf import settings

from tournament.serializers import UserSerializer

from common import get_auth_handler

def index_view(req):
    context = {
        "data": {
            "isAuthenticated": req.user.is_authenticated,
            "user": None,
            "authUrl": settings.OSU_AUTH_URL,
            "wsUri": settings.ACHIEVEMENTS_WS_URI
        }
    }

    if req.user.is_authenticated:
        context["data"]["user"] = UserSerializer(req.user).serialize(include=["involvements", "roles"])

    return render(req, 'dist/index.html', context)

urlpatterns = [
    re_path(r".*", index_view, name="index")
]
