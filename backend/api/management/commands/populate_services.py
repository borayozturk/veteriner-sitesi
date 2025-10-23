from django.core.management.base import BaseCommand
from api.models import PageContent

class Command(BaseCommand):
    help = 'Populate PageContent with all service detail pages'

    def handle(self, *args, **kwargs):
        services = [
            {
                'slug': 'yurtdisi-cikis',
                'title': 'Yurtdışı Çıkış İşlemleri',
                'description': '''<div class="space-y-6">
<h2 class="text-2xl font-bold text-gray-900">Yurtdışı Çıkış İşlemleri</h2>
<p>Sevimli dostlarınızla yurt dışına seyahat için gerekli tüm veteriner işlemleri.</p>

<h3 class="text-xl font-semibold mt-4">Özellikler:</h3>
<ul class="list-disc pl-6 space-y-2">
<li>Uluslararası Sağlık Sertifikası</li>
<li>AB Uyumlu Pet Pasaportu</li>
<li>Kuduz Aşısı ve Titrasyon</li>
<li>Mikroçip Takılması</li>
<li>Ülkeye Özel Gereksinimler</li>
</ul>

<h3 class="text-xl font-semibold mt-4">İşlem Süreci:</h3>
<ol class="list-decimal pl-6 space-y-2">
<li>Randevu Alın - Online veya telefonla randevu oluşturun</li>
<li>Gerekli Belgeler - Mevcut aşı kartı ve kimlik belgelerinizi getirin</li>
<li>Veteriner Muayene - Detaylı sağlık kontrolü yapılır</li>
<li>Belge Düzenleme - Tüm resmi evraklar hazırlanır</li>
<li>Teslim - Evraklarınızı teslim alın ve yolculuğa hazır olun</li>
</ol>
</div>'''
            },
            {
                'slug': 'kalp-muayenesi',
                'title': 'Kalp Muayenesi',
                'description': '''<div class="space-y-6">
<h2 class="text-2xl font-bold text-gray-900">Kalp Muayenesi</h2>
<p>Evcil hayvanınızın kardiyovasküler sağlığını detaylı olarak değerlendiriyoruz.</p>

<h3 class="text-xl font-semibold mt-4">Özellikler:</h3>
<ul class="list-disc pl-6 space-y-2">
<li>EKG İncelemesi</li>
<li>Ekokardiyografi</li>
<li>Kardiyak Auskültasyon</li>
<li>Kan Basıncı Ölçümü</li>
<li>Kardiyak Biyobelirteç Testleri</li>
</ul>

<h3 class="text-xl font-semibold mt-4">İşlem Süreci:</h3>
<ol class="list-decimal pl-6 space-y-2">
<li>Randevu Alın</li>
<li>Klinik Muayene</li>
<li>Görüntüleme Testleri</li>
<li>Sonuç Değerlendirme</li>
<li>Tedavi Planı Oluşturma</li>
</ol>
</div>'''
            },
            {
                'slug': 'check-up',
                'title': 'Check-Up',
                'description': '''<div class="space-y-6">
<h2 class="text-2xl font-bold text-gray-900">Genel Sağlık Check-Up</h2>
<p>Evcil dostunuzun sağlığını düzenli olarak kontrol ettirmek hastalıkların erken teşhisi için önemlidir.</p>

<h3 class="text-xl font-semibold mt-4">Özellikler:</h3>
<ul class="list-disc pl-6 space-y-2">
<li>Tam Fizik Muayene</li>
<li>Kan Tahlilleri</li>
<li>İdrar Analizi</li>
<li>Dışkı Analizi</li>
<li>Radyolojik Kontrol</li>
</ul>

<h3 class="text-xl font-semibold mt-4">İşlem Süreci:</h3>
<ol class="list-decimal pl-6 space-y-2">
<li>Randevu Alın</li>
<li>Genel Muayene</li>
<li>Laboratuvar Testleri</li>
<li>Sonuçların Değerlendirilmesi</li>
<li>Sağlık Raporu Teslimi</li>
</ol>
</div>'''
            },
            {
                'slug': 'kuduz-titrasyon-testi',
                'title': 'Kuduz Titrasyon Testi',
                'description': '''<div class="space-y-6">
<h2 class="text-2xl font-bold text-gray-900">Kuduz Titrasyon Testi</h2>
<p>Yurtdışı seyahatler için gerekli olan kuduz antikor seviyesinin ölçümü.</p>

<h3 class="text-xl font-semibold mt-4">Özellikler:</h3>
<ul class="list-disc pl-6 space-y-2">
<li>FAVN Test Metodu</li>
<li>AB Onaylı Laboratuvar</li>
<li>Hızlı Sonuç Süreci</li>
<li>Uluslararası Geçerlilik</li>
<li>Resmi Sertifikalandırma</li>
</ul>

<h3 class="text-xl font-semibold mt-4">İşlem Süreci:</h3>
<ol class="list-decimal pl-6 space-y-2">
<li>Randevu Alın</li>
<li>Kan Örneği Alımı</li>
<li>Laboratuvar Gönderimi</li>
<li>Test Analizi (10-14 gün)</li>
<li>Sonuç Belgesi Teslimi</li>
</ol>
</div>'''
            },
            {
                'slug': 'asilama',
                'title': 'Aşılama',
                'description': '''<div class="space-y-6">
<h2 class="text-2xl font-bold text-gray-900">Aşılama Hizmetleri</h2>
<p>Evcil hayvanınızı hastalıklardan korumak için düzenli aşılama programları.</p>

<h3 class="text-xl font-semibold mt-4">Özellikler:</h3>
<ul class="list-disc pl-6 space-y-2">
<li>Kuduz Aşısı</li>
<li>Karma Aşılar (5'li, 7'li)</li>
<li>Kedi Lösemi Aşısı</li>
<li>Kene ve Pire Aşıları</li>
<li>Aşı Takip Kartı</li>
</ul>

<h3 class="text-xl font-semibold mt-4">İşlem Süreci:</h3>
<ol class="list-decimal pl-6 space-y-2">
<li>Randevu Alın</li>
<li>Sağlık Kontrolü</li>
<li>Aşı Uygulaması</li>
<li>Kayıt ve Takip</li>
<li>Hatırlatma Sistemi</li>
</ol>
</div>'''
            },
            {
                'slug': 'cerrahi-operasyonlar',
                'title': 'Cerrahi Operasyonlar',
                'description': '''<div class="space-y-6">
<h2 class="text-2xl font-bold text-gray-900">Cerrahi Operasyonlar</h2>
<p>Modern ameliyathane ve deneyimli ekibimizle tüm cerrahi müdahaleler.</p>

<h3 class="text-xl font-semibold mt-4">Özellikler:</h3>
<ul class="list-disc pl-6 space-y-2">
<li>Sterilizasyon (Kısırlaştırma)</li>
<li>Yumuşak Doku Cerrahisi</li>
<li>Ortopedik Operasyonlar</li>
<li>Tümör Ameliyatları</li>
<li>Diş Cerrahisi</li>
</ul>

<h3 class="text-xl font-semibold mt-4">İşlem Süreci:</h3>
<ol class="list-decimal pl-6 space-y-2">
<li>Ön Muayene ve Değerlendirme</li>
<li>Ameliyat Öncesi Testler</li>
<li>Operasyon Planlaması</li>
<li>Cerrahi Müdahale</li>
<li>Ameliyat Sonrası Bakım</li>
</ol>
</div>'''
            },
            {
                'slug': 'parazit-tedavisi',
                'title': 'Parazit Tedavisi',
                'description': '''<div class="space-y-6">
<h2 class="text-2xl font-bold text-gray-900">Parazit Tedavisi</h2>
<p>İç ve dış parazitlere karşı kapsamlı koruma ve tedavi programları.</p>

<h3 class="text-xl font-semibold mt-4">Özellikler:</h3>
<ul class="list-disc pl-6 space-y-2">
<li>İç Parazit Tedavisi</li>
<li>Pire ve Kene Kontrolü</li>
<li>Kalp Kurdu Testi ve Tedavisi</li>
<li>Dışkı Analizi</li>
<li>Koruyucu İlaç Uygulamaları</li>
</ul>

<h3 class="text-xl font-semibold mt-4">İşlem Süreci:</h3>
<ol class="list-decimal pl-6 space-y-2">
<li>Muayene ve Teşhis</li>
<li>Parazit Testi</li>
<li>İlaç Uygulaması</li>
<li>Kontrol Muayeneleri</li>
<li>Koruyucu Program Planı</li>
</ol>
</div>'''
            },
            {
                'slug': 'laboratuvar-hizmetleri',
                'title': 'Laboratuvar Hizmetleri',
                'description': '''<div class="space-y-6">
<h2 class="text-2xl font-bold text-gray-900">Laboratuvar Hizmetleri</h2>
<p>Modern laboratuvar teknolojisi ile hızlı ve güvenilir test sonuçları.</p>

<h3 class="text-xl font-semibold mt-4">Özellikler:</h3>
<ul class="list-disc pl-6 space-y-2">
<li>Tam Kan Sayımı</li>
<li>Biyokimya Panelleri</li>
<li>Hormon Testleri</li>
<li>İdrar ve Dışkı Analizi</li>
<li>Mikrobiyolojik Testler</li>
</ul>

<h3 class="text-xl font-semibold mt-4">İşlem Süreci:</h3>
<ol class="list-decimal pl-6 space-y-2">
<li>Örnek Alımı</li>
<li>Laboratuvar İşleme</li>
<li>Sonuç Analizi</li>
<li>Veteriner Yorumu</li>
<li>Rapor Teslimi</li>
</ol>
</div>'''
            },
            {
                'slug': 'dogum-ve-jinekoloji',
                'title': 'Doğum ve Jinekoloji',
                'description': '''<div class="space-y-6">
<h2 class="text-2xl font-bold text-gray-900">Doğum ve Jinekoloji</h2>
<p>Üreme sağlığı, gebelik takibi ve doğum hizmetleri.</p>

<h3 class="text-xl font-semibold mt-4">Özellikler:</h3>
<ul class="list-disc pl-6 space-y-2">
<li>Gebelik Ultrasonu</li>
<li>Doğum Yardımı</li>
<li>Sezaryen Operasyonu</li>
<li>Üreme Sistemi Muayenesi</li>
<li>Yavru Bakımı Danışmanlığı</li>
</ul>

<h3 class="text-xl font-semibold mt-4">İşlem Süreci:</h3>
<ol class="list-decimal pl-6 space-y-2">
<li>Gebelik Kontrolü</li>
<li>Düzenli Takip</li>
<li>Doğum Öncesi Hazırlık</li>
<li>Doğum Süreci</li>
<li>Doğum Sonrası Bakım</li>
</ol>
</div>'''
            },
            {
                'slug': 'viral-hastaliklar',
                'title': 'Viral Hastalıklar',
                'description': '''<div class="space-y-6">
<h2 class="text-2xl font-bold text-gray-900">Viral Hastalıklar Tedavisi</h2>
<p>Viral enfeksiyonların teşhis, tedavi ve önlenmesi.</p>

<h3 class="text-xl font-semibold mt-4">Özellikler:</h3>
<ul class="list-disc pl-6 space-y-2">
<li>Parvovirus Tedavisi</li>
<li>Distemper Tedavisi</li>
<li>Kedi AIDS (FIV)</li>
<li>Kedi Lösemi (FeLV)</li>
<li>Hızlı Test Kitleri</li>
</ul>

<h3 class="text-xl font-semibold mt-4">İşlem Süreci:</h3>
<ol class="list-decimal pl-6 space-y-2">
<li>Belirti Değerlendirmesi</li>
<li>Hızlı Test Uygulaması</li>
<li>Tedavi Protokolü</li>
<li>Destek Bakımı</li>
<li>Takip Muayeneleri</li>
</ol>
</div>'''
            },
            {
                'slug': 'goruntuleme-hizmetleri',
                'title': 'Görüntüleme Hizmetleri',
                'description': '''<div class="space-y-6">
<h2 class="text-2xl font-bold text-gray-900">Görüntüleme Hizmetleri</h2>
<p>Dijital röntgen, ultrason ve diğer görüntüleme teknikleri.</p>

<h3 class="text-xl font-semibold mt-4">Özellikler:</h3>
<ul class="list-disc pl-6 space-y-2">
<li>Dijital Röntgen</li>
<li>Ultrasonografi</li>
<li>Endoskopi</li>
<li>EKG</li>
<li>Radyolojik Değerlendirme</li>
</ul>

<h3 class="text-xl font-semibold mt-4">İşlem Süreci:</h3>
<ol class="list-decimal pl-6 space-y-2">
<li>Klinik Değerlendirme</li>
<li>Görüntüleme Seçimi</li>
<li>İşlem Uygulaması</li>
<li>Görüntü Analizi</li>
<li>Sonuç Raporlama</li>
</ol>
</div>'''
            },
            {
                'slug': 'mikrocip-implantasyonu',
                'title': 'Mikroçip İmplantasyonu',
                'description': '''<div class="space-y-6">
<h2 class="text-2xl font-bold text-gray-900">Mikroçip İmplantasyonu</h2>
<p>Evcil hayvanınızın kalıcı kimlik tanımlaması ve kayıt sistemi.</p>

<h3 class="text-xl font-semibold mt-4">Özellikler:</h3>
<ul class="list-disc pl-6 space-y-2">
<li>ISO Standart Mikroçip</li>
<li>Ağrısız Uygulama</li>
<li>Resmi Kayıt Sistemi</li>
<li>Uluslararası Tanıma</li>
<li>Kayıp-Bulma Güvencesi</li>
</ul>

<h3 class="text-xl font-semibold mt-4">İşlem Süreci:</h3>
<ol class="list-decimal pl-6 space-y-2">
<li>Randevu ve Kayıt</li>
<li>Mikroçip Yerleştirme</li>
<li>Sistem Kaydı</li>
<li>Belge Düzenleme</li>
<li>Sahiplik Tescili</li>
</ol>
</div>'''
            },
            {
                'slug': 'kedi-kopek-konaklama',
                'title': 'Kedi & Köpek Konaklaması',
                'description': '''<div class="space-y-6">
<h2 class="text-2xl font-bold text-gray-900">Kedi & Köpek Konaklaması</h2>
<p>Güvenli, konforlu ve hijyenik ortamda evcil hayvan pansiyon hizmeti.</p>

<h3 class="text-xl font-semibold mt-4">Özellikler:</h3>
<ul class="list-disc pl-6 space-y-2">
<li>Bireysel Odalar</li>
<li>24/7 Veteriner Gözetimi</li>
<li>Özel Beslenme Programı</li>
<li>Oyun ve Sosyalleşme</li>
<li>Günlük Video Raporları</li>
</ul>

<h3 class="text-xl font-semibold mt-4">İşlem Süreci:</h3>
<ol class="list-decimal pl-6 space-y-2">
<li>Rezervasyon Yapın</li>
<li>Sağlık Kontrolü</li>
<li>Check-in İşlemi</li>
<li>Konaklama Dönemi</li>
<li>Check-out ve Teslim</li>
</ol>
</div>'''
            },
            {
                'slug': 'mama',
                'title': 'Mama ve Besin Desteği',
                'description': '''<div class="space-y-6">
<h2 class="text-2xl font-bold text-gray-900">Mama ve Besin Desteği</h2>
<p>Premium kalite mama ve besin takviyesi ürünleri.</p>

<h3 class="text-xl font-semibold mt-4">Özellikler:</h3>
<ul class="list-disc pl-6 space-y-2">
<li>Veteriner Diyeti Mamaları</li>
<li>Yaş ve Cins Özel Ürünler</li>
<li>Vitamin ve Mineraller</li>
<li>Beslenme Danışmanlığı</li>
<li>Özel Diyet Programları</li>
</ul>

<h3 class="text-xl font-semibold mt-4">İşlem Süreci:</h3>
<ol class="list-decimal pl-6 space-y-2">
<li>Beslenme Değerlendirmesi</li>
<li>Ürün Önerisi</li>
<li>Mama Seçimi</li>
<li>Kullanım Talimatları</li>
<li>Takip ve Ayarlama</li>
</ol>
</div>'''
            },
            {
                'slug': 'pet-kuafor',
                'title': 'Pet Kuaför',
                'description': '''<div class="space-y-6">
<h2 class="text-2xl font-bold text-gray-900">Pet Kuaför Hizmetleri</h2>
<p>Profesyonel tımar ve bakım hizmetleri.</p>

<h3 class="text-xl font-semibold mt-4">Özellikler:</h3>
<ul class="list-disc pl-6 space-y-2">
<li>Tüy Kesimi ve Şekillendirme</li>
<li>Yıkama ve Kurutma</li>
<li>Tırnak Kesimi</li>
<li>Kulak Temizliği</li>
<li>Cins Özel Tımar</li>
</ul>

<h3 class="text-xl font-semibold mt-4">İşlem Süreci:</h3>
<ol class="list-decimal pl-6 space-y-2">
<li>Randevu Alın</li>
<li>Tımar Değerlendirmesi</li>
<li>Bakım İşlemleri</li>
<li>Görsel Sonuç</li>
<li>Bakım Önerileri</li>
</ol>
</div>'''
            },
            {
                'slug': 'pet-malzeme',
                'title': 'Pet Malzeme',
                'description': '''<div class="space-y-6">
<h2 class="text-2xl font-bold text-gray-900">Pet Malzeme Satışı</h2>
<p>Evcil hayvanınız için kaliteli ürün ve aksesuarlar.</p>

<h3 class="text-xl font-semibold mt-4">Özellikler:</h3>
<ul class="list-disc pl-6 space-y-2">
<li>Oyuncak ve Eğlence</li>
<li>Tasma, Gezdirme Setleri</li>
<li>Mama-Su Kapları</li>
<li>Yatak ve Taşıma Çantası</li>
<li>Hijyen Ürünleri</li>
</ul>

<h3 class="text-xl font-semibold mt-4">İşlem Süreci:</h3>
<ol class="list-decimal pl-6 space-y-2">
<li>Ürün Keşfi</li>
<li>Danışmanlık</li>
<li>Ürün Seçimi</li>
<li>Satın Alma</li>
<li>Kullanım Rehberi</li>
</ol>
</div>'''
            },
            {
                'slug': 'vaccinated-pets',
                'title': 'Aşılı Hayvan Sertifikası',
                'description': '''<div class="space-y-6">
<h2 class="text-2xl font-bold text-gray-900">Aşılı Hayvan Sertifikası</h2>
<p>Resmi aşı belgesi ve sertifika düzenleme hizmeti.</p>

<h3 class="text-xl font-semibold mt-4">Özellikler:</h3>
<ul class="list-disc pl-6 space-y-2">
<li>Resmi Aşı Belgesi</li>
<li>Dijital Kayıt Sistemi</li>
<li>QR Kodlu Sertifika</li>
<li>Aşı Geçmişi Takibi</li>
<li>Uluslararası Geçerlilik</li>
</ul>

<h3 class="text-xl font-semibold mt-4">İşlem Süreci:</h3>
<ol class="list-decimal pl-6 space-y-2">
<li>Aşı Kontrolü</li>
<li>Kayıt İşlemi</li>
<li>Sertifika Hazırlama</li>
<li>Onay ve İmzalama</li>
<li>Belge Teslimi</li>
</ol>
</div>'''
            }
        ]

        created_count = 0
        updated_count = 0

        for service in services:
            page_name = service['slug']
            title = service['title']
            content = service['description']

            # Check if page already exists
            page, created = PageContent.objects.update_or_create(
                page_name=page_name,
                defaults={
                    'title': title,
                    'content': content
                }
            )

            if created:
                created_count += 1
                self.stdout.write(self.style.SUCCESS(f'[+] Created: {page_name} - {title}'))
            else:
                updated_count += 1
                self.stdout.write(self.style.WARNING(f'[*] Updated: {page_name} - {title}'))

        self.stdout.write(self.style.SUCCESS(f'\nComplete! Created: {created_count}, Updated: {updated_count}'))
