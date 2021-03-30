from django.urls import path
from api.views import snippet_list, PlaceList, PlaceListGeneric, TypeListGeneric

urlpatterns = [
    path('places/', PlaceListGeneric.as_view()),
    path('types/', TypeListGeneric.as_view())
]
