"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include, path
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularRedocView,
    SpectacularSwaggerView,
)

from drf_spectacular.utils import extend_schema
from rest_framework.decorators import api_view, permission_classes
from rest_framework.views import status

from src.utils.createResponse import createResponse


@extend_schema(exclude=True)
@api_view(["GET"])
@permission_classes([])
def root(request):
    return createResponse(
        message="OK",
        status_code=status.HTTP_200_OK,
        success=True,
    )


urlpatterns = [
    path("admin/", admin.site.urls),
    # user routes
    path("user/", include("src.users.urls")),
    # logapi routes
    path("hello/", include("src.logapi.urls")),
    # documentation
    path("docs/", SpectacularAPIView.as_view(), name="schema"),
    path(
        "docs/swagger/",
        SpectacularSwaggerView.as_view(url_name="schema"),
        name="swagger-ui",
    ),
    path(
        "docs/redoc/",
        SpectacularRedocView.as_view(url_name="schema"),
        name="redoc",
    ),
    path("", root),
]

handler400 = "src.exceptions.handleBadRequest"
handler404 = "src.exceptions.handleNotFound"
handler500 = "src.exceptions.handleServerError"
