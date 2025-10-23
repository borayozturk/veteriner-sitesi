# -*- coding: utf-8 -*-
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'petkey_api.settings')
django.setup()

from api.models import PageContent

# Delete all pages
PageContent.objects.all().delete()

# Create pages with proper UTF-8 encoding
pages_data = [
    {'page_name': 'yurtdisi-cikis', 'title': 'Yurtdışı Çıkış İşlemleri', 'content': 'Yurtdışına çıkış için gerekli tüm veteriner işlemleri.'},
    {'page_name': 'kalp-muayenesi', 'title': 'Kalp Muayenesi', 'content': 'Evcil dostlarınızın kalp sağlığı için detaylı muayene.'},
    {'page_name': 'check-up', 'title': 'Check-Up', 'content': 'Kapsamlı genel sağlık kontrolü ve tetkikler.'},
    {'page_name': 'kuduz-titrasyon-testi', 'title': 'Kuduz Titrasyon Testi', 'content': 'Kuduz aşısı etkinliğini ölçen laboratuvar testi.'},
    {'page_name': 'asilama', 'title': 'Aşılama', 'content': 'Dostlarınızı hastalıklardan korumak için düzenli aşılama programı.'},
    {'page_name': 'laboratuvar-hizmetleri', 'title': 'Laboratuvar Hizmetleri', 'content': 'Tam donanımlı laboratuvar ve testler.'},
    {'page_name': 'cerrahi-operasyonlar', 'title': 'Cerrahi Operasyonlar', 'content': 'Modern ameliyathane ve deneyimli ekip.'},
    {'page_name': 'parazit-tedavisi', 'title': 'Parazit Tedavisi', 'content': 'İç ve dış parazit tedavi ve korunma.'},
    {'page_name': 'dogum-ve-jinekoloji', 'title': 'Doğum ve Jinekoloji', 'content': 'Gebelik takibi ve doğum hizmetleri.'},
    {'page_name': 'viral-hastaliklar', 'title': 'Viral Hastalıklar', 'content': 'Viral enfeksiyonların teşhis ve tedavisi.'},
    {'page_name': 'goruntuleme-hizmetleri', 'title': 'Görüntüleme Hizmetleri', 'content': 'Röntgen, ultrason ve diğer görüntüleme.'},
    {'page_name': 'mikrocip-implantasyonu', 'title': 'Mikroçip İmplantasyonu', 'content': 'Güvenli ve hızlı mikroçip uygulaması.'},
    {'page_name': 'kedi-kopek-konaklama', 'title': 'Kedi & Köpek Konaklama', 'content': 'Konforlu ve güvenli pet oteli hizmeti.'},
    {'page_name': 'mama', 'title': 'Mama ve Besin Desteği', 'content': 'Kaliteli mama ve takviye ürünleri.'},
    {'page_name': 'pet-kuafor', 'title': 'Pet Kuaför', 'content': 'Profesyonel tıraş ve bakım hizmetleri.'},
    {'page_name': 'pet-malzeme', 'title': 'Pet Malzeme', 'content': 'Kaliteli pet ürünleri ve aksesuarlar.'},
    {'page_name': 'vaccinated-pets', 'title': 'Aşılı Hayvan Sertifikası', 'content': 'Resmi aşı sertifikası düzenleme.'},
]

for page_data in pages_data:
    page = PageContent.objects.create(**page_data)
    print(f'Created: {page.page_name} - {page.title}')

print(f'\nTotal pages: {PageContent.objects.count()}')

# Verify one page
pc = PageContent.objects.filter(page_name='asilama').first()
if pc:
    print(f'\nVerify asilama page:')
    print(f'Title: {pc.title}')
    print(f'Content: {pc.content}')
