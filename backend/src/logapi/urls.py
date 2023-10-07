from django.urls import path

from . import views

urlpatterns = [
    path("<int:userid>/", views.HelloView.as_view(), name="hello_tracker"),
]
