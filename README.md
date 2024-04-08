# Zingers

A game we're developing for the [UMich Quant Convention](https://tradersatmichigan.github.io/convention/)!

## Usage

### Setup

#### Backend

We recommend using a virtual environment.

```shell
python -m venv .env
source .env/bin/activate
```

The backend uses [Django](https://www.djangoproject.com/) with
[Channels](https://channels.readthedocs.io/en/latest/index.html) and redis.
Install with:

```shell
python -m pip install django "channels[daphne]" channels-redis
```

#### Frontend

First install [npm](https://www.npmjs.com/) if youdon't already have it.

Then install dependencies with:

```shell
npm install
```

### Run

> Note: This is very scuffed currently, but will be improved upon completion of the project.
> We are planning to containerize the project for easy of use and portability.

We need to run redis in the background, we'll do this using docker:

```shell
docker run --rm -p 6379:6379 redis:7
```

Then build the frontend:

```shell
npm start
```

Then run the backend with:

```shell
python manage.py runserver
```

Finally, navigate to http://localhost:8000 (or whatever address:port you use with runserver).
