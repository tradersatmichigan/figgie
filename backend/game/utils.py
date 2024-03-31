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


def get_all_orders(asset: int) -> list[dict]:
    return [
        {
            "trader_id": order.trader.id,
            "side": order.side,
            "price": order.price,
            "quantaty": order.quantity,
        }
        for order in Order.objects.filter(asset=asset)
    ]


def match_order(
    trader: Trader, asset: int, side: str, price: int, quantity: int
) -> tuple[list[dict], dict]:
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
                "order_id": order.id,
                "asset": asset,
                "buyer_id": (
                    order.trader.id if order.side == "B" else trader.id
                ),
                "seller_id": (
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

    order_dict = {}
    if quantity > 0:
        order = trader.place_order(asset, side, price, quantity)
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
        buyer.buy(trade["asset"], trade["price"], trade["quantity"])
        seller.sell(trade["asset"], trade["price"], trade["quantity"])


def cancel_order(order_id: int, user_id: int) -> None:
    try:
        order: Order = Order.objects.get(id=order_id)
        trader: Trader = Trader.objects.get(id=order.trader)
    except (Order.DoesNotExist, Trader.DoesNotExist):
        return
    if trader.user.id != user_id:
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
