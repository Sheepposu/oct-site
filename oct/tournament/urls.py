from django.urls import path
from rest_framework.decorators import api_view

from . import views

urlpatterns = [
    path("login", views.login, name="api-login"),
    path("logout", views.logout, name="api-logout"),
    path("dashboard", views.dashboard, name="api-dashboard"),
]
