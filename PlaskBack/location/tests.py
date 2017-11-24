from django.test import TestCase, Client

from .models import LocationL1, LocationL2, LocationL3
from user.models import UserInfo
from location.models import getLocationFromCSVFile

from django.contrib.auth import authenticate
from django.contrib.auth.models import User
import json


class AskTestCase(TestCase):
    def setUp(self):
        self.client = Client()
        getLocationFromCSVFile('./location/korea.CSV')

        client = Client(enforce_csrf_checks = True)
        response = client.get('/api/user/token')
        csrftoken = response.cookies['csrftoken'].value
        response = self.client.post(
                '/api/user/signup',
                json.dumps({
                    'email': 'PlaskTest1@snu.ac.kr',
                    'username': 'PlaskTest1',
                    'password': '123123',
                    'locations': 'South Korea/Busan/Buk;South Korea/Busan/Busanjin;',
                    'services': 'coffee;pizza;',
                    'blocked': 'asdf;qwer',
                    'notify_freq': '10'
                    }),
                content_type = 'application/json',
                HTTP_X_CSRFTOKEN = csrftoken)

        response = self.client.post('/api/user/signin', json.dumps({'email': 'PlaskTest1@snu.ac.kr', 'password': '123123'}), content_type = 'application.json')
        self.assertEqual(response.status_code, 204)

    def test_invalid(self):
        response = self.client.delete('/api/location/countries')
        self.assertEqual(response.status_code, 405)

        response = self.client.delete('/api/location/1')
        self.assertEqual(response.status_code, 405)

        response = self.client.delete('/api/location/1/1')
        self.assertEqual(response.status_code, 405)

    def test_question_answer(self):
        response = self.client.get('/api/location/countries')
        self.assertEqual(response.status_code, 200)

        response = self.client.get('/api/location/South%20Korea')
        self.assertEqual(response.status_code, 200)

        response = self.client.get('/api/location/South%20Korea/Seoul')
        self.assertEqual(response.status_code, 200)