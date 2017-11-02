from django.db import models
import csv

class UserInfo(models.Model):
	is_active = models.BooleanField(default = True) # Sync with User
	locations = models.ManyToManyField(
		Location,
		related_name = '+',
	)

class Location(models.Model):
	loc_code1 = models.IntegerField() # for LocationL1
	loc_code2 = models.IntegerField() # for LocationL2
	loc_code3 = models.IntegerField() # for LocationL3


class LocationL1(models.Model):
	loc_code = models.PositiveIntegerField()
	name = models.CharField(max_length = 100)
	persons = models.ManyToManyField(
		Person,
		related_name = '+',
	)

class LocationL2(models.Model):
	loc_code = models.PositiveIntegerField()
	name = models.CharField(max_length = 100)
	locations = models.ForeignKey(
		'LocationL1',
		related_name = 'child',
		null = True
	)
	persons = models.ManyToManyField(
		Person,
		related_name = '+',
	)

class LocationL3(models.Model):
	loc_code = models.PositiveIntegerField()
	name = models.CharField(max_length = 100)
	locations = models.ForeignKey(
		'LocationL2',
		related_name = 'child',
		null = True
	)
	persons = models.ManyToManyField(
		Person,
		related_name = '+',
	)

'''def readLocationFile (filepath):
	with open(filepath) as f:
		reader = csv.reader(f)
		for row in reader
			_, created = LocationL1'''
