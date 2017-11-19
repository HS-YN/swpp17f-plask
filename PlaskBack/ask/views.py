from django.http import HttpResponse, HttpResponseNotAllowed
from django.http import JsonResponse, HttpResponseNotFound

from django.contrib.auth.models import User
from django.shortcuts import render

from user.models import UserInfo, Location, Service
from user.views import servParse, locParse
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
        author = UserInfo.objects.get(id=request.user.id)
        return JsonResponse(
            list(author.questions.all().values()), safe=False)
    elif request.method == 'POST':
        author = UserInfo.objects.get(id=request.user.id)
        content = json.loads(request.body.decode())['content']
        locations = locParse(json.loads(request.body.decode())['locations'])
        services = servParse(json.loads(request.body.decode())['services'])
        # TODO: fix getting locations and services(match from string to id)
        new_question = Question(
            author=author, content=content, time=datetime.now(),
            locations=locations, services=services)
        new_question.save()
        return HttpResponse(status=201)
    else:
        return HttpResponseNotAllowed(['GET', 'POST'])


@login_required
def question_recent(request):
    pass


@login_required
def question_related(request):
    pass


@login_required
def question_search(request):
    pass


@login_required
def question_answer(request):
    pass


@login_required
def answer(request, question_id):
    pass
