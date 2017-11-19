from django.http import HttpResponse, HttpResponseNotAllowed
from django.http import JsonResponse, HttpResponseNotFound

from django.contrib.auth.models import User
from django.shortcuts import render

from user.models import UserInfo, Location, Service
from .models import Question, Answer

from datetime import datetime

import json


def login_required(function=None, redirect_field_name=None):
    def _decorator(func):
        def _wrapped_view(request, *args, **kwargs):
            if request.user.is_authenticated():
                return func(request, *args, **kwargs)
            else:
                return HttpResponse(status=401)
        return _wrapped_view
    return _decorator(function)


@login_required
def question(request):
    if request.method == 'GET':
        author = User.objects.get(username=request.user.username)
        return JsonResponse(
            list(Question.objects.filter(author=author).values()), safe=False)
    elif request.method == 'POST':
        author = User.objects.get(username=request.user.username)
        content = json.loads(request.body.decode())['content']
        locations = json.loads(request.body.decode())['locations']
        services = json.loads(request.body.decode())['services']
        new_question = Question(
            author=author, content=content, time=datetime.now(),
            locations=locations, services=services)
        new_question.save()
        return HttpResponse(status=201)
    else:
        return HttpResponseNotAllowed(['GET', 'POST'])
# TODO: after integration, need to check validity of locations and services.


def question_pushed():
