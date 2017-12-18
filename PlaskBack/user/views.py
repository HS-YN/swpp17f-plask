from django.http import HttpResponse, HttpResponseNotAllowed
from django.http import HttpResponseNotFound, JsonResponse

from django.views.decorators.csrf import ensure_csrf_cookie
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User

from .models import UserInfo, Service
from .utils import Parse, SetInfo, login_required

import json, random

@ensure_csrf_cookie
def token(request):
    if request.method == 'GET':
        return HttpResponse(status=204)
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
        blocked = req_data['blockedServices']
        notify_freq = int(req_data['notiFrequency'])

        if User.objects.filter(username=username).exists():
            return HttpResponse(status=401)
        # TODO reuse anonymous user db for signup => next sprint
        User.objects.create_user(username=username, password=password)
        new_userinfo = UserInfo(nickname=nickname, is_active=True, notify_freq=notify_freq)
        new_userinfo.user = User.objects.get(username=username)
        new_userinfo.save()

        services = Parse.servParse(services)
        blocked = Parse.servParse(blocked)
        SetInfo.setService(new_userinfo, services)
        SetInfo.setBlocked(new_userinfo, blocked)
        locations = Parse.locParse(locations)
        try:
            SetInfo.setLocation(new_userinfo, locations, UserInfo)
        except UserInfo.DoesNotExist:
            return HttpResponse(status=404)
        new_userinfo.save()
        return HttpResponse(status=201)
    else:
        return HttpResponseNotAllowed(['POST', 'DELETE'])


def signin(request):
    if request.method == 'POST':
        req_data = json.loads(request.body.decode())
        username = req_data['email']
        password = req_data['password']
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return HttpResponse(status=204)
        else:
            return HttpResponse(status=401)

    else:
        return HttpResponseNotAllowed(['POST'])


def signout(request):
    if request.method == 'GET':
        logout(request)
        return HttpResponse(status=204)
    else:
        return HttpResponseNotAllowed(['GET'])

def checksignedin(request):
    if request.method == 'GET':
        if request.user.is_authenticated:
            return JsonResponse('True', safe=False)
        else:
            return JsonResponse('False', safe=False)
    else:
        return HttpResponseNotAllowed(['GET'])

@login_required
def userinfo(request):
    if request.method == 'GET':
        userinfo = request.user.userinfo
        result = {}
        result['email'] = request.user.username
        result['username'] = userinfo.nickname
        result['locations'] = Parse.getLocationStr(userinfo)
        result['services'] = Parse.getServiceStr(userinfo)
        result['blockedServices'] = Parse.getBlockedStr(userinfo)
        result['notiFrequency'] = userinfo.notify_freq
        return JsonResponse (result)
    elif request.method == 'PUT':
        # put userinfo - assume logged in
        req_data = json.loads(request.body.decode())
        if 'password' in req_data:
            password = req_data['password']
            request.user.set_password(password)
        locations = req_data['locations']
        services = req_data['services']
        blocked = req_data['blockedServices']
        notify_freq = int(req_data['notiFrequency'])

        userinfo = request.user.userinfo
        services = Parse.servParse(services)
        blocked = Parse.servParse(blocked)
        SetInfo.setService(userinfo, services)
        SetInfo.setBlocked(userinfo, blocked)
        locations = Parse.locParse(locations)
        try:
            SetInfo.setLocation(userinfo, locations, UserInfo)
        except UserInfo.DoesNotExist:
            return HttpResponse(status = 404)
        userinfo.notify_freq = notify_freq
        userinfo.save()
        request.user.save()
        return HttpResponse(status = 204)
    else:
        return HttpResponseNotAllowed(['GET', 'PUT'])


def service(request):
    if request.method == 'GET':
        services = list(Service.objects.all())
        random.shuffle(services)
        return JsonResponse(
            [service.name for service in services], safe=False)
    else:
        return HttpResponseNotAllowed(['GET'])
