from django.urls import re_path
from django.shortcuts import render

from tournament.serializers import UserSerializer

def index_view(request):
    if not request.user.is_authenticated:
        return render(request, 'dist/index.html', {"data": {"isAuthenticated": False, "user": None}})
    
    user_serializer = UserSerializer(request.user)
    serialized_user = user_serializer.serialize()

    return render(request, 'dist/index.html', {"data": {"isAuthenticated": True, "user": serialized_user}})

urlpatterns = [
    re_path(r".*", index_view)
]
