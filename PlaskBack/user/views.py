from django.http import HttpResponse, HttpResponseNotAllowed
from django.http import HttpResponseNotFound, JsonResponse
from django.forms.models import model_to_dict

import json, pickle
from django.views.decorators.csrf import ensure_csrf_cookie
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User

from .models import UserInfo, Service
from location.models import LocationL1, LocationL2, LocationL3
from location.models import locParse, servParse, setLocation
import json


def setService(userinfo, services):
	userinfo.services.clear()
	for service in services:
		new_service, _ = Service.objects.get_or_create(name = service)
		userinfo.services.add(new_service)
		userinfo.save()

def getLocationStr(userinfo):
	result = ''
	for location in list(userinfo.locations.all()):
		loc_code1 = location.loc_code1
		loc_code2 = location.loc_code2
		loc_code3 = location.loc_code3
		
		loc_name1 = LocationL1.objects.get(loc_code = loc_code1).name
		loc_name2 = LocationL2.objects.get(loc_code = loc_code2).name
		loc_name3 = LocationL3.objects.get(loc_code = loc_code3).name
		
		result = result + loc_name1 + '/' + loc_name2 + '/' + loc_name3 + ';'
	return result

def getServiceStr(userinfo):
	result = ''
	for service in list(userinfo.services.all()):
		result = result + service.name + ';'
	return result

@ensure_csrf_cookie
def token(request):
	if request.method == 'GET':
		return HttpResponse(status = 204)
	else:
		return HttpResponseNotAllowed(['GET'])

def signup(request):
	if request.method == 'POST':
		req_data = json.loads(request.body.decode())
		username = req_data['email']
		nickname = req_data['username']
		password = req_data['password']
		locations = req_data['locations']
		services = req_data['services']
	
		if User.objects.filter(username = username).exists():
			return HttpResponse(status = 401)
		# TODO reuse anonymous user db for signup => next sprint
		User.objects.create_user(username = username, password = password)
		new_userinfo = UserInfo(nickname = nickname, is_active = True)
		new_userinfo.save()

		services = servParse(services)
		setService(new_userinfo, services)
		locations = locParse(locations)
		try:
			setLocation(new_userinfo, locations)
		except UserInfo.DoesNotExist:
			return HttpResponse(status = 404)
		new_userinfo.save()
		return HttpResponse(status = 201)
	
	elif request.method == 'DELETE':
		# remove user - assume logged in
		if request.user is not None:
			del_userinfo = UserInfo.objects.get(id = request.user.id)
			del_userinfo.is_active = False
			request.user.is_active = False
			del_userinfo.locations.clear()
			del_userinfo.services.clear()
			del_userinfo.save()
			request.user.save()
			return HttpResponse(status = 204)
		else:
			return HttpResponse(status = 403)

	else:
		return HttpResponseNotAllowed(['POST', 'DELETE'])

def signin(request):
	if request.method == 'POST':
		req_data = json.loads(request.body.decode())
		username = req_data['email']
		password = req_data['password']
		user = authenticate(request, username = username, password = password)
		if user is not None:
			login(request, user)
			return HttpResponse(status = 204)
		else:
			return HttpResponse(status = 401)

	else:
		return HttpResponseNotAllowed(['POST'])

def signout(request):
	if request.method == 'GET':
		logout(request)
		return HttpResponse(status = 204)
	else:
		return HttpResponseNotAllowed(['GET'])

def userinfo(request):
	if request.method == 'GET':
		# get userinfo - assume logged in
		if request.user is not None:
			userinfo = UserInfo.objects.get(id = request.user.id)
			result = {}
			result['email'] = request.user.username
			result['username'] = userinfo.nickname
			result['locations'] = getLocationStr(userinfo)
			result['services'] = getServiceStr(userinfo)
			return JsonResponse (result)
		else:
			return HttpResponse(status = 401)

	elif request.method == 'PUT':
		# put userinfo - assume logged in
		if request.user is None:
			return HttpResponse(status = 401)
		user = request.user

		# TODO make it put
		req_data = json.loads(request.body.decode())
		#TODO: Deal with Password Issue
		#password = req_data['password']
		locations = req_data['locations']
		services = req_data['services']
	
		#user.set_password(password)
		userinfo = UserInfo.objects.get(id = user.id)
		services = servParse(services)
		setService(userinfo, services)
		locations = locParse(locations)
		try:
			setLocation(userinfo, locations)
		except UserInfo.DoesNotExist:
			return HttpResponse(status = 404)
		userinfo.save ()
		user.save()
		return HttpResponse(status = 204)

	else:
		return HttpResponseNotAllowed(['GET', 'PUT'])

