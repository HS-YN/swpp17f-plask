from django.http import HttpResponse, HttpResponseNotAllowed
from django.http import JsonResponse, HttpResponseNotFound

from django.contrib.auth.models import User
from django.shortcuts import render

from user.models import UserInfo, Location, Service
from user.views import servParse, locParse, setService
from location.views import LocationL1, LocationL2, LocationL3
from .models import Question, Answer

from datetime import datetime, timedelta

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

def setLocation(question, location_list):
    question.locations.clear()
    for location in location_list:
        loc_length = len (location)
        try:
            l1 = LocationL1.objects.get(name = location[0])
        except LocationL1.DoesNotExist:
            raise Question.DoesNotExist
        loc_codel1 = l1.loc_code

        loc_length = loc_length - 1
        if loc_length > 0:
            try:
                l2 = l1.child.get(name = location[1])
            except LocationL2.DoesNotExist:
                raise Question.DoesNotExist
            loc_codel2 = l2.loc_code
        else:
            loc_codel2 = -1

        loc_length = loc_length - 1
        if loc_length > 0:
            try:
                l3 = l2.child.get(name = location[2])
            except LocationL3.DoesNotExist:
                raise Question.DoesNotExist
            loc_codel3 = l3.loc_code
        else:
            loc_codel3 = -1

        new_location, _ = Location.objects.get_or_create (
            loc_code1 = loc_codel1,
            loc_code2 = loc_codel2,
            loc_code3 = loc_codel3
        )
        question.locations.add (new_location)
        question.save ()

@login_required
def question(request):
    if request.method == 'GET':
        author = UserInfo.objects.get(id=request.user.id)
        return JsonResponse(
            list(author.questions.all().values()), safe=False)
    elif request.method == 'POST':
        author = UserInfo.objects.get(id=request.user.id)
        req_body = json.loads(request.body.decode())
        content = req_body['content']
        locations = locParse(req_body['locations'])
        services = servParse(req_body['services'])
        new_question = Question(
            author=author, content=content, time=datetime.now())
        new_question.save()
        setService (new_question, services)
        setLocation (new_question, locations)
        return HttpResponse(status=201)
    else:
        return HttpResponseNotAllowed(['GET', 'POST'])


@login_required
def question_recent(request):
    if request.method == 'GET':
        yesterday = datetime.now() - timedelta(1)
        return JsonResponse(
            list(Question.objects.filter(time >= yesterday).values()),
            safe=False)
    else:
        return HttpResponseNotAllowed(['GET'])


@login_required
def question_related(request):
    pass


def tag_check():
    pass


@login_required
def question_search(request):
    if request.method == 'GET':
        location = json.loads(request.body.decode())['location']
        searchTarget = json.loads(request.body.decode())['search'].split(' ')
        stringSearch = []
        tagSearch = []
        for curr in searchTarget:
            if curr.find('#') != -1:
                tagSearch.append(curr[1:])
            else:
                stringSearch.append(curr)
    else:
        return HttpResponseNotAllowed(['GET'])


@login_required
def question_answer(request):
    pass


@login_required
def answer(request, question_id):
    pass
