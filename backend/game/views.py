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


@login_required
def cancel_order(request, order_id) -> JsonResponse:
    """This won't actually be used. This logic should instead be
    handled by a websocket I think."""
    try:
        order: Order = Order.objects.get(id=order_id)
        trader: Trader = Trader.objects.get(user=request.user.id)
    except Order.DoesNotExist:
        return JsonResponse(
            {"error": f"Order with order_id={order_id} not found"}, status=404
        )
    except Trader.DoesNotExist:
        return JsonResponse(
            {"error": f"Something went wrong, trader not found"}, status=500
        )
    if order.user.id != request.user.id:
        return JsonResponse(
            {"error": f"Cannot cancel another user's order"}, status=403
        )
    if order.side == "B":
        trader.buying_power += order.price * order.quantity
    elif order.side == "A":
        match order.asset:
            case "A":
                trader.apples_remaining += order.quantity
            case "B":
                trader.bananas_remaining += order.quantity
            case "C":
                trader.cherries_remaining += order.quantity
            case "D":
                trader.dragonfruit_remaining += order.quantity
    trader.save()
    order.delete()
