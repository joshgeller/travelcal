from rest_framework import serializers

from .models import Trip


class TripSerializer(serializers.HyperlinkedModelSerializer):
    account = serializers.ReadOnlyField(source='account.id')

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
            'url',
        )
