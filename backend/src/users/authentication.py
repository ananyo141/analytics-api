from rest_framework import authentication
from rest_framework_simplejwt.authentication import JWTTokenUserAuthentication


class CookieTokenAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        access_token = request.COOKIES.get("accessToken")

        if not access_token:
            return None

        # Verify the access token
        validator = JWTTokenUserAuthentication()
        token = validator.get_validated_token(access_token)
        user = validator.get_user(token)

        # Return the user and token
        return (user, token)
