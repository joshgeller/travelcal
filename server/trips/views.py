from rest_framework import permissions, viewsets

from .models import Trip
from .serializers import TripSerializer


class TripViewSet(viewsets.ModelViewSet):
    """ViewSet for the Trip class"""

    queryset = Trip.objects.all()
    serializer_class = TripSerializer
    permission_classes = [permissions.AllowAny]
