from rest_framework import generics
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from api.models import Place, Type
from api.serializers import PlaceSerializer, TypeSerializer

import sqlalchemy


@csrf_exempt
def snippet_list(request):

    engine = sqlalchemy.create_engine('sqlite:///db.sqlite3')
    Session = sqlalchemy.orm.sessionmaker(bind=engine)
    session = Session()
    """
    List all code snippets, or create a new snippet.
    """
    if request.method == 'GET':
        # places = Place.objects.all()
        places = session.query(Place).all()
        serializer = PlaceSerializer(places, many=True)
        return JsonResponse(serializer.data, safe=False)

    elif request.method == 'POST':
        data = JSONParser().parse(request)
        serializer = PlaceSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=201)
        return JsonResponse(serializer.errors, status=400)


class PlaceList(APIView):
    """
    List all snippets, or create a new snippet.
    """

    def get(self, request, format=None):
        engine = sqlalchemy.create_engine('sqlite:///db.sqlite3')
        Session = sqlalchemy.orm.sessionmaker(bind=engine)
        session = Session()
        places = session.query(Place).all()
        serializer = PlaceSerializer(places, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = PlaceSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PlaceListGeneric(generics.ListCreateAPIView):
    engine = sqlalchemy.create_engine('sqlite:///db.sqlite3')
    Session = sqlalchemy.orm.sessionmaker(bind=engine)
    session = Session()
    queryset = session.query(Place).all()
    # queryset = Snippet.objects.all()
    serializer_class = PlaceSerializer


class TypeListGeneric(generics.ListCreateAPIView):
    engine = sqlalchemy.create_engine('sqlite:///db.sqlite3')
    Session = sqlalchemy.orm.sessionmaker(bind=engine)
    session = Session()
    queryset = session.query(Type).all()
    # queryset = Snippet.objects.all()
    serializer_class = TypeSerializer
