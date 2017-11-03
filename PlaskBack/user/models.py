from django.db import models
from location.models import LocationL1, LocationL2, LocationL3

class UserInfo(models.Model):
	nickname = models.CharField(max_length = 100)
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
			new_service, _ = Service.get_or_create(name = service)
			self.services.add(new_service)
	def setLocation(self, location_list):
		# assumption: location_list = [[l1, l2, l3], ... ]
		for location in location_list:
			try:
				l1 = LocationL1.objects.get(name = location[0])
			except LocationL1.DoesNotExist:
				raise UserInfo.DoesNotExist
			try:
				l2 = l1.child.get(name = location[1])
			except LocationL2.DoesNotExist:
				raise UserInfo.DoesNotExist
			try:
				l3 = l2.child.get(name = location[2])
			except LocationL3.DoesNotExist:
				raise UserInfo.DoesNotExist
			l1.persons.add(self)
			l2.persons.add(self)
			l3.persons.add(self)
			new_location, _ = Location.get_or_create(
				loc_code1 = l1.loc_code,
				loc_code2 = l2.loc_code,
				loc_code3 = l3.loc_code
			)
			self.locations.add(new_location)

class Location(models.Model):
	loc_code1 = models.IntegerField() # for LocationL1
	loc_code2 = models.IntegerField() # for LocationL2
	loc_code3 = models.IntegerField() # for LocationL3

class Service(models.Model):
	name = models.CharField(max_length = 100)


