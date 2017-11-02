from django.db import models
import csv

class Location(models.Model):
	loc_code1 = models.IntegerField() # for LocationL1
	loc_code2 = models.IntegerField() # for LocationL2
	loc_code3 = models.IntegerField() # for LocationL3

class Service(models.Model):
	name = models.CharField(max_length = 100)

class UserInfo(models.Model):
	is_active = models.BooleanField(default = True) # Sync with User
	locations = models.ManyToManyField(
		Location,
		related_name = '+',
	)
	services = models.ManyToManyField(
		Service,
		related_name = 'users'
	)
	def setServce(self, service_list):
		for service in service_list:
			obj, _ = Service.get_or_create(name = service)
			self.services.add(obj)

