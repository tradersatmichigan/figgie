import random

from django import forms
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import BaseUserCreationForm
from django.contrib.auth.models import User
from django.shortcuts import render
from django.urls import reverse_lazy
from django.views.generic import CreateView

from .models import Trader


class CustomBaseUserCreationForm(BaseUserCreationForm):
    first_name = forms.CharField(max_length=30, required=True)
    last_name = forms.CharField(max_length=30, required=True)
    email = forms.EmailField(max_length=254, required=True)

    class Meta(BaseUserCreationForm.Meta):
        model = User
        fields = (
            "username",
            "first_name",
            "last_name",
            "email",
            "password1",
            "password2",
        )

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields["first_name"].initial = self.instance.first_name
        self.fields["last_name"].initial = self.instance.last_name
        self.fields["email"].initial = self.instance.email

    def save(self, commit=True):
        user = super().save(commit=False)
        user.first_name = self.cleaned_data["first_name"]
        user.last_name = self.cleaned_data["last_name"]
        user.email = self.cleaned_data["email"]
        if commit:
            user.save()
            starting_asset = random.randint(1, 4)
            starting_amount = 2000 // starting_asset
            starting_capital = 30_000 - (starting_amount * 10 * starting_asset)
            Trader.objects.create(
                user=user,
                capital=starting_capital,
                buying_power=starting_capital,
                apples=starting_amount if starting_asset == 1 else 0,
                bananas=starting_amount if starting_asset == 2 else 0,
                cherries=starting_amount if starting_asset == 3 else 0,
                dragonfruit=starting_amount if starting_asset == 4 else 0,
                apples_remaining=starting_amount if starting_asset == 1 else 0,
                bananas_remaining=(
                    starting_amount if starting_asset == 2 else 0
                ),
                cherries_remaining=(
                    starting_amount if starting_asset == 3 else 0
                ),
                dragonfruit_remaining=(
                    starting_amount if starting_asset == 4 else 0
                ),
            )
        return user


class SignUpView(CreateView):
    form_class = CustomBaseUserCreationForm
    success_url = reverse_lazy("login")
    template_name = "registration/signup.html"


@login_required
def market(request, asset_name):
    trader = Trader.objects.get(user=request.user.id)
    return render(
        request, "market.html", {"trader": trader, "asset_name": asset_name}
    )
