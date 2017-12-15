from django.http import HttpResponse, HttpResponseNotAllowed
from django.http import JsonResponse, HttpResponseNotFound
from django.forms.models import model_to_dict

from user.models import Location, Service
from user.views import tokenWith, servParse, locParse, setService, setLocation, getLocationStr, getServiceStr
from user.views import login_required
from location.views import LocationL1, LocationL2, LocationL3
from .models import Question, Answer

from datetime import datetime, timedelta, time

import json


def question_to_dict(question):
    result = {}
    result['id'] = question.id
    result['content'] = question.content
    result['time'] = str(question.time)
    result['author'] = question.author.nickname
    result['locations'] = getLocationStr(question)
    result['services'] = getServiceStr(question)
    if question.selAnswer is None:
        result['select_id'] = -1
    else: result['select_id'] = question.selAnswer.id
    return result
def answer_to_dict(answer, author):
    result = {}
    result['id'] = answer.id
    result['content'] = answer.content
    result['time'] = str(answer.time)
    result['author'] = answer.author.nickname
    if answer.author.id == author.id:
        result['isMine'] = 'True'
    else: result['isMine'] = 'False'
    return result

def getQuestionByLocCode (loc_code_set):
    try:
        l1 = LocationL1.objects.get(loc_code = loc_code_set.loc_code1)
    except LocationL1.DoesNotExist:
        raise Question.DoesNotExist
    if loc_code_set.loc_code2 >= 0:
        try:
            l2 = l1.child.get(loc_code = loc_code_set.loc_code2)
        except LocationL2.DoesNotExist:
            raise Question.DoesNotExist
    else:
        l2 = None
    if l2 is not None and loc_code_set.loc_code3 >= 0:
        try:
            l3 = l2.child.get(loc_code = loc_code_set.loc_code3)
        except LocationL3.DoesNotExist:
            raise Question.DoesNotExist
    else:
        l3 = None

    TIME_DIFF = 7 # 1 week
    start_time = datetime.now().date() - timedelta(TIME_DIFF)
    if l3 is not None:
        return list(l3.questions.order_by('time').filter(time__gte = start_time).all())
    elif l2 is not None:
        return list(l2.questions.order_by('time').filter(time__gte = start_time).all())
    else:
        return list(l1.questions.order_by('time').filter(time__gte = start_time).all())
def getServiceMatchPoint (question, services):
    match_count = 0
    for service in services.all():
        for q_service in question.services.all():
            if service.name == q_service.name:
                match_count = match_count + 1
    return match_count
def sortQuestionByService (questions, services):
    result = []
    for question in questions:
        result.append ((getServiceMatchPoint(question, services), question))
    return [point_question[1] for point_question in sorted(result, key = lambda point_question: point_question[0], reverse = True)]
def isMyQuestion (question, userinfo):
    for myQuestion in userinfo.questions.all():
        if question.id == myQuestion.id:
            return True
    return False
def filterQuestion (questions, blocked, userinfo):
    result = []
    for question in questions:
        if getServiceMatchPoint(question, blocked) == 0 and not isMyQuestion(question, userinfo):
            result.append (question)
    return result
def popSelectedAnswer (question, answers):
    if question.selAnswer is None:
        answer_id = -1
    else:
        answer_id = question.selAnswer.id
    if answer_id == -1:
        return None, answers
    else:
        select = None
        left = []
        for answer in answers:
            if answer.id == answer_id:
                select = answer
            else:
                left.append(answer)
        return select, left



def getQuestion_by_loc_code(loc_code1, loc_code2, loc_code3):
    loc_code1 = int(loc_code1)
    loc_code2 = int(loc_code2)
    loc_code3 = int(loc_code3)
    try:
        l1 = LocationL1.objects.get(loc_code = loc_code1)
    except LocationL1.DoesNotExist:
        raise Question.DoesNotExist
    if (loc_code2 < 0):
        return l1.questions
    try:
        l2 = l1.child.get(loc_code = loc_code2)
    except LocationL2.DoesNotExist:
        raise Question.DoesNotExist
    if (loc_code3 < 0):
        return l2.questions
    try:
        l3 = l2.child.get(loc_code = loc_code3)
    except LocationL3.DoesNotExist:
        raise Question.DoesNotExist
    return l3.questions
def isCommonWord(word):
    word = word.lower()
    wordlist = ['a', 'an', 'is', 'isn\'t', 'are', 'aren\'t',
        'was', 'wasn\'t', 'were', 'weren\'t', 'it', 'that', 'this',
        'at', 'in', 'for', 'where', 'when', 'how', 'what', 'who', 'why', 'and', 'or',
        'to', 'of', 'will', 'would', 'can', 'cannot', 'can\'t' 'could',
        'may', 'might', 'here', 'there', 'not', 'there\'s',
        'with', 'if', 'else', 'have', 'near', 'nearby', 'i', 'you', 'he', 'she', 'they',
        'do', 'don\'t', 'has', 'haven\'t', 'hasn\'t', 'does', 'doesn\'t']
    for forbidden in wordlist:
        if word == forbidden:
            return True
    return False
def strListContains(strlist, word):
    for string in strlist:
        if string.lower() == word.lower():
            return True
    return False
def getQuestionMatchPoint(question, search_words):
    total_count = 0
    match_count = 0
    content = question.content
    services = [service.name for service in question.services.all()]

    for word in search_words:
        if not isCommonWord(word):
            total_count = total_count + 1
            if word.lower() in content.lower() or strListContains(services, word):
                match_count = match_count + 1
    if total_count == 0:
        return 0
    else:
        return match_count * 100 / total_count

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
def question_recent(request):
    if request.method == 'GET':
        yesterday = datetime.now().date() - timedelta(1)
        start_time = datetime.combine(yesterday, time())
        questions = list(Question.objects.order_by('time').filter(time__gte=start_time))
        questions.reverse()
        return JsonResponse(
            [question_to_dict(question) for question in questions],
            safe=False)
    else:
        return HttpResponseNotAllowed(['GET'])

@login_required
def question_related(request):
    if request.method == 'GET':
        userinfo = request.user.userinfo
        locations = userinfo.locations.all()
        services = userinfo.services
        blocked = userinfo.blocked
        
        MAX_COUNT = 30
        result = []
        for location in locations:
            try:
                result = result + getQuestionByLocCode(location)
            except Question.DoesNotExist:
                return HttpResponse (status = 400) # invalid location code
        result.reverse()
        result = sortQuestionByService (result, services)
        result = filterQuestion (result, blocked, userinfo)
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
            questions = getQuestion_by_loc_code (loc_code1, loc_code2, loc_code3)
        except Question.DoesNotExist:
            return HttpResponse (status = 400) # invalid location code input

        MAX_SEARCH_COUNT = 50
        search_words = tokenWith(search_string.replace('%20', ' '), ' ')
        result = []
        for question in questions.all():
            match_point = getQuestionMatchPoint(question, search_words)
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
        author = curr_question.author
        answers = list(curr_question.answers.order_by('time').all())
        select, answers = popSelectedAnswer (curr_question, answers)
        answers.append (select)
        answers.reverse()
        return JsonResponse(
            [answer_to_dict (answer, author) for answer in answers], safe=False)
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
        # do not allow select my answer
        if answer.author.id == author.id:
            return HttpResponse (status = 400)
        else:
            question.selAnswer = answer
            question.save()
            return HttpResponse (status = 204)
    else:
        return HttpResponseNotAllowed(['GET'])