"""
Export database data to JSON fixture
"""
import os
import sys
import django

# Setup Django
sys.path.insert(0, os.path.dirname(__file__))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'petkey_api.settings')
django.setup()

from django.core import serializers
from api.models import (
    BlogPost, Service, Veterinarian, AboutPage, ContactPage,
    SiteSettings, SEOSettings, GoogleReview, HomePage, ServicesPage,
    PageContent, GalleryImage
)

def export_data():
    """Export all data to JSON"""
    models = [
        Veterinarian,
        BlogPost,
        Service,
        PageContent,
        GalleryImage,
        GoogleReview,
        SEOSettings,
        AboutPage,
        ContactPage,
        ServicesPage,
        HomePage,
        SiteSettings,
    ]

    all_objects = []
    for model in models:
        objects = model.objects.all()
        print(f"Exporting {model.__name__}: {objects.count()} objects")
        all_objects.extend(objects)

    # Serialize to JSON
    json_data = serializers.serialize('json', all_objects, indent=2, use_natural_foreign_keys=False)

    # Write to file with UTF-8 encoding
    fixtures_dir = os.path.join(os.path.dirname(__file__), 'api', 'fixtures')
    os.makedirs(fixtures_dir, exist_ok=True)

    fixture_file = os.path.join(fixtures_dir, 'initial_data.json')
    with open(fixture_file, 'w', encoding='utf-8') as f:
        f.write(json_data)

    print(f"\n✓ Data exported successfully to {fixture_file}")
    print(f"Total objects exported: {len(all_objects)}")

if __name__ == '__main__':
    export_data()
