import random
from rest_framework.views import APIView
from rest_framework import status
from rest_framework import generics, filters
from django_filters import rest_framework as django_filters
from datetime import datetime, timedelta

from src.utils.createResponse import createResponse
from .serializers import ApiLogSerializer
from .models import ApiLog, ApiLogRequest, ApiLogResponse


class HelloView(APIView):
    permission_classes = []

    def finalize_response(self, request, response, *args, **kwargs):
        success = random.random() <= 0.5  # 50% chance of success

        # Create response
        content = {"message": "Hello, World!"}
        response = createResponse(
            message=f"Hi there user {kwargs.get('userid')}",
            success=success,
            data=content,
            status_code=status.HTTP_200_OK
                    if success else status.HTTP_418_IM_A_TEAPOT,
        )

        # Create ApiLogRequest
        api_log_request = ApiLogRequest.objects.create(
            method=request.method,
            body=request.data,
            headers=dict(request.headers),
        )

        # Create ApiLogResponse
        api_log_response = ApiLogResponse.objects.create(
            api_log_request=api_log_request,
            body=response.data,
            headers=dict(response.headers),
            status_code=response.status_code,
        )

        # Create ApiLog
        ApiLog.objects.create(
            userId=kwargs.get("userid"),
            status_code=response.status_code,
            url=request.path,
            api_request=api_log_request,
            api_response=api_log_response,
            success=response.status_code == status.HTTP_200_OK,
        )

        return super().finalize_response(request, response, *args, **kwargs)


class AnalyticsView(generics.ListAPIView):
    serializer_class = ApiLogSerializer
    filter_backends = [
        django_filters.DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['userId', 'success']
    ordering_fields = ['created_at']
    ordering = ['-created_at']

    def get_queryset(self):
        # Get the time range from the request query parameters
        time_range = self.request.query_params.get('time_range', None)
        queryset = ApiLog.objects.all()
        # Apply time filter if provided
        if time_range:
            now = datetime.now()
            if time_range == 'last_24_hours':
                start_time = now - timedelta(hours=24)
            elif time_range == 'last_7_days':
                start_time = now - timedelta(days=7)
            elif time_range == 'custom':
                # Implement custom time range logic here
                start_time = datetime.strptime(
                    self.request.query_params['start_date'], "%Y-%m-%d")

            queryset = queryset.filter(
                created_at__gte=start_time, created_at__lte=now
            ).prefetch_related(
                'api_request', 'api_response'
            ).prefetch_related('api_response', 'api_response')

        return queryset
