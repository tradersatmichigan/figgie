from django.urls import re_path

from . import consumers

websocket_urlpatterns = [
    re_path(
        r"ws/market/(?P<asset_num>[0-3])/$", consumers.AssetConsumer.as_asgi()
    ),
]
