from django.conf.urls import url
from ask import views

urlpatterns = [
    url('^question$', views.question, name='question'),
    url('^question/recent$', views.question_recent, name='question_recent'),
    url('^question/related$', views.question_related, name='question_related'),
    url('^question/search/(?P<loc_code1>[0-9]+)/(?P<search_string>[\s\w]+)$', views.question_search1, name='question_search1'),
    url('^question/search/(?P<loc_code1>[0-9]+)/(?P<loc_code2>[0-9]+)/(?P<search_string>[\s\w]+)$', views.question_search2, name='question_search2'),
    url('^question/search/(?P<loc_code1>[0-9]+)/(?P<loc_code2>[0-9]+)/(?P<loc_code3>[0-9]+)/(?P<search_string>[\s\w]+)$', views.question_search3, name='question_search3'),
    url('^question/answer$', views.question_answer, name='question_answer'),
    url('^answer/(?P<question_id>[0-9]+)$', views.answer, name='answer')
]
