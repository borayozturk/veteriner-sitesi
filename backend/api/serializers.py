from rest_framework import serializers
from .models import Veterinarian, BlogPost, Appointment, ContactMessage, GalleryImage, PageContent, Service, AboutPage, ServicesPage, ContactPage, SEOSettings, GoogleReview, HomePage, SiteSettings
from . import models
import base64
import uuid
from django.core.files.base import ContentFile


class VeterinarianSerializer(serializers.ModelSerializer):
    class Meta:
        model = Veterinarian
        fields = ["id", "name", "slug", "specialty", "bio", "avatar", "experience_years",
                  "education", "graduation_year", "certifications", "expertise_areas",
                  "achievements", "monday_hours", "tuesday_hours", "wednesday_hours",
                  "thursday_hours", "friday_hours", "saturday_hours", "sunday_hours",
                  "phone", "email", "address", "is_active",
                  "created_at", "updated_at"]
        read_only_fields = ["slug", "created_at", "updated_at"]

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        # Convert avatar image path to full URL
        if representation.get('avatar') and instance.avatar:
            request = self.context.get('request')
            if request:
                representation['avatar'] = request.build_absolute_uri(instance.avatar.url)
            else:
                # Fallback if no request in context
                representation['avatar'] = f'http://localhost:8000{instance.avatar.url}' if instance.avatar else None
        return representation


class BlogPostSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source="author.name", read_only=True)
    featured_image = serializers.CharField(required=False, allow_blank=True, allow_null=True)

    class Meta:
        model = BlogPost
        fields = ["id", "author", "author_name", "title", "slug", "excerpt",
                  "content", "featured_image", "category", "tags", "status",
                  "views", "published_at", "created_at", "updated_at"]
        read_only_fields = ["slug", "views", "created_at", "updated_at"]

    def create(self, validated_data):
        featured_image_data = validated_data.pop('featured_image', None)
        blog_post = BlogPost.objects.create(**validated_data)

        if featured_image_data and featured_image_data.startswith('data:image'):
            # Decode base64 image
            format, imgstr = featured_image_data.split(';base64,')
            ext = format.split('/')[-1]
            image_data = ContentFile(base64.b64decode(imgstr), name=f'{uuid.uuid4()}.{ext}')
            blog_post.featured_image = image_data
            blog_post.save()
        elif featured_image_data:
            blog_post.featured_image = featured_image_data
            blog_post.save()

        return blog_post

    def update(self, instance, validated_data):
        featured_image_data = validated_data.pop('featured_image', None)

        # Update other fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if featured_image_data and featured_image_data.startswith('data:image'):
            # Decode base64 image
            format, imgstr = featured_image_data.split(';base64,')
            ext = format.split('/')[-1]
            image_data = ContentFile(base64.b64decode(imgstr), name=f'{uuid.uuid4()}.{ext}')
            instance.featured_image = image_data
        elif featured_image_data:
            instance.featured_image = featured_image_data

        instance.save()
        return instance

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        # Convert image path to full URL
        if representation.get('featured_image') and instance.featured_image:
            request = self.context.get('request')
            if request:
                representation['featured_image'] = request.build_absolute_uri(instance.featured_image.url)
            else:
                # Fallback if no request in context
                representation['featured_image'] = f'http://localhost:8000{instance.featured_image.url}' if instance.featured_image else None
        return representation


class BlogPostListSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source="author.name", read_only=True)

    class Meta:
        model = BlogPost
        fields = ["id", "author_name", "title", "slug", "excerpt",
                  "featured_image", "category", "tags", "status",
                  "views", "published_at", "created_at"]

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        # Convert image path to full URL
        if representation.get('featured_image') and instance.featured_image:
            request = self.context.get('request')
            if request:
                representation['featured_image'] = request.build_absolute_uri(instance.featured_image.url)
            else:
                # Fallback if no request in context
                representation['featured_image'] = f'http://localhost:8000{instance.featured_image.url}' if instance.featured_image else None
        return representation


class AppointmentSerializer(serializers.ModelSerializer):
    veterinarian_name = serializers.CharField(source="veterinarian.name", read_only=True)
    
    class Meta:
        model = Appointment
        fields = ["id", "veterinarian", "veterinarian_name", "pet_name", "pet_type", 
                  "pet_breed", "pet_age", "owner_name", "owner_email", "owner_phone", 
                  "date", "time", "service", "notes", "status", "admin_notes", 
                  "created_at", "updated_at"]
        read_only_fields = ["created_at", "updated_at"]


class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ["id", "name", "email", "phone", "subject", "message",
                  "status", "admin_reply", "is_deleted", "deleted_at",
                  "created_at", "updated_at"]
        read_only_fields = ["created_at", "updated_at", "deleted_at"]


