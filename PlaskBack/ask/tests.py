from django.test import TestCase, Client

from .models import Question, Answer
from user.models import UserInfo
from location.models import getLocationFromCSVFile

from datetime import datetime
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
import json


class AskTestCase(TestCase):
    def setUp(self):
        self.client = Client()
        getLocationFromCSVFile('./location/korea.CSV')

        response = self.client.get('/api/ask/question')
        self.assertEqual(response.status_code, 401)

        client = Client(enforce_csrf_checks=True)
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
        response = self.client.get('/api/ask/answer/1')
        self.assertEqual(response.status_code, 404)

        response = self.client.delete('/api/ask/question/answer')
        self.assertEqual(response.status_code, 405)

        response = self.client.delete('/api/ask/question/recent')
        self.assertEqual(response.status_code, 405)

        response = self.client.delete('/api/ask/question')
        self.assertEqual(response.status_code, 405)
        '''
        response = self.client.delete('/api/ask/question/search')
        self.assertEqual(response.status_code, 405)

        response = self.client.delete('/api/ask/question/related')
        self.assertEqual(response.status_code, 405)
        '''

    def test_question_answer(self):
        response = self.client.post(
            '/api/ask/question',
            json.dumps({
                'content': 'this',
                'locations': 'South%20Korea/Busan/Buk;',
                'services': 'coffee;pizza;'
            }),
            content_type='application/json')
        self.assertEqual(response.status_code, 204)

        response = self.client.get('/api/ask/question')
        data = json.loads(response.content.decode())
        self.assertEqual(data[0]['id'], 1)
        self.assertEqual(data[0]['content'], 'this')

        response = self.client.get('/api/ask/question/recent')
        data = json.loads(response.content.decode())
        self.assertEqual(data[0]['id'], 1)

        response = self.client.post('/api/ask/answer/1', json.dumps({
            'content': 'that'
        }), content_type='application/json')
        self.assertEqual(response.status_code, 204)

        response = self.client.get('/api/ask/answer/1')
        data = json.loads(response.content.decode())
        self.assertEqual(data[0]['content'], 'that')

        response = self.client.delete('/api/ask/answer/1')
        self.assertEqual(response.status_code, 405)

        response = self.client.get('/api/ask/question/answer')
        data = json.loads(response.content.decode())
        self.assertEqual(data[0]['content'], 'this')
'''
        response = self.client.get('/api/ask/question/related')
        data = json.loads(response.content.decode())
        self.assertEqual(data[0]['content'], 'this')

        response = self.client.get('/api/ask/question/search',
                                   json.dumps({'search': 'this', 'location': 'South Korea'}),
                                   content_type='application/json')
        data = json.loads(response.content.decode())
        self.assertEqual(data[0]['content'], 'this')
'''
