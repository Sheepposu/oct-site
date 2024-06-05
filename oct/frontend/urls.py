from django.urls import re_path
from django.shortcuts import render

from tournament.serializers import UserSerializer

from common import get_auth_handler

def index_view(request):
    if not request.user.is_authenticated:
        auth_url = get_auth_handler().get_auth_url()
        return render(request, 'dist/index.html', {
            "data": {"isAuthenticated": False, "user": None, "authUrl": auth_url},
        })
    
    user_serializer = UserSerializer(request.user)
    serialized_user = user_serializer.serialize()

    return render(request, 'dist/index.html', {"data": {"isAuthenticated": True, "user": serialized_user}})

urlpatterns = [
    re_path(r".*", index_view)
]
