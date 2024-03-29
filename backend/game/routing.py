from django.urls import re_path

from . import consumers

websocket_urlpatterns = [
    re_path(
        r"ws/market/(?P<asset_name>\w+)/$", consumers.AssetConsumer.as_asgi()
    ),
]
