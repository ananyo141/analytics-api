from django.contrib import admin
from .models import ApiLog, ApiLogRequest, ApiLogResponse

admin.site.register(ApiLog)
admin.site.register(ApiLogRequest)
admin.site.register(ApiLogResponse)
