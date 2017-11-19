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
        User.objects.create_user(username='a', password='123')
        Question.objects.create(
            content='q',
            time=datetime.now()
        )
        self.client = Client()

    def test_question(self):
        #response = self.client.get('/api/ask/question')
        #self.assertEqual(response.status_code, 401)
        self.client.login(username='a', password='123')
        response = self.client.post('/api/ask/question', json.dumps({
            'content': 'this'
            }), content_type='application/json')
        self.assertEqual(response.status_code, 201)
        response = self.client.get('/api/ask/question')
        data = json.loads(response.content.decode())
        self.assertEqual(data[0]['content'], 'this')

    def test_question_recent(self):
        pass
