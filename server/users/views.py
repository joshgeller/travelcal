from rest_framework import status
from rest_framework.decorators import detail_route
from rest_framework.permissions import SAFE_METHODS, AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from .models import Account
from .permissions import IsAccountOwner
from .serializers import AccountSerializer


class AccountViewSet(ModelViewSet):
    lookup_field = 'email'
    queryset = Account.objects.all()
    serializer_class = AccountSerializer

    def get_object(self):
        return self.request.user

    def get_permissions(self):
        if self.request.method in SAFE_METHODS:
            # Authentication isn't needed for safe methods like GET
            return (AllowAny(),)

        if self.request.method == 'POST':
            # Authentication isn't needed when creating a new account.
            return (AllowAny(),)

        # Authentication is needed for updates to Account object.
        return (IsAuthenticated(), IsAccountOwner(),)

    def create(self, request):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            Account.objects.create_user(**serializer.validated_data)
            return Response(serializer.validated_data,
                            status=status.HTTP_201_CREATED)

        return Response({
            'status': 'error',
            'detail': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    def set_password(self, *args, **kwargs):
        # Extract the current User from the request
        user = self.request.user
        if self.request.data['password']:
            user.set_password(self.request.data['password'])
            user.save()
            return Response(status=status.HTTP_200_OK)
        return Response(status=status.HTTP_400_BAD_REQUEST)
