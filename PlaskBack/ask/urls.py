from django.conf.urls import url
from ask import views

urlpatterns = [
    url('^question$', views.question, name='question'),
    url('^question/related$', views.question_related, name='question_related'),
    url('^question/search$', views.question_search, name='question_search'),
    url('^question/answer$', views.question_answer, name='question_answer'),
    url('^answer/(?P<question_id>[0-9]+)$', views.answer, name='answer'),
    url('^select/(?P<question_id>[0-9]+)/(?P<answer_id>[0-9]+)', views.select, name='select'),
]
