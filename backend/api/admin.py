from django.contrib import admin
from .models import Veterinarian, BlogPost, Appointment, ContactMessage, GalleryImage, PageContent, AboutPage, ServicesPage, SEOSettings, SiteSettings


@admin.register(Veterinarian)
class VeterinarianAdmin(admin.ModelAdmin):
    list_display = ['name', 'specialty', 'experience_years', 'phone', 'email', 'is_active', 'created_at']
    list_filter = ['is_active', 'specialty', 'created_at']
    search_fields = ['name', 'specialty', 'bio', 'phone', 'email']
    readonly_fields = ['created_at', 'updated_at']
    fieldsets = (
        ('Temel Bilgiler', {
            'fields': ('user', 'name', 'specialty', 'bio', 'avatar')
        }),
        ('Detaylar', {
            'fields': ('experience_years', 'education', 'certifications')
        }),
        ('İletişim', {
            'fields': ('phone', 'email')
        }),
        ('Durum', {
            'fields': ('is_active', 'created_at', 'updated_at')
        }),
    )


@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = ['title', 'author', 'category', 'status', 'views', 'published_at', 'created_at']
    list_filter = ['status', 'category', 'created_at', 'published_at']
    search_fields = ['title', 'content', 'excerpt', 'tags']
    readonly_fields = ['slug', 'views', 'created_at', 'updated_at']
    date_hierarchy = 'published_at'
    fieldsets = (
        ('İçerik', {
            'fields': ('author', 'title', 'slug', 'excerpt', 'content', 'featured_image')
        }),
        ('Kategori & Etiketler', {
            'fields': ('category', 'tags')
        }),
        ('Yayın', {
            'fields': ('status', 'published_at', 'views')
        }),
        ('Tarihler', {
            'fields': ('created_at', 'updated_at')
        }),
    )


@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ['pet_name', 'owner_name', 'veterinarian', 'date', 'time', 'service', 'status', 'created_at']
    list_filter = ['status', 'date', 'veterinarian', 'created_at']
    search_fields = ['pet_name', 'owner_name', 'owner_email', 'owner_phone', 'service']
    readonly_fields = ['created_at', 'updated_at']
    date_hierarchy = 'date'
    fieldsets = (
        ('Randevu Bilgileri', {
            'fields': ('veterinarian', 'date', 'time', 'service', 'status')
        }),
        ('Evcil Hayvan', {
            'fields': ('pet_name', 'pet_type', 'pet_breed', 'pet_age')
        }),
        ('Sahip Bilgileri', {
            'fields': ('owner_name', 'owner_email', 'owner_phone')
        }),
        ('Notlar', {
            'fields': ('notes', 'admin_notes')
        }),
        ('Tarihler', {
            'fields': ('created_at', 'updated_at')
        }),
    )


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'subject', 'status', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['name', 'email', 'subject', 'message']
    readonly_fields = ['created_at', 'updated_at']
    date_hierarchy = 'created_at'
    fieldsets = (
        ('Gönderen Bilgileri', {
            'fields': ('name', 'email', 'phone')
        }),
        ('Mesaj', {
            'fields': ('subject', 'message', 'status')
        }),
        ('Yanıt', {
            'fields': ('admin_reply',)
        }),
        ('Tarihler', {
            'fields': ('created_at', 'updated_at')
        }),
    )


@admin.register(GalleryImage)
class GalleryImageAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'order', 'is_active', 'created_at']
    list_filter = ['category', 'is_active', 'created_at']
    search_fields = ['title', 'description', 'tags']
    readonly_fields = ['created_at', 'updated_at']
    list_editable = ['order', 'is_active']
    fieldsets = (
        ('Görsel', {
            'fields': ('title', 'description', 'image')
        }),
        ('Kategori & Etiketler', {
            'fields': ('category', 'tags')
        }),
        ('Sıralama & Durum', {
            'fields': ('order', 'is_active')
        }),
        ('Tarihler', {
            'fields': ('created_at', 'updated_at')
        }),
    )


@admin.register(PageContent)
class PageContentAdmin(admin.ModelAdmin):
    list_display = ['page_name', 'title', 'updated_at']
    search_fields = ['page_name', 'title', 'content']
    readonly_fields = ['updated_at']
    fieldsets = (
        ('Sayfa', {
            'fields': ('page_name', 'title')
        }),
        ('İçerik', {
            'fields': ('content',)
        }),
        ('Tarih', {
            'fields': ('updated_at',)
        }),
    )


