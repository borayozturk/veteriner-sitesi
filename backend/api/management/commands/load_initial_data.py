from django.core.management.base import BaseCommand
from django.core.management import call_command
from api.models import BlogPost, Service, Veterinarian, SiteSettings
import os


class Command(BaseCommand):
    help = 'Load initial data from fixtures'

    def handle(self, *args, **options):
        # Check if data already exists
        if BlogPost.objects.exists() or Service.objects.count() > 1 or Veterinarian.objects.exists():
            self.stdout.write(
                self.style.WARNING('Data already exists. Skipping initial data load.')
            )
            self.stdout.write(
                self.style.WARNING(f'BlogPost: {BlogPost.objects.count()}, Service: {Service.objects.count()}, Veterinarian: {Veterinarian.objects.count()}')
            )
            return

        # Load fixtures
        fixtures_file = os.path.join(
            os.path.dirname(os.path.dirname(os.path.dirname(__file__))),
            'fixtures',
            'initial_data.json'
        )

        if not os.path.exists(fixtures_file):
            self.stdout.write(
                self.style.ERROR(f'Fixtures file not found: {fixtures_file}')
            )
            return

        try:
            self.stdout.write('Loading initial data...')
            call_command('loaddata', fixtures_file, verbosity=0)
            self.stdout.write(
                self.style.SUCCESS('Initial data loaded successfully!')
            )
            self.stdout.write(
                self.style.SUCCESS(f'BlogPost: {BlogPost.objects.count()}, Service: {Service.objects.count()}, Veterinarian: {Veterinarian.objects.count()}')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error loading initial data: {str(e)}')
            )
