import datetime
import json
import unittest
from random import randint

from django.contrib.auth import get_user_model
from django.test import Client
from rest_framework.reverse import reverse

from .models import Trip

User = get_user_model()


def create_django_contrib_auth_models_user(**kwargs):
    defaults = {}
    defaults["email"] = "test{}@travelcal.com".format(randint(0, 99999))
    defaults.update(**kwargs)
    return User.objects.create(**defaults)


def create_trip(**kwargs):
    defaults = {
        "name": "Trip {}".format(randint(0, 99999)),
        "account": create_django_contrib_auth_models_user(),
        "start_date": datetime.date.today(),
        "end_date": datetime.date.today(),
    }
    defaults.update(**kwargs)
    trip = Trip.objects.create(**defaults)
    return trip


class TripViewTest(unittest.TestCase):
    '''
    Tests for Trip
    '''
    def setUp(self):
        self.client = Client()
        self.account = create_django_contrib_auth_models_user()

    def test_list_trip(self):
        url = reverse('trip-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)

    def test_create_trip(self):
        url = reverse('trip-list')
        data = {
            "name": "Trip {}".format(randint(0, 99999)),
            "account": self.account.id,
            "start_date": datetime.date.today(),
            "end_date": datetime.date.today(),
        }
        response = self.client.post(url, data=data)
        self.assertEqual(response.status_code, 201)

    def test_detail_trip(self):
        trip = create_trip(account=self.account)
        url = reverse('trip-detail', args=[trip.id, ])
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)

    def test_update_trip(self):
        trip = create_trip(account=self.account)
        data = {
            "name": "New Name",
        }
        url = reverse('trip-detail', args=[trip.id, ])
        response = self.client.patch(url, data=json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 200)

    def test_update_trip_user(self):
        trip = create_trip(account=self.account)
        data = {
            "account": create_django_contrib_auth_models_user().id,
        }
        url = reverse('trip-detail', args=[trip.id, ])
        response = self.client.patch(url, data=json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 200)

    def test_delete_trip(self):
        trip = create_trip(account=self.account)
        url = reverse('trip-detail', args=[trip.id, ])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, 204)
