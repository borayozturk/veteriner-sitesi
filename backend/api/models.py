from django.db import models
from django.contrib.auth.models import User
from django.utils.text import slugify

class Veterinarian(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="veterinarian_profile", null=True, blank=True)
    name = models.CharField(max_length=200, verbose_name="Ad Soyad")
    slug = models.SlugField(max_length=200, unique=True, verbose_name="URL Slug", blank=True, null=True)
    specialty = models.CharField(max_length=200, verbose_name="Uzmanlık Alanı")
    bio = models.TextField(verbose_name="Biyografi", blank=True)
    avatar = models.ImageField(upload_to="veterinarians/", verbose_name="Profil Fotoğrafı", blank=True, null=True)
    experience_years = models.IntegerField(verbose_name="Deneyim (Yıl)", default=0)
    education = models.TextField(verbose_name="Eğitim", blank=True)
    graduation_year = models.IntegerField(verbose_name="Mezuniyet Yılı", null=True, blank=True)
    certifications = models.TextField(verbose_name="Sertifikalar", blank=True)
    expertise_areas = models.TextField(verbose_name="Uzmanlık Alanları", blank=True, help_text="Her satıra bir uzmanlık alanı")
    achievements = models.TextField(verbose_name="Başarılar ve Ödüller", blank=True, help_text="Her satıra bir başarı")

    # Çalışma saatleri - Her gün için ayrı
    monday_hours = models.CharField(max_length=50, verbose_name="Pazartesi", blank=True)
    tuesday_hours = models.CharField(max_length=50, verbose_name="Salı", blank=True)
    wednesday_hours = models.CharField(max_length=50, verbose_name="Çarşamba", blank=True)
    thursday_hours = models.CharField(max_length=50, verbose_name="Perşembe", blank=True)
    friday_hours = models.CharField(max_length=50, verbose_name="Cuma", blank=True)
    saturday_hours = models.CharField(max_length=50, verbose_name="Cumartesi", blank=True)
    sunday_hours = models.CharField(max_length=50, verbose_name="Pazar", blank=True)

    # İletişim bilgileri
    phone = models.CharField(max_length=20, verbose_name="Telefon", blank=True)
    email = models.EmailField(verbose_name="E-posta", blank=True)
    address = models.TextField(verbose_name="Adres", blank=True)
    is_active = models.BooleanField(default=True, verbose_name="Aktif")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Veteriner Hekim"
        verbose_name_plural = "Veteriner Hekimler"
        ordering = ["-created_at"]

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
            # Eğer slug zaten varsa, sonuna sayı ekle
            original_slug = self.slug
            counter = 1
            while Veterinarian.objects.filter(slug=self.slug).exists():
                self.slug = f"{original_slug}-{counter}"
                counter += 1
        super().save(*args, **kwargs)


class BlogPost(models.Model):
    STATUS_CHOICES = [
        ("draft", "Taslak"),
        ("published", "Yayında"),
    ]

    author = models.ForeignKey(Veterinarian, on_delete=models.CASCADE, related_name="blog_posts", verbose_name="Yazar")
    title = models.CharField(max_length=300, verbose_name="Başlık")
    slug = models.SlugField(max_length=300, unique=True, blank=True)
    excerpt = models.TextField(max_length=500, verbose_name="Özet")
    content = models.TextField(verbose_name="İçerik")
    featured_image = models.ImageField(upload_to="blog/", verbose_name="Öne Çıkan Görsel", blank=True, null=True)
    category = models.CharField(max_length=100, verbose_name="Kategori", default="Genel")
    tags = models.CharField(max_length=500, verbose_name="Etiketler", blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="draft", verbose_name="Durum")
    views = models.IntegerField(default=0, verbose_name="Görüntülenme")
    published_at = models.DateTimeField(null=True, blank=True, verbose_name="Yayın Tarihi")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Blog Yazısı"
        verbose_name_plural = "Blog Yazıları"
        ordering = ["-published_at", "-created_at"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title, allow_unicode=True)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class Appointment(models.Model):
    STATUS_CHOICES = [
        ("pending", "Bekliyor"),
        ("confirmed", "Onaylandı"),
        ("completed", "Tamamlandı"),
        ("cancelled", "İptal Edildi"),
    ]

    veterinarian = models.ForeignKey(Veterinarian, on_delete=models.CASCADE, related_name="appointments", verbose_name="Veteriner")
    pet_name = models.CharField(max_length=100, verbose_name="Evcil Hayvan Adı")
    pet_type = models.CharField(max_length=50, verbose_name="Hayvan Türü")
    pet_breed = models.CharField(max_length=100, verbose_name="Irk", blank=True)
    pet_age = models.CharField(max_length=50, verbose_name="Yaş")
    owner_name = models.CharField(max_length=200, verbose_name="Sahip Adı")
    owner_email = models.EmailField(verbose_name="E-posta")
    owner_phone = models.CharField(max_length=20, verbose_name="Telefon")
    date = models.DateField(verbose_name="Tarih")
    time = models.TimeField(verbose_name="Saat")
    service = models.CharField(max_length=200, verbose_name="Hizmet")
    notes = models.TextField(verbose_name="Notlar", blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending", verbose_name="Durum")
    admin_notes = models.TextField(verbose_name="Admin Notları", blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Randevu"
        verbose_name_plural = "Randevular"
        ordering = ["date", "time"]

    def __str__(self):
        return f"{self.pet_name} - {self.date} {self.time}"


class ContactMessage(models.Model):
    STATUS_CHOICES = [
        ("new", "Yeni"),
        ("read", "Okundu"),
        ("replied", "Yanıtlandı"),
    ]

    name = models.CharField(max_length=200, verbose_name="Ad Soyad")
    email = models.EmailField(verbose_name="E-posta")
    phone = models.CharField(max_length=20, verbose_name="Telefon", blank=True)
    subject = models.CharField(max_length=200, verbose_name="Konu")
    message = models.TextField(verbose_name="Mesaj")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="new", verbose_name="Durum")
    admin_reply = models.TextField(verbose_name="Admin Yanıtı", blank=True)
    is_deleted = models.BooleanField(default=False, verbose_name="Silinmiş")
    deleted_at = models.DateTimeField(null=True, blank=True, verbose_name="Silinme Tarihi")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "İletişim Mesajı"
        verbose_name_plural = "İletişim Mesajları"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.name} - {self.subject}"


