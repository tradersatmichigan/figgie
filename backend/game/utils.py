from django import forms
from django.core.validators import MinValueValidator

from .models import Order, Trader


class OrderValidationForm(forms.Form):
    asset = forms.ChoiceField(choices=Order.ASSET_TYPES)
    side = forms.ChoiceField(choices=Order.SIDES)
    price = forms.IntegerField(validators=[MinValueValidator(1)])
    quantity = forms.IntegerField(validators=[MinValueValidator(1)])


class InvalidOrderException(Exception):
    pass


class InsufficientCapitalException(Exception):
    def __str__(self) -> str:
        return "Error: insufficient capital for order."


class InsufficientAssetsException(Exception):
    def __init__(self, asset: str) -> None:
        super().__init__()
        self.asset = asset

    def __str__(self) -> str:
        return f"Error: insufficient {self.asset} for order."


def validate_order(
    trader: Trader, asset: str, side: str, price: int, quantity: int
) -> None:
    form = OrderValidationForm(
        {
            "asset": asset,
            "side": side,
            "price": price,
            "quantity": quantity,
        }
    )
    if not form.is_valid():
        raise InvalidOrderException(form.errors)

    if side == "B" and price * quantity > trader.buying_power:
        raise InsufficientCapitalException
    if side == "A":
        if asset == "A" and quantity > trader.apples_remaining:
            raise InsufficientAssetsException(asset=asset)
        elif asset == "B" and quantity > trader.bananas_remaining:
            raise InsufficientAssetsException(asset=asset)
        elif asset == "C" and quantity > trader.cherries_remaining:
            raise InsufficientAssetsException(asset=asset)
        elif asset == "D" and quantity > trader.dragonfruit_remaining:
            raise InsufficientAssetsException(asset=asset)


def match_order(
    trader: Trader, asset: str, side: str, price: int, quantity: int
) -> tuple[list[dict], dict]:
    """Matches order and places a new order, if needed."""
    if side == "A":
        matches: list[Order] = Order.objects.filter(
            asset=asset, side="B", price__gte=price
        ).order_by("-price", "id")
    else:
        matches: list[Order] = Order.objects.filter(
            asset=asset, side="A", price__lte=price
        ).order_by("price", "id")

    trade_list = []
    for order in matches:
        q_matched = min(quantity, order.quantity)
        p_matched = (
            min(price, order.price) if side == "B" else max(price, order.price)
        )
        trade_list.append(
            {
                "order_id": order.id,
                "asset": asset,
                "buyer_id": (
                    order.trader.id if order.side == "B" else trader.id
                ),
                "seller_id": (
                    order.trader.id if order.side == "A" else trader.id
                ),
                "price": p_matched,
                "quantity": q_matched,
            }
        )
        if q_matched == order.quantity:
            order.delete()
        else:
            order.quantity -= q_matched
            order.save()
        quantity -= q_matched
        if quantity <= 0:
            break

    order_dict = {}
    if quantity > 0:
        order: Order = Order.objects.create(
            trader=trader,
            asset=asset,
            side=side,
            price=price,
            quantity=quantity,
        )
        order.save()
        if side == "B":
            trader.buying_power -= price * quantity
        if side == "A":
            match asset:
                case "A":
                    trader.apples_remaining -= quantity
                case "B":
                    trader.bananas_remaining -= quantity
                case "C":
                    trader.cherries_remaining -= quantity
                case "D":
                    trader.dragonfruit_remaining -= quantity
        trader.save()
        order_dict = {
            "order_id": order.id,
            "trader_id": order.trader.id,
            "side": order.side,
            "price": order.price,
            "quantity": order.quantity,
        }
    return trade_list, order_dict


def settle_trades(trades: list[dict]) -> None:
    for trade in trades:
        buyer: Trader = Trader.objects.get(id=trade["buyer_id"])
        seller: Trader = Trader.objects.get(id=trade["seller_id"])
        match trade["asset"]:
            case "A":
                buyer.apples += trade["quantity"]
                seller.apples -= trade["quantity"]
            case "B":
                buyer.bananas += trade["quantity"]
                seller.bananas -= trade["quantity"]
            case "C":
                buyer.cherries += trade["quantity"]
                seller.cherries -= trade["quantity"]
            case "D":
                buyer.dragonfruit += trade["quantity"]
                seller.dragonfruit -= trade["quantity"]
        buyer.capital -= trade["price"] * trade["quantity"]
        seller.capital += trade["price"] * trade["quantity"]
        buyer.save()
        seller.save()


# def place_order(
#     user_id: int, asset: str, side: str, price: int, quantity: int
# ) -> dict:
#
#     form = OrderValidationForm(
#         {
#             "user_id": user_id,
#             "asset": asset,
#             "side": side,
#             "price": price,
#             "quantity": quantity,
#         }
#     )
#     if not form.is_valid():
#         return {"error": form.errors}
#
#     user_id = form.cleaned_data["user_id"]
#     side = form.cleaned_data["side"]
#     asset = form.cleaned_data["asset"]
#     price = form.cleaned_data["price"]
#     quantity = form.cleaned_data["quantity"]
#
#     try:
#         trader: Trader = Trader.objects.get(user=user_id)
#     except Trader.DoesNotExist:
#         return {"error": f"No trader object found with user_id={user_id}"}
#
#     order = Order.objects.create(
#         trader=trader,
#         asset=asset,
#         side=side,
#         price=price,
#         quantity=quantity,
#     )
#     order.save()
#
#     return order.id
