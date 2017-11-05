from django.conf.urls import url
from location import views

urlpatterns = [
    url('^countries$', views.getCountries, name='getCountries'),
    url('^(?P<loc_lv1>[A-Za-z\ ]+)$', views.getLv1Child, name='getLv1Child'),
    url('^(?P<loc_lv1>[A-Za-z\ ]+)/(?P<loc_lv2>[A-Za-z\ ]+)$', views.getLv2Child, name='getLv2Child'),
#	url('^name/(?P<location_name>[A-Za-z]+)$', views.getLoc_Code, name = 'name'),
]
