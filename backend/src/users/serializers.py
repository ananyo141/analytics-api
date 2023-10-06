from django.contrib.auth.password_validation import (
    validate_password as django_validate_password,
)
from rest_framework.serializers import ModelSerializer

from .models import User


class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        extra_kwargs = {
            "password": {"write_only": True},
            "email": {"required": True},
            "name": {"required": True},
        }

        fields = ["email", "name", "password"]

    def create(self, validated_data):
        password = validated_data.pop("password", None)
        user = User.objects.create(**validated_data)

        # identify password field to be set as hashed password
        user.set_password(password)
        user.save()
        return user

    def validate_password(self, password):
        # validate password using django's password validation
        django_validate_password(password, self.context["request"].user)
        return password

    def update(self, instance, validated_data):
        # identify password field to be set as hashed password
        password = validated_data.pop("password", instance.password)
        instance.set_password(password)
        return super().update(instance, validated_data)
