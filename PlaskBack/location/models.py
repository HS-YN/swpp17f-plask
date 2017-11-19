from django.db import models
from user.models import UserInfo, Location
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
			level1, _ = LocationL1.objects.get_or_create(loc_code = int(row[0]), name = str(row[1]))
			level2, created = LocationL2.objects.get_or_create(loc_code = int(row[2]), name = str(row[3]))
			level3, _ = LocationL3.objects.get_or_create(loc_code = int(row[4]), name = str(row[5]))
			if (created):
				level2.parent = level1
				level2.save()
			level3.parent = level2
			level3.save()

def setLocation(userinfo, location_list):
	userinfo.locations.clear()
	for location in location_list:
		loc_length = len (location)
		try:
			l1 = LocationL1.objects.get(name = location[0])
		except LocationL1.DoesNotExist:
			raise UserInfo.DoesNotExist
		l1.persons.add(userinfo)
		l1.save()
		loc_code_l1 = l1.loc_code
		
		loc_length = loc_length - 1
		if loc_length > 0:
			try:
				l2 = l1.child.get(name = location[1])
			except LocationL2.DoesNotExist:
				raise UserInfo.DoesNotExist
			l2.persons.add(userinfo)
			l2.save()
			loc_code_l2 = l2.loc_code
		else:
			loc_code_l2 = -1

		loc_length = loc_length - 1
		if loc_length > 0:
			try:
				l3 = l2.child.get(name = location[2])
			except LocationL3.DoesNotExist:
				raise UserInfo.DoesNotExist
			l3.persons.add(userinfo)
			l3.save()
			loc_code_l3 = l3.loc_code
		else:
			loc_code_l3 = -1

		new_location, _ = Location.objects.get_or_create(
			loc_code1 = loc_code_l1,
			loc_code2 = loc_code_l2,
			loc_code3 = loc_code_l3
		)
		userinfo.locations.add(new_location)
		userinfo.save()

