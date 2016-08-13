import datetime

from calendars.models import Calendar
from django.core.management.base import BaseCommand
from trips.models import Trip


class Command(BaseCommand):
    help = 'Sends email reminders for upcoming calendar activities.'

    def handle(self, *args, **options):
        tomorrow = datetime.date.today() + datetime.timedelta(days=1)
        trips = Trip.objects.filter(start_date=tomorrow)
        for trip in trips:
            trip.remind()
