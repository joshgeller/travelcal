from django.contrib.postgres.fields import JSONField
from django.db import models as models
from rest_framework.reverse import reverse
from trips.models import Trip


class Calendar(models.Model):

    # Fields
    created = models.DateTimeField(auto_now_add=True, editable=False)
    last_updated = models.DateTimeField(auto_now=True, editable=False)
    data = JSONField(null=True, blank=True)

    # Relationship Fields
    trip = models.OneToOneField(Trip, )

    class Meta:
        ordering = ('-created',)

    def __str__(self):
        return self.trip.name

    def get_absolute_url(self):
        return reverse('calendar-detail', kwargs={'pk': self.pk})
