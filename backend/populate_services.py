# -*- coding: utf-8 -*-
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'petkey_api.settings')
django.setup()

from api.models import Service

# Delete existing services
Service.objects.all().delete()

# Service data from services.js
services_data = [
    {'slug': 'yurtdisi-cikis', 'icon': '✈️', 'title': 'Yurtdışı Çıkış İşlemleri', 'short_description': 'Sevimli dostlarınızla yurt dışına seyahat etmek için gerekli tüm veteriner işlemleri.', 'order': 1},
    {'slug': 'kalp-muayenesi', 'icon': '❤️', 'title': 'Kalp Muayenesi', 'short_description': 'Evcil hayvanınızın kalp sağlığının detaylı kontrolü ve erken teşhis.', 'order': 2},
    {'slug': 'check-up', 'icon': '🔍', 'title': 'Check-Up', 'short_description': 'Kapsamlı sağlık kontrolü ile dostunuzun sağlığını koruma altına alın.', 'order': 3},
    {'slug': 'kuduz-titrasyon-testi', 'icon': '🧪', 'title': 'Kuduz Titrasyon Testi', 'short_description': 'AB ülkelerine seyahat için zorunlu kuduz antikor düzeyi testi.', 'order': 4},
    {'slug': 'asilama', 'icon': '💉', 'title': 'Aşılama', 'short_description': 'Dostlarınızı hastalıklardan korumak için düzenli aşılama programı.', 'order': 5},
    {'slug': 'cerrahi-operasyonlar', 'icon': '⚕️', 'title': 'Cerrahi Operasyonlar', 'short_description': 'Güvenli Müdahale, Hızlı İyileşme', 'order': 6},
    {'slug': 'parazit-tedavisi', 'icon': '🦠', 'title': 'Parazit Tedavisi', 'short_description': 'İç ve dış parazitlere karşı etkili koruma ve tedavi.', 'order': 7},
    {'slug': 'laboratuvar-hizmetleri', 'icon': '🔬', 'title': 'Laboratuvar Hizmetleri', 'short_description': 'Modern ekipmanlarla hızlı ve güvenilir laboratuvar testleri.', 'order': 8},
    {'slug': 'dogum-ve-jinekoloji', 'icon': '🤱', 'title': 'Doğum ve Jinekoloji', 'short_description': 'Gebelik takibi ve doğum sürecinde profesyonel destek.', 'order': 9},
    {'slug': 'viral-hastaliklar', 'icon': '🦠', 'title': 'Viral Hastalıklar', 'short_description': 'Viral enfeksiyonların teşhisi ve tedavisi.', 'order': 10},
    {'slug': 'goruntuleme-hizmetleri', 'icon': '📡', 'title': 'Görüntüleme Hizmetleri', 'short_description': 'Röntgen, ultrason ve ileri görüntüleme teknolojileri.', 'order': 11},
    {'slug': 'mikrocip-implantasyonu', 'icon': '📍', 'title': 'Mikroçip İmplantasyonu', 'short_description': 'Evcil hayvanınızın güvenliği için mikroçip uygulaması.', 'order': 12},
    {'slug': 'kedi-kopek-konaklama', 'icon': '🏠', 'title': 'Kedi & Köpek Konaklaması', 'short_description': 'Veteriner gözetiminde güvenli ve konforlu konaklama.', 'order': 13},
    {'slug': 'mama', 'icon': '🍖', 'title': 'Mama ve Besin Desteği', 'short_description': 'Kaliteli mama ve besin takviyesi ürünleri.', 'order': 14},
    {'slug': 'pet-kuafor', 'icon': '✂️', 'title': 'Pet Kuaför', 'short_description': 'Profesyonel tıraş, banyo ve bakım hizmetleri.', 'order': 15},
    {'slug': 'pet-malzeme', 'icon': '🎾', 'title': 'Pet Malzeme', 'short_description': 'Evcil hayvanınız için kaliteli ürünler ve aksesuarlar.', 'order': 16},
    {'slug': 'vaccinated-pets', 'icon': '🛡️', 'title': 'Aşılı Hayvan Sertifikası', 'short_description': 'Aşılama kayıtlarının resmi belgelerle tespit edilmesi.', 'order': 17},
]

# Create services
for service_data in services_data:
    service = Service.objects.create(**service_data)
    print(f'[OK] {service.title} - {service.slug}')

print(f'\n[SUCCESS] Toplam {Service.objects.count()} hizmet eklendi!')
