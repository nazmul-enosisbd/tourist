from rest_framework import serializers
from api.models import Type, Place
import sqlalchemy


engine = sqlalchemy.create_engine('sqlite:///db.sqlite3')
Session = sqlalchemy.orm.sessionmaker(bind=engine)
session = Session()


class PlaceSerializer(serializers.Serializer):

    id = serializers.IntegerField(read_only=True)
    name = serializers.CharField(
        required=False, allow_blank=True, max_length=50)
    address = serializers.CharField(
        required=False, allow_blank=True, max_length=100)
    rating = serializers.IntegerField()
    # types = TypeSerializer(many=True, read_only=True)
    type_id = serializers.ChoiceField(
        choices=[i.id for i in session.query(Type.id.label('id')).all()])
    picture = serializers.CharField(
        required=False, allow_blank=True)

    def create(self, validate_data):
        """
        Create and return a new `Snippet` instance, given the validated data.
        """
        # return Place.objects.create(**validated_data)
        engine = sqlalchemy.create_engine('sqlite:///db.sqlite3')
        Session = sqlalchemy.orm.sessionmaker(bind=engine)
        session = Session()
        instance = Place(**validate_data)
        session.add(instance)
        session.commit()
        # session.close()
        return instance

    def update(self, instance, validate_data):
        """
        Update and return an existing `Snippet` instance, given the validated data.
        """
        instance.name = validate_data.get('name', instance.name)
        instance.address = validate_data.get('address', instance.address)
        instance.rating = validate_data.get('rating', instance.rating)
        instance.type_id = validate_data.get('type_id', instance.type_id)
        instance.picture = validate_data.get('picture', instance.picture)
        instance.save()
        return instance


class TypeSerializer(serializers.Serializer):

    id = serializers.IntegerField()
    name = serializers.CharField(required=True, max_length=10)

    def create(self, validate_data):
        # return Type.objects.create(**validate_data)
        # return self.session.add(Type(**validate_data))
        engine = sqlalchemy.create_engine('sqlite:///db.sqlite3')
        Session = sqlalchemy.orm.sessionmaker(bind=engine)
        session = Session()
        instance = Type(**validate_data)
        session.add(instance)
        session.commit()
        return instance

    def update(self, instance, validate_data):
        instance.id = validate_data.get('id', instance.id)
        instance.name = validate_data.get('name', instance.name)
        instance.save()
        return instance
