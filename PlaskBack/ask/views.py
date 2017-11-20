from django.http import HttpResponse, HttpResponseNotAllowed
from django.http import JsonResponse, HttpResponseNotFound

from user.models import UserInfo, Location, Service
from user.views import servParse, locParse, setService
from location.views import LocationL1, LocationL2, LocationL3
from .models import Question, Answer

from datetime import datetime, timedelta, time

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
        yesterday = datetime.now().date() - timedelta(1)
        start_time = datetime.combine(yesterday, time())
        return JsonResponse(list(Question.objects.order_by('time').filter(
            time__gte=start_time).values()), safe=False)
    else:
        return HttpResponseNotAllowed(['GET'])

'''
@login_required
def question_related(request):
    if request.method == 'GET':
        curr_user = UserInfo.objects.get(id=request.user.id)
        location = curr_user.locations.all().values()[0]
        tag_search = curr_user.services.all().values()
        relevant_questions = list(Question.objects.filter(locations__loc_code1=location['loc_code1']).filter(
            locations__loc_code2=location['loc_code2']
        ).filter(locations__loc_code3=location['loc_code3']).values())
        selected_questions = []
        for question_given in relevant_questions:
            weight = 0
            threshold = len(question_given.services) * 0.7
            # TODO: for question_given, there is an attributeError: "dict object has no attribute objects"
            for question_tag in question_given.services:
                if tag_search.find(question_tag) != -1:
                    weight = weight + 1
            if weight >= threshold:
                selected_questions.append(question_given)
        return selected_questions
    else:
        return HttpResponseNotAllowed(['GET'])
'''

'''
# TODO: There is a same problem with question_related.
@login_required
def question_search(request):
    if request.method == 'GET':
        location_raw = location2index(json.loads(request.body.decode())['location'].split('/'))
        location = Location.objects.get(loc_code1=location_raw[0], loc_code2=location_raw[1], loc_code3=location_raw[2])
        search_target = json.loads(request.body.decode())['search'].split(' ')
        string_search = []
        tag_search = []
        for curr in search_target:
            if curr.find('#') != -1:
                tag_search.append(curr[1:])
            else:
                string_search.append(curr)
        tag_search = service2index(tag_search)
        relevant_questions = list(Question.objects.filter(locations=location).values())
        selected_questions = []
        threshold = len(search_target)*0.7
        for question_given in relevant_questions:
            weight = 0
            for string_given in string_search:
                if question_given.content.find(string_given) != -1:
                    weight = weight+1
            for tag_given in tag_search:
                if question_given.services.find(tag_given) != -1:
                    weight = weight+1
            if weight >= threshold:
                selected_questions.append(question_given)
        return selected_questions
    else:
        return HttpResponseNotAllowed(['GET'])
'''

@login_required
def question_answer(request):
    if request.method == 'GET':
        author = UserInfo.objects.get(id=request.user.id)
        return JsonResponse(
            list(author.answers.all().values()), safe=False)
    else:
        return HttpResponseNotAllowed(['GET'])


@login_required
def answer(request, question_id):
    question_id = int(question_id)
    try:
        curr_question = Question.objects.get(id=question_id)
    except Question.DoesNotExist:
        return HttpResponseNotFound()
    if request.method == 'GET':
        return JsonResponse(
            list(Answer.objects.filter(question=curr_question).values()), safe=False)
    elif request.method == 'POST':
        author = UserInfo.objects.get(id=request.user.id)
        req_body = json.loads(request.body.decode())
        content = req_body['content']
        new_answer = Answer(
            author=author, content=content, time=datetime.now(), question=curr_question)
        new_answer.save()
        return HttpResponse(status=201)
    else:
        return HttpResponseNotAllowed(['GET', 'POST'])

'''
def service2index(service_list):
    if len(service_list) <= 0:
        return []

    index_list = []
    for services in service_list:
        index_list.append(Service.objects.get(name=services).id)
    return index_list


def location2index(location_list):
    index_list = [-1, -1, -1]
    if len(location_list) >= 1 & len(location_list[0]) > 0:
        index_list[0] = LocationL1.objects.get(name=location_list[0].replace("%20", " ")).id
    if len(location_list) >= 2 & len(location_list[1]) > 0:
        index_list[1] = LocationL2.objects.get(name=location_list[1].replace("%20", " ")).id
    if len(location_list) >= 3 & len(location_list[2] > 0):
        index_list[1] = LocationL2.objects.get(name=location_list[2].replace("%20", " ")).id
    return index_list;
'''

def setLocation(question, location_list):
    question.locations.clear()
    for location in location_list:
        loc_length = len(location)
        try:
            l1 = LocationL1.objects.get(name=location[0].replace("%20", " "))
        except LocationL1.DoesNotExist:
            raise Question.DoesNotExist
        loc_codel1 = l1.loc_code

        loc_length = loc_length - 1
        if loc_length > 0:
            try:
                l2 = l1.child.get(name=location[1].replace("%20", " "))
            except LocationL2.DoesNotExist:
                raise Question.DoesNotExist
            loc_codel2 = l2.loc_code
        else:
            loc_codel2 = -1

        loc_length = loc_length - 1
        if loc_length > 0:
            try:
                l3 = l2.child.get(name=location[2].replace("%20", " "))
            except LocationL3.DoesNotExist:
                raise Question.DoesNotExist
            loc_codel3 = l3.loc_code
        else:
            loc_codel3 = -1

        new_location, _ = Location.objects.get_or_create (
            loc_code1=loc_codel1,
            loc_code2=loc_codel2,
            loc_code3=loc_codel3
        )
        question.locations.add(new_location)
        question.save()
