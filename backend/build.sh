#!/usr/bin/env bash
# exit on error
set -o errexit

# Install Python dependencies
pip install -r requirements.txt

# Collect static files (without database)
DJANGO_SETTINGS_MODULE=petkey_api.settings python manage.py collectstatic --no-input --noinput

# Run migrations
python manage.py migrate
