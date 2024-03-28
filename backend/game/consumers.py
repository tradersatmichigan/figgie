import json

from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer

from .models import Trader
from .utils import (InsufficientAssetsException, InsufficientCapitalException,
                    InvalidOrderException, match_order, settle_trades,
                    validate_order)

update_count = 0


class AssetConsumer(WebsocketConsumer):
    def connect(self):
        self.asset_name = self.scope["url_route"]["kwargs"]["asset_name"]
        self.asset_group_name = f"market_{self.asset_name}"

        async_to_sync(self.channel_layer.group_add)(
            self.asset_group_name, self.channel_name
        )

        self.accept()

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(
            self.asset_group_name, self.channel_name
        )

    def receive(self, text_data):
        order = json.loads(text_data)
        try:
            user = self.scope["user"]
            side = order["side"]
            price = int(order["price"])
            quantity = int(order["quantity"])
            trader: Trader = Trader.objects.get(user=user.id)
            validate_order(
                trader=trader,
                asset=self.asset_name[0].upper(),
                side=side,
                price=price,
                quantity=quantity,
            )
        except (
            KeyError,
            Trader.DoesNotExist,
            InvalidOrderException,
            InsufficientCapitalException,
            InsufficientAssetsException,
        ) as err:
            self.send(text_data=json.dumps({"error": str(err)}))
            return

        trades, order = match_order(
            trader=trader,
            asset=self.asset_name[0].upper(),  # TODO: make this cleaner
            side=side,
            price=price,
            quantity=quantity,
        )
        settle_trades(trades)

        global update_count
        async_to_sync(self.channel_layer.group_send)(
            self.asset_group_name,
            {
                "type": "order.message",
                "update_id": update_count,
                "trades": trades,
                "order": order,
            },
        )
        update_count += 1

    def order_message(self, event):
        data = {
            "update_id": event["update_id"],
            "trades": event["trades"],
            "order": event["order"],
        }
        self.send(text_data=json.dumps(data))
