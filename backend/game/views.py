import random

from django import forms
from django.contrib.auth.forms import BaseUserCreationForm
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator
from django.http import HttpRequest, JsonResponse
from django.urls import reverse_lazy
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
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
            Trader.objects.create(
                user=user,
                capital=random.randint(1000, 10000),
                apples=random.randint(0, 100),
                bananas=random.randint(0, 100),
                cherries=random.randint(0, 100),
                dragonfruit=random.randint(0, 100),
            )
        return user


class SignUpView(CreateView):
    form_class = CustomBaseUserCreationForm
    success_url = reverse_lazy("login")
    template_name = "registration/signup.html"


class OrderValidationForm(forms.Form):
    trader_id = forms.IntegerField(min_value=1)
    asset = forms.ChoiceField(choices=Order.ASSET_TYPES)
    order_type = forms.ChoiceField(choices=Order.ORDER_TYPES)
    price = forms.IntegerField(validators=[MinValueValidator(1)])
    quantity = forms.IntegerField(validators=[MinValueValidator(1)])


@csrf_exempt
@require_http_methods(["POST"])
def place_order(request: HttpRequest) -> JsonResponse:

    # Note: this only works when using sessions, so I've disabled it for
    # developing the API
    # if not request.user.is_authenticated:
    #     return JsonResponse({"error": "Authentication required"}, status=401)

    form = OrderValidationForm(request.POST)

    if not form.is_valid():
        return JsonResponse({"error": "Invalid request"}, status=400)

    trader_id = form.cleaned_data["trader_id"]
    order_type = form.cleaned_data["order_type"]
    asset = form.cleaned_data["asset"]
    quantity = form.cleaned_data["quantity"]
    price = form.cleaned_data["price"]

    try:
        trader: Trader = Trader.objects.get(id=trader_id)
    except Trader.DoesNotExist:
        return JsonResponse({"error": "Trader not found"}, status=404)

    # Check to ensure no foul play, disabled for development
    # if trader.user.id != request.user.id:
    #     return JsonResponse(
    #         {"error": "Cannot place order for another trader"}, status=403
    #     )

    if order_type == "A" and trader.get_asset_count(asset) < quantity:
        return JsonResponse(
            {"error": "Cannot take on short positions"}, status=403
        )

    order = Order.objects.create(
        trader=trader,
        asset=asset,
        order_type=order_type,
        price=price,
        quantity=quantity,
    )
    order.save()

    return JsonResponse(
        {
            "trader": trader.id,
            "asset": asset,
            "order_type": order_type,
            "price": price,
            "quantity": quantity,
        },
        status=201,
    )


class FullfilmentValidationForm(forms.Form):
    trader_id = forms.IntegerField(min_value=1)
    quantity = forms.IntegerField(validators=[MinValueValidator(1)])


@csrf_exempt
@require_http_methods(["POST"])
def fulfill_order(request: HttpRequest, order_id: int) -> JsonResponse:
    # if not request.user.is_authenticated:
    #     return JsonResponse({"error": "Authentication required"}, status=401)
    form = FullfilmentValidationForm(request.POST)

    if not form.is_valid():
        return JsonResponse({"error": "Invalid request"}, status=400)

    counterparty_id = form.cleaned_data["trader_id"]
    quantity = form.cleaned_data["quantity"]

    try:
        order: Order = Order.objects.get(id=order_id)
        counterparty: Trader = Trader.objects.get(
            id=form.cleaned_data["trader_id"]
        )
    except Order.DoesNotExist:
        return JsonResponse({"error": "Order not found"}, status=404)
    except Trader.DoesNotExist:
        return JsonResponse({"error": "Trader not found"}, status=404)

    if quantity > order.quantity:
        return JsonResponse(
            {"error": "Quantity requested greater than order"}, status=403
        )

    if counterparty.capital < quantity * order.price:
        return JsonResponse({"error": "Not enough capital"}, status=403)

    quantity = quantity if order.order_type == "A" else -quantity

    counterparty.capital -= quantity * order.price
    order.trader.capital += quantity * order.price
    match order.asset:
        case "A":
            counterparty.apples += quantity
            order.trader.apples -= quantity
        case "B":
            counterparty.bananas += quantity
            order.trader.bananas -= quantity
        case "C":
            counterparty.cherries += quantity
            order.trader.cherries -= quantity
        case "D":
            counterparty.dragonfruit += quantity
            order.trader.dragonfruit -= quantity

    quantity = quantity if order.order_type == "A" else -quantity

    counterparty.save()
    order.trader.save()

    if quantity == order.quantity:
        order.delete()
    else:
        order.quantity -= quantity
        order.save()

    return JsonResponse(
        {
            "buyer": (
                order.trader.id if order.order_type == "B" else counterparty.id
            ),
            "seller": (
                counterparty.id if order.order_type == "B" else order.trader.id
            ),
            "asset": order.asset,
            "quantity": quantity,
            "price": order.price,
        }
    )
