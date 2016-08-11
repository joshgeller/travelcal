import dateutil

from django.db import models as models
from django.template.loader import render_to_string
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

    def remind(self):
        activities = sorted(self.calendar.data, key=lambda a: a['start'])
        for activity in activities:
            activity.update(
                {'start': dateutil.parser.parse((activity['start']))})
            activity.update({'end': dateutil.parser.parse((activity['end']))})
        self.account.send_email(
            subject='Your Travelcal Trip Reminder',
            message='You have an upcoming trip!',
            html=render_to_string('email.html',
                                  {'trip': self, 'calendar': activities}
                                  )
        )
