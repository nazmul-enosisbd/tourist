from django.urls import path
from api.views import snippet_list, PlaceList, PlaceListGeneric, TypeListGeneric, PlaceDetail

urlpatterns = [
    path('places/', PlaceList.as_view()),
    path('places/<int:pk>/', PlaceDetail.as_view()),
    path('types/', TypeListGeneric.as_view())
]
