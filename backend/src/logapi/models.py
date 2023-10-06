from django.db import models


# Request and response models for API calls
class ApiLogRequest(models.Model):
    method = models.CharField(max_length=10)
    request_object = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)


class ApiLogResponse(models.Model):
    api_log_request = models.OneToOneField(
        ApiLogRequest, on_delete=models.CASCADE)
    response_object = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)


# Main log model for API calls
class ApiLog(models.Model):
    userId = models.CharField(max_length=40, null=False, blank=False)
    status_code = models.IntegerField()
    url = models.CharField(max_length=150, null=False, blank=False)
    api_request = models.OneToOneField(
        ApiLogRequest, on_delete=models.CASCADE,
        null=False, blank=False
    )
    api_response = models.OneToOneField(
        ApiLogResponse, on_delete=models.CASCADE,
    )
    success = models.BooleanField()
    response_time = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.url
