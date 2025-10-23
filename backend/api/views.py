from rest_framework import viewsets, filters, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated, AllowAny
from django.utils import timezone
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from .models import Veterinarian, BlogPost, Appointment, ContactMessage, GalleryImage, PageContent, Service, AboutPage, ServicesPage, ContactPage, SEOSettings, GoogleReview, HomePage, SiteSettings
from .serializers import (
    VeterinarianSerializer,
    BlogPostSerializer,
    BlogPostListSerializer,
    AppointmentSerializer,
    ContactMessageSerializer,
    GalleryImageSerializer,
    PageContentSerializer,
    ServiceSerializer,
    AboutPageSerializer,
    ServicesPageSerializer,
    ContactPageSerializer,
    SEOSettingsSerializer,
    GoogleReviewSerializer,
    HomePageSerializer,
    SiteSettingsSerializer
)
from .email_utils import send_appointment_confirmation, send_contact_confirmation


class VeterinarianViewSet(viewsets.ModelViewSet):
    """ViewSet for Veterinarian model - Public read, auth write"""
    queryset = Veterinarian.objects.all()
    serializer_class = VeterinarianSerializer
    permission_classes = [AllowAny]  # Allow anyone to create/update for now (should be restricted in production)
    lookup_field = 'slug'  # Use slug instead of pk for lookups

    @action(detail=False, methods=['get'])
    def active(self, request):
        """Get only active veterinarians"""
        active_vets = self.queryset.filter(is_active=True)
        serializer = self.get_serializer(active_vets, many=True)
        return Response(serializer.data)


