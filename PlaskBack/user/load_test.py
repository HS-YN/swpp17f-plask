from locust import HttpLocust, TaskSet, task
import json

class UserAppTasks(TaskSet):
	@task
	def service(self):
		self.client.get('/api/user/services')

class WebsiteUesr(HttpLocust):
	task_set = UserAppTasks
	min_wait = 5000
	max_wait = 15000