from django.db import models
from user.models import Location, UserInfo, Service
from datetime import datetime


class Answer(models.Model):
    content = models.TextField()
    time = models.TimeField()
    question = models.ForeignKey(
        'Question',
        related_name='answers',
        null=True,
        on_delete = models.CASCADE
    )
    author = models.ForeignKey(
        UserInfo,
        null=True,
        related_name='answers',
        on_delete = models.CASCADE,
    )

class Question(models.Model):
    time = models.DateTimeField()
    content = models.TextField()
    author = models.ForeignKey(
        UserInfo,
        null=True,
        related_name='questions',
        on_delete = models.CASCADE,
    )
    locations = models.ManyToManyField(
        Location,
        related_name='+',
    )
    services = models.ManyToManyField(
        Service,
        related_name='questions'
    )
    selAnswer = models.OneToOneField(
        Answer,
        related_name='+',
        null=True,
        default=None,
        on_delete=models.CASCADE
    )
    ansUsers = models.ManyToManyField(
        UserInfo,
        related_name='answered',
    )