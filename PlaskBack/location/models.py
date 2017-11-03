from django.db import models
from user.models import UserInfo
import csv

class LocationL1(models.Model):
	loc_code = models.PositiveIntegerField()
	name = models.CharField(max_length = 100)
	persons = models.ManyToManyField(
		UserInfo,
		related_name = '+',
	)

class LocationL2(models.Model):
	loc_code = models.PositiveIntegerField()
	name = models.CharField(max_length = 100)
	parent = models.ForeignKey(
		'LocationL1',
		related_name = 'child',
		null = True
	)
	persons = models.ManyToManyField(
		UserInfo,
		related_name = '+',
	)

class LocationL3(models.Model):
	loc_code = models.PositiveIntegerField()
	name = models.CharField(max_length = 100)
	parent = models.ForeignKey(
		'LocationL2',
		related_name = 'child',
		null = True
	)
	persons = models.ManyToManyField(
		UserInfo,
		related_name = '+',
	)

def getLocationFromCSVFile(path):
	with open(path) as f:
		reader = csv.reader(f)
		for row in reader:
			level1, _ = LocationL1.objects.get_or_create(loc_code = reader[0], name = reader[1])
			level2, created = LocationL2.objects.get_or_create(loc_code = reader[0], name = reader[1])
			level3, _ = LocationL3.objects.get_or_create(loc_code = reader[0], name = reader[1])
			if (created):
				level2.parent = level1
			level3.parent = level2

def setLocation(userinfo, location_list):
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
		userinfo.locations.add(new_location)
