from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    avatar = models.ImageField(upload_to='images/avatars/', default='images/avatars/default.png',
                               verbose_name='Аватар')
    about = models.TextField(verbose_name='О себе')

    def __str__(self):
        return self.username

    class Meta:
        verbose_name = 'Юзер'
        verbose_name_plural = 'Юзеры'


class Room(models.Model):
    name = models.CharField(max_length=50, unique=True, verbose_name='Название комнаты')
    date = models.DateTimeField(auto_now_add=True, verbose_name='Дата создания комнаты')
    roomUsers = models.ManyToManyField(User, blank=True, verbose_name='Юзеры комнаты')

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Комната'
        verbose_name_plural = 'Комнаты'


class Message(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    room = models.ForeignKey(Room, on_delete=models.CASCADE, verbose_name='Комната')
    text = models.TextField(blank=True, verbose_name='Сообщение')
    date = models.DateTimeField(auto_now_add=True, verbose_name='Дата отправки')
    time = models.CharField(max_length=10, default='00:00:00', verbose_name='Время отправки')
    count_in_room = models.CharField(max_length=255, verbose_name='Индентификатор команты')
    is_direct = models.BooleanField(default=False, verbose_name='Является ли сообщение приватным')

    def __str__(self):
        return f'{self.author}: {self.text[:15]}...'

    class Meta:
        verbose_name = 'Сообщение'
        verbose_name_plural = 'Сообщения'
        ordering = ('date',)