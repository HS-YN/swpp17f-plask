from user.views import getLocationStr, getServiceStr
from location.views import LocationL1, LocationL2, LocationL3
from .models import Question, Answer

from datetime import datetime, timedelta, time

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
def answer_to_dict(answer):
    result = {}
    result['id'] = answer.id
    result['content'] = answer.content
    result['time'] = str(answer.time)
    result['author'] = answer.author.nickname
    return result

def getQuestion_LocCode(loc_code1, loc_code2, loc_code3, filterByTime):
    TIME_DIFF = 7 # 1 week
    start_time = datetime.now().date() - timedelta(TIME_DIFF)

    try:
        l1 = LocationL1.objects.get(loc_code = int(loc_code1))
    except LocationL1.DoesNotExist:
        raise Question.DoesNotExist
    if (loc_code2 < 0):
        if filterByTime:
            return list(l1.questions.order_by('time').filter(time__gte = start_time).all())
        else:
            return list(l1.questions.all())

    try:
        l2 = l1.child.get(loc_code = int(loc_code2))
    except LocationL2.DoesNotExist:
        raise Question.DoesNotExist
    if (loc_code3 < 0):
        if filterByTime:
            return list(l2.questions.order_by('time').filter(time__gte = start_time).all())
        else:
            return list(l2.questions.all())

    try:
        l3 = l2.child.get(loc_code = int(loc_code3))
    except LocationL3.DoesNotExist:
        raise Question.DoesNotExist
    if filterByTime:
        return list(l3.questions.order_by('time').filter(time__gte = start_time).all())
    else:
        return list(l3.questions.all())

class Search:
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
            if not Search.isCommonWord(word):
                total_count = total_count + 1
                if word.lower() in content.lower() or Search.strListContains(services, word):
                    match_count = match_count + 1
        if total_count == 0:
            return 0
        else:
            return match_count * 100 / total_count

class Related:
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
            result.append ((Related.getServiceMatchPoint(question, services), question))
        return [point_question[1] for point_question in sorted(result, key = lambda point_question: point_question[0], reverse = True)]
    def isMyQuestion (question, userinfo):
        for myQuestion in userinfo.questions.all():
            if question.id == myQuestion.id:
                return True
        return False
    def isAnswered (question, userinfo):
        ansUsers = list(question.ansUsers.all())
        answered = list(userinfo.answered.all())
        if len(ansUsers) < len(answered):
            for ansUser in ansUsers:
                if ansUser.id == userinfo.id:
                    return True
            return False
        else:
            for question_ in answered:
                if question.id == question_.id:
                    return True
            return False
    def filterQuestion (questions, blocked, userinfo):
        result = []
        for question in questions:
            if (Related.getServiceMatchPoint(question, blocked) == 0 and
                not Related.isMyQuestion(question, userinfo) and
                not Related.isAnswered(question, userinfo)):
                result.append (question)
        return result

    def getRecentQuestion ():
        yesterday = datetime.now().date() - timedelta(1)
        start_time = datetime.combine(yesterday, time())
        questions = list(Question.objects.order_by('time').filter(time__gte=start_time))
        questions.reverse()
        return questions

def getAnswerInOrder (question):
    selAnswer = question.selAnswer
    answers = list(question.answers.order_by('time').all())
    if selAnswer is None:
        answers.reverse ()
        return answers
    else:
        idx = answers.index (selAnswer)
        del answers[idx]
        answers.append (selAnswer)
        answers.reverse ()
        return answers