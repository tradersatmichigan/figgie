from django.urls import path

from .views import SignUpView, get_game_state, get_leaderboard, render_game

urlpatterns = [
    path("accounts/signup/", SignUpView.as_view(), name="signup"),
    path("api/state/", get_game_state, name="state"),
    path("api/leaderboard/", get_leaderboard, name="leaderboard"),
    path("game/", render_game, name="game"),
]
