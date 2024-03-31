import json

from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer

from .models import Trader
from .utils import (InsufficientAssetsException, InsufficientCapitalException,
                    InvalidOrderException, cancel_order, match_order,
                    settle_trades, validate_order)

update_count = 0


class AssetConsumer(WebsocketConsumer):
    def connect(self):
        try:
            self.asset_num = int(
                self.scope["url_route"]["kwargs"]["asset_num"]
            )
        except (ValueError, KeyError):
            return
        self.asset_group_name = f"market_{self.asset_num}"

        async_to_sync(self.channel_layer.group_add)(
            self.asset_group_name, self.channel_name
        )

        self.accept()

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(
            self.asset_group_name, self.channel_name
        )

    def receive(self, text_data):
        global update_count
        data = json.loads(text_data)
        if "cancel" in data and data["cancel"]:
            cancel_order(data["order_id"], self.scope["user"])

            async_to_sync(self.channel_layer.group_send)(
                self.asset_group_name,
                {
                    "type": "cancel.message",
                    "update_id": update_count,
                    "cancel": True,
                    "order_id": data["order_id"],
                },
            )
            update_count += 1
            return
        try:
            user = self.scope["user"]
            side = data["side"]
            price = int(data["price"])
            quantity = int(data["quantity"])
            trader: Trader = Trader.objects.get(user=user.id)
            validate_order(
                trader=trader,
                asset=self.asset_num,
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

        trades, data = match_order(
            trader=trader,
            asset=self.asset_num,
            side=side,
            price=price,
            quantity=quantity,
        )
        settle_trades(trades)

        async_to_sync(self.channel_layer.group_send)(
            self.asset_group_name,
            {
                "type": "order.message",
                "update_id": update_count,
                "trades": trades,
                "order": data,
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

    def cancel_message(self, event):
        data = {
            "update_id": event["update_id"],
            "cancel": event["type"],
            "order_id": event["order_id"],
        }
        self.send(text_data=json.dumps(data))
