from django.urls import path

from . import views

urlpatterns = [
    # pages
    path("", views.index, name="index"),
]