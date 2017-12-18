from locust import HttpLocust, TaskSet, task
import json

class UserAppTasks(TaskSet):
	def on_start(self):
		response = self.client.get('/api/user/token')
		csrftoken = response.cookies['csrftoken']

		self.client.post('/api/user/signin',
			json.dumps({'email': 'test1@google.com', 'password': 'test1'}),
			headers={'X-CSRFToken': csrftoken},
			cookies={'csrftoken': csrftoken})

	@task
	def question(self):
		response = self.client.get('/api/ask/question')
		data = json.loads(response.content.decode())
		for question in data:
			self.client.get('/api/ask/answer/' + str(question['id']))

	@task
	def question_related(self):
		response = self.client.get('/api/ask/question/related')
		data = json.loads(response.content.decode())
		for question in data:
			self.client.get('/api/ask/answer/' + str(question['id']))

	@task
	def question_answer(self):
		response = self.client.get('/api/ask/question/answer')
		data = json.loads(response.content.decode())
		for question in data:
			self.client.get('/api/ask/answer/' + str(question['id']))

class WebsiteUesr(HttpLocust):
	task_set = UserAppTasks
	min_wait = 5000
	max_wait = 15000