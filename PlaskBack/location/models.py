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
	# assumption: location_list = [[l1, l2, l3], ... ]
	for location in location_list:
		print (location)
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
		l1.persons.add(userinfo)
		l2.persons.add(userinfo)
		l3.persons.add(userinfo)
		new_location, _ = Location.objects.get_or_create(
			loc_code1 = l1.loc_code,
			loc_code2 = l2.loc_code,
			loc_code3 = l3.loc_code
		)
		userinfo.locations.add(new_location)

def locParse(instr) :
	loclist = servParse(instr)
	result = []
	for loc in loclist :
		semiResult = []
		loc = loc.replace(' ', '<!?>')
		loc = loc.replace('/', ' ')
		tokens = loc.split()
		for tok in tokens :
			tok = str(tok).replace('<!?>', ' ')
			semiResult.append(tok)
		result.append(semiResult)
	return result

def servParse(instr) :
	instr = instr.replace(' ', '<!?>')
	instr = instr.replace(';', ' ')
	tokens = instr.split()
	result = []
	for tok in tokens :
		tok = str(tok).replace('<!?>', ' ')
		result.append(tok)
	return result

