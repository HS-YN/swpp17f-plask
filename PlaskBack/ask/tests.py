from django.test import TestCase, Client

from .models import Question, Answer
from user.models import UserInfo
from location.utils import getLocationFromCSVFile

from datetime import datetime
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
import json

def askQuestion(testbench, content, locations, services, code=204):
    response = testbench.client.post(
        '/api/ask/question',
        json.dumps({
            'content': content,
            'locations': locations,
            'services': services
        }),
        content_type='application/json')
    testbench.assertEqual(response.status_code, code)

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
        response = self.client.post(
                '/api/user/signup',
                json.dumps({
                    'email': 'PlaskTest2@snu.ac.kr',
                    'username': 'PlaskTest2',
                    'password': '123123',
                    'locations': 'South Korea/Busan/Buk;South Korea/Busan/Busanjin;South Korea/Seoul;',
                    'services': 'coffee;pizza;',
                    'blockedServices': 'station;airport',
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

        response = self.client.delete('/api/ask/question')
        self.assertEqual(response.status_code, 405)

        response = self.client.delete('/api/ask/question/search')
        self.assertEqual(response.status_code, 405)

        response = self.client.delete('/api/ask/question/related')
        self.assertEqual(response.status_code, 405)

        response = self.client.delete('/api/ask/select/1/1')
        self.assertEqual(response.status_code, 405)

    def test_question_answer(self):
        content = 'q0 content'
        askQuestion (self, content, 'South%20Korea/Busan/Buk;', 'coffee;pizza;')
        askQuestion (self, 'q1', 'South%20Korea/Busan/Buk;', 'station;')         # filtered by service tag
        askQuestion (self, 'q2', 'South%20Korea/Busan/Dong;', 'coffee;pizza;')    # filtered by invalid location
        askQuestion (self, 'q3', 'South%20Korea/Busan/Busanjin;', 'coffee;')
        askQuestion (self, 'q4', 'South%20Korea/Busan/Buk;', 'asdf;qwer;')
        askQuestion (self, 'q5', 'South%20Korea/Busan/Buk;', 'asdf;')
        askQuestion (self, 'q6', 'South%20Korea/Busan/Buk;', 'pizza;')
        askQuestion (self, 'q7', 'South%20Korea/Busan/Buk;', 'coffee;pizza;pasta')

        response = self.client.get('/api/ask/question')
        data = json.loads(response.content.decode())
        print ('DEBUG: /api/ask/question')
        for question in data:
            print ('id: ' + str(question['id']) +' / content: '+ question['content'])

        response = self.client.post('/api/ask/answer/1', json.dumps({
            'content': 'that'
        }), content_type='application/json')
        self.assertEqual(response.status_code, 204)
        response = self.client.post('/api/ask/answer/1', json.dumps({
            'content': 'this'
        }), content_type='application/json')
        self.assertEqual(response.status_code, 204)

        response = self.client.get('/api/ask/answer/1')
        data = json.loads(response.content.decode())
        print ('DEBUG: /api/ask/answer/1')
        for answer in data:
            print ('id: ' + str(answer['id']) + ' / content: ' + answer['content'])

        response = self.client.delete('/api/ask/answer/1')
        self.assertEqual(response.status_code, 405)

        response = self.client.get('/api/ask/question/answer')
        data = json.loads(response.content.decode())
        print ('DEBUG: /api/ask/question/answer')
        for question in data:
            print ('id: ' + str(question['id']) +' / content: '+ question['content'])

        response = self.client.post('/api/ask/question/search', json.dumps({
                'loc_code1': '213',
                'loc_code2': '-1',
                'loc_code3': '-1',
                'search_string': 'content%20to delete asdf qwer zxcv'
            }), content_type='application/json')
        data = json.loads(response.content.decode())
        print ('DEBUG: /api/ask/question/search/213/content%20to delete asdf qwer zxcv')
        for question in data:
            print ('id: ' + str(question['id']) +' / content: '+ question['content'])
        
        response = self.client.post('/api/ask/question/search', json.dumps({
                'loc_code1': '21',
                'loc_code2': '-1',
                'loc_code3': '-1',
                'search_string': 'content%20to delete asdf qwer zxcv'
            }), content_type='application/json')
        self.assertEqual(response.status_code, 400)

        response = self.client.post('/api/ask/question/search', json.dumps({
                'loc_code1': '213',
                'loc_code2': '-1',
                'loc_code3': '-1',
                'search_string': 'to delete asdf qwer zxcv'
            }), content_type='application/json')
        data = json.loads(response.content.decode())
        print ('DEBUG: /api/ask/question/search/213/to delete asdf qwer zxcv')
        for question in data:
            print ('id: ' + str(question['id']) +' / content: '+ question['content'])

        
        response = self.client.post('/api/ask/question/search', json.dumps({
                'loc_code1': '213',
                'loc_code2': '1',
                'loc_code3': '-1',
                'search_string': 'pizza is delicious'
            }), content_type='application/json')
        data = json.loads(response.content.decode())
        print ('DEBUG: /api/ask/question/search/213/1/pizza is delicious')
        for question in data:
            print ('id: ' + str(question['id']) +' / content: '+ question['content'])
        
        response = self.client.post('/api/ask/question/search', json.dumps({
                'loc_code1': '213',
                'loc_code2': '199',
                'loc_code3': '-1',
                'search_string': 'pizza is delicious'
            }), content_type='application/json')
        self.assertEqual(response.status_code, 400)
        
        response = self.client.post('/api/ask/question/search', json.dumps({
                'loc_code1': '213',
                'loc_code2': '1',
                'loc_code3': '-1',
                'search_string': 'is delicious'
            }), content_type='application/json')
        data = json.loads(response.content.decode())
        self.assertEqual(len(data), 0)


        response = self.client.post('/api/ask/question/search', json.dumps({
                'loc_code1': '213',
                'loc_code2': '1',
                'loc_code3': '1',
                'search_string': 'what coffee do you like most?'
            }), content_type='application/json')
        data = json.loads(response.content.decode())
        print ('DEBUG: /api/ask/question/search/213/1/1/what coffee do you like most?')
        for question in data:
            print ('id: ' + str(question['id']) +' / content: '+ question['content'])

        response = self.client.post('/api/ask/question/search', json.dumps({
                'loc_code1': '213',
                'loc_code2': '1',
                'loc_code3': '199',
                'search_string': 'what coffee do you like most?'
            }), content_type='application/json')
        self.assertEqual(response.status_code, 400)

        response = self.client.post('/api/ask/question/search', json.dumps({
                'loc_code1': '213',
                'loc_code2': '1',
                'loc_code3': '1',
                'search_string': 'what do you like most?'
            }), content_type='application/json')
        data = json.loads(response.content.decode())
        self.assertEqual(len(data), 0)


        response = self.client.get('/api/ask/question/related')
        data = json.loads(response.content.decode())
        self.assertEqual(len(data), 8)

        response = self.client.get ('/api/user/signout')
        self.assertEqual(response.status_code, 204)
        response = self.client.post('/api/user/signin', json.dumps({'email': 'PlaskTest2@snu.ac.kr', 'password': '123123'}), content_type = 'application.json')
        self.assertEqual(response.status_code, 204)

        askQuestion (self, 'q8', 'South%20Korea/Busan/Buk;', 'coffee;pizza;pasta')
        askQuestion (self, 'q9', 'South%20Korea/Busan/Bok;', 'coffee;pizza;pasta', 400)
        askQuestion (self, 'q10', 'South%20Korea/Soul;', 'coffee;pizza;pasta', 400)
        askQuestion (self, 'q11', 'Korea;', 'coffee;pizza;pasta', 400)
        askQuestion (self, 'q12', 'South%20Korea;', 'coffee;pizza;pasta')
        askQuestion (self, 'q13', 'South%20Korea/Busan;', 'coffee;pizza;pasta')

        response = self.client.get('/api/ask/question/related')
        data = json.loads(response.content.decode())
        print ('DEBUG: /api/ask/question/related')
        for question in data:
            print ('id: ' + str(question['id']) +' / content: '+ question['content'])


        response = self.client.post('/api/ask/answer/1', json.dumps({
            'content': 'this1'
        }), content_type='application/json')
        self.assertEqual(response.status_code, 204)
        response = self.client.post('/api/ask/answer/1', json.dumps({
            'content': 'this2'
        }), content_type='application/json')
        self.assertEqual(response.status_code, 204)
        response = self.client.get('/api/ask/answer/1')
        data = json.loads(response.content.decode())
        print ('DEBUG: /api/ask/answer/1')
        for answer in data:
            print ('id: ' + str(answer['id']) + ' / content: ' + answer['content'])

        response = self.client.get('/api/ask/select/1/1')
        self.assertEqual(response.status_code, 400)
        response = self.client.get ('/api/user/signout')
        self.assertEqual(response.status_code, 204)
        response = self.client.post('/api/user/signin', json.dumps({'email': 'PlaskTest1@snu.ac.kr', 'password': '123123'}), content_type = 'application.json')
        self.assertEqual(response.status_code, 204)

        response = self.client.get('/api/ask/select/1/1')
        self.assertEqual(response.status_code, 400)
        response = self.client.get('/api/ask/select/1/5')
        self.assertEqual(response.status_code, 400)
        response = self.client.get('/api/ask/select/1/3')
        self.assertEqual(response.status_code, 204)

        response = self.client.get('/api/ask/question')
        data = json.loads(response.content.decode())
        print ('DEBUG: /api/ask/question')
        for question in data:
            print ('id: ' + str(question['id']) +' / content: '+ question['content'] + ' / select_id: ' + str(question['select_id']))

        response = self.client.get('/api/ask/answer/1')
        data = json.loads(response.content.decode())
        print ('DEBUG: /api/ask/answer/1')
        for answer in data:
            print ('id: ' + str(answer['id']) + ' / content: ' + answer['content'])