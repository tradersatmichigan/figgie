from django.urls import path

from .views import SignUpView, fulfill_order, place_order

urlpatterns = [
    path("accounts/signup/", SignUpView.as_view(), name="signup"),
    path("api/orders/", place_order, name="orders"),
    path("api/fulfill/<int:order_id>/", fulfill_order, name="fulfill"),
]
