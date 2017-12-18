from django.test import TestCase, Client

from .models import LocationL1, LocationL2, LocationL3
from user.models import UserInfo
from .utils import getLocationFromCSVFile

from django.contrib.auth import authenticate
from django.contrib.auth.models import User
import json


class LocationTestCase(TestCase):
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
                    'blockedServices': 'asdf;qwer',
                    'notiFrequency': '10'
                    }),
                content_type = 'application/json',
                HTTP_X_CSRFTOKEN = csrftoken)

        response = self.client.post('/api/user/signin', json.dumps({'email': 'PlaskTest1@snu.ac.kr', 'password': '123123'}), content_type = 'application.json')
        self.assertEqual(response.status_code, 204)

    def test_invalid(self):
        response = self.client.get ('/api/location/1')
        self.assertEqual(response.status_code, 404)
        response = self.client.get ('/api/location/1/1')
        self.assertEqual(response.status_code, 404)
        response = self.client.get ('/api/location/213/999')
        self.assertEqual(response.status_code, 404)
        response = self.client.delete('/api/location/countries')
        self.assertEqual(response.status_code, 405)
        response = self.client.delete('/api/location/1')
        self.assertEqual(response.status_code, 405)
        response = self.client.delete('/api/location/1/1')
        self.assertEqual(response.status_code, 405)

    def test_location(self):
        response = self.client.get('/api/location/countries')
#        data = json.loads(response.content.decode())
#        print (data)
        self.assertEqual(response.status_code, 200)

        response = self.client.get('/api/location/213')
#        data = json.loads(response.content.decode())
#        print (data)
        self.assertEqual(response.status_code, 200)

        response = self.client.get('/api/location/213/1')
#        data = json.loads(response.content.decode())
#        print (data)
        self.assertEqual(response.status_code, 200)
