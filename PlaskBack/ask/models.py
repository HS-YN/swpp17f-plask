from django.db import models

class Question(models.Model):
	content = models.TextField ()
	time = models.TimeField ()
	author = models.ForeignKey (
		'UserInfo',
		related_name = 'questions',
		null = True
	)	
	locations = models.ManyToManyField(
		Location,
		related_name = '+',
	)
	services = models.ManyToManyField(
		Service,
		related_name = 'questions'
	)


class Answer(models.Model):
	content = models.TextField ()
	time = models.TimeField ()
	question = models.ForeignKey (
		'Question',
		releate_name = 'answers',
		null = True
	)
	author = models.ForeignKey (
		'UserInfo',
		related_name = 'answers',
		null = True
	)
