import random
from rest_framework.views import APIView
from rest_framework.exceptions import ValidationError
from rest_framework.pagination import PageNumberPagination
from rest_framework import status
from rest_framework import generics, filters
from django_filters import rest_framework as django_filters
from django.utils import timezone
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
            url=request.get_full_path(),
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
    pagination_class = PageNumberPagination

    def get_queryset(self):
        # Get the time range from the request query parameters
        time_range = self.request.query_params.get('time_range', None)
        queryset = ApiLog.objects.all()

        self.failure_count = 0  # initialize counts, so that they are always
        self.distinct_user_count = 0  # present in the response

        # Apply time filter if provided
        if time_range:
            end_time = timezone.now()  # default end time is now
            if time_range == 'last_24_hours':
                start_time = end_time - timedelta(hours=24)
            elif time_range == 'last_7_days':
                start_time = end_time - timedelta(days=7)
            elif time_range == 'custom':
                if not self.request.query_params.get('start_date') \
                        or not self.request.query_params.get(
                        'end_date'):
                    raise ValidationError(
                        'start_date and end_date are required '
                        'for custom time range')

                # Implement custom time range logic here
                try:
                    start_time = datetime.strptime(
                        self.request.query_params.get('start_date'),
                        "%d-%m-%Y")
                    end_time = datetime.strptime(
                        self.request.query_params.get('end_date', end_time),
                        "%d-%m-%Y")
                except ValueError:
                    raise ValidationError(
                        'start_date and end_date must be in the format '
                        'dd-mm-yyyy')
            else:
                raise ValidationError(
                    'time_range must be one of last_24_hours, '
                    'last_7_days, custom')

            queryset = queryset.filter(
                created_at__gte=timezone.make_aware(
                    start_time) if time_range == 'custom' else start_time,
                created_at__lte=timezone.make_aware(
                    end_time) if time_range == 'custom' else end_time
            ).prefetch_related(
                'api_request', 'api_response'
            ).prefetch_related('api_response', 'api_response')

            self.failure_count = queryset.filter(success=False).count()
            self.distinct_user_count = queryset.values(
                'userId').distinct().count()

        return queryset

    def finalize_response(self, request, response, *args, **kwargs):
        # Add failure_count, distinct users to response
        response.data['failure_count'] = self.failure_count
        response.data['distinct_users'] = self.distinct_user_count
        return super().finalize_response(request, response, *args, **kwargs)
