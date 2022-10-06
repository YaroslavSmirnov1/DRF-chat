from django.shortcuts import render, redirect, reverse
from .models import Message, Room, User
from rest_framework.generics import RetrieveUpdateDestroyAPIView, RetrieveAPIView, ListAPIView
from chat.serializers import UserSerializer, RoomSerializer
from django.contrib.auth.decorators import login_required
from chat.permissions import IsOwner
from rest_framework.permissions import IsAuthenticated


def index(request):
    return render(request, 'index.html') #главная страница


@login_required
def room(request, room_name):
    messages = Message.objects.filter(room__name=room_name).filter(is_direct=False)
    username_ = request.user.username
    return render(request, 'room.html', {
        'room_name': room_name,
        'chat_messages': messages,
        'username_': username_
    })


@login_required
def direct(request, direct_name):
    roomUser_1_name, roomUser_2_name = direct_name.split('.')
    if request.user.username != roomUser_1_name and request.user.username != roomUser_2_name:
        return redirect(reverse('index'))
    new_direct_name = f'{roomUser_2_name}.{roomUser_1_name}'
    if Room.objects.filter(name=direct_name).filter(message__is_direct=True).exists():
        messages = Message.objects.filter(room__name=direct_name).filter(is_direct=True).order_by('date')
    elif Room.objects.filter(name=new_direct_name).filter(message__is_direct=True).exists():
        return redirect(reverse('direct', args=[new_direct_name]))
    else:
        messages = []
    username_ = request.user.username

    return render(request, 'direct.html', {
        'direct_name': direct_name,
        'chat_messages': messages,
        'user_1': User.objects.get(username=roomUser_1_name),
        'user_2': User.objects.get(username=roomUser_2_name),
        'username_': username_
    })

@login_required
def account_details(request, username):
    if request.user.username == username:
        return render(request, 'profile_edit.html')
    return render(request, 'profile.html')


class UserAPIView(RetrieveUpdateDestroyAPIView):
    serializer_class = UserSerializer
    queryset = User.objects.all()
    lookup_field = 'username'
    permission_classes = [IsOwner, IsAuthenticated]


class GetUserAPIView(RetrieveAPIView):
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user


class GetRoomsAPIView(ListAPIView):
    queryset = Room.objects.exclude(message__is_direct=True)
    serializer_class = RoomSerializer


class GetRoomsOfUserAPIView(ListAPIView):
    lookup_field = 'username'
    serializer_class = RoomSerializer

    def get_queryset(self):
        return Room.objects.filter(roomUsers__username=self.kwargs['username'])
