from rest_framework import serializers
from api.models import Type, Place
import sqlalchemy


class TypeSerializer(serializers.ModelSerializer):

    class Meta:
        model = Type
        fields = '__all__'


# class PlaceSerializer(serializers.ModelSerializer):
#     types = TypeSerializer(many=True, read_only=True)

#     class Meta:
#         model = Place
#         fields = ['id', 'name', 'address', 'rating', 'types', 'picture']

class PlaceSerializer(serializers.Serializer):
    engine = sqlalchemy.create_engine('sqlite:///db.sqlite3')
    Session = sqlalchemy.orm.sessionmaker(bind=engine)
    session = Session()
    id = serializers.IntegerField(read_only=True)
    name = serializers.CharField(
        required=False, allow_blank=True, max_length=50)
    address = serializers.CharField(
        required=False, allow_blank=True, max_length=100)
    rating = serializers.IntegerField()
    # types = TypeSerializer(many=True, read_only=True)
    type_id = serializers.ChoiceField(
        choices=session.query(Type).all())
    picture = serializers.CharField(
        required=False, allow_blank=True, max_length=10000)

    def create(self, validated_data):
        """
        Create and return a new `Snippet` instance, given the validated data.
        """
        return Place.objects.create(**validated_data)

    def update(self, instance, validated_data):
        """
        Update and return an existing `Snippet` instance, given the validated data.
        """
        instance.name = validated_data.get('name', instance.name)
        instance.address = validated_data.get('address', instance.address)
        instance.rating = validated_data.get('rating', instance.rating)
        instance.type_id = validated_data.get('type_id', instance.type_id)
        instance.picture = validated_data.get('picture', instance.picture)
        instance.save()
        return instance


class TypeSerializer(serializers.Serializer):
    engine = sqlalchemy.create_engine('sqlite:///db.sqlite3')
    Session = sqlalchemy.orm.sessionmaker(bind=engine)
    session = Session()
    id = serializers.IntegerField()
    name = serializers.CharField(required=True, max_length=10)

    def create(self, validate_data):
        # return Type.objects.create(**validate_data)
        # return self.session.add(Type(**validate_data))
        instance = Type(**validate_data)
        self.session.add(instance)
        self.session.commit()
        return instance

    def update(self, instance, validate_data):
        instance.id = validate_data.get('id', instance.id)
        instance.name = validate_data.get('name', instance.name)
        instance.save()
        return instance
