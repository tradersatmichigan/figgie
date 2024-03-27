import json

from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer


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
        side = order["side"]
        quantity = order["quantity"]
        price = order["price"]

        async_to_sync(self.channel_layer.group_send)(
            self.asset_group_name,
            {
                "type": "order.message",
                "side": side,
                "quantity": quantity,
                "price": price,
            },
        )

    def order_message(self, event):
        side = event["side"]
        quantity = event["quantity"]
        price = event["price"]

        self.send(
            text_data=json.dumps(
                {
                    "side": side,
                    "quantity": quantity,
                    "price": price,
                }
            )
        )
