from django.http import HttpResponse, HttpResponseNotAllowed
from django.http import HttpResponseNotFound, JsonResponse
from django.forms.models import model_to_dict
from .models import LocationL1, LocationL2, LocationL3
import json

# MIGHT BE USED / do not check test
# get location code by name
