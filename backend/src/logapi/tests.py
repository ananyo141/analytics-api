from rest_framework.test import APITestCase, APIClient

from src.users.models import User


class LogTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user("test@example.com", "password")
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def test_log_create(self):
        url = "/hello/14/"
        response = self.client.get(url)
        self.assertTrue(response.status_code in (200, 418))

    def test_log_list(self):
        url = "/hello/analytics/"
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
