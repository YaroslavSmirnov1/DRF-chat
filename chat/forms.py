from allauth.account.forms import SignupForm
from django import forms
from django.forms import ModelForm
from chat.models import User


class CustomSignUpForm(SignupForm):
    about = forms.CharField(label='О себе', required=True, widget=forms.TextInput())

class UserForm(ModelForm):
    class Meta:
        model = User
        fields = '__all__'
