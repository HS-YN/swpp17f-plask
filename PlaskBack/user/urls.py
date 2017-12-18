from django.conf.urls import url
from user import views

urlpatterns = [
	url('^token$',		views.token,	name = 'token'),
	url('^signup$',		views.signup,	name = 'signup'),
	url('^signin$',		views.signin,	name = 'signin'),
	url('^signout$',	views.signout,	name = 'signout'),
	url('^userinfo$',	views.userinfo,	name = 'userinfo'),
  	url('^checksignedin$', views.checksignedin, name = 'checksignedin'),
  	url('^service', 	views.service,	name = 'service')
]

