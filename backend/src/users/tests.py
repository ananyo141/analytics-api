from rest_framework.test import APITestCase, APIClient

from .models import User


class UsersTests(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            "test@new.test",
            "testobj",
        )

    def test_user_register(self):
        url = "/user/register/"
        data = {
            "name": "TestObject",
            "email": "test@test.test",
            "password": "test123@coasfefa",
        }
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, 201)

    def test_user_login(self):
        url = "/user/login/"
        data = {
            "email": "test@new.test",
            "password": "testobj",
        }
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, 200)
