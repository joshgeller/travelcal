from rest_framework import permissions, viewsets

from .models import Calendar
from .serializers import CalendarSerializer


class CalendarViewSet(viewsets.ModelViewSet):
    """ViewSet for the Calendar class"""

    queryset = Calendar.objects.all()
    serializer_class = CalendarSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        """
        Only return Calendars associated with the current user.
        """

        account = self.request.user
        return Calendar.objects.filter(trip__account=account)
