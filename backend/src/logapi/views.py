from rest_framework.views import APIView
from rest_framework import status

from src.utils.createResponse import createResponse
from .models import ApiLog, ApiLogRequest, ApiLogResponse


class HelloView(APIView):
    permission_classes = []

    def finalize_response(self, request, response, *args, **kwargs):
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
            response_time=0,
        )

        # Create response
        content = {"message": "Hello, World!"}
        response = createResponse(
            message=f"Hi there user {kwargs.get('userid')}",
            success=True,
            data=content,
            status_code=status.HTTP_200_OK,
        )
        return super().finalize_response(request, response, *args, **kwargs)
