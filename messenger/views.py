from django.shortcuts import render
from django.contrib.auth.decorators import login_required

@login_required
def account_details(request, username):
    if request.user.username == username:
        return render(request, 'profile_edit.html')
    return render(request, 'profile.html')