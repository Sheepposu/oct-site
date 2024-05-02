from django.urls import re_path
from django.shortcuts import render

def index_view(request):
    return render(request, 'dist/index.html')

urlpatterns = [
    re_path(r".*", index_view)
]
