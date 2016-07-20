from calendars.models import Calendar
from rest_framework import permissions, status, viewsets
from rest_framework.response import Response

from .models import Trip
from .serializers import TripSerializer


class TripViewSet(viewsets.ModelViewSet):
    """ViewSet for the Trip class"""

    queryset = Trip.objects.all()
    serializer_class = TripSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        """
        Only return Trips associated with the current user.
        """
        # TODO: Remove the try/except block to restrict Trips to
        # the current user only. This is disabled for midpoint check
        # demonstration purposes only.
        try:
            account = self.request.user
            return Trip.objects.filter(account=account)
        except TypeError:
            return Trip.objects.all()

    def create(self, request, *args, **kwargs):
        """
        Override the base create method so we can associate the authenticated
        user with the newly created object, instead of requiring the client
        to the pass the user's ID as part of the POST request.
        """

        # Extract the current User from the request
        data = request.data
        data['account'] = request.user.pk
        # Serialize the request data to create the Trip
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        # Create an empty Calendar for this trip
        cal = Calendar(trip=serializer.instance)
        cal.save()
        # Return success response
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
