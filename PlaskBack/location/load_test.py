from locust import HttpLocust, TaskSet, task
import json

class UserAppTasks(TaskSet):
	@task
	def location(self):
		response = self.client.get('/api/location/213')
		data = json.loads(response.content.decode())
		for locationL2 in data:
			self.client.get('/api/location/213/' + str(locationL2['loc_code']))


class WebsiteUesr(HttpLocust):
	task_set = UserAppTasks
	min_wait = 5000
	max_wait = 15000