from django.contrib.auth.models import User
from django.core.validators import MinValueValidator
from django.db import models


class Trader(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    capital = models.PositiveIntegerField()
    apples = models.PositiveIntegerField()
    bananas = models.PositiveIntegerField()
    cherries = models.PositiveIntegerField()
    dragonfruit = models.PositiveIntegerField()

    def __str__(self):
        return self.user.__str__()

    def get_asset_count(self, asset):
        match asset:
            case "A":
                return self.apples
            case "B":
                return self.bananas
            case "C":
                return self.cherries
            case "D":
                return self.dragonfruit
            case _:
                raise KeyError


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
    price = models.PositiveIntegerField(validators=[MinValueValidator(1)])
    quantity = models.PositiveIntegerField(validators=[MinValueValidator(1)])
