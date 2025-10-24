from django.core.management.base import BaseCommand
from django.core.management import call_command
from api.models import (
    BlogPost, Service, Veterinarian, PageContent, GalleryImage,
    GoogleReview, SEOSettings, AboutPage, ContactPage, ServicesPage,
    HomePage, SiteSettings, Appointment, ContactMessage
)
import os


class Command(BaseCommand):
    help = 'Reset all data and reload fixtures with correct IDs'

    def handle(self, *args, **options):
        self.stdout.write('Deleting existing data...')

        # Delete all data except admin users
        BlogPost.objects.all().delete()
        Service.objects.all().delete()
        Veterinarian.objects.all().delete()
        PageContent.objects.all().delete()
        GalleryImage.objects.all().delete()
        GoogleReview.objects.all().delete()
        SEOSettings.objects.all().delete()
        AboutPage.objects.all().delete()
        ContactPage.objects.all().delete()
        ServicesPage.objects.all().delete()
        HomePage.objects.all().delete()
        SiteSettings.objects.all().delete()
        Appointment.objects.all().delete()
        ContactMessage.objects.all().delete()

        self.stdout.write(self.style.SUCCESS('Existing data deleted'))

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
            self.stdout.write('Loading fixtures...')
            call_command('loaddata', fixtures_file, verbosity=0)
            self.stdout.write(
                self.style.SUCCESS('Fixtures loaded successfully!')
            )
            self.stdout.write(
                self.style.SUCCESS(f'BlogPost: {BlogPost.objects.count()}, Service: {Service.objects.count()}, Veterinarian: {Veterinarian.objects.count()}')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error loading fixtures: {str(e)}')
            )
