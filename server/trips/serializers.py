from rest_framework import serializers
from users.models import Account

from .models import Trip


class TripSerializer(serializers.HyperlinkedModelSerializer):
    account = serializers.PrimaryKeyRelatedField(queryset=Account.objects.all())

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
