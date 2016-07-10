from django.contrib.auth import update_session_auth_hash
from rest_framework.serializers import CharField, ModelSerializer
from trips.serializers import TripSerializer

from .models import Account


class AccountSerializer(ModelSerializer):
    password = CharField(write_only=True, required=False)
    confirm_password = CharField(write_only=True, required=False)
    trips = TripSerializer(many=True)

    class Meta:
        model = Account
        fields = ('id', 'email', 'created_at', 'updated_at',
                  'password', 'confirm_password', 'trips')
        read_only_fields = ('created_at', 'updated_at',)

        def create(self, data):
            """
            Create a new Account.
            """
            return Account.objects.create(**data)

        def update(self, instance, data):
            """
            Update an existing Account.
            """
            instance.save()

            # Handle user changing their password.
            password = data.get('password', None)
            confirm_password = data.get('confirm_password', None)
            if password and confirm_password and password == confirm_password:
                instance.set_password(password)
                instance.save()

            # If user changes password, we need to make sure the session
            # stays active and doesn't log them out on the next request.
            update_session_auth_hash(self.context.get('request'), instance)

            return instance
