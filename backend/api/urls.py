from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    VeterinarianViewSet,
    BlogPostViewSet,
    AppointmentViewSet,
    ContactMessageViewSet,
    GalleryImageViewSet,
    PageContentViewSet,
    ServiceViewSet,
    AboutPageViewSet,
    ServicesPageViewSet,
    ContactPageViewSet,
    SEOSettingsViewSet,
    GoogleReviewViewSet,
    HomePageViewSet,
    SiteSettingsViewSet,
    sitemap_xml
)
from .auth_views import (
    login_view,
    logout_view,
    check_auth,
    get_users,
    create_user,
    update_user,
    delete_user
)

# Create a router and register our viewsets
router = DefaultRouter()
router.register(r'veterinarians', VeterinarianViewSet, basename='veterinarian')
router.register(r'blog', BlogPostViewSet, basename='blogpost')
router.register(r'appointments', AppointmentViewSet, basename='appointment')
router.register(r'contact', ContactMessageViewSet, basename='contactmessage')
router.register(r'gallery', GalleryImageViewSet, basename='galleryimage')
router.register(r'pages', PageContentViewSet, basename='pagecontent')
router.register(r'services', ServiceViewSet, basename='service')
router.register(r'about-page', AboutPageViewSet, basename='aboutpage')
router.register(r'services-page', ServicesPageViewSet, basename='servicespage')
router.register(r'contact-page', ContactPageViewSet, basename='contactpage')
router.register(r'seo-settings', SEOSettingsViewSet, basename='seosettings')
router.register(r'google-reviews', GoogleReviewViewSet, basename='googlereview')
router.register(r'homepage', HomePageViewSet, basename='homepage')
router.register(r'site-settings', SiteSettingsViewSet, basename='sitesettings')

# The API URLs are now determined automatically by the router
urlpatterns = [
    path('', include(router.urls)),
    # Authentication endpoints
    path('auth/login/', login_view, name='login'),
    path('auth/logout/', logout_view, name='logout'),
    path('auth/check/', check_auth, name='check-auth'),
    # User management endpoints
    path('users/', get_users, name='get-users'),
    path('users/create/', create_user, name='create-user'),
    path('users/<int:user_id>/update/', update_user, name='update-user'),
    path('users/<int:user_id>/delete/', delete_user, name='delete-user'),
    # SEO endpoints
    path('sitemap.xml', sitemap_xml, name='sitemap'),
]
