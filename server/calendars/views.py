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
        # TODO: Remove the try/except block to restrict Calendar to
        # the current user only. This is disabled for midpoint check
        # demonstration purposes only.
        try:
            account = self.request.user
            return Calendar.objects.filter(trip__account=account)
        except TypeError:
            return Calendar.objects.all()
