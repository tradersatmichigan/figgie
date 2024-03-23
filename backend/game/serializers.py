from rest_framework import serializers

from .models import Order, Trader


class TraderSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model = Trader
        fields = (
            "id",
            "username",
            "capital",
            "apples",
            "bananas",
            "cherries",
            "dragonfruit",
        )


class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = (
            "id",
            "trader",
            "asset",
            "order_type",
            "price",
            "quantity",
        )
