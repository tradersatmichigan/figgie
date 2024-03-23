import random

from django import forms
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import BaseUserCreationForm
from django.contrib.auth.models import User
from django.urls import reverse_lazy
from django.views.generic import CreateView
from rest_framework import permissions, viewsets

from .models import Order, Trader
from .serializers import OrderSerializer, TraderSerializer


class CustomBaseUserCreationForm(BaseUserCreationForm):
    first_name = forms.CharField(max_length=30, required=True)
    last_name = forms.CharField(max_length=30, required=True)
    email = forms.EmailField(max_length=254, required=True)

    class Meta(BaseUserCreationForm.Meta):
        model = User
        fields = (
            "username",
            "first_name",
            "last_name",
            "email",
            "password1",
            "password2",
        )

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields["first_name"].initial = self.instance.first_name
        self.fields["last_name"].initial = self.instance.last_name
        self.fields["email"].initial = self.instance.email

    def save(self, commit=True):
        user = super().save(commit=False)
        user.first_name = self.cleaned_data["first_name"]
        user.last_name = self.cleaned_data["last_name"]
        user.email = self.cleaned_data["email"]
        if commit:
            user.save()
            Trader.objects.create(
                user=user,
                capital=random.randint(1000, 10000),
                apples=random.randint(0, 100),
                bananas=random.randint(0, 100),
                cherries=random.randint(0, 100),
                dragonfruit=random.randint(0, 100),
            )
        return user


class SignUpView(CreateView):
    form_class = CustomBaseUserCreationForm
    success_url = reverse_lazy("login")
    template_name = "registration/signup.html"


class TraderViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows traders to be viewed or edited.
    """

    queryset = Trader.objects.all()
    serializer_class = TraderSerializer
    permission_classes = [permissions.IsAuthenticated]


class OrderViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows orders to be viewed or edited.
    """

    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]
