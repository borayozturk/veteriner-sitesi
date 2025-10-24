#!/usr/bin/env bash
# exit on error
set -o errexit

# Install Python dependencies
pip install -r requirements.txt

# Collect static files (without database)
DJANGO_SETTINGS_MODULE=petkey_api.settings python manage.py collectstatic --no-input --noinput

# Run migrations
python manage.py migrate

# Create admin user if doesn't exist
python manage.py create_admin

# Always reset data to fix ID issues (only runs if RESET_DATA=true in env)
if [ "$RESET_DATA" = "true" ]; then
    echo "Resetting and loading initial data..."
    python manage.py reset_data
else
    echo "Skipping data reset (set RESET_DATA=true to reset)"
fi
