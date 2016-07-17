from django.db import models as models
from rest_framework.reverse import reverse
from users.models import Account


class Trip(models.Model):

    # Fields
    name = models.CharField(max_length=255)
    created = models.DateTimeField(auto_now_add=True, editable=False)
    last_updated = models.DateTimeField(auto_now=True, editable=False)
    start_date = models.DateField()
    end_date = models.DateField()

    # Relationship Fields
    account = models.ForeignKey(Account, related_name='trips')

    class Meta:
        ordering = ('-created',)

    def __str__(self):
        return self.name

    def get_absolute_url(self):
        return reverse('trip-detail', kwargs={'pk': self.pk})
