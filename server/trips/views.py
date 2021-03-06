import json

import dateutil.parser

from calendars.models import Calendar
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import detail_route
from rest_framework.response import Response
from wkhtmltopdf.views import PDFTemplateResponse

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
        try:
            account = self.request.user
            return Trip.objects.filter(account=account)
        except TypeError:
            return Response(status=status.HTTP_403_FORBIDDEN)

    @detail_route(methods=['get'])
    def pdf(self, request, pk=None, *args, **kwargs):
        trip = self.get_object()
        filename = '{}.pdf'.format(trip.name)
        activities = sorted(trip.calendar.data, key=lambda a: a['start'])
        for activity in activities:
            activity.update({'start': dateutil.parser.parse((activity['start']))})
            activity.update({'end': dateutil.parser.parse((activity['end']))})
            if activity.get('allDay') is False:
                activity.update({'startTime': dateutil.parser.parse((activity['startTime']))})
                activity.update({'endTime': dateutil.parser.parse((activity['endTime']))})
        response = PDFTemplateResponse(
            request=request,
            template='pdf.html',
            filename=filename,
            context={'trip': trip, 'calendar': activities},
            show_content_in_browser=False
        )
        return response

    @detail_route(methods=['get'])
    def remind(self, request, pk=None, *args, **kwargs):
        trip = self.get_object()
        trip.remind()
        return Response({'email': trip.account.email}, status=status.HTTP_200_OK)

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