class GalleryImage(models.Model):
    CATEGORY_CHOICES = [
        ("dogs", "Köpekler"),
        ("cats", "Kediler"),
        ("clinic", "Klinik"),
        ("team", "Ekip"),
    ]

    title = models.CharField(max_length=200, verbose_name="Başlık")
    description = models.TextField(verbose_name="Açıklama", blank=True)
    image = models.TextField(verbose_name="Görsel URL")  # Changed to TextField for URL support
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, verbose_name="Kategori")
    tags = models.CharField(max_length=500, verbose_name="Etiketler", blank=True)
    order = models.IntegerField(default=0, verbose_name="Sıra")
    is_active = models.BooleanField(default=True, verbose_name="Aktif")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Galeri Görseli"
        verbose_name_plural = "Galeri Görselleri"
        ordering = ["order", "-created_at"]

    def __str__(self):
        return self.title


class PageContent(models.Model):
    page_name = models.CharField(max_length=50, unique=True, verbose_name="Sayfa")
    title = models.CharField(max_length=300, verbose_name="Başlık")
    content = models.TextField(verbose_name="İçerik", blank=True)
    sections = models.JSONField(verbose_name="Bölümler", blank=True, null=True, default=list)
    faqs = models.JSONField(verbose_name="SSS (Sıkça Sorulan Sorular)", blank=True, null=True, default=list)

    # Özel hizmet alanları
    features = models.JSONField(verbose_name="Neler Sunuyoruz (Özellikler)", blank=True, null=True, default=list, help_text="Her özellik bir liste öğesi olarak eklenecek")
    process_steps = models.JSONField(verbose_name="Süreç Nasıl İşler (Adımlar)", blank=True, null=True, default=list, help_text="Her adım sırayla gösterilecek")

    # Aşılama için özel alanlar
    vaccination_schedule = models.JSONField(verbose_name="Aşı Takvimi", blank=True, null=True, default=dict, help_text='{"puppies": "Yavru bilgisi", "adult": "Yetişkin bilgisi", "rabies": "Kuduz bilgisi"}')

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Sayfa İçeriği"
        verbose_name_plural = "Sayfa İçerikleri"

    def __str__(self):
        return self.page_name


class Service(models.Model):
    slug = models.CharField(max_length=100, unique=True, verbose_name="Slug")
    icon = models.CharField(max_length=10, verbose_name="İkon", default="🏥")
    title = models.CharField(max_length=200, verbose_name="Başlık")
    short_description = models.TextField(max_length=500, verbose_name="Kısa Açıklama")
    is_active = models.BooleanField(default=True, verbose_name="Aktif")
    order = models.IntegerField(default=0, verbose_name="Sıra")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # SEO Fields
    meta_title = models.CharField(max_length=70, verbose_name="Meta Başlık", blank=True, help_text="Boş bırakılırsa 'title' kullanılır")
    meta_description = models.TextField(max_length=170, verbose_name="Meta Açıklama", blank=True, help_text="Boş bırakılırsa 'short_description' kullanılır")
    meta_keywords = models.CharField(max_length=255, verbose_name="Anahtar Kelimeler", blank=True)
    og_image = models.CharField(max_length=255, verbose_name="OG Görsel URL", blank=True, default="/og-service.jpg")

    class Meta:
        verbose_name = "Hizmet"
        verbose_name_plural = "Hizmetler"
        ordering = ["order", "title"]

    def __str__(self):
        return self.title


