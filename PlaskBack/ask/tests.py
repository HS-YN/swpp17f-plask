from django.test import TestCase, Client
from django.contrib.auth import login
from .models import Question, Answer
from user.models import UserInfo
from datetime import datetime
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
import json


class AskTestCase(TestCase):
    def setUp(self):
        client = Client(enforce_csrf_checks=True)
        response = client.get('/api/user/token')
        csrftoken = response.cookies['csrftoken'].value
        response = self.client.post('/api/user/signup',
            json.dumps({
                'email': 'PlaskTest1@snu.ac.kr',
                'username': 'PlaskTest1',
                'password': '123123',
                'locations':
                'South Korea/Busan/Buk;South Korea/Busan/Busanjin;',
                'services': 'coffee;pizza;'
            }),
            content_type='application/json',
            HTTP_X_CSRFTOKEN=csrftoken)

        response = self.client.post('/api/user/signin', json.dumps({
            'email': 'PlaskTest1@snu.ac.kr', 'password': '123123'}),
            content_type='application.json')
        Question.objects.create(
            content='q',
            time=datetime.now()
        )
        self.client = Client()

    def test_question(self):
        response = self.client.get('/api/ask/question')
        data = json.loads(response.content.decode())
        self.assertEqual(data[0]['content'], 'q')

    def test_question_recent(self):
        pass
