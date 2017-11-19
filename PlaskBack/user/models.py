from django.db import models
import json


class Location(models.Model):
    loc_code1 = models.IntegerField()  # for LocationL1
    loc_code2 = models.IntegerField()  # for LocationL2
    loc_code3 = models.IntegerField()  # for LocationL3


class Service(models.Model):
    name = models.CharField(max_length=100)


class UserInfo(models.Model):
    nickname = models.CharField(max_length=100, default='')
    is_active = models.BooleanField(default=True)  # Sync with User
    notify_freq = models.IntegerField(default=5)
    locations = models.ManyToManyField(
        Location,
        related_name='+',
    )
    services = models.ManyToManyField(
        Service,
        related_name='users'
    )
    blocked = models.ManyToManyField(
        Service,
        related_name='+'
    )

    #def toJSON(self):
    #    return json.dumps(self, default=lambda x: x.__dict__, sort_keys=True, indent=4)
