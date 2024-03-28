from django.contrib.auth.models import User
from django.db import models


class Trader(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    capital = models.IntegerField()
    buying_power = models.IntegerField()

    apples = models.IntegerField(default=0)
    bananas = models.IntegerField(default=0)
    cherries = models.IntegerField(default=0)
    dragonfruit = models.IntegerField(default=0)

    apples_remaining = models.IntegerField(default=0)
    bananas_remaining = models.IntegerField(default=0)
    cherries_remaining = models.IntegerField(default=0)
    dragonfruit_remaining = models.IntegerField(default=0)

    def __str__(self):
        return self.user.__str__()


class Order(models.Model):
    ASSET_TYPES = (
        ("A", "Apples"),
        ("B", "Bananas"),
        ("C", "Cherries"),
        ("D", "Dragonfruit"),
    )
    SIDES = (
        ("A", "Ask"),
        ("B", "Bid"),
    )
    trader = models.ForeignKey(Trader, on_delete=models.CASCADE)
    asset = models.CharField(max_length=1, choices=ASSET_TYPES, db_index=True)
    side = models.CharField(max_length=1, choices=SIDES, db_index=True)
    price = models.IntegerField(db_index=True)
    quantity = models.IntegerField()

    def __str__(self):
        return (
            f"Order {self.id}: {self.side} for {self.quantity} of "
            f"{self.asset} at {self.price}"
        )
