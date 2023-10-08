from django.db import models


# Request Model for API calls
class ApiLogRequest(models.Model):
    method = models.CharField(max_length=10)
    body = models.JSONField()
    headers = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)


# Response Model for API calls
class ApiLogResponse(models.Model):
    api_log_request = models.OneToOneField(
        ApiLogRequest, on_delete=models.CASCADE)
    body = models.JSONField()
    headers = models.JSONField(default=dict)
    status_code = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)


# Main log model for API calls
class ApiLog(models.Model):
    class Meta:
        indexes = [
            # create index for created_at field for faster query
            models.Index(fields=['-created_at']),
            models.Index(fields=['userId']),
            models.Index(fields=['success']),
        ]

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
    error_message = models.CharField(max_length=150, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.url
