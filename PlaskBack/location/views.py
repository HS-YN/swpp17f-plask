from django.http import HttpResponse, HttpResponseNotAllowed
from django.http import HttpResponseNotFound, JsonResponse
from django.forms.models import model_to_dict
from .models import LocationL1, LocationL2, LocationL3
import json

# MIGHT BE USED / do not check test
# get location code by name

def getCountries(request):
    if request.method == 'GET': 
        cons = list(LocationL1.objects.all().values())
        result = ''
        for con in cons:
          result = result+con['name']
          result = result + ';'
        return JsonResponse(result, safe=False)
    else:
        return HttpResponseNotAllowed(['POST','PUT','DELETE'])

def getLv1Child(request, loc_lv1):
    if request.method == 'GET':
        loc = LocationL1.objects.get(name = loc_lv1)
        locs = list(loc.child.all().values())
        result = ''
        for temploc in locs:
          result = result+temploc['name']
          result = result+';'
        return JsonResponse(result, safe=False)
    else:
        return HttpResponseNotAllowed(['POST','PUT','DELETE'])


def getLv2Child(request, loc_lv1, loc_lv2):
    if request.method == 'GET':
        loc = LocationL1.objects.get(name = loc_lv1)
        loc2 = loc.child.get(name = loc_lv2)
        locs = list(loc2.child.all().values())
        result = ''
        for temploc in locs:
          result = result+temploc['name']
          result = result+';'
        return JsonResponse(result, safe=False)
    else:
        return HttpResponseNotAllowed(['POST','PUT','DELETE'])