class AboutPage(models.Model):
    # Hero Section
    hero_subtitle = models.TextField(verbose_name="Hero Alt Başlık", default="Evcil dostlarınızın sağlığı ve mutluluğu için 10+ yıldır hizmetinizdeyiz")

    # Stats - JSON field for flexibility
    stats = models.JSONField(
        verbose_name="İstatistikler",
        default=list,
        help_text='[{"number": "10+", "label": "Yıllık Tecrübe"}, ...]'
    )

    # Story Section
    story_title = models.CharField(max_length=200, verbose_name="Hikaye Başlık", default="Hikayemiz")
    story_paragraph_1 = models.TextField(verbose_name="Hikaye Paragraf 1", default="")
    story_paragraph_2 = models.TextField(verbose_name="Hikaye Paragraf 2", default="")

    # Values Section
    values = models.JSONField(
        verbose_name="Değerlerimiz",
        default=list,
        help_text='[{"icon": "FaHeart", "title": "Sevgi ve Özen", "description": "..."}, ...]'
    )

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Hakkımızda Sayfası"
        verbose_name_plural = "Hakkımızda Sayfası"

    def __str__(self):
        return "Hakkımızda Sayfası İçeriği"

    def save(self, *args, **kwargs):
        # Only allow one instance
        self.pk = 1
        super().save(*args, **kwargs)

    @classmethod
    def get_instance(cls):
        obj, created = cls.objects.get_or_create(
            pk=1,
            defaults={
                'hero_subtitle': 'Evcil dostlarınızın sağlığı ve mutluluğu için 10+ yıldır hizmetinizdeyiz',
                'stats': [
                    {'number': '10+', 'label': 'Yıllık Tecrübe'},
                    {'number': '25K+', 'label': 'Mutlu Hasta'},
                    {'number': '15+', 'label': 'Uzman Veteriner'},
                    {'number': '%99', 'label': 'Memnuniyet Oranı'}
                ],
                'story_title': 'Hikayemiz',
                'story_paragraph_1': 'PetKey Veteriner Kliniği, 2014 yılında evcil hayvan sevgisi ve veterinerlik tutkusuyla kuruldu. Küçük bir klinikten başlayan yolculuğumuz, bugün binlerce mutlu evcil hayvan ve sahiplerinin güvendiği bir merkez haline geldi.',
                'story_paragraph_2': 'Modern teknoloji, deneyimli kadro ve sınırsız sevgi ile her gün daha fazla canına dokunuyoruz. Misyonumuz basit: Her evcil hayvana en iyi sağlık hizmetini sunmak ve onların mutlu, sağlıklı bir yaşam sürmelerini sağlamak.',
                'values': [
                    {'icon': 'FaHeart', 'title': 'Sevgi ve Özen', 'description': 'Her hayvana aile ferdiniz gibi yaklaşıyor, onların mutluluğunu ön planda tutuyoruz.'},
                    {'icon': 'FaAward', 'title': 'Profesyonellik', 'description': 'En yüksek kalite standartlarında, modern ekipmanlarla hizmet veriyoruz.'},
                    {'icon': 'FaUserMd', 'title': 'Uzman Kadro', 'description': 'Alanında deneyimli, sürekli kendini geliştiren veteriner hekimlerimiz.'},
                    {'icon': 'FaPaw', 'title': '7/24 Hizmet', 'description': 'Acil durumlarda her an ulaşabileceğiniz kesintisiz veteriner hizmeti sunuyoruz.'}
                ]
            }
        )
        return obj


