from django.contrib import admin
from django.urls import path, include
from allauth.account.views import signup, login, password_change
from messenger.views import account_details

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api-auth/', include('rest_framework.urls')),
    path('chat/', include('chat.urls')),
    path("accounts/signup/", signup, name="account_signup"),
    path("accounts/login/", login, name="account_login"),
    path("accounts/password/change/", password_change, name="account_change_password"),
    path('accounts/account_details/<str:username>/', account_details, name="account_details"),
]
