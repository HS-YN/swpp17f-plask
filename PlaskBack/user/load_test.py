from locust import HttpLocust, TaskSet, task

class UserAppTasks(TaskSet):
	@task
	def signup(self):
		self.client.get('/api/user/services')

class WebsiteUesr(HttpLocust):
	task_set = UserAppTasks
	min_wait = 5000
	max_wait = 15000