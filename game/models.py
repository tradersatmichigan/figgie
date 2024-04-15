from django.contrib.auth.models import User
from django.db import models


class Asset(models.IntegerChoices):
    DRESSING = 0
    RYE = 1
    SWISS = 2
    PASTRAMI = 3


class Trader(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    capital = models.IntegerField()
    buying_power = models.IntegerField()

    asset_0 = models.IntegerField(default=0)
    asset_1 = models.IntegerField(default=0)
    asset_2 = models.IntegerField(default=0)
    asset_3 = models.IntegerField(default=0)

    asset_0_remaining = models.IntegerField(default=0)
    asset_1_remaining = models.IntegerField(default=0)
    asset_2_remaining = models.IntegerField(default=0)
    asset_3_remaining = models.IntegerField(default=0)

    def __str__(self):
        return self.user.__str__()

    def get_portfolio_value(self) -> int:
        return (
            self.capital
            + 10 * self.asset_0
            + 20 * self.asset_1
            + 30 * self.asset_2
            + 40 * self.asset_3
            + 100
            * min([self.asset_0, self.asset_1, self.asset_2, self.asset_3])
        )

    def assets_remaining(self, asset: int) -> int:
        match asset:
            case 0:
                return self.asset_0_remaining
            case 1:
                return self.asset_1_remaining
            case 2:
                return self.asset_2_remaining
            case 3:
                return self.asset_3_remaining
            case _:
                raise KeyError

    def buy(
        self, asset: int, price: int, quantity: int, oringinator: bool
    ) -> None:
        match asset:
            case 0:
                self.asset_0 += quantity
                self.asset_0_remaining += quantity
            case 1:
                self.asset_1 += quantity
                self.asset_1_remaining += quantity
            case 2:
                self.asset_2 += quantity
                self.asset_2_remaining += quantity
            case 3:
                self.asset_3 += quantity
                self.asset_3_remaining += quantity
            case _:
                raise KeyError
        self.capital -= quantity * price
        if not oringinator:
            self.buying_power -= quantity * price
        self.save()

    def sell(
        self, asset: int, price: int, quantity: int, oringinator: bool
    ) -> None:
        print(oringinator)
        match asset:
            case 0:
                self.asset_0 -= quantity
            case 1:
                self.asset_1 -= quantity
            case 2:
                self.asset_2 -= quantity
            case 3:
                self.asset_3 -= quantity
            case _:
                raise KeyError
        self.capital += quantity * price
        self.buying_power += quantity * price
        if not oringinator:
            match asset:
                case 0:
                    self.asset_0_remaining -= quantity
                case 1:
                    self.asset_1_remaining -= quantity
                case 2:
                    self.asset_2_remaining -= quantity
                case 3:
                    self.asset_3_remaining -= quantity
                case _:
                    raise KeyError
        self.save()

    def place_order(self, asset: int, side: str, price: int, quantity: int):
        order: Order = Order.objects.create(
            trader=self,
            asset=asset,
            side=side,
            price=price,
            quantity=quantity,
        )
        if side == "B":
            self.buying_power -= price * quantity
        if side == "A":
            match asset:
                case 0:
                    self.asset_0_remaining -= quantity
                case 1:
                    self.asset_1_remaining -= quantity
                case 2:
                    self.asset_2_remaining -= quantity
                case 3:
                    self.asset_3_remaining -= quantity
                case _:
                    raise KeyError
        self.save()
        return order


class Order(models.Model):
    SIDES = (
        ("A", "Ask"),
        ("B", "Bid"),
    )
    trader = models.ForeignKey(Trader, on_delete=models.CASCADE)
    asset = models.IntegerField(choices=Asset, db_index=True)
    side = models.CharField(max_length=1, choices=SIDES, db_index=True)
    price = models.IntegerField(db_index=True)
    quantity = models.IntegerField()

    def __str__(self):
        return (
            f"Order {self.id}: {self.side} for {self.quantity} of "
            f"asset {self.asset} at {self.price}"
        )
