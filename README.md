# Omakase

A game we're developing for the [UMich Quant Convention](https://tradersatmichigan.github.io/convention/)!

## Usage

### Setup

We recommend using a virtual environment.

```shell
python -m venv .env
source .env/bin/activate
```

The backend uses [Django](https://www.djangoproject.com/) on the backend with 
[Channels](https://channels.readthedocs.io/en/latest/index.html) and redis.
Install with:

```shell
python -m pip install django redis "channels[daphne]"
```

### Run

We need to run redis in the background, we'll do this using docker:

```shell
docker run --rm -p 6379:6379 redis:7
```

Then run the backend with:

```shell
python manage.py runserver
```
