from django.http import HttpResponse, HttpResponseNotAllowed
from django.http import HttpResponseNotFound, JsonResponse
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.views.decorators.csrf import ensure_csrf_cookie
from django.forms.models import model_to_dict
from .models import UserInfo
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
		username = req_data['username']
		password = req_data['password']
		location1 = req_data['location1']
		location2 = req_data['location2']
		location3 = req_data['location3']

		# have the same id index between user and userinfo 
		User.objects.create_user(username = username, password = password)
		new_userinfo = UserInfo(is_active = True, location1 = location1, location2 = location2, location3 = location3)
		new_userinfo.save ()
		return HttpResponse(status = 201)

	elif request.method == 'DELETE':
		# remove user - assume logged in
		if request.user is not None:
			del_userinfo = UserInfo.objects.get(id = request.user.id)
			del_userinfo.is_active = False
			request.user.is_active = False
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