class ContactPage(models.Model):
    # Hero Section
    hero_title = models.CharField(max_length=200, verbose_name="Ana Başlık", default="Bizimle İletişime Geçin")
    hero_subtitle = models.TextField(verbose_name="Alt Başlık", default="Sevimli dostlarınızın sağlığı için her zaman yanınızdayız. 7/24 hizmetinizdeyiz!")

    # Contact Info Cards
    phone_number = models.CharField(max_length=50, verbose_name="Telefon Numarası", default="(0212) 123 45 67")
    phone_label = models.CharField(max_length=100, verbose_name="Telefon Etiketi", default="7/24 Acil Hat")

    whatsapp_number = models.CharField(max_length=50, verbose_name="WhatsApp Numarası", default="0555 123 45 67")
    whatsapp_label = models.CharField(max_length=100, verbose_name="WhatsApp Etiketi", default="Hızlı İletişim")

    email_primary = models.EmailField(verbose_name="Birincil E-posta", default="info@petkey.com")
    email_secondary = models.EmailField(verbose_name="İkincil E-posta", default="destek@petkey.com", blank=True)

    address_line1 = models.CharField(max_length=200, verbose_name="Adres Satır 1", default="Kadıköy, İstanbul")
    address_line2 = models.CharField(max_length=200, verbose_name="Adres Satır 2", default="Türkiye", blank=True)
    google_maps_url = models.URLField(verbose_name="Google Maps URL", default="https://www.google.com/maps/place/Kad%C4%B1k%C3%B6y,+Istanbul/@40.9887328,29.0242891,13z")
    google_maps_embed = models.TextField(verbose_name="Google Maps Embed URL", default="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d48377.833789145195!2d29.00782952167968!3d40.98876200000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab9bdf0702a83%3A0xe9e46e5fdbf96af!2zS2FkxLFrw7Z5LCDEsHN0YW5idWw!5e0!3m2!1str!2str!4v1647000000000!5m2!1str!2str")

    # Working Hours - JSON field for flexibility
    working_hours = models.JSONField(
        verbose_name="Çalışma Saatleri",
        default=list,
        help_text='[{"day": "Pazartesi - Cuma", "hours": "09:00 - 19:00"}, ...]'
    )

    # Why Contact Us Section
    why_contact_us = models.JSONField(
        verbose_name="Neden Bize Ulaşmalısınız",
        default=list,
        help_text='[{"icon": "🏥", "title": "Başlık", "description": "Açıklama"}, ...]'
    )

    # Emergency Section
    emergency_title = models.CharField(max_length=200, verbose_name="Acil Durum Başlık", default="🚨 Acil Durumlar İçin")
    emergency_subtitle = models.TextField(verbose_name="Acil Durum Alt Başlık", default="Evcil dostunuzun acil bir durumu mu var? Hemen bizi arayın!")
    emergency_phone = models.CharField(max_length=50, verbose_name="Acil Hat Telefon", default="(0212) 123 45 67")
    emergency_whatsapp = models.CharField(max_length=50, verbose_name="Acil WhatsApp", default="0555 123 45 67")

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "İletişim Sayfası"
        verbose_name_plural = "İletişim Sayfası"

    def __str__(self):
        return "İletişim Sayfası İçeriği"

    def save(self, *args, **kwargs):
        # Only allow one instance
        self.pk = 1
        super().save(*args, **kwargs)

    @classmethod
    def get_instance(cls):
        obj, created = cls.objects.get_or_create(
            pk=1,
            defaults={
                'hero_title': 'Bizimle İletişime Geçin',
                'hero_subtitle': 'Sevimli dostlarınızın sağlığı için her zaman yanınızdayız. 7/24 hizmetinizdeyiz!',
                'phone_number': '(0212) 123 45 67',
                'phone_label': '7/24 Acil Hat',
                'whatsapp_number': '0555 123 45 67',
                'whatsapp_label': 'Hızlı İletişim',
                'email_primary': 'info@petkey.com',
                'email_secondary': 'destek@petkey.com',
                'address_line1': 'Kadıköy, İstanbul',
                'address_line2': 'Türkiye',
                'google_maps_url': 'https://www.google.com/maps/place/Kad%C4%B1k%C3%B6y,+Istanbul/@40.9887328,29.0242891,13z',
                'google_maps_embed': 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d48377.833789145195!2d29.00782952167968!3d40.98876200000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab9bdf0702a83%3A0xe9e46e5fdbf96af!2zS2FkxLFrw7Z5LCDEsHN0YW5idWw!5e0!3m2!1str!2str!4v1647000000000!5m2!1str!2str',
                'working_hours': [
                    {'day': 'Pazartesi - Cuma', 'hours': '09:00 - 19:00'},
                    {'day': 'Cumartesi', 'hours': '10:00 - 17:00'},
                    {'day': 'Pazar', 'hours': '10:00 - 15:00'},
                    {'day': 'Acil Servis', 'hours': '7/24 Hizmet'}
                ],
                'why_contact_us': [
                    {'icon': '🏥', 'title': '7/24 Hizmet', 'description': 'Acil durumlar için her zaman ulaşılabilir'},
                    {'icon': '👨‍⚕️', 'title': 'Uzman Kadro', 'description': 'Deneyimli veteriner hekimler'},
                    {'icon': '⚡', 'title': 'Hızlı Yanıt', 'description': 'En kısa sürede size dönüş yapıyoruz'},
                    {'icon': '💚', 'title': 'Güvenilir', 'description': 'Binlerce mutlu müşteri'}
                ],
                'emergency_title': '🚨 Acil Durumlar İçin',
                'emergency_subtitle': 'Evcil dostunuzun acil bir durumu mu var? Hemen bizi arayın!',
                'emergency_phone': '(0212) 123 45 67',
                'emergency_whatsapp': '0555 123 45 67'
            }
        )
        return obj


