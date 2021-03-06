import datetime

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
        return Calendar.objects.all()

    @list_route(methods=['get'])
    def popular(self, request, pk=None, *args, **kwargs):
        queryset = Calendar.objects.all()
        popular_activities = {}
        for calendar in queryset:
            if calendar.data:
                for activity in calendar.data:
                    if isinstance(activity, dict):
                        addr = activity.get('address', {}).get('name', None)
                        if addr:
                            if addr not in popular_activities:
                                popular_activities.update({
                                    addr: {
                                        'score': 1,
                                        'address': activity.get('address')
                                    }
                                })
                            else:
                                popularity = popular_activities.get(addr).get('score')
                                popular_activities.update({
                                    addr: {
                                        'score': popularity + 1,
                                        'address': activity.get('address')
                                    }
                                })
        results = []
        for name, data in popular_activities.items():
            results.append(
                {
                    'title': name,
                    'address': data['address'],
                    'score': data['score'],
                    'start': datetime.datetime.now(),
                    'end': datetime.datetime.now()
                }
            )
        return Response(results)