@admin.register(AboutPage)
class AboutPageAdmin(admin.ModelAdmin):
    list_display = ['__str__', 'updated_at']
    readonly_fields = ['updated_at']

    fieldsets = (
        ('Hero Bölümü', {
            'fields': ('hero_subtitle',),
            'description': 'Ana başlığın altında görünen metin'
        }),
        ('İstatistikler', {
            'fields': ('stats',),
            'description': 'JSON formatında istatistikler. Örnek: [{"number": "10+", "label": "Yıllık Tecrübe"}, {"number": "25K+", "label": "Mutlu Hasta"}]'
        }),
        ('Hikayemiz Bölümü', {
            'fields': ('story_title', 'story_paragraph_1', 'story_paragraph_2'),
        }),
        ('Güncelleme Tarihi', {
            'fields': ('updated_at',)
        }),
    )

    def has_add_permission(self, request):
        # Only one instance allowed
        return not AboutPage.objects.exists()

    def has_delete_permission(self, request, obj=None):
        # Don't allow deletion
        return False


@admin.register(ServicesPage)
class ServicesPageAdmin(admin.ModelAdmin):
    list_display = ['__str__', 'updated_at']
    readonly_fields = ['updated_at']

    fieldsets = (
        ('Hero Bölümü', {
            'fields': ('hero_title_line1', 'hero_title_line2', 'hero_description'),
            'description': 'Hizmetler sayfasının üst kısmındaki hero bölümü'
        }),
        ('Özellik Pilleri', {
            'fields': ('feature_pills',),
            'description': 'Hero bölümünde gösterilen 3 özellik. JSON formatı: [{"icon": "🏥", "text": "Modern Klinik"}, ...]'
        }),
        ('İstatistikler', {
            'fields': ('stats',),
            'description': 'Sağ taraftaki istatistik kartları (5 adet). JSON formatı: [{"number": "21+", "label": "Hizmet Dalı", "icon": "🩺", "gradient": "from-emerald-500 to-cyan-500"}, ...]'
        }),
        ('Alt Bölüm - CTA (Daha Fazla Bilgi)', {
            'fields': ('cta_title', 'cta_subtitle', 'cta_description', 'cta_phone'),
            'description': 'Sayfa altındaki iletişim çağrısı bölümü'
        }),
        ('Güncelleme Tarihi', {
            'fields': ('updated_at',)
        }),
    )

    def has_add_permission(self, request):
        # Only one instance allowed
        return not ServicesPage.objects.exists()

    def has_delete_permission(self, request, obj=None):
        # Don't allow deletion
        return False


@admin.register(SEOSettings)
class SEOSettingsAdmin(admin.ModelAdmin):
    list_display = ['page_name', 'title', 'updated_at']
    list_filter = ['page_name']
    search_fields = ['title', 'description', 'keywords']
    readonly_fields = ['created_at', 'updated_at']

    fieldsets = (
        ('Sayfa', {
            'fields': ('page_name',)
        }),
        ('Meta Tags', {
            'fields': ('title', 'description', 'keywords'),
            'description': 'SEO için meta bilgileri. Başlık: 50-60 karakter, Açıklama: 150-160 karakter'
        }),
        ('Open Graph', {
            'fields': ('og_image', 'canonical'),
            'description': 'Sosyal medya paylaşımları için'
        }),
        ('Genel Ayarlar (Sadece Global için)', {
            'fields': ('site_name', 'twitter_handle', 'facebook_url', 'instagram_url', 'twitter_url', 'google_analytics_id', 'google_search_console_id'),
            'description': 'Bu alanlar sadece page_name=global için kullanılır'
        }),
        ('Tarihler', {
            'fields': ('created_at', 'updated_at')
        }),
    )


@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    list_display = ['__str__', 'site_title', 'updated_at']
    readonly_fields = ['created_at', 'updated_at']

    fieldsets = (
        ('Header & Logo Ayarları', {
            'fields': ('site_title', 'site_logo_image', 'site_logo_text', 'site_logo_subtitle', 'site_logo_emoji'),
        }),
        ('İletişim Bilgileri', {
            'fields': ('contact_phone', 'contact_phone_link', 'contact_email', 'contact_address'),
        }),
        ('Çalışma Saatleri', {
            'fields': ('working_hours_weekday', 'working_hours_weekend', 'working_hours_info'),
        }),
        ('Footer Ayarları', {
            'fields': ('footer_about_text', 'footer_facebook_url', 'footer_instagram_url', 'footer_twitter_url'),
        }),
        ('Tarihler', {
            'fields': ('created_at', 'updated_at')
        }),
    )

    def has_add_permission(self, request):
        # Only one instance allowed
        return not SiteSettings.objects.exists()

    def has_delete_permission(self, request, obj=None):
        # Don't allow deletion
        return False
