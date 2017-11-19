from django.conf.urls import url
from ask import views

urlpatterns = [
    url('^ask/question$', views.question, name='question'),
    url('^ask/question/recent$', views.question_recent,
        name='question_recent'),
    url('^ask/question/related$', views.question_related,
        name='question_related'),
    url('^ask/question/search$', views.question_search,
        name='question_search'),
    url('^ask/question/answer$', views.question_answer,
        name='question_answer'),
    url('^ask/answer/(?P<question_id>[0-9]+)$', views.answer, name='answer')
]