class ServicesPage(models.Model):
    # Hero Section
    hero_title_line1 = models.CharField(max_length=200, verbose_name="Ana Başlık Satır 1", default="Evcil Dostlarınız İçin")
    hero_title_line2 = models.CharField(max_length=200, verbose_name="Ana Başlık Satır 2", default="Kapsamlı Hizmetler")
    hero_description = models.TextField(verbose_name="Hero Açıklama", default="Modern ekipmanlarımız ve uzman veteriner kadromuzla evcil hayvanlarınızın sağlığı için her türlü hizmeti sunuyoruz.")
    hero_phone = models.CharField(max_length=50, verbose_name="Hero Telefon (Görünen)", default="(0212) 123 45 67")
    hero_phone_link = models.CharField(max_length=50, verbose_name="Hero Telefon Link (tel:)", default="+902121234567")

    # Feature Pills (3 items)
    feature_pills = models.JSONField(
        verbose_name="Özellik Pillleri",
        default=list,
        help_text='[{"icon": "🏥", "text": "Modern Klinik"}, {"icon": "⚡", "text": "7/24 Acil Servis"}, {"icon": "👨‍⚕️", "text": "Uzman Kadro"}]'
    )

    # Stats - 5 stats cards
    stats = models.JSONField(
        verbose_name="İstatistikler",
        default=list,
        help_text='[{"number": "21+", "label": "Hizmet Dalı", "icon": "🩺", "gradient": "from-emerald-500 to-cyan-500"}, ...]'
    )

    # CTA Section (Bottom)
    cta_title = models.CharField(max_length=200, verbose_name="CTA Başlık", default="Daha Fazla Bilgi İçin")
    cta_subtitle = models.CharField(max_length=200, verbose_name="CTA Alt Başlık", default="Bize Ulaşın")
    cta_description = models.TextField(verbose_name="CTA Açıklama", default="Size en uygun hizmeti bulmak ve randevu oluşturmak için 7/24 hizmetinizdeyiz")
    cta_phone = models.CharField(max_length=50, verbose_name="CTA Telefon", default="(0212) 123 45 67")

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Hizmetler Sayfası"
        verbose_name_plural = "Hizmetler Sayfası"

    def __str__(self):
        return "Hizmetler Sayfası İçeriği"

    def save(self, *args, **kwargs):
        # Only allow one instance
        self.pk = 1
        super().save(*args, **kwargs)

    @classmethod
    def get_instance(cls):
        obj, created = cls.objects.get_or_create(
            pk=1,
            defaults={
                'hero_title_line1': 'Evcil Dostlarınız İçin',
                'hero_title_line2': 'Kapsamlı Hizmetler',
                'hero_description': 'Modern ekipmanlarımız ve uzman veteriner kadromuzla evcil hayvanlarınızın sağlığı için her türlü hizmeti sunuyoruz.',
                'feature_pills': [
                    {'icon': '🏥', 'text': 'Modern Klinik'},
                    {'icon': '⚡', 'text': '7/24 Acil Servis'},
                    {'icon': '👨‍⚕️', 'text': 'Uzman Kadro'}
                ],
                'stats': [
                    {'number': '21+', 'label': 'Hizmet Dalı', 'icon': '🩺', 'gradient': 'from-emerald-500 to-cyan-500'},
                    {'number': '7/24', 'label': 'Acil Hizmet', 'icon': '⏰', 'gradient': 'from-blue-500 to-purple-500'},
                    {'number': '15+', 'label': 'Yıllık Deneyim', 'icon': '👨‍⚕️', 'gradient': 'from-emerald-500 to-cyan-500'},
                    {'number': '100%', 'label': 'Modern Ekipman', 'icon': '🏥', 'gradient': 'from-orange-500 to-pink-500'},
                    {'number': '10K+', 'label': 'Mutlu Hayvan', 'icon': '💚', 'gradient': 'from-green-500 to-emerald-500'}
                ],
                'cta_title': 'Daha Fazla Bilgi İçin',
                'cta_subtitle': 'Bize Ulaşın',
                'cta_description': 'Size en uygun hizmeti bulmak ve randevu oluşturmak için 7/24 hizmetinizdeyiz',
                'cta_phone': '(0212) 123 45 67'
            }
        )
        return obj


