from django.test import TestCase, Client
from .models import UserInfo
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
import json

class UserTestCase(TestCase):
	def setUp(self):
		self.client = Client()

		client = Client(enforce_csrf_checks = True)
		response = client.get('/api/user/token')
		csrftoken = response.cookies['csrftoken'].value
		self.client.post(
			'/api/user/signup',
			json.dumps({'username': 'PlaskTest1',
				'password': '123123',
				'location1': 'South Korea',
				'location2': 'Seoul',
				'location3': 'Kwanak-gu'}),
			content_type = 'application/json',
			HTTP_X_CSRFTOKEN = csrftoken)
		
	def test_signin_ok(self):
		response = self.client.post('/api/user/signin', json.dumps({'username': 'PlaskTest1', 'password': '123123'}), content_type = 'application.json')
		self.assertEqual(response.status_code, 204)

	def test_signin_failed(self):
		response = self.client.post('/api/user/signin', json.dumps({'username': 'PlaskTest1', 'password': '123123'}), content_type = 'application.json')
