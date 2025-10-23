# -*- coding: utf-8 -*-
from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from api.models import Veterinarian, BlogPost, Appointment, ContactMessage, PageContent, GalleryImage


class Command(BaseCommand):
    help = "Seed the database with sample data"

    def handle(self, *args, **kwargs):
        self.stdout.write("Seeding database...")

        # Clear existing data
        self.stdout.write("Clearing existing data...")
        Veterinarian.objects.all().delete()
        BlogPost.objects.all().delete()
        Appointment.objects.all().delete()
        ContactMessage.objects.all().delete()
        PageContent.objects.all().delete()
        GalleryImage.objects.all().delete()

        # Veterinarians
        self.stdout.write("Creating veterinarians...")
        vet1 = Veterinarian.objects.create(
            name="Dr. Ayse Yilmaz",
            specialty="Genel Veteriner Hekim",
            bio="15 yildir evcil hayvan sagligi alaninda hizmet vermekteyim. Kedi ve kopeklerin ic hastaliklari konusunda uzmanim.",
            experience_years=15,
            education="Istanbul Universitesi Veteriner Fakultesi",
            certifications="Veteriner Hekimlik Diplomasi, Ic Hastaliklari Sertifikasi",
            phone="+90 532 111 2233",
            email="ayse.yilmaz@petkey.com"
        )

        vet2 = Veterinarian.objects.create(
            name="Dr. Mehmet Demir",
            specialty="Cerrahi Uzmani",
            bio="Veteriner cerrahisi alaninda 10 yillik deneyim. Ortopedik ve yumusak doku cerrahisi konusunda uzmanim.",
            experience_years=10,
            education="Ankara Universitesi Veteriner Fakultesi",
            certifications="Cerrahi Uzmanlik Belgesi, Anestezi Sertifikasi",
            phone="+90 532 444 5566",
            email="mehmet.demir@petkey.com"
        )

        vet3 = Veterinarian.objects.create(
            name="Dr. Zeynep Kaya",
            specialty="Kedi Hastaliklari Uzmani",
            bio="Kedi hastaliklari ve davranis problemleri konusunda uzmanlasmis veteriner hekim.",
            experience_years=8,
            education="Ege Universitesi Veteriner Fakultesi",
            certifications="Kedi Hastaliklari Sertifikasi",
            phone="+90 532 777 8899",
            email="zeynep.kaya@petkey.com"
        )

        vet4 = Veterinarian.objects.create(
            name="Dr. Can Ozturk",
            specialty="Ortopedi Uzmani",
            bio="Hayvan ortopedisi ve travmatoloji alaninda uzman veteriner hekim.",
            experience_years=12,
            education="Uludag Universitesi Veteriner Fakultesi",
            certifications="Ortopedi Uzmanlik Belgesi",
            phone="+90 532 999 0011",
            email="can.ozturk@petkey.com"
        )
        
        # Blog Posts
        self.stdout.write("Creating blog posts...")
        BlogPost.objects.create(
            author=vet1,
            title="Kopeklerde Asi Takvimi: Ne Zaman Hangi Asi?",
            excerpt="Yeni sahiplendiginiz kopeginizin saglikli kalmasi icin asi takvimini takip etmek cok onemli. Bu yazida tum detaylari bulabilirsiniz.",
            content="""Kopeginizin saglikli bir yasam surmes icin asi takvimini duzgun takip etmek hayati onem tasiyor.

6-8 Haftalik: Distemper, Parvovirus, Adenovirus
10-12 Haftalik: DHPP (Kombinasyon asisi), Leptospiroz
14-16 Haftalik: DHPP rapeli, Kuduz asisi

Yetiskin kopekler icin yillik rapel asilari unutmayin!""",
            category="Saglik",
            tags="asi, kopek, saglik, koruyucu bakim",
            status="published",
            views=256,
            published_at=timezone.now() - timedelta(days=15)
        )

        BlogPost.objects.create(
            author=vet3,
            title="Kedilerde Kum Kabi Egitimi: Ipuclari ve Puf Noktalari",
            excerpt="Yeni kedi sahibi misiniz? Kum kabi egitimi konusunda bilmeniz gereken her sey burada.",
            content="""Kediler dogal olarak temiz hayvanlardir. Dogru kum kabi secimi ve yerlestirme ile egitim cok kolay olabilir.

Ideal kum kabi ozelikleri:
- Kedinin rahatca donebilecegi buyuklukde
- Acik veya kapali (kedinin tercihine gore)
- Kolay temizlenebilir

Kum kabi sayisi: Evinizde bulunan kedi sayisi + 1 adet olmaldir.""",
            category="Bakim",
            tags="kedi, egitim, kum kabi, temizlik",
            status="published",
            views=189,
            published_at=timezone.now() - timedelta(days=10)
        )

        BlogPost.objects.create(
            author=vet2,
            title="Evcil Hayvaninizin Kisirlastirilmasi: Faydalarive Surec",
            excerpt="Kisirlastrma operasyonu hakkinda merak ettikleriniz ve bu islemin faydlari.",
            content="""Kisirlastrma, evcil hayvaninizin ureme yetenegini ortadan kaldiran cerrahi bir islemdir.

Saglik Faydalari:
- Meme tumoru riskini %95 azaltir
- Rahim iltihabi riskini ortadan kaldirir
- Prostat problemlerini onler

Davranissal Faydalar:
- Saldrganligi azaltir
- Kacma egilimini azaltir

Dogru zaman: Kopekler 6-12 aylik, Kediler 5-6 aylikken.""",
            category="Saglik",
            tags="kisirlastrma, cerrahi, saglik",
            status="published",
            views=167,
            published_at=timezone.now() - timedelta(days=7)
        )

        BlogPost.objects.create(
            author=vet1,
            title="Kis Aylarinda Evcil Hayvan Bakimi",
            excerpt="Soguk havalarda evcil hayvaninizin sagligini korumak icin nelere dikkat etmelisiniz?",
            content="""Kis aylari evcil hayvanlarimiz icin zorlu olabilir.

Beslenme: Soguk havalarda enerji ihtiyaci artar. Ozellikle disarida vakit geciren hayvanlar icin porsiyon miktarini artirabilirsiniz.

Pati Bakimi: Kar ve tuz patileri tahris edebilir. Yuruyusten sonra patileri ilik suyla temizleyin.

Barinak: Disarida kalan hayvanlar icin uygun barinak saglayin.""",
            category="Bakim",
            tags="kis, bakim, beslenme, pati",
            status="published",
            views=143,
            published_at=timezone.now() - timedelta(days=3)
        )

        BlogPost.objects.create(
            author=vet4,
            title="Kopeklerde Eklem Sagligi ve Artrit",
            excerpt="Yasli kopeklerde eklem problemleri ve artrit tedavisi hakkinda bilmeniz gerekenler.",
            content="""Yaslilik ile birlikte kopeklerde eklem problemleri siklasmaktadir.

Belirtiler:
- Hareket etmede zorluk
- Merdiven cikmaktan kacinma
- Topallik
- Uyandiktan sonra sertlik

Tedavi: Ilac tedavisi, fizik tedavi, beslenme desteği ve gerekirse cerrahi mudahale.""",
            category="Saglik",
            tags="kopek, eklem, artrit, yasli",
            status="published",
            views=98,
            published_at=timezone.now() - timedelta(days=1)
        )
        
        # Appointments
        self.stdout.write("Creating appointments...")
        today = timezone.now().date()
        Appointment.objects.create(
            veterinarian=vet1,
            pet_name="Pamuk",
            pet_type="Kopek",
            pet_breed="Golden Retriever",
            pet_age="3 yas",
            owner_name="Ali Yilmaz",
            owner_email="ali@example.com",
            owner_phone="+90 532 123 4567",
            date=today + timedelta(days=2),
            time="10:00",
            service="Genel Muayene",
            notes="Aylik kontrol randevusu",
            status="confirmed"
        )

        Appointment.objects.create(
            veterinarian=vet3,
            pet_name="Minosh",
            pet_type="Kedi",
            pet_breed="Tekir",
            pet_age="2 yas",
            owner_name="Ayse Demir",
            owner_email="ayse@example.com",
            owner_phone="+90 532 234 5678",
            date=today + timedelta(days=1),
            time="14:30",
            service="Asi",
            notes="Yillik kuduz asisi",
            status="confirmed"
        )

        Appointment.objects.create(
            veterinarian=vet2,
            pet_name="Karabash",
            pet_type="Kopek",
            pet_breed="Kangal",
            pet_age="5 yas",
            owner_name="Mehmet Kaya",
            owner_email="mehmet@example.com",
            owner_phone="+90 532 345 6789",
            date=today + timedelta(days=3),
            time="11:00",
            service="Cerrahi Operasyon",
            notes="Kisirlastirma operasyonu",
            status="pending"
        )

        Appointment.objects.create(
            veterinarian=vet4,
            pet_name="Luna",
            pet_type="Kopek",
            pet_breed="Husky",
            pet_age="4 yas",
            owner_name="Selin Arslan",
            owner_email="selin@example.com",
            owner_phone="+90 532 456 7891",
            date=today + timedelta(days=5),
            time="15:00",
            service="Ortopedi Muayenesi",
            status="pending"
        )

        Appointment.objects.create(
            veterinarian=vet1,
            pet_name="Boncuk",
            pet_type="Kedi",
            pet_breed="Van Kedisi",
            pet_age="1 yas",
            owner_name="Emre Yildirim",
            owner_email="emre@example.com",
            owner_phone="+90 532 567 8902",
            date=today - timedelta(days=2),
            time="09:30",
            service="Genel Muayene",
            status="completed"
        )

        # Contact Messages
        self.stdout.write("Creating contact messages...")
        ContactMessage.objects.create(
            name="Fatma Sahin",
            email="fatma@example.com",
            phone="+90 532 456 7890",
            subject="Randevu Degisikligi",
            message="Merhaba, yarinki randevumu ertelemem gerekiyor. Musait oldugunuzda beni arayabilir misiniz?",
            status="new"
        )

        ContactMessage.objects.create(
            name="Can Ozturk",
            email="can@example.com",
            phone="+90 532 567 8901",
            subject="Acil Durum",
            message="Kedim yemek yemiyor ve cok halsiz. Bugun muayene olabilir miyiz?",
            status="read",
            admin_reply="Merhaba Can Bey, bugun saat 16:00'da randevu ayarladik. Lutfen klinige geliniz."
        )

        ContactMessage.objects.create(
            name="Elif Yilmaz",
            email="elif@example.com",
            phone="+90 532 678 9012",
            subject="Fiyat Bilgisi",
            message="Kopek kisirlastirma operasyonu icin fiyat bilgisi alabilir miyim?",
            status="new"
        )

        ContactMessage.objects.create(
            name="Burak Celik",
            email="burak@example.com",
            phone="+90 532 789 0123",
            subject="Tesekkur",
            message="Kopegimin operasyonu cok basarili gecti. Tum ekibe tesekkur ederim.",
            status="replied",
            admin_reply="Tesekkur ederiz! Kopgenizin sagligi bizim icin en onemli oncelik."
        )
        
        # Gallery Images
        self.stdout.write("Creating gallery images...")

        # Dogs
        dog_images = [
            'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800',
            'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800',
            'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=800',
            'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=800',
            'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800',
            'https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=800',
            'https://images.unsplash.com/photo-1534361960057-19889db9621e?w=800',
            'https://images.unsplash.com/photo-1588943211346-0908a1fb0b01?w=800',
        ]

        for idx, img_url in enumerate(dog_images):
            GalleryImage.objects.create(
                title=f"Mutlu Kopek {idx + 1}",
                description="Klinigimizde tedavi goren sevimli dostumuz",
                image=img_url,
                category="dogs",
                tags="kopek, tedavi, saglik",
                order=idx,
                is_active=True
            )

        # Cats
        cat_images = [
            'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800',
            'https://images.unsplash.com/photo-1519052537078-e6302a4968d4?w=800',
            'https://images.unsplash.com/photo-1573865526739-10c1de0b6c78?w=800',
            'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800',
            'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=800',
            'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=800',
            'https://images.unsplash.com/photo-1571566882372-1598d88abd90?w=800',
            'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=800',
        ]

        for idx, img_url in enumerate(cat_images):
            GalleryImage.objects.create(
                title=f"Sevimli Kedi {idx + 1}",
                description="Kedi bakim hizmetlerimizden bir kare",
                image=img_url,
                category="cats",
                tags="kedi, bakim, muayene",
                order=idx,
                is_active=True
            )

        # Clinic
        clinic_images = [
            'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=800',
            'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=800',
            'https://images.unsplash.com/photo-1581888227599-779811939961?w=800',
        ]

        for idx, img_url in enumerate(clinic_images):
            GalleryImage.objects.create(
                title=f"Klinigimiz {idx + 1}",
                description="Modern ekipmanlarimiz ve steril ortamimiz",
                image=img_url,
                category="clinic",
                tags="klinik, ekipman, hijyen",
                order=idx,
                is_active=True
            )

        # Team
        team_images = [
            'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800',
            'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800',
            'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=800',
            'https://images.unsplash.com/photo-1612531386530-97286d97c2d2?w=800',
        ]

        for idx, img_url in enumerate(team_images):
            GalleryImage.objects.create(
                title=f"Ekibimiz {idx + 1}",
                description="Uzman veteriner hekimlerimiz",
                image=img_url,
                category="team",
                tags="ekip, veteriner, uzman",
                order=idx,
                is_active=True
            )

        # Page Content
        self.stdout.write("Creating page content...")
        PageContent.objects.create(
            page_name="about",
            title="Hakkimizda",
            content="PetKey Veteriner Klinigi 2010 yilindan beri Istanbul Kadikoy'de hizmet vermektedir. Modern ekipmanlarimiz ve deneyimli kadromuzla evcil dostlarinizin sagligi icin calisiyoruz."
        )

        PageContent.objects.create(
            page_name="services",
            title="Hizmetlerimiz",
            content="""- Genel Muayene ve Kontrol
- Asilama Programlari
- Cerrahi Operasyonlar
- Dis Temizligi ve Tedavisi
- Laboratuvar Hizmetleri
- Ultrason ve Rontgen
- Acil Mudahale
- Petshop Urunleri"""
        )

        PageContent.objects.create(
            page_name="emergency",
            title="Acil Durum Bilgileri",
            content="""7/24 Acil Hat: +90 532 000 0000

Acil durumlarda lutfen bizi arayin. Gece vardiyamiz her zaman hizmette."""
        )

        self.stdout.write(self.style.SUCCESS("Database seeded successfully!"))
        self.stdout.write(f'Created:')
        self.stdout.write(f'  - 4 Veterinarians')
        self.stdout.write(f'  - 5 Blog Posts')
        self.stdout.write(f'  - 5 Appointments')
        self.stdout.write(f'  - 4 Contact Messages')
        self.stdout.write(f'  - 27 Gallery Images')
        self.stdout.write(f'  - 3 Page Contents')
