from rest_framework import status
from rest_framework.response import Response


def buildResponse(*, message, data={}, success=True):
    return {
        "success": success,
        "message": message,
        "data": data,
    }


def createResponse(
    *,
    message,
    data={},
    success=True,
    status_code=status.HTTP_200_OK,
    headers={
        "content-type": "application/json",
    }
):
    return Response(
        buildResponse(message=message, data=data, success=success),
        status=status_code,
        headers=headers,
    )
