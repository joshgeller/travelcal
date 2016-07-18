from calendars.serializers import CalendarSerializer
from rest_framework import serializers

from .models import Trip


class TripSerializer(serializers.ModelSerializer):
    calendar = CalendarSerializer()

    class Meta:
        model = Trip
        fields = (
            'account',
            'calendar',
            'created',
            'end_date',
            'id',
            'last_updated',
            'name',
            'start_date',
            'get_absolute_url',
        )
