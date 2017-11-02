from django.db import models

# Create your models here.

class UserInfo(models.Model):
	is_active = models.BooleanField(default = True) # Sync with User
	location1 = models.CharField(max_length = 100)	# Country
	location2 = models.CharField(max_length = 100)	# State
	location3 = models.CharField(max_length = 100)	# City
