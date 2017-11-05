from django.conf.urls import url
from location import views

urlpatterns = [
    url('^countries$', views.getCountries, name='getCountries'),
    url('^(?P<loc_lv1>[\w\ ]+)$', views.getLv1Child, name='getLv1Child'),
    url('^(?P<loc_lv1>[\w\ ]+)/(?P<loc_lv2>[\w\ ]+)$', views.getLv2Child, name='getLv2Child'),
#	url('^name/(?P<location_name>[A-Za-z]+)$', views.getLoc_Code, name = 'name'),
]
