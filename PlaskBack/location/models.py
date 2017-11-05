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

def locParse(instr) :
    loclist = servParse(instr)
    result = []
    for loc in loclist :
        semiResult = []
        loc = loc.replace('/', ' ')
        tokens = loc.split()
        for tok in tokens :
            semiResult.append(tok)
        result.append(semiResult)
    return result

def servParse(instr) : 
    instr = instr.replace(';', ' ')
    tokens = instr.split()
    result = []
    for tok in tokens :
        result.append(tok)
    return result

