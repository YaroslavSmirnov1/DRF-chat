from django.urls import re_path, path
from chat.consumers import RoomConsumer, DirectConsumer


websocket_urlpatterns = [
    path('ws/chat/<str:room_name>/', RoomConsumer.as_asgi()),
    path('ws/chat/direct/<str:direct_name>/', DirectConsumer.as_asgi())
]
