from django.urls import path
from rest_framework.decorators import api_view

from . import views

urlpatterns = [
    # pages
    path("", views.index, name="index"),
    path("teams", views.tournament_teams, name="teams"),
    path("login/", views.login_view, name="api-login"),
    path("logout", views.logout_view, name="logout"),
    path("session", views.session_view, name="session"),
    path("dashboard", views.dashboard, name="dashboard"),
    # path("register", views.register, name="register"),
    # path("unregister", views.unregister, name="unregister"),
    path("tournaments", views.tournaments, name="tournaments"),
    path("tournaments/mappools", views.tournament_mappools, name="mappools"),
    path("tournaments/bracket", views.tournament_bracket, name="bracket"),
    path("tournaments/<str:name>", views.tournaments, name="tournament_info"),
    path("tournaments/<str:name>/<str:section>", views.tournaments, name="tournament_section"),
    path("tournaments/<str:name>/mappool/<str:round>", views.tournament_mappools, name="tournament_mappool"),
    path("tournaments/<str:name>/matches/<str:match_id>", views.tournament_matches, name="tournament_match"),
    path("matches/<int:match_id>/<str:action>", views.tournament_match_action, name="match_action"),
    path("referee", views.referee, name="referee"),

    # api
    path("api/tournaments/<str:name>/<str:round>/mappool", api_view(['GET'])(views.tournament_mappools), kwargs={"api": True}),
    path("api/tournaments/<str:name>/users", api_view(['GET'])(views.tournament_users), kwargs={"api": True}),
    path("api/tournaments/<str:name>/matches", api_view(["GET"])(views.tournament_matches), kwargs={"api": True}),
    path("api/tournaments/<str:name>/matches/<str:match_id>", api_view(['GET'])(views.tournament_matches), kwargs={"api": True}),
    path("api/osu/matchinfo", api_view(['GET'])(views.get_osu_match_info))
]
