from django.http import HttpResponse
from .models import UserInfo, Location, Service
from location.models import LocationL1, LocationL2, LocationL3

def login_required(function=None, redirect_field_name=None):
    def _decorator(func):
        def _wrapped_view(request, *args, **kwargs):
            if request.user.is_authenticated:
                return func(request, *args, **kwargs)
            else:
                return HttpResponse(status=401)
        return _wrapped_view
    return _decorator(function)

class Parse:
    def tokenWith(string, tokstr):
        tokens = string.split(tokstr)
        result = []
        for tok in tokens:
            if tok is not None and tok != '':
                result.append(tok)
        return result
    def servParse(servstr):
        return Parse.tokenWith(servstr, ';')
    def locParse(locstr):
        loclist = Parse.tokenWith(locstr, ';')
        result = []
        for loc in loclist:
            subResult = Parse.tokenWith(loc, '/')
            result.append(subResult)
        return result
    def getLocationStr(has_loc):
        result = ''
        for location in list(has_loc.locations.all()):
            loc_code1 = location.loc_code1
            loc_code2 = location.loc_code2
            loc_code3 = location.loc_code3

            loc1 = LocationL1.objects.get(loc_code=loc_code1)

            loc_name1 = loc1.name
            if(loc_code2 > 0):
                loc2 = loc1.child.get(loc_code=loc_code2)
                loc_name2 = '/' + loc2.name
            else:
                loc_name2 = ""
            if(loc_code3 > 0):
                loc_name3 = '/' + loc2.child.get(loc_code=loc_code3).name
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

class SetInfo:
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
            SetInfo.addToLocation(has_loc, l1, ModelClassType)
            l1.save()
            loc_code_l1 = l1.loc_code

            loc_length = loc_length - 1
            if loc_length > 0:
                try:
                    l2 = l1.child.get(name=location[1].replace("%20", " "))
                except LocationL2.DoesNotExist:
                    raise ModelClassType.DoesNotExist
                SetInfo.addToLocation(has_loc, l2, ModelClassType)
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
                SetInfo.addToLocation(has_loc, l3, ModelClassType)
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