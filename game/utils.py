from django import forms
from django.core.validators import MinValueValidator

from .models import Asset, Order, Trader


class OrderValidationForm(forms.Form):
    asset = forms.ChoiceField(choices=Asset)
    side = forms.ChoiceField(choices=Order.SIDES)
    price = forms.IntegerField(validators=[MinValueValidator(1)])
    quantity = forms.IntegerField(validators=[MinValueValidator(1)])


class InvalidOrderException(Exception):
    pass


class InsufficientCapitalException(Exception):
    def __str__(self) -> str:
        return "Error: insufficient capital for order."


class InsufficientAssetsException(Exception):
    def __init__(self, asset: int) -> None:
        super().__init__()
        self.asset = asset

    def __str__(self) -> str:
        return f"Error: insufficient {self.asset} for order."


def validate_order(
    trader: Trader, asset: int, side: str, price: int, quantity: int
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
    if side == "A" and quantity > trader.assets_remaining(asset):
        raise InsufficientAssetsException(asset=asset)


def get_all_orders(asset: int) -> dict[int, dict[str, int | str]]:
    return {
        order.id: {
            "asset": asset,
            "traderId": order.trader.id,
            "side": order.side,
            "price": order.price,
            "quantity": order.quantity,
        }
        for order in Order.objects.filter(asset=asset)
    }


def match_order(
    trader: Trader, asset: int, side: str, price: int, quantity: int
) -> tuple[list[dict], dict | None]:
    """Matches order and places a new order, if needed."""
    if side == "A":
        matches = Order.objects.filter(
            asset=asset, side="B", price__gte=price
        ).order_by("-price", "id")
    else:
        matches = Order.objects.filter(
            asset=asset, side="A", price__lte=price
        ).order_by("price", "id")

    trade_list = []
    for order in matches:
        if order.trader == trader:
            continue
        q_matched = min(quantity, order.quantity)
        trade_list.append(
            {
                "orderId": order.id,
                "asset": asset,
                "originSide": order.side,
                "buyerId": (
                    order.trader.id if order.side == "B" else trader.id
                ),
                "sellerId": (
                    order.trader.id if order.side == "A" else trader.id
                ),
                "price": order.price,
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

    order_data = None
    if quantity > 0:
        order = trader.place_order(asset, side, price, quantity)
        order_data = {
            "orderId": order.id,
            "asset": order.asset,
            "traderId": order.trader.id,
            "side": order.side,
            "price": order.price,
            "quantity": order.quantity,
        }
    return trade_list, order_data


def settle_trades(trades: list[dict]) -> None:
    for trade in trades:
        buyer: Trader = Trader.objects.get(id=trade["buyerId"])
        seller: Trader = Trader.objects.get(id=trade["sellerId"])
        buyer.buy(
            trade["asset"],
            trade["price"],
            trade["quantity"],
            trade["originSide"] == "B",
        )
        seller.sell(
            trade["asset"],
            trade["price"],
            trade["quantity"],
            trade["originSide"] == "A",
        )


def cancel_order(orderId: int, userId: int) -> None:
    try:
        order: Order = Order.objects.get(id=orderId)
        trader: Trader = Trader.objects.get(id=order.trader.id)
    except (Order.DoesNotExist, Trader.DoesNotExist):
        return
    if trader.user.id != userId:
        return

    if order.side == "B":
        trader.buying_power += order.price * order.quantity
    if order.side == "A":
        match order.asset:
            case 0:
                trader.asset_0_remaining += order.quantity
            case 1:
                trader.asset_1_remaining += order.quantity
            case 2:
                trader.asset_2_remaining += order.quantity
            case 3:
                trader.asset_3_remaining += order.quantity
            case _:
                raise KeyError
    trader.save()
    order.delete()
