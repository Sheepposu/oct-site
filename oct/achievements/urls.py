from django.urls import path

from . import views

urlpatterns = [
    path("", views.achievements),
    path("team/", views.team),
    path("teams/", views.teams),
    path("team/join/", views.join_team),
    path("team/leave/", views.leave_team),
    path("team/new/", views.create_team),
    path("wsauth/", views.get_auth_packet)
]