class SEOSettings(models.Model):
    """
    SEO Settings model for managing meta tags, descriptions, and keywords for different pages
    """
    PAGE_CHOICES = [
        ('homepage', 'Ana Sayfa'),
        ('services', 'Hizmetler'),
        ('blog', 'Blog'),
        ('about', 'Hakkımızda'),
        ('contact', 'İletişim'),
        ('global', 'Genel Ayarlar')
    ]

    page_name = models.CharField(
        max_length=50,
        choices=PAGE_CHOICES,
        unique=True,
        verbose_name="Sayfa"
    )

    # Meta Tags
    title = models.CharField(
        max_length=70,
        verbose_name="Meta Başlık",
        help_text="Optimal: 50-60 karakter",
        blank=True
    )
    description = models.CharField(
        max_length=170,
        verbose_name="Meta Açıklama",
        help_text="Optimal: 150-160 karakter",
        blank=True
    )
    keywords = models.CharField(
        max_length=500,
        verbose_name="Anahtar Kelimeler",
        help_text="Virgül ile ayırın",
        blank=True
    )

    # Open Graph
    og_image = models.CharField(
        max_length=500,
        verbose_name="Open Graph Görseli",
        default="/og-image.jpg",
        help_text="Önerilen: 1200x630px",
        blank=True
    )
    canonical = models.URLField(
        max_length=500,
        verbose_name="Canonical URL",
        blank=True
    )

    # Global Settings (only for page_name='global')
    site_name = models.CharField(
        max_length=200,
        verbose_name="Site Adı",
        blank=True,
        null=True
    )
    twitter_handle = models.CharField(
        max_length=100,
        verbose_name="Twitter Handle",
        blank=True,
        null=True
    )
    facebook_url = models.URLField(
        max_length=500,
        verbose_name="Facebook URL",
        blank=True,
        null=True
    )
    instagram_url = models.URLField(
        max_length=500,
        verbose_name="Instagram URL",
        blank=True,
        null=True
    )
    twitter_url = models.URLField(
        max_length=500,
        verbose_name="Twitter URL",
        blank=True,
        null=True
    )
    google_analytics_id = models.CharField(
        max_length=100,
        verbose_name="Google Analytics ID",
        blank=True,
        null=True
    )
    google_search_console_id = models.CharField(
        max_length=200,
        verbose_name="Google Search Console ID",
        blank=True,
        null=True
    )

    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "SEO Ayarı"
        verbose_name_plural = "SEO Ayarları"
        ordering = ['page_name']

    def __str__(self):
        return f"SEO - {self.get_page_name_display()}"


class GoogleReview(models.Model):
    """Google yorumları için model"""
    name = models.CharField(max_length=200, verbose_name="İsim")
    initial = models.CharField(max_length=2, verbose_name="İnisiyel", help_text="Örn: AB")
    rating = models.IntegerField(verbose_name="Puan", default=5, help_text="1-5 arası")
    text = models.TextField(verbose_name="Yorum Metni")
    date = models.CharField(max_length=50, verbose_name="Tarih", help_text="Örn: 2 hafta önce")
    verified = models.BooleanField(default=True, verbose_name="Doğrulanmış")
    local_guide = models.BooleanField(default=False, verbose_name="Yerel Rehber")
    is_active = models.BooleanField(default=True, verbose_name="Aktif")
    order = models.IntegerField(default=0, verbose_name="Sıra", help_text="Küçük numara önce gösterilir")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Google Yorumu"
        verbose_name_plural = "Google Yorumları"
        ordering = ['order', '-created_at']

    def __str__(self):
        return f"{self.name} - {self.rating}⭐"


