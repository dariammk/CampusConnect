from django.contrib import admin
from django.urls import path, re_path
from django.views.static import serve
from .views import FrontendAppView
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('front.urls')),
]
