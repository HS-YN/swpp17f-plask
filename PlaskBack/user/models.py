from django.db import models

# Create your models here.

class UserPlus(models.Model):
	loc_code1 = models.IntegerField()
	loc_code2 = models.IntegerField()
	loc_code3 = models.IntegerField()
