from django.http import HttpResponse, HttpResponseNotAllowed
from django.http import JsonResponse, HttpResponseNotFound

from user.views import tokenWith, servParse, locParse, setService, setLocation
from user.views import login_required
from .models import Question, Answer

from .utils import question_to_dict, answer_to_dict, getQuestion_LocCode, Search, Related, getAnswerInOrder

from datetime import datetime, timedelta, time
import json

@login_required
def question(request):
    if request.method == 'GET':
        author = request.user.userinfo
        questions = list(author.questions.order_by('time').all())
        questions.reverse()
        return JsonResponse(
            [question_to_dict (question) for question in questions],
            safe=False)
    elif request.method == 'POST':
        author = request.user.userinfo
        req_body = json.loads(request.body.decode())
        content = req_body['content']
        locations = locParse(req_body['locations'])
        services = servParse(req_body['services'])
        new_question = Question(
            author=author, content=content, time=datetime.now())
        new_question.save()
        setService(new_question, services)
        try :
            setLocation(new_question, locations, Question)
        except Question.DoesNotExist:
            return HttpResponse(status=400)
        return HttpResponse(status=204)
    else:
        return HttpResponseNotAllowed(['GET', 'POST'])

@login_required
def question_related(request):
    if request.method == 'GET':
        userinfo = request.user.userinfo
        locations = userinfo.locations.all()
        services = userinfo.services
        blocked = userinfo.blocked
        
        MAX_COUNT = 30
        result = set([])
        for location in locations:
            try:
                result = result | set(getQuestion_LocCode(location.loc_code1, location.loc_code2, location.loc_code3, True))
            except Question.DoesNotExist:
                return HttpResponse (status = 400) # invalid location code
        result = list(result)
        result.reverse()
        result = Related.sortQuestionByService (result, services)
        result = Related.filterQuestion (result, blocked, userinfo)
        if len(result) == 0:
            result = Related.getRecentQuestion ()
        return JsonResponse(
            [question_to_dict(question) for question in result[:MAX_COUNT]],
            safe = False)
    else:
        return HttpResponseNotAllowed(['GET'])

@login_required
def question_search(request):
    if request.method == 'POST':
        req_body = json.loads(request.body.decode())
        loc_code1 = int(req_body['loc_code1'])
        loc_code2 = int(req_body['loc_code2'])
        loc_code3 = int(req_body['loc_code3'])
        search_string = req_body['search_string']

        try:
            questions = getQuestion_LocCode (loc_code1, loc_code2, loc_code3, False)
        except Question.DoesNotExist:
            return HttpResponse (status = 400) # invalid location code input

        MAX_SEARCH_COUNT = 50
        search_words = tokenWith(search_string.replace('%20', ' '), ' ')
        result = []
        for question in questions:
            match_point = Search.getQuestionMatchPoint(question, search_words)
            if match_point >= 1:
                result.append ((match_point, question))
        result = [point_question[1] for point_question in sorted(result, key = lambda point_question: point_question[0], reverse = True)]
        result = result[:MAX_SEARCH_COUNT]
        return JsonResponse(
            [question_to_dict(question) for question in result],
            safe=False)
    else:
        return HttpResponseNotAllowed(['POST'])

@login_required
def question_answer(request):
    if request.method == 'GET':
        author = request.user.userinfo
        questions = []
        answers = list(author.answers.order_by('time').all())
        answers.reverse()
        for answer in answers:
            if answer.question not in questions:
                questions.append(answer.question)
        return JsonResponse(
            [question_to_dict(question) for question in questions], safe=False)
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
        answers = getAnswerInOrder (curr_question)
        return JsonResponse(
            [answer_to_dict (answer) for answer in answers], safe=False)
    elif request.method == 'POST':
        author = request.user.userinfo
        req_body = json.loads(request.body.decode())
        content = req_body['content']
        new_answer = Answer(
            author=author, content=content, time=datetime.now(), question = curr_question)
        new_answer.save()
        return HttpResponse(status=204)
    else:
        return HttpResponseNotAllowed(['GET', 'POST'])

@login_required
def select (request, question_id, answer_id):
    if request.method == 'GET':
        author = request.user.userinfo
        try:
            question = author.questions.get(id = question_id)
        except Question.DoesNotExist:
            return HttpResponse (status = 400)
        try:
            answer = question.answers.get(id = answer_id)
        except Answer.DoesNotExist:
            return HttpResponse (status = 400)
        if answer.author.id == author.id: # do not allow select my answer
            return HttpResponse (status = 400)
        else:
            question.selAnswer = answer
            question.save()
            return HttpResponse (status = 204)
    else:
        return HttpResponseNotAllowed(['GET'])