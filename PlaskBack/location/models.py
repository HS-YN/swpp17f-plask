from django.db import models
from user.models import UserInfo, Location
from ask.models import Question

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
