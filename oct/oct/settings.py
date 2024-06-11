"""
Django settings for oct project.

Generated by 'django-admin startproject' using Django 4.2.2.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/4.2/ref/settings/
"""

from pathlib import Path
from dotenv import load_dotenv
load_dotenv()
import os
from osu import AuthHandler, Scope, Client
import mimetypes
import sentry_sdk
from sentry_sdk.integrations.django import DjangoIntegration

mimetypes.add_type("text/css", ".css", True)

sentry_sdk.init(
  dsn=os.getenv("SENTRY_DSN"),
  integrations=[DjangoIntegration()],

  # Set traces_sample_rate to 1.0 to capture 100%
  # of transactions for performance monitoring.
  # We recommend adjusting this value in production.
  traces_sample_rate=1.0,

  # If you wish to associate users to errors (assuming you are using
  # django.contrib.auth) you may enable sending PII data.
  send_default_pii=True
)

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.getenv("DJANGO_SECRET_KEY")
WS_CONNECTION_VALIDATOR = os.getenv("WS_CONNECTION_VALIDATOR")

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = bool(int(os.getenv("DJANGO_DEBUG")))


if DEBUG:
    ALLOWED_HOSTS = ["*"]
else:
    ALLOWED_HOSTS = [
        "ocah.sheppsu.me"
    ]

if not DEBUG:
    SECURE_SSL_REDIRECT = True
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True

# Application definition

INSTALLED_APPS = [
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    "debug_toolbar",
    "tournament.apps.TournamentConfig",
    "achievements.apps.AchievementsConfig",
    # 'corsheaders'
]

REST_FRAMEWORK = {
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 10
}

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    "debug_toolbar.middleware.DebugToolbarMiddleware",
    # 'corsheaders.middleware.CorsMiddleware'
]

# Allow vite dev server to connect
# CORS_ALLOWED_ORIGINS = [
#     'http://localhost:5173'
# ]

WHITENOISE_MIMETYPES = {
    '.css': "text/css",
}

ROOT_URLCONF = 'oct.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [
            os.path.join(BASE_DIR, "templates"),
            os.path.join(BASE_DIR, "frontend")
        ],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'oct.wsgi.application'


# Database
# https://docs.djangoproject.com/en/4.2/ref/settings/#databases

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": os.getenv("PGDATABASE"),
        "USER": os.getenv("PGUSER"),
        "PASSWORD": os.getenv("PGPASSWORD"),
        "HOST": os.getenv("PGHOST"),
        "PORT": os.getenv("PGPORT"),
    }
}


# Password validation
# https://docs.djangoproject.com/en/4.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

AUTH_USER_MODEL = "tournament.User"
AUTH_BACKEND = "django.contrib.auth.backends.ModelBackend"

# Internationalization
# https://docs.djangoproject.com/en/4.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.2/howto/static-files/

STATIC_URL = 'static/'
if not DEBUG:
    STATIC_ROOT = BASE_DIR / 'staticfiles'
    STATIC_URL = 'staticfiles/'
STATICFILES_DIRS = [os.path.join(BASE_DIR, "frontend", "dist")]

# Default primary key field type
# https://docs.djangoproject.com/en/4.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'


OSU_CLIENT_ID = int(os.getenv("OSU_CLIENT_ID"))
OSU_CLIENT_SECRET = os.getenv("OSU_CLIENT_SECRET")
OSU_CLIENT_REDIRECT = os.getenv("OSU_CLIENT_REDIRECT")
OSU_AUTH_URL = AuthHandler(OSU_CLIENT_ID, OSU_CLIENT_SECRET, OSU_CLIENT_REDIRECT, Scope.identify()).get_auth_url()
OSU_CLIENT = Client.from_client_credentials(OSU_CLIENT_ID, OSU_CLIENT_SECRET, OSU_CLIENT_REDIRECT)


CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
        "LOCATION": "unique-snowflake",
    }
}


ADMINS = [
    ("Admin", os.getenv("ERROR_REPORT_EMAIL"))
]


# idk why I have to do this for it to work but w/e
def show_toolbar(request):
    return DEBUG

DEBUG_TOOLBAR_CONFIG = {
    "SHOW_TOOLBAR_CALLBACK": show_toolbar,
}

ACHIEVEMENTS_WS_URI = os.getenv("ACHIEVEMENTS_WS_URI")