class HomePage(models.Model):
    """Anasayfa için dinamik içerik modeli"""

    # Hero Section
    hero_title = models.CharField(max_length=200, verbose_name="Hero Başlık", default="İstanbul'un En Güvenilir Veteriner Kliniği")
    hero_subtitle = models.CharField(max_length=300, verbose_name="Hero Alt Başlık", default="Modern ekipmanlarımız ve uzman veteriner kadromuzla evcil dostlarınızın sağlığı için 7/24 hizmetinizdeyiz")
    hero_cta_text = models.CharField(max_length=50, verbose_name="Hero Buton Metni", default="Randevu Al")
    hero_cta_link = models.CharField(max_length=200, verbose_name="Hero Buton Linki", default="/randevu")
    hero_secondary_cta_text = models.CharField(max_length=50, verbose_name="İkincil Buton Metni", default="Hizmetlerimiz", blank=True)
    hero_secondary_cta_link = models.CharField(max_length=200, verbose_name="İkincil Buton Linki", default="/hizmetler", blank=True)

    # Stats Section
    show_stats = models.BooleanField(default=True, verbose_name="İstatistikleri Göster")
    stat1_number = models.CharField(max_length=20, verbose_name="İstatistik 1 Sayı", default="15+")
    stat1_label = models.CharField(max_length=100, verbose_name="İstatistik 1 Etiket", default="Yıllık Deneyim")
    stat2_number = models.CharField(max_length=20, verbose_name="İstatistik 2 Sayı", default="10,000+")
    stat2_label = models.CharField(max_length=100, verbose_name="İstatistik 2 Etiket", default="Mutlu Hayvan Sahibi")
    stat3_number = models.CharField(max_length=20, verbose_name="İstatistik 3 Sayı", default="7/24")
    stat3_label = models.CharField(max_length=100, verbose_name="İstatistik 3 Etiket", default="Acil Servis")
    stat4_number = models.CharField(max_length=20, verbose_name="İstatistik 4 Sayı", default="25+")
    stat4_label = models.CharField(max_length=100, verbose_name="İstatistik 4 Etiket", default="Uzman Veteriner")

    # Services Section
    show_services = models.BooleanField(default=True, verbose_name="Hizmetleri Göster")
    services_title = models.CharField(max_length=200, verbose_name="Hizmetler Başlık", default="Hizmetlerimiz")
    services_subtitle = models.CharField(max_length=300, verbose_name="Hizmetler Alt Başlık", default="Evcil dostlarınız için kapsamlı veteriner hizmetleri", blank=True)

    # Why Choose Us Section
    show_why_choose = models.BooleanField(default=True, verbose_name="Neden Biz Göster")
    why_choose_title = models.CharField(max_length=200, verbose_name="Neden Biz Başlık", default="Neden Biz?")
    why_choose_subtitle = models.CharField(max_length=300, verbose_name="Neden Biz Alt Başlık", default="Modern teknoloji ve sevgi dolu yaklaşımımızla fark yaratıyoruz", blank=True)
    why_choose_features = models.JSONField(
        verbose_name="Neden Biz Özellikleri",
        default=list,
        blank=True,
        help_text='[{"icon": "🏥", "title": "Modern Klinik", "description": "En son teknoloji ekipmanlar"}, ...]'
    )

    # About Section
    show_about = models.BooleanField(default=True, verbose_name="Hakkımızda Göster")
    about_title = models.CharField(max_length=200, verbose_name="Hakkımızda Başlık", default="Biz Kimiz?")
    about_description = models.TextField(verbose_name="Hakkımızda Açıklama", default="İstanbul'un güvenilir veteriner kliniği olarak evcil dostlarınızın sağlığı için hizmet veriyoruz.")
    about_cta_text = models.CharField(max_length=50, verbose_name="Hakkımızda Buton", default="Daha Fazla Bilgi")

    # Veterinarians Section
    show_veterinarians = models.BooleanField(default=True, verbose_name="Veterinerleri Göster")
    veterinarians_title = models.CharField(max_length=200, verbose_name="Veterinerler Başlık", default="Uzman Kadromuz")
    veterinarians_subtitle = models.CharField(max_length=300, verbose_name="Veterinerler Alt Başlık", default="Deneyimli ve uzman veteriner hekimlerimiz", blank=True)

    # Appointment CTA Section
    show_appointment_cta = models.BooleanField(default=True, verbose_name="Randevu CTA Göster")
    appointment_cta_title = models.CharField(max_length=200, verbose_name="Randevu CTA Başlık", default="Randevu Almaya Hazır mısınız?")
    appointment_cta_description = models.TextField(verbose_name="Randevu CTA Açıklama", default="Evcil dostunuz için hemen online randevu oluşturun")
    appointment_cta_button = models.CharField(max_length=50, verbose_name="Randevu Buton", default="Hemen Randevu Al")
    appointment_cta_phone = models.CharField(max_length=20, verbose_name="Randevu Telefon", default="(0212) 123 45 67")
    appointment_cta_phone_link = models.CharField(max_length=20, verbose_name="Randevu Telefon Link", default="+902121234567")
    appointment_cta_features = models.JSONField(
        verbose_name="Randevu Özellikleri",
        default=list,
        blank=True,
        help_text='[{"text": "Hızlı Randevu"}, {"text": "Uzman Kadro"}, {"text": "Modern Ekipman"}, {"text": "7/24 Hizmet"}]'
    )
    appointment_cta_stat1_number = models.CharField(max_length=20, verbose_name="Stat 1 Sayı", default="4.9")
    appointment_cta_stat1_label = models.CharField(max_length=50, verbose_name="Stat 1 Etiket", default="Google Puanı")
    appointment_cta_stat2_number = models.CharField(max_length=20, verbose_name="Stat 2 Sayı", default="5,000+")
    appointment_cta_stat2_label = models.CharField(max_length=50, verbose_name="Stat 2 Etiket", default="Mutlu Hayvan")
    appointment_cta_stat3_number = models.CharField(max_length=20, verbose_name="Stat 3 Sayı", default="15+")
    appointment_cta_stat3_label = models.CharField(max_length=50, verbose_name="Stat 3 Etiket", default="Uzman Veteriner")

    # Google Reviews Section
    show_reviews = models.BooleanField(default=True, verbose_name="Yorumları Göster")
    reviews_title = models.CharField(max_length=200, verbose_name="Yorumlar Başlık", default="Müşteri Yorumları")
    reviews_subtitle = models.CharField(max_length=300, verbose_name="Yorumlar Alt Başlık", default="Google'da aldığımız gerçek müşteri değerlendirmeleri", blank=True)
    reviews_rating = models.CharField(max_length=10, verbose_name="Ortalama Puan", default="4.9")
    reviews_count = models.CharField(max_length=20, verbose_name="Toplam Yorum", default="250+")
    reviews_cta_text = models.CharField(max_length=100, verbose_name="Yorumlar Buton", default="Tüm Yorumları Google'da Gör")
    reviews_cta_link = models.URLField(verbose_name="Yorumlar Buton Link", default="https://www.google.com/maps", blank=True)

    # Blog Section
    show_blog = models.BooleanField(default=True, verbose_name="Blog Göster")
    blog_title = models.CharField(max_length=200, verbose_name="Blog Başlık", default="Blog Yazılarımız")
    blog_subtitle = models.CharField(max_length=300, verbose_name="Blog Alt Başlık", default="Evcil hayvan bakımı hakkında faydalı bilgiler", blank=True)

    # Contact Section
    show_contact = models.BooleanField(default=True, verbose_name="İletişim Göster")
    contact_title = models.CharField(max_length=200, verbose_name="İletişim Başlık", default="Bize Ulaşın")
    contact_description = models.TextField(verbose_name="İletişim Açıklama", default="Sorularınız için bizimle iletişime geçin")

    # Meta
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Anasayfa"
        verbose_name_plural = "Anasayfa"

    def __str__(self):
        return "Anasayfa İçeriği"

    def save(self, *args, **kwargs):
        # Only allow one instance
        self.pk = 1
        super().save(*args, **kwargs)

    @classmethod
    def get_instance(cls):
        obj, created = cls.objects.get_or_create(pk=1)
        return obj


