from rest_framework import generics
from django.http import HttpResponse, JsonResponse, Http404
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from api.models import Place, Type
from api.serializers import PlaceSerializer, TypeSerializer

import sqlalchemy

from api.session import sa_session
# engine = sqlalchemy.create_engine('sqlite:///db.sqlite3')
# Session = sqlalchemy.orm.sessionmaker(bind=engine)
# session = Session()


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
        print(places)
        serializer = PlaceSerializer(places, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        engine = sqlalchemy.create_engine('sqlite:///db.sqlite3')
        Session = sqlalchemy.orm.sessionmaker(bind=engine)
        session = Session()
        serializer = PlaceSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PlaceDetail(APIView):
    engine = sqlalchemy.create_engine('sqlite:///db.sqlite3')
    Session = sqlalchemy.orm.sessionmaker(bind=engine, expire_on_commit=False)
    session = Session()

    def get_object(self, pk):
        try:
            engine = sqlalchemy.create_engine('sqlite:///db.sqlite3')
            Session = sqlalchemy.orm.sessionmaker(bind=engine)
            session = Session()
            places = session.query(Place).filter(Place.id == pk).first()
            session.close()
            print(places)
            return places
        except Place.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        place = self.get_object(pk)

        serializer = PlaceSerializer(place)
        if place is None:
            return Response({'message': 'place not found'}, status=status.HTTP_204_NO_CONTENT)
        return Response(serializer.data)

    def put(self, request, pk, format=None):
        place = self.get_object(pk)
        serializer = PlaceSerializer(place, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        place = self.get_object(pk)
        engine = sqlalchemy.create_engine('sqlite:///db.sqlite3')
        Session = sqlalchemy.orm.sessionmaker(bind=engine)
        session = Session()
        self.session.delete(place)
        self.session.commit()
        return Response(status=status.HTTP_204_NO_CONTENT)


class PlaceListGeneric(generics.ListCreateAPIView):
    engine = sqlalchemy.create_engine('sqlite:///db.sqlite3')
    Session = sqlalchemy.orm.sessionmaker(bind=engine)
    session = Session()
    queryset = sa_session.query(Place).all()
    # queryset = Snippet.objects.all()
    serializer_class = PlaceSerializer

    # def get(self, request, *args, **kwargs):
    #     # engine = sqlalchemy.create_engine('sqlite:///db.sqlite3')
    #     # Session = sqlalchemy.orm.sessionmaker(bind=engine)
    #     # session = Session()
    #     # self.queryset = session.query(Place).all()
    #     # session.close()
    #     return self.list(request, *args, **kwargs)

    # def post(self, request, *args, **kwargs):
    #     return self.create(request, *args, **kwargs)


class TypeListGeneric(generics.ListCreateAPIView):
    # engine = sqlalchemy.create_engine('sqlite:///db.sqlite3')
    # Session = sqlalchemy.orm.sessionmaker(bind=engine)
    # session = Session()
    # queryset = session.query(Type).all()
    # queryset = Snippet.objects.all()
    serializer_class = TypeSerializer

    def get(self, request, *args, **kwargs):
        engine = sqlalchemy.create_engine('sqlite:///db.sqlite3')
        Session = sqlalchemy.orm.sessionmaker(bind=engine)
        session = Session()
        self.queryset = sa_session.query(Type).all()
        return self.list(request, *args, **kwargs)
