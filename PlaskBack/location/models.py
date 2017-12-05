from django.db import models
from user.models import UserInfo, Location
from ask.models import Question
import csv

class LocationL1(models.Model):
    loc_code = models.PositiveIntegerField()
    name = models.CharField(max_length=100)
    persons = models.ManyToManyField(
        UserInfo,
        related_name='+',
    )
    questions = models.ManyToManyField(
        Question,
        related_name='+'
    )


class LocationL2(models.Model):
    loc_code = models.PositiveIntegerField()
    name = models.CharField(max_length=100)
    parent = models.ForeignKey(
        'LocationL1',
        related_name='child',
        null=True,
        on_delete = models.CASCADE
    )
    persons = models.ManyToManyField(
        UserInfo,
        related_name='+',
    )
    questions = models.ManyToManyField(
        Question,
        related_name='+'
    )


class LocationL3(models.Model):
    loc_code = models.PositiveIntegerField()
    name = models.CharField(max_length=100)
    parent = models.ForeignKey(
        'LocationL2',
        related_name='child',
        null=True,
        on_delete = models.CASCADE
    )
    persons = models.ManyToManyField(
        UserInfo,
        related_name='+',
    )
    questions = models.ManyToManyField(
        Question,
        related_name='+'
    )


def getLocationFromCSVFile(path):
    with open(path) as f:
        reader = csv.reader(f)
        for row in reader:
            level1, _ = LocationL1.objects.get_or_create(
                loc_code=int(row[0]), name=str(row[1]))
            level2, created = LocationL2.objects.get_or_create(
                loc_code=int(row[2]), name=str(row[3]))
            level3, _ = LocationL3.objects.get_or_create(
                loc_code=int(row[4]), name=str(row[5]))
            if (created):
                level2.parent = level1
                level2.save()
            level3.parent = level2
            level3.save()
