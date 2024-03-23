from django.contrib.auth.models import User
from django.db import models


class Trader(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    capital = models.IntegerField()
    apples = models.IntegerField()
    bananas = models.IntegerField()
    cherries = models.IntegerField()
    dragonfruit = models.IntegerField()

    def __str__(self):
        return self.user.__str__()


class Order(models.Model):
    ASSET_TYPES = (
        ("A", "Apples"),
        ("B", "Bananas"),
        ("C", "Cherries"),
        ("D", "Dragonfruit"),
    )
    ORDER_TYPES = (
        ("A", "Ask"),
        ("B", "Bid"),
    )
    trader = models.ForeignKey(Trader, on_delete=models.CASCADE)
    asset = models.CharField(max_length=1, choices=ASSET_TYPES)
    order_type = models.CharField(max_length=1, choices=ORDER_TYPES)
    price = models.IntegerField()
    quantity = models.IntegerField()
