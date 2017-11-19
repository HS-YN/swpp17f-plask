from django.db import models
from user.models import Location, UserInfo, Service
from datetime import datetime


class Question(models.Model):
    time = models.DateTimeField(default=datetime.now())
    content = models.TextField()
    author = models.ForeignKey(
        UserInfo,
        related_name='questions',
        null=True
    )
    locations = models.ManyToManyField(
        Location,
        related_name='+',
    )
    services = models.ManyToManyField(
        Service,
        related_name='questions'
    )


class Answer(models.Model):
    content = models.TextField()
    time = models.TimeField()
    question = models.ForeignKey(
        'Question',
        related_name='answers',
        null=True
    )
    author = models.ForeignKey(
        UserInfo,
        related_name='answers',
        null=True
    )
