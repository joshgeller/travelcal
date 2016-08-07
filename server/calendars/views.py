from rest_framework import permissions, viewsets
from rest_framework.decorators import list_route
from rest_framework.response import Response

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

    @list_route(methods=['get'])
    def popular(self, request, pk=None, *args, **kwargs):
        queryset = Calendar.objects.all()
        popular_activities = {}
        for calendar in queryset:
            for activity in calendar.data:
                if activity.address:
                    if activity.address not in popular_activities:
                        popular_activities.update({
                            activity.address: 1
                        })
                    else:
                        popularity = popular_activities.get(activity.address)
                        popular_activities.update({
                            activity.address: popularity + 1
                        })
        return Response(popular_activities)
