from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _


# Create your models here.
class User(AbstractUser):
    email = models.EmailField(_("email address"), unique=True, null=False, blank=False)
    name = models.CharField(max_length=120, null=False, blank=False)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["name"]
