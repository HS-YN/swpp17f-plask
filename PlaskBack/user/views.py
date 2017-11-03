from django.http import HttpResponse, HttpResponseNotAllowed
from django.http import HttpResponseNotFound, JsonResponse
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.views.decorators.csrf import ensure_csrf_cookie
from django.forms.models import model_to_dict
from .models import UserInfo
from location.models import LocationL1, LocationL2, LocationL3
import json

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

		try:
			# Check Username Uniqueness
			User.objects.get(username = username)
			return HttpResponse(status = 412)
		except User.DoesNotExist:
			try:
				# Optimization: creating User with AnonymousUser(Reuse DB)
				new_user = User.objects.get(is_acitve = False)
				new_user.username = username
				new_user.is_active = True
				new_user.set_password(password)
				new_user.save()
				new_userinfo = UserInfo.get(id = new_user.id)
				new_userinfo.nickname = nickname
				new_userinfo.is_active = True
			except User.DoesNotExist:
				new_user = User.objects.create_user(username = username, password = password)
				new_userinfo = UserInfo(nickname = nickname, is_active = True)
			new_userinfo.setService(services)
			new_userinfo.setLocations(locations)
			new_userinfo.save ()
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
		username = req_data['username']
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
'''
def userinfo(request):
	if request.method == 'GET':
		# get userinfo - assume logged in
		if request.user is not None:
			userinfo = UserInfo.objects.get(id = request.user.id)
			return JsonResponse (model_to_dict (userinfo))
		else:
			return HttpResponse(status = 403)

	elif request.method == 'PUT':
		# put userinfo - assume logged in
		if request.user is not None:
			req_data = json.loads(request.body.decode())
			location1 = req_data['location1']
			location2 = req_data['location2']
			location3 = req_data['location3']
			
			userinfo = UserInfo.objects.get(id = request.user.id)
			userinfo.location1 = location1
			userinfo.location2 = location2
			userinfo.location3 = location3
			userinfo.save()
			return HttpResponse(status = 204)
		else:
			return HttpResponse(status = 403)

	else:
		return HttpResponseNotAllowed(['GET', 'PUT'])
'''
