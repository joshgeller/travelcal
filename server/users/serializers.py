from rest_framework.serializers import CharField, ModelSerializer
from trips.serializers import TripSerializer

from .models import Account


class AccountSerializer(ModelSerializer):
    password = CharField(write_only=True, required=False)
    trips = TripSerializer(many=True, required=False)

    class Meta:
        model = Account
        fields = ('id', 'email', 'created_at', 'updated_at',
                  'password', 'trips')
        read_only_fields = ('created_at', 'updated_at',)

        def create(self, data):
            """
            Create a new Account.
            """
            return Account.objects.create(**data)
