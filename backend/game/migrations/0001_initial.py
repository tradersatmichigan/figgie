# Generated by Django 5.0.3 on 2024-03-23 18:38

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="Trader",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("capital", models.IntegerField()),
                ("apples", models.IntegerField()),
                ("bananas", models.IntegerField()),
                ("cherries", models.IntegerField()),
                ("dragonfruit", models.IntegerField()),
                (
                    "user",
                    models.OneToOneField(
                        on_delete=django.db.models.deletion.CASCADE,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Order",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "asset",
                    models.CharField(
                        choices=[
                            ("A", "Apples"),
                            ("B", "Bananas"),
                            ("C", "Cherries"),
                            ("D", "Dragonfruit"),
                        ],
                        max_length=1,
                    ),
                ),
                (
                    "order_type",
                    models.CharField(
                        choices=[("A", "Ask"), ("B", "Bid")], max_length=1
                    ),
                ),
                ("price", models.IntegerField()),
                ("quantity", models.IntegerField()),
                (
                    "trader",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="game.trader",
                    ),
                ),
            ],
        ),
    ]