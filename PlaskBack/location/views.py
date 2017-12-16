from django.http import HttpResponse, HttpResponseNotAllowed
from django.http import HttpResponseNotFound, JsonResponse

from .models import LocationL1, LocationL2
from .utils import loc_to_dict

import json

def getCountries(request):
    if request.method == 'GET': 
        return JsonResponse([loc_to_dict(location) for location in LocationL1.objects.all()], safe=False)
    else:
        return HttpResponseNotAllowed(['POST','PUT','DELETE'])

def getLv1Child(request, loc_lv1_code):
    if request.method == 'GET':
        try:
            loc_l1 = LocationL1.objects.get(loc_code = loc_lv1_code)
        except LocationL1.DoesNotExist:
            return HttpResponseNotFound()
        return JsonResponse([loc_to_dict(location) for location in loc_l1.child.all()], safe=False)
    else:
        return HttpResponseNotAllowed(['POST','PUT','DELETE'])


def getLv2Child(request, loc_lv1_code, loc_lv2_code):
    if request.method == 'GET':
        try:
            loc_l1 = LocationL1.objects.get(loc_code = loc_lv1_code)
        except LocationL1.DoesNotExist:
            return HttpResponseNotFound()
        try:
            loc_l2 = loc_l1.child.get(loc_code = loc_lv2_code)
        except LocationL2.DoesNotExist:
            return HttpResponseNotFound()
        return JsonResponse([loc_to_dict(location) for location in loc_l2.child.all()], safe=False)
    else:
        return HttpResponseNotAllowed(['POST','PUT','DELETE'])