class SiteSettings(models.Model):
    """Site genel ayarları - Singleton model"""
    # Header Ayarları
    site_title = models.CharField(max_length=200, verbose_name="Site Başlığı", default="Veteriner Kliniği")
    site_logo_image = models.ImageField(upload_to="logos/", verbose_name="Logo Resmi", blank=True, null=True, help_text="Logo resmi yükleyin (Tavsiye edilen: 200x200px)")
    site_logo_text = models.CharField(max_length=100, verbose_name="Logo Metni", default="Veteriner", blank=True)
    site_logo_subtitle = models.CharField(max_length=100, verbose_name="Logo Alt Yazısı", default="Veteriner Kliniği", blank=True)
    site_logo_emoji = models.CharField(max_length=10, verbose_name="Logo Emoji", default="🐾", blank=True, help_text="Logo resmi yoksa emoji gösterilir")

    # İletişim Bilgileri
    contact_phone = models.CharField(max_length=20, verbose_name="Telefon Numarası", default="(0212) 123 45 67")
    contact_phone_link = models.CharField(max_length=20, verbose_name="Telefon Link", default="+902121234567")
    contact_whatsapp = models.CharField(max_length=20, verbose_name="WhatsApp Numarası", default="+905001234567", blank=True, help_text="Uluslararası format: +90...")
    contact_email = models.EmailField(verbose_name="E-posta", default="info@veteriner.com")
    contact_address = models.TextField(verbose_name="Adres", default="Kadıköy, İstanbul")

    # Footer Ayarları
    footer_about_text = models.TextField(
        verbose_name="Footer Hakkında Metni",
        default="Sevimli dostlarınızın sağlığı için modern ekipman ve deneyimli kadromuzla 7/24 hizmetinizdeyiz. Onların mutluluğu bizim önceliğimiz."
    )
    footer_facebook_url = models.URLField(verbose_name="Facebook URL", blank=True, default="https://facebook.com/veteriner")
    footer_instagram_url = models.URLField(verbose_name="Instagram URL", blank=True, default="https://instagram.com/veteriner")
    footer_twitter_url = models.URLField(verbose_name="Twitter URL", blank=True, default="https://twitter.com/veteriner")

    # Çalışma Saatleri
    working_hours_weekday = models.CharField(max_length=100, verbose_name="Hafta İçi", default="09:00 - 18:00")
    working_hours_weekend = models.CharField(max_length=100, verbose_name="Hafta Sonu", default="10:00 - 16:00")
    working_hours_info = models.CharField(max_length=200, verbose_name="Ek Bilgi", default="7/24 Acil Servis")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Site Ayarları"
        verbose_name_plural = "Site Ayarları"

    def __str__(self):
        return "Site Ayarları"

    def save(self, *args, **kwargs):
        # Only allow one instance (Singleton pattern)
        self.pk = 1
        super().save(*args, **kwargs)

    @classmethod
    def get_instance(cls):
        obj, created = cls.objects.get_or_create(pk=1)
        return obj