class BlogPostViewSet(viewsets.ModelViewSet):
    """ViewSet for BlogPost - Public reads published, auth manages all"""
    queryset = BlogPost.objects.all()
    permission_classes = [AllowAny]  # Allow anyone to create/update for now (should be restricted in production)
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'content', 'excerpt', 'tags', 'category']
    ordering_fields = ['published_at', 'created_at', 'views']
    ordering = ['-published_at']
    lookup_field = 'slug'

    def get_serializer_class(self):
        if self.action == 'list':
            return BlogPostListSerializer
        return BlogPostSerializer

    def get_queryset(self):
        queryset = BlogPost.objects.all()
        if not self.request.user.is_authenticated:
            queryset = queryset.filter(status='published')

        category = self.request.query_params.get('category', None)
        if category:
            queryset = queryset.filter(category__iexact=category)

        tag = self.request.query_params.get('tag', None)
        if tag:
            queryset = queryset.filter(tags__icontains=tag)

        author_id = self.request.query_params.get('author', None)
        if author_id:
            queryset = queryset.filter(author_id=author_id)

        return queryset.order_by('-published_at', '-created_at')

    def retrieve(self, request, *args, **kwargs):
        """Increment views when retrieving"""
        instance = self.get_object()
        instance.views += 1
        instance.save(update_fields=['views'])
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Get most viewed published posts"""
        featured_posts = BlogPost.objects.filter(status='published').order_by('-views')[:5]
        serializer = BlogPostListSerializer(featured_posts, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def categories(self, request):
        """Get all unique categories"""
        categories = BlogPost.objects.filter(status='published').values_list('category', flat=True).distinct()
        return Response(list(categories))


class AppointmentViewSet(viewsets.ModelViewSet):
    """ViewSet for Appointment - Anyone creates, auth manages"""
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['date', 'time', 'created_at']
    ordering = ['date', 'time']

    def get_permissions(self):
        # Allow anyone to create and view appointments (for now - should add auth in production)
        return [AllowAny()]

    def get_queryset(self):
        queryset = Appointment.objects.all()

        vet_id = self.request.query_params.get('veterinarian', None)
        if vet_id:
            queryset = queryset.filter(veterinarian_id=vet_id)

        status_param = self.request.query_params.get('status', None)
        if status_param:
            queryset = queryset.filter(status=status_param)

        date_from = self.request.query_params.get('date_from', None)
        date_to = self.request.query_params.get('date_to', None)
        if date_from:
            queryset = queryset.filter(date__gte=date_from)
        if date_to:
            queryset = queryset.filter(date__lte=date_to)

        upcoming = self.request.query_params.get('upcoming', None)
        if upcoming:
            queryset = queryset.filter(date__gte=timezone.now().date())

        return queryset

    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        """Update appointment status"""
        appointment = self.get_object()
        new_status = request.data.get('status')

        if new_status not in dict(Appointment.STATUS_CHOICES):
            return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)

        appointment.status = new_status
        appointment.save()
        serializer = self.get_serializer(appointment)
        return Response(serializer.data)

    def perform_create(self, serializer):
        """Override perform_create to send email after creating appointment"""
        appointment = serializer.save()
        # Send confirmation email to customer
        send_appointment_confirmation(appointment)

    @action(detail=False, methods=['get'])
    def available_slots(self, request):
        """Get available time slots for date and veterinarian"""
        date = request.query_params.get('date')
        vet_id = request.query_params.get('veterinarian')

        if not date or not vet_id:
            return Response({'error': 'Date and veterinarian required'}, status=status.HTTP_400_BAD_REQUEST)

        booked_times = Appointment.objects.filter(
            date=date, veterinarian_id=vet_id, status__in=['pending', 'confirmed']
        ).values_list('time', flat=True)

        all_slots = []
        for hour in range(9, 18):
            for minute in [0, 30]:
                all_slots.append(f"{hour:02d}:{minute:02d}")

        available_slots = [s for s in all_slots if s not in [t.strftime('%H:%M') for t in booked_times]]
        return Response({'available_slots': available_slots})


class ContactMessageViewSet(viewsets.ModelViewSet):
    """ViewSet for ContactMessage - Anyone creates, auth manages"""
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['created_at', 'status']
    ordering = ['-created_at']

    def get_permissions(self):
        # Allow anyone to create messages
        # Allow anyone to list/view for now (should add auth in production)
        return [AllowAny()]

    def get_queryset(self):
        # For restore and permanent_delete actions, don't filter by is_deleted
        if self.action in ['restore', 'permanent_delete']:
            return ContactMessage.objects.all()

        queryset = ContactMessage.objects.all()

        # Filter by deleted status
        show_deleted = self.request.query_params.get('deleted', None)
        if show_deleted == 'true':
            queryset = queryset.filter(is_deleted=True)
        elif show_deleted == 'false' or show_deleted is None:
            queryset = queryset.filter(is_deleted=False)

        status_param = self.request.query_params.get('status', None)
        if status_param:
            queryset = queryset.filter(status=status_param)
        return queryset

    def perform_create(self, serializer):
        """Override perform_create to send email after creating contact message"""
        contact_message = serializer.save()
        # Send confirmation email to customer
        send_contact_confirmation(contact_message)

    def destroy(self, request, *args, **kwargs):
        """Soft delete - move to trash"""
        message = self.get_object()
        message.is_deleted = True
        message.deleted_at = timezone.now()
        message.save()
        return Response({'status': 'Message moved to trash'}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['patch'])
    def mark_read(self, request, pk=None):
        """Mark message as read"""
        message = self.get_object()
        message.status = 'read'
        message.save()
        return Response(self.get_serializer(message).data)

    @action(detail=True, methods=['patch'])
    def reply(self, request, pk=None):
        """Add admin reply"""
        message = self.get_object()
        admin_reply = request.data.get('admin_reply')

        if not admin_reply:
            return Response({'error': 'Admin reply required'}, status=status.HTTP_400_BAD_REQUEST)

        message.admin_reply = admin_reply
        message.status = 'replied'
        message.save()
        return Response(self.get_serializer(message).data)

    @action(detail=True, methods=['patch'])
    def restore(self, request, pk=None):
        """Restore message from trash"""
        message = self.get_object()
        message.is_deleted = False
        message.deleted_at = None
        message.save()
        return Response({'status': 'Message restored'}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['delete'])
    def permanent_delete(self, request, pk=None):
        """Permanently delete message"""
        message = self.get_object()
        message.delete()
        return Response({'status': 'Message permanently deleted'}, status=status.HTTP_204_NO_CONTENT)


class GalleryImageViewSet(viewsets.ModelViewSet):
    """ViewSet for GalleryImage - Public read, auth write"""
    queryset = GalleryImage.objects.filter(is_active=True)
    serializer_class = GalleryImageSerializer
    permission_classes = [AllowAny]  # Allow anyone to create/update for now (should be restricted in production)
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description', 'tags']
    ordering_fields = ['order', 'created_at']
    ordering = ['order', '-created_at']

    def get_queryset(self):
        queryset = GalleryImage.objects.all()
        if not self.request.user.is_authenticated:
            queryset = queryset.filter(is_active=True)

        category = self.request.query_params.get('category', None)
        if category:
            queryset = queryset.filter(category=category)
        return queryset

    @action(detail=False, methods=['get'])
    def categories(self, request):
        """Get all categories with counts"""
        categories = []
        for code, name in GalleryImage.CATEGORY_CHOICES:
            count = self.queryset.filter(category=code).count()
            categories.append({'code': code, 'name': name, 'count': count})
        return Response(categories)


class PageContentViewSet(viewsets.ModelViewSet):
    """ViewSet for PageContent - Public read, auth update"""
    queryset = PageContent.objects.all()
    serializer_class = PageContentSerializer
    permission_classes = [AllowAny]  # Allow anyone to create/update for now (should be restricted in production)
    pagination_class = None  # Disable pagination for page content

    def get_queryset(self):
        return PageContent.objects.all().order_by('page_name')

    @action(detail=False, methods=['get'], url_path='by-name/(?P<page_name>[^/.]+)')
    def by_name(self, request, page_name=None):
        """Get page content by name"""
        try:
            page = PageContent.objects.get(page_name=page_name)
            return Response(self.get_serializer(page).data)
        except PageContent.DoesNotExist:
            return Response({'error': 'Page not found'}, status=status.HTTP_404_NOT_FOUND)


class ServiceViewSet(viewsets.ModelViewSet):
    """ViewSet for Service - Public read active services, auth manages all"""
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer
    permission_classes = [AllowAny]  # Allow anyone to create/update for now (should be restricted in production)
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['order', 'title', 'created_at']
    ordering = ['order', 'title']
    pagination_class = None  # Disable pagination for services

    def get_queryset(self):
        queryset = Service.objects.all()
        # For update/delete operations, always allow access to all services
        # Otherwise, only show active services to non-authenticated users
        if self.action in ['update', 'partial_update', 'destroy', 'retrieve']:
            return queryset.order_by('order', 'title')

        if not self.request.user.is_authenticated:
            queryset = queryset.filter(is_active=True)
        return queryset.order_by('order', 'title')

    @action(detail=False, methods=['get'])
    def active(self, request):
        """Get only active services"""
        active_services = Service.objects.filter(is_active=True).order_by('order', 'title')
        serializer = self.get_serializer(active_services, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def all(self, request):
        """Get ALL services (for admin panel)"""
        all_services = Service.objects.all().order_by('order', 'title')
        serializer = self.get_serializer(all_services, many=True)
        return Response(serializer.data)


class AboutPageViewSet(viewsets.ModelViewSet):
    """ViewSet for About Page - Single instance, public read, auth write"""
    queryset = AboutPage.objects.all()
    serializer_class = AboutPageSerializer
    permission_classes = [AllowAny]  # Allow anyone to read/update for now
    authentication_classes = []  # Disable authentication
    pagination_class = None  # Disable pagination
    http_method_names = ['get', 'put', 'patch']  # Only allow GET, PUT, PATCH (no POST, DELETE)

    def get_queryset(self):
        # Always return the singleton instance
        return AboutPage.objects.all()

    def list(self, request, *args, **kwargs):
        """Override list to return single instance"""
        instance = AboutPage.get_instance()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def retrieve(self, request, *args, **kwargs):
        """Override retrieve to always return the singleton"""
        instance = AboutPage.get_instance()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)


class ServicesPageViewSet(viewsets.ModelViewSet):
    """ViewSet for Services Page - Single instance, public read, auth write"""
    queryset = ServicesPage.objects.all()
    serializer_class = ServicesPageSerializer
    permission_classes = [AllowAny]  # Allow anyone to read/update for now
    authentication_classes = []  # Disable authentication
    pagination_class = None  # Disable pagination
    http_method_names = ['get', 'put', 'patch']  # Only allow GET, PUT, PATCH (no POST, DELETE)

    def get_queryset(self):
        # Always return the singleton instance
        return ServicesPage.objects.all()

    def list(self, request, *args, **kwargs):
        """Override list to return single instance"""
        instance = ServicesPage.get_instance()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def retrieve(self, request, *args, **kwargs):
        """Override retrieve to always return the singleton"""
        instance = ServicesPage.get_instance()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)


class ContactPageViewSet(viewsets.ModelViewSet):
    """ViewSet for Contact Page - Single instance, public read, auth write"""
    queryset = ContactPage.objects.all()
    serializer_class = ContactPageSerializer
    permission_classes = [AllowAny]  # Allow anyone to read/update for now
    authentication_classes = []  # Disable authentication
    pagination_class = None  # Disable pagination
    http_method_names = ['get', 'put', 'patch']  # Only allow GET, PUT, PATCH (no POST, DELETE)

    def get_queryset(self):
        # Always return the singleton instance
        return ContactPage.objects.all()

    def list(self, request, *args, **kwargs):
        """Override list to return array with single instance for compatibility"""
        instance = ContactPage.get_instance()
        serializer = self.get_serializer(instance)
        # Return as array to match frontend expectation
        return Response([serializer.data])

    def retrieve(self, request, *args, **kwargs):
        """Override retrieve to always return the singleton"""
        instance = ContactPage.get_instance()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)


class SEOSettingsViewSet(viewsets.ModelViewSet):
    """ViewSet for SEO Settings - Public read, auth write"""
    queryset = SEOSettings.objects.all()
    serializer_class = SEOSettingsSerializer
    permission_classes = [AllowAny]  # Allow anyone to read/update for now
    pagination_class = None  # Disable pagination
    lookup_field = 'page_name'  # Use page_name instead of id for lookups

    def get_queryset(self):
        return SEOSettings.objects.all().order_by('page_name')

    @action(detail=False, methods=['get'])
    def all_settings(self, request):
        """Get all SEO settings in a structured format"""
        all_seo = SEOSettings.objects.all()
        result = {}
        for seo in all_seo:
            result[seo.page_name] = {
                'title': seo.title or '',
                'description': seo.description or '',
                'keywords': seo.keywords or '',
                'ogImage': seo.og_image or '',
                'canonical': seo.canonical or ''
            }
            # Add global settings fields if it's the global page
            if seo.page_name == 'global':
                result[seo.page_name].update({
                    'siteName': seo.site_name or '',
                    'twitterHandle': seo.twitter_handle or '',
                    'facebookUrl': seo.facebook_url or '',
                    'instagramUrl': seo.instagram_url or '',
                    'twitterUrl': seo.twitter_url or '',
                    'googleAnalyticsId': seo.google_analytics_id or '',
                    'googleSearchConsoleId': seo.google_search_console_id or ''
                })
        return Response(result)

    @action(detail=False, methods=['post'])
    def bulk_update(self, request):
        """Bulk update all SEO settings"""
        data = request.data
        updated_pages = []

        for page_name, settings in data.items():
            # Convert camelCase to snake_case for database fields
            db_settings = {
                'title': settings.get('title', ''),
                'description': settings.get('description', ''),
                'keywords': settings.get('keywords', ''),
                'og_image': settings.get('ogImage', ''),
                'canonical': settings.get('canonical', '')
            }

            # Add global settings if page is 'global'
            if page_name == 'global':
                db_settings.update({
                    'site_name': settings.get('siteName', ''),
                    'twitter_handle': settings.get('twitterHandle', ''),
                    'facebook_url': settings.get('facebookUrl', ''),
                    'instagram_url': settings.get('instagramUrl', ''),
                    'twitter_url': settings.get('twitterUrl', ''),
                    'google_analytics_id': settings.get('googleAnalyticsId', ''),
                    'google_search_console_id': settings.get('googleSearchConsoleId', '')
                })

            # Update or create the SEO settings
            seo, created = SEOSettings.objects.update_or_create(
                page_name=page_name,
                defaults=db_settings
            )
            updated_pages.append(page_name)

        return Response({
            'success': True,
            'updated_pages': updated_pages,
            'message': 'SEO ayarları başarıyla kaydedildi'
        })


@api_view(['GET'])
@permission_classes([AllowAny])
def sitemap_xml(request):
    """
    Generate dynamic sitemap.xml
    """
    import os
    from datetime import datetime

    # Get the base URL from environment or use default
    base_url = os.environ.get('SITE_URL', 'https://petkey.com')

    # Start sitemap XML
    xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'

    # Static pages with high priority
    static_pages = [
        {'loc': '/', 'priority': '1.0', 'changefreq': 'daily'},
        {'loc': '/hizmetler', 'priority': '0.9', 'changefreq': 'weekly'},
        {'loc': '/hakkimizda', 'priority': '0.8', 'changefreq': 'monthly'},
        {'loc': '/veterinerler', 'priority': '0.8', 'changefreq': 'weekly'},
        {'loc': '/blog', 'priority': '0.8', 'changefreq': 'daily'},
        {'loc': '/galeri', 'priority': '0.7', 'changefreq': 'weekly'},
        {'loc': '/iletisim', 'priority': '0.7', 'changefreq': 'monthly'},
        {'loc': '/randevu', 'priority': '0.9', 'changefreq': 'monthly'},
    ]

    for page in static_pages:
        xml += '  <url>\n'
        xml += f'    <loc>{base_url}{page["loc"]}</loc>\n'
        xml += f'    <changefreq>{page["changefreq"]}</changefreq>\n'
        xml += f'    <priority>{page["priority"]}</priority>\n'
        xml += '  </url>\n'

    # Blog posts
    blog_posts = BlogPost.objects.filter(status='published').order_by('-published_at')
    for post in blog_posts:
        lastmod = post.updated_at.strftime('%Y-%m-%d') if post.updated_at else datetime.now().strftime('%Y-%m-%d')
        xml += '  <url>\n'
        xml += f'    <loc>{base_url}/blog/{post.slug}</loc>\n'
        xml += f'    <lastmod>{lastmod}</lastmod>\n'
        xml += '    <changefreq>monthly</changefreq>\n'
        xml += '    <priority>0.6</priority>\n'
        xml += '  </url>\n'

    # Services
    services = Service.objects.filter(is_active=True)
    for service in services:
        xml += '  <url>\n'
        xml += f'    <loc>{base_url}/service/{service.slug}</loc>\n'
        xml += '    <changefreq>monthly</changefreq>\n'
        xml += '    <priority>0.7</priority>\n'
        xml += '  </url>\n'

    # Veterinarians
    vets = Veterinarian.objects.filter(is_active=True)
    for vet in vets:
        xml += '  <url>\n'
        xml += f'    <loc>{base_url}/veteriner/{vet.id}</loc>\n'
        xml += '    <changefreq>monthly</changefreq>\n'
        xml += '    <priority>0.6</priority>\n'
        xml += '  </url>\n'

    # Close urlset
    xml += '</urlset>'

    return HttpResponse(xml, content_type='application/xml')


@method_decorator(csrf_exempt, name='dispatch')
class GoogleReviewViewSet(viewsets.ModelViewSet):
    """ViewSet for Google Reviews"""
    queryset = GoogleReview.objects.all().order_by('order', '-created_at')
    serializer_class = GoogleReviewSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        """Return all reviews for admin, only active for public"""
        queryset = GoogleReview.objects.all()
        # If there's a query parameter to get only active reviews
        only_active = self.request.query_params.get('active_only', None)
        if only_active == 'true':
            queryset = queryset.filter(is_active=True)
        return queryset.order_by('order', '-created_at')


class HomePageViewSet(viewsets.ModelViewSet):
    """ViewSet for HomePage - Only one instance"""
    queryset = HomePage.objects.all()
    serializer_class = HomePageSerializer
    permission_classes = [AllowAny]
    authentication_classes = []  # Disable authentication for this viewset

    @action(detail=False, methods=['get'])
    def content(self, request):
        """Get the homepage content (always returns the single instance)"""
        homepage = HomePage.get_instance()
        serializer = self.get_serializer(homepage)
        return Response(serializer.data)


class SiteSettingsViewSet(viewsets.ModelViewSet):
    """ViewSet for Site Settings - Only one instance"""
    queryset = SiteSettings.objects.all()
    serializer_class = SiteSettingsSerializer
    permission_classes = [AllowAny]
    authentication_classes = []

    @action(detail=False, methods=['get'])
    def get_settings(self, request):
        """Get the site settings (always returns the single instance)"""
        settings = SiteSettings.get_instance()
        serializer = self.get_serializer(settings)
        return Response(serializer.data)

    @action(detail=False, methods=['post', 'put', 'patch'])
    def update_settings(self, request):
        """Update the site settings"""
        settings = SiteSettings.get_instance()
        serializer = self.get_serializer(settings, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
