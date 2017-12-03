from django.http import HttpResponse, HttpResponseNotAllowed
from django.http import HttpResponseNotFound, JsonResponse
from django.forms.models import model_to_dict

from django.views.decorators.csrf import ensure_csrf_cookie
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User

from .models import UserInfo, Service, Location
from location.models import LocationL1, LocationL2, LocationL3
import json, random

# CHECK LOGIN
def login_required(function=None, redirect_field_name=None):
    def _decorator(func):
        def _wrapped_view(request, *args, **kwargs):
            if request.user.is_authenticated():
                return func(request, *args, **kwargs)
            else:
                return HttpResponse(status=401)
        return _wrapped_view
    return _decorator(function)


# TOKENIZE FUNCTIONS
def tokenWith(string, tokstr):
    tokens = string.split(tokstr)
    result = []
    for tok in tokens:
        if tok is not None and tok != '':
            result.append(tok)
    return result
def servParse(servstr):
    return tokenWith(servstr, ';')
def locParse(locstr):
    loclist = tokenWith(locstr, ';')
    result = []
    for loc in loclist:
        subResult = tokenWith(loc, '/')
        result.append(subResult)
    return result


# SET SERVICES AND LOCATIONS
def setService(has_serv, services):
    has_serv.services.clear()
    for service in services:
        new_service, _ = Service.objects.get_or_create(name=service)
        has_serv.services.add(new_service)
        has_serv.save()
def setBlocked(userinfo, blocked):
    userinfo.blocked.clear()
    for service in blocked:
        new_service, _ = Service.objects.get_or_create(name=service)
        userinfo.blocked.add(new_service)
        userinfo.save()

def addToLocation(has_loc, location, ModelClassType):
    if ModelClassType == UserInfo:
        location.persons.add(has_loc)
    else:
        location.questions.add(has_loc)
def setLocation(has_loc, location_list, ModelClassType):
    has_loc.locations.clear()
    for location in location_list:
        loc_length = len(location)
        try:
            l1 = LocationL1.objects.get(name=location[0].replace("%20", " "))
        except LocationL1.DoesNotExist:
            raise ModelClassType.DoesNotExist
        addToLocation(has_loc, l1, ModelClassType)
        l1.save()
        loc_code_l1 = l1.loc_code

        loc_length = loc_length - 1
        if loc_length > 0:
            try:
                l2 = l1.child.get(name=location[1].replace("%20", " "))
            except LocationL2.DoesNotExist:
                raise ModelClassType.DoesNotExist
            addToLocation(has_loc, l2, ModelClassType)
            l2.save()
            loc_code_l2 = l2.loc_code
        else:
            loc_code_l2 = -1

        loc_length = loc_length - 1
        if loc_length > 0:
            try:
                l3 = l2.child.get(name=location[2].replace("%20", " "))
            except LocationL3.DoesNotExist:
                raise ModelClassType.DoesNotExist
            addToLocation(has_loc, l3, ModelClassType)
            l3.save()
            loc_code_l3 = l3.loc_code
        else:
            loc_code_l3 = -1

        new_location, _ = Location.objects.get_or_create(
            loc_code1=loc_code_l1,
            loc_code2=loc_code_l2,
            loc_code3=loc_code_l3
        )
        has_loc.locations.add(new_location)
        has_loc.save()


# PARSE LOCATION FOR JSON RESPONSE
def getLocationStr(has_loc):
    result = ''
    for location in list(has_loc.locations.all()):
        loc_code1 = location.loc_code1
        loc_code2 = location.loc_code2
        loc_code3 = location.loc_code3

        loc1 = LocationL1.objects.get(loc_code=loc_code1)

        loc_name1 = loc1.name + '/'
        if(loc_code2 > 0):
            loc2 = loc1.child.get(loc_code=loc_code2)
            loc_name2 = loc2.name + '/'
        else:
            loc_name2 = ""
        if(loc_code3 > 0):
            loc_name3 = loc2.child.get(loc_code=loc_code3).name
        else:
            loc_name3 = ""

        result = result + loc_name1 + loc_name2 + loc_name3 + ';'
    return result
def getBlockedStr(userinfo):
    result = ''
    for service in list(userinfo.blocked.all()):
        result = result + service.name + ';'
    return result
def getServiceStr(has_serv):
    result = ''
    for service in list(has_serv.services.all()):
        result = result + service.name + ';'
    return result


# API
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

        services = servParse(services)
        blocked = servParse(blocked)
        setService(new_userinfo, services)
        setBlocked(new_userinfo, blocked)
        locations = locParse(locations)
        try:
            setLocation(new_userinfo, locations, UserInfo)
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
        if request.user.is_authenticated():
            return JsonResponse('True', safe=False)
        else:
            return JsonResponse('False', safe=False)
    else:
        return HttpResponseNotAllowed(['GET'])

@login_required
def userinfo(request):
    if request.method == 'GET':
        # get userinfo - assume logged in
        # NOTE: request.user returns instance of Anonymous User if a user is not logged in (instead of None)
        userinfo = request.user.userinfo
        result = {}
        result['email'] = request.user.username
        result['username'] = userinfo.nickname
        result['locations'] = getLocationStr(userinfo)
        result['services'] = getServiceStr(userinfo)
        result['blockedServices'] = getBlockedStr(userinfo)
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
        services = servParse(services)
        blocked = servParse(blocked)
        setService(userinfo, services)
        setBlocked(userinfo, blocked)
        locations = locParse(locations)
        try:
            setLocation(userinfo, locations, UserInfo)
        except UserInfo.DoesNotExist:
            return HttpResponse(status = 404)
        userinfo.notify_freq = notify_freq
        userinfo.save()
        request.user.save()
        return HttpResponse(status = 204)
    else:
        return HttpResponseNotAllowed(['GET', 'PUT'])

@login_required
def service(request):
    if request.method == 'GET':
        services = list(Service.objects.all())
        COUNT = 10
        random.shuffle (services)
        services = services[:COUNT]
        return JsonResponse(
            [service.name for service in services], safe=False)
    else:
        return HttpResponseNotAllowed(['GET'])