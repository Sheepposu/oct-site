from django.urls import path

from . import views

urlpatterns = [
    path("", views.achievements),
    path("team/", views.team),
    path("team/join/", views.join_team),
    path("team/leave/", views.leave_team),
    path("team/new/", views.create_team)
]