class GalleryImageSerializer(serializers.ModelSerializer):
    image = serializers.CharField()  # Support both file uploads and URLs

    class Meta:
        model = GalleryImage
        fields = ["id", "title", "description", "image", "category",
                  "tags", "order", "is_active", "created_at", "updated_at"]
        read_only_fields = ["created_at", "updated_at"]


class PageContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = PageContent
        fields = ["id", "page_name", "title", "content", "sections", "faqs", "features", "process_steps", "vaccination_schedule", "updated_at"]
        read_only_fields = ["updated_at"]


class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = ["id", "slug", "icon", "title", "short_description", "is_active", "order", "meta_title", "meta_description", "meta_keywords", "og_image", "created_at", "updated_at"]
        read_only_fields = ["created_at", "updated_at"]


class AboutPageSerializer(serializers.ModelSerializer):
    class Meta:
        model = AboutPage
        fields = ["id", "hero_subtitle", "stats", "story_title", "story_paragraph_1", "story_paragraph_2", "values", "updated_at"]
        read_only_fields = ["updated_at"]


class ServicesPageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServicesPage
        fields = [
            "id", "hero_title_line1", "hero_title_line2", "hero_description",
            "hero_phone", "hero_phone_link",
            "feature_pills", "stats",
            "cta_title", "cta_subtitle", "cta_description", "cta_phone",
            "updated_at"
        ]
        read_only_fields = ["updated_at"]


class ContactPageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactPage
        fields = [
            "id", "hero_title", "hero_subtitle",
            "phone_number", "phone_label",
            "whatsapp_number", "whatsapp_label",
            "email_primary", "email_secondary",
            "address_line1", "address_line2",
            "google_maps_url", "google_maps_embed",
            "working_hours", "why_contact_us",
            "emergency_title", "emergency_subtitle",
            "emergency_phone", "emergency_whatsapp",
            "updated_at"
        ]
        read_only_fields = ["updated_at"]


class SEOSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = SEOSettings
        fields = [
            "id", "page_name", "title", "description", "keywords",
            "og_image", "canonical", "site_name", "twitter_handle",
            "facebook_url", "instagram_url", "twitter_url",
            "google_analytics_id", "google_search_console_id",
            "created_at", "updated_at"
        ]
        read_only_fields = ["created_at", "updated_at"]


class GoogleReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.GoogleReview
        fields = [
            "id", "name", "initial", "rating", "text", "date",
            "verified", "local_guide", "is_active", "order",
            "created_at", "updated_at"
        ]
        read_only_fields = ["created_at", "updated_at"]


class HomePageSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.HomePage
        fields = [
            "id",
            # Hero Section
            "hero_title", "hero_subtitle", "hero_cta_text", "hero_cta_link",
            "hero_secondary_cta_text", "hero_secondary_cta_link",
            # Stats Section
            "show_stats", "stat1_number", "stat1_label", "stat2_number", "stat2_label",
            "stat3_number", "stat3_label", "stat4_number", "stat4_label",
            # Services Section
            "show_services", "services_title", "services_subtitle",
            # Why Choose Us Section
            "show_why_choose", "why_choose_title", "why_choose_subtitle", "why_choose_features",
            # About Section
            "show_about", "about_title", "about_description", "about_cta_text",
            # Veterinarians Section
            "show_veterinarians", "veterinarians_title", "veterinarians_subtitle",
            # Appointment CTA Section
            "show_appointment_cta", "appointment_cta_title", "appointment_cta_description",
            "appointment_cta_button", "appointment_cta_phone", "appointment_cta_phone_link",
            "appointment_cta_features",
            "appointment_cta_stat1_number", "appointment_cta_stat1_label",
            "appointment_cta_stat2_number", "appointment_cta_stat2_label",
            "appointment_cta_stat3_number", "appointment_cta_stat3_label",
            # Google Reviews Section
            "show_reviews", "reviews_title", "reviews_subtitle", "reviews_rating",
            "reviews_count", "reviews_cta_text", "reviews_cta_link",
            # Blog Section
            "show_blog", "blog_title", "blog_subtitle",
            # Contact Section
            "show_contact", "contact_title", "contact_description",
            # Meta
            "created_at", "updated_at"
        ]
        read_only_fields = ["created_at", "updated_at"]


class SiteSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteSettings
        fields = [
            "site_title", "site_logo_image", "site_logo_text", "site_logo_subtitle", "site_logo_emoji",
            "contact_phone", "contact_phone_link", "contact_whatsapp", "contact_email", "contact_address",
            "footer_about_text", "footer_facebook_url", "footer_instagram_url", "footer_twitter_url",
            "working_hours_weekday", "working_hours_weekend", "working_hours_info",
            "created_at", "updated_at"
        ]
        read_only_fields = ["created_at", "updated_at"]
