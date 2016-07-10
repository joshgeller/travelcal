from rest_framework import serializers, status
from rest_framework.response import Response

from .models import Trip


class TripSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trip
        fields = (
            'account',
            'created',
            'end_date',
            'id',
            'last_updated',
            'name',
            'start_date',
            'get_absolute_url',
        )
