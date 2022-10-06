from rest_framework.serializers import ModelSerializer, StringRelatedField
from chat.models import Room, User


class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ['user.username', 'user.email', 'avatar']


class RoomSerializer(ModelSerializer):
    users = StringRelatedField(many=True)

    class Meta:
        model = Room
        fields = ['name', 'users']