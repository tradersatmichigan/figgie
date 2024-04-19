import csv
import random

from django.contrib import admin

from .models import Order, Trader


@admin.action(description="Reset portfolio")
def reset_portfolio(modeladmin, request, queryset):
    prev = random.randint(0, 3)
    for s in queryset.order_by("?"):
        starting_asset = prev
        prev = (prev + 1) % 4
        starting_amount = 2000 // (starting_asset + 1)
        starting_capital = 30_000 - (
            starting_amount * 10 * (starting_asset + 1)
        )

        s.capital = starting_capital
        s.buying_power = starting_capital
        s.asset_0 = starting_amount if starting_asset == 0 else 0
        s.asset_1 = starting_amount if starting_asset == 1 else 0
        s.asset_2 = starting_amount if starting_asset == 2 else 0
        s.asset_3 = starting_amount if starting_asset == 3 else 0
        s.asset_0_remaining = starting_amount if starting_asset == 0 else 0
        s.asset_1_remaining = starting_amount if starting_asset == 1 else 0
        s.asset_2_remaining = starting_amount if starting_asset == 2 else 0
        s.asset_3_remaining = starting_amount if starting_asset == 3 else 0
        s.save()


@admin.action(description="Export leaderboard")
def download_csv(modeladmin, request, queryset):
    with open("results.csv", mode="w") as results_file:
        employee_writer = csv.writer(
            results_file,
            delimiter=",",
            quotechar='"',
            quoting=csv.QUOTE_MINIMAL,
        )

        employee_writer.writerow(
            [
                "username",
                "first",
                "last",
                "cash",
                "dressing",
                "rye",
                "swiss",
                "pastrami",
                "value",
            ]
        )
        for s in queryset:
            value = (
                s.capital
                + 10 * s.asset_0
                + 20 * s.asset_1
                + 30 * s.asset_2
                + 40 * s.asset_3
                + 100 * min([s.asset_0, s.asset_1, s.asset_2, s.asset_3])
            )
            employee_writer.writerow(
                [
                    s.user.username,
                    s.user.first_name,
                    s.user.last_name,
                    s.capital,
                    s.asset_0,
                    s.asset_1,
                    s.asset_2,
                    s.asset_3,
                    value,
                ]
            )


class TraderAdmin(admin.ModelAdmin):
    actions = [reset_portfolio, download_csv]


admin.site.register(Trader, TraderAdmin)
admin.site.register(Order)
