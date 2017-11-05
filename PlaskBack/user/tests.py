from django.test import TestCase, Client
from .models import UserInfo
from .views import multi_dump
from location.models import getLocationFromCSVFile, LocationL1, LocationL2, LocationL3
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
import json

class UserTestCase(TestCase):
  def setUp(self):
    self.client = Client()
    getLocationFromCSVFile ('./location/korea.CSV')

    client = Client(enforce_csrf_checks = True)
    response = client.get('/api/user/token')
    csrftoken = response.cookies['csrftoken'].value
    response = self.client.post(
        '/api/user/signup',
        json.dumps({
          'email': 'PlaskTest1@snu.ac.kr',
          'username': 'PlaskTest1',
          'password': '123123',
          'locations': 'South Korea/Busan/Buk;South Korea/Busan/Busanjin',
          'services': 'coffee;pizza;'
          }),
        content_type = 'application/json',
        HTTP_X_CSRFTOKEN = csrftoken)

  def test_signin_ok(self):
    response = self.client.post('/api/user/signin', json.dumps({'username': 'PlaskTest1@snu.ac.kr', 'password': '123123'}), content_type = 'application.json')
    self.assertEqual(response.status_code, 204)

  def test_signin_failed(self):
    response = self.client.post('/api/user/signin', json.dumps({'username': 'PlaskTest1', 'password': '123123'}), content_type = 'application.json')

  def test_get_loc_list(self):
    response = self.client.get('/api/location/countries', content_type = 'application.json')
    data = json.loads(response.content.decode())
    print(data)
    response = self.client.get('/api/location/South Korea', content_type = 'application.json')
    data = json.loads(response.content.decode())
    print(data)
    response = self.client.get('/api/location/South Korea/Seoul', content_type = 'application.json')
    data = json.loads(response.content.decode())
    print(data)
