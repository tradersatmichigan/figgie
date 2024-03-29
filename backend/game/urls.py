from django.urls import path

from .views import SignUpView, market

urlpatterns = [
    path("accounts/signup/", SignUpView.as_view(), name="signup"),
    path("market/<str:asset_name>/", market, name="market"),
]
