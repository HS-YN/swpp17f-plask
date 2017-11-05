from django.test import TestCase, Client
from .models import UserInfo
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
				'locations': 'South Korea/Busan/Buk;South Korea/Busan/Busanjin;',
				'services': 'coffee;pizza;'
			}),
			content_type = 'application/json',
			HTTP_X_CSRFTOKEN = csrftoken)

		response = self.client.post('/api/user/signin', json.dumps({'email': 'PlaskTest1@snu.ac.kr', 'password': '123123'}), content_type = 'application.json')
		self.assertEqual(response.status_code, 204)
	
	def test_signin_failed(self):
		response = self.client.post('/api/user/signin', json.dumps({'email': 'PlaskTest1', 'password': '123123'}), content_type = 'application.json')

	def test_userinfo_get(self):
		userinfo = UserInfo.objects.get(id = 1)
		response = self.client.get('/api/user/userinfo')
		data = json.loads(response.content.decode())
		self.assertEqual (response.status_code, 200)
		self.assertEqual (data['locations'], 'South Korea/Busan/Buk;South Korea/Busan/Busanjin;')
		self.assertEqual (data['username'], 'PlaskTest1')
		self.assertEqual (data['services'], 'coffee;pizza;')

	def test_userinfo_put(self):
		userinfo = UserInfo.objects.get(id = 1)
		response = self.client.put(
			'/api/user/userinfo',
			json.dumps({
				'password': '456456',
				'locations': 'South Korea/Busan/Buk',
				'services': 'coffee;pizza;microsoft;hell;swpp'
			}),
			content_type = 'application/json'
		)
		self.assertEqual (response.status_code, 204)

		userinfo = UserInfo.objects.get(id = 1)
		serv = list(userinfo.services.all())
		loc = list(userinfo.locations.all())

		self.assertEqual (len(serv), 5)
		self.assertEqual (len(loc), 1)

