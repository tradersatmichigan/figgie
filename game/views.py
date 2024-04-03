import random

from django import forms
from django.contrib.admin.views.autocomplete import JsonResponse
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import BaseUserCreationForm
from django.contrib.auth.models import User
from django.shortcuts import render
from django.urls import reverse_lazy
from django.views.generic import CreateView

from .models import Order, Trader
from .utils import get_all_orders


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
            starting_asset = random.randint(0, 3)
            starting_amount = 2000 // (starting_asset + 1)
            starting_capital = 30_000 - (
                starting_amount * 10 * (starting_asset + 1)
            )
            Trader.objects.create(
                user=user,
                capital=starting_capital,
                buying_power=starting_capital,
                asset_0=starting_amount if starting_asset == 0 else 0,
                asset_1=starting_amount if starting_asset == 1 else 0,
                asset_2=starting_amount if starting_asset == 2 else 0,
                asset_3=starting_amount if starting_asset == 3 else 0,
                asset_0_remaining=(
                    starting_amount if starting_asset == 0 else 0
                ),
                asset_1_remaining=(
                    starting_amount if starting_asset == 1 else 0
                ),
                asset_2_remaining=(
                    starting_amount if starting_asset == 2 else 0
                ),
                asset_3_remaining=(
                    starting_amount if starting_asset == 3 else 0
                ),
            )
        return user


class SignUpView(CreateView):
    form_class = CustomBaseUserCreationForm
    success_url = reverse_lazy("login")
    template_name = "registration/signup.html"


@login_required
def market(request, asset_num: int):
    trader = Trader.objects.get(user=request.user.id)
    return render(
        request, "market.html", {"trader": trader, "asset_num": asset_num}
    )


@login_required
def get_game_state(request):
    try:
        trader: Trader = Trader.objects.get(user=request.user.id)
    except Trader.DoesNotExist:
        return JsonResponse({"error": "No trader account."}, status=403)
    return JsonResponse(
        {
            "portfolio": {
                "cash": trader.capital,
                "buying_power": trader.buying_power,
                "assets": [
                    trader.asset_0,
                    trader.asset_1,
                    trader.asset_2,
                    trader.asset_3,
                ],
                "assets_remaining": [
                    trader.asset_0_remaining,
                    trader.asset_1_remaining,
                    trader.asset_2_remaining,
                    trader.asset_3_remaining,
                ],
            },
            "orders": [get_all_orders(asset) for asset in range(4)],
        },
        status=200,
    )


@login_required
def get_leaderboard(_):
    """
    Return the entire every trader's name and portfolio value.

    This list is NOT sorted.
    """
    traders = Trader.objects.all()
    pairs = [
        (trader.user.username, trader.get_portfolio_value())
        for trader in traders
    ]
    return JsonResponse(pairs, safe=False, status=200)


@login_required
def render_game(request):
    return render(request, "game.html")
