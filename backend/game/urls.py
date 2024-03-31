from django.urls import path

from .views import SignUpView, get_game_state, get_leaderboard, market

urlpatterns = [
    path("accounts/signup/", SignUpView.as_view(), name="signup"),
    path("market/<int:asset_num>/", market, name="market"),
    path("game/state/", get_game_state, name="state"),
    path("game/leaderboard/", get_leaderboard, name="leaderboard"),
]
