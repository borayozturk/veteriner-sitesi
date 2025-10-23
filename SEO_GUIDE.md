# 🚀 PetKey Veteriner - SEO Optimizasyon Rehberi

## ✅ Yapılan İyileştirmeler

### 1. Temel SEO Bileşenleri
- ✅ SEO Component (`src/components/common/SEO.jsx`)
- ✅ react-helmet-async kurulumu
- ✅ HelmetProvider App.jsx'e eklendi
- ✅ prop-types paketi kuruldu

### 2. Meta Tags (Tüm Sayfalarda)
- ✅ Title tags (her sayfa için özel)
- ✅ Meta descriptions (anahtar kelime zengin)
- ✅ Meta keywords
- ✅ Canonical URLs
- ✅ Robots meta tags
- ✅ Language meta tag
- ✅ Theme color

### 3. Open Graph & Social Media
- ✅ Open Graph tags (Facebook, LinkedIn)
- ✅ Twitter Card tags
- ✅ OG images
- ✅ OG descriptions
- ✅ OG titles

### 4. Structured Data (JSON-LD)
Tüm ana sayfalara eklendi:
- ✅ **Home**: VeterinaryCare schema + ratings
- ✅ **Blog**: Blog schema + publisher
- ✅ **Services**: MedicalBusiness + service catalog
- ✅ **About**: AboutPage + organization
- ✅ **Appointment**: MedicalBusiness + ReserveAction

### 5. SEO Dosyaları
- ✅ `robots.txt` - Crawler yönetimi
- ✅ `sitemap.xml` - Site haritası

### 6. SEO Utility Fonksiyonları
- ✅ Dynamic sitemap generator
- ✅ FAQ schema generator
- ✅ LocalBusiness schema
- ✅ Breadcrumb schema
- ✅ Article schema (blog posts)
- ✅ Person schema (veterinarians)
- ✅ Slug generator (Turkish support)
- ✅ Keyword extractor

### 7. Yeni Bileşenler
- ✅ Breadcrumbs component
- ✅ FAQ Section component

---

## 🔥 SEO'yu Daha da Güçlendirme Stratejileri

### A. İçerik Optimizasyonu

#### 1. **Keyword Research**
```
Ana Hedef Kelimeler:
- veteriner İstanbul
- veteriner kliniği
- acil veteriner
- 7/24 veteriner
- kedi veterineri
- köpek veterineri
- evcil hayvan doktoru

Long-tail Keywords:
- "gece veteriner açık"
- "pazar günü veteriner"
- "İstanbul en iyi veteriner"
- "uygun fiyat veteriner"
```

#### 2. **Blog Stratejisi**
Her hafta en az 2 blog yazısı:
- Evcil hayvan bakımı
- Hastalık belirtileri
- Beslenme tavsiyeleri
- Aşı takvimleri
- Mevsimsel ipuçları

#### 3. **Lokal SEO**
```javascript
// İletişim sayfasında Google My Business entegrasyonu
- Google Maps widget
- Adres ve yol tarifi
- Çalışma saatleri
- Yorumlar widget
```

### B. Teknik SEO İyileştirmeleri

#### 1. **Sayfa Hızı Optimizasyonu**
```javascript
// vite.config.js'ye ekle:
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          animations: ['framer-motion'],
        }
      }
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true
      }
    }
  }
}
```

#### 2. **Image Optimization**
- WebP formatına geçiş
- Lazy loading implementasyonu
- Alt text optimizasyonu
- Image sitemap oluşturma

#### 3. **Core Web Vitals**
- LCP (Largest Contentful Paint) < 2.5s
- FID (First Input Delay) < 100ms
- CLS (Cumulative Layout Shift) < 0.1

### C. Schema.org Genişletme

#### Blog Posts için Article Schema
```javascript
// BlogDetail.jsx'e ekle
import { generateArticleSchema } from '../utils/seoUtils';

const articleSchema = generateArticleSchema({
  title: post.title,
  excerpt: post.excerpt,
  image: post.featured_image,
  published_at: post.published_at,
  updated_at: post.updated_at,
  author: post.author_name,
  slug: post.slug
});
```

#### Veterinarians için Person Schema
```javascript
// VetProfile.jsx'e ekle
import { generatePersonSchema } from '../utils/seoUtils';

const personSchema = generatePersonSchema({
  name: vet.name,
  title: vet.title,
  bio: vet.bio,
  avatar: vet.avatar,
  specialty: vet.specialty
});
```

### D. Link Building Stratejileri

#### 1. **Internal Linking**
- Blog yazılarından hizmet sayfalarına link
- Hizmet sayfalarından randevu sayfasına
- Ana sayfadan tüm önemli sayfalara

#### 2. **External Links**
- Yerel dizinler (Google My Business, Yandex)
- Veteriner dernekleri
- Evcil hayvan siteleri
- Sosyal medya profilleri

### E. Local SEO (Yerel SEO)

#### Google My Business Optimize
```
✓ İşletme adı: PetKey Veteriner Kliniği
✓ Kategori: Veteriner Kliniği
✓ Adres: Tam adres bilgisi
✓ Telefon: +90 212 123 45 67
✓ Website: https://petkey.com
✓ Çalışma saatleri: 7/24 Açık
✓ Fotoğraflar: Klinik, kadro, mutlu hayvanlar
✓ Yorumlar: Müşterilerden düzenli yorum topla
```

#### NAP Consistency
```
Tüm platformlarda aynı bilgiler:
- Name (Ad): PetKey Veteriner Kliniği
- Address (Adres): [Tam Adres]
- Phone (Telefon): +90 212 123 45 67
```

### F. Sosyal Medya Sinyalleri

```javascript
// Sosyal medya paylaşım butonları ekle
<div className="social-share">
  <a href={`https://facebook.com/sharer/sharer.php?u=${url}`}>
    Facebook'ta Paylaş
  </a>
  <a href={`https://twitter.com/intent/tweet?url=${url}&text=${title}`}>
    Twitter'da Paylaş
  </a>
  <a href={`https://wa.me/?text=${title} ${url}`}>
    WhatsApp'ta Paylaş
  </a>
</div>
```

---

## 📊 SEO Performans Takibi

### Kullanılması Gereken Araçlar

1. **Google Search Console**
   - Site kayıt
   - Sitemap gönderimi
   - İndexleme kontrolü
   - Arama performansı

2. **Google Analytics 4**
   - Trafik analizi
   - Kullanıcı davranışları
   - Dönüşüm takibi

3. **Google PageSpeed Insights**
   - Sayfa hızı analizi
   - Core Web Vitals
   - Mobile usability

4. **Schema Markup Validator**
   - Structured data kontrolü
   - Rich snippets preview

### Hedef Metrikler

```
🎯 İlk 3 Ay:
- Organik trafik: +50%
- Anahtar kelime sıralaması: İlk 3 sayfada
- Backlink sayısı: +20
- Domain Authority: 20+

🎯 6 Ay:
- Organik trafik: +150%
- Anahtar kelime sıralaması: İlk sayfada
- Backlink sayısı: +50
- Domain Authority: 30+
```

---

## 🛠 Acil Yapılacaklar

### Yüksek Öncelik
1. ✅ SEO component oluştur
2. ✅ Meta tags ekle
3. ✅ Structured data ekle
4. ✅ Robots.txt ve sitemap.xml oluştur
5. ⏳ Google Search Console'a kayıt
6. ⏳ Google Analytics kurulumu
7. ⏳ Image optimization (WebP)
8. ⏳ Lazy loading implementasyonu

### Orta Öncelik
9. ⏳ Blog yazıları ekleme (haftada 2)
10. ⏳ FAQ section ekleme
11. ⏳ Breadcrumbs tüm sayfalara
12. ⏳ Internal linking stratejisi
13. ⏳ Alt text optimizasyonu

### Düşük Öncelik
14. ⏳ Sosyal medya paylaşım butonları
15. ⏳ Schema markup genişletme
16. ⏳ Link building
17. ⏳ Local directories kayıt

---

## 💡 Best Practices

### Title Tags
```
Format: [Keyword] | PetKey Veteriner
Uzunluk: 50-60 karakter
Örnek: "Acil Veteriner Hizmeti 7/24 | PetKey Veteriner İstanbul"
```

### Meta Descriptions
```
Uzunluk: 150-160 karakter
Call-to-action içermeli
Anahtar kelime doğal şekilde geçmeli
Örnek: "İstanbul'un en güvenilir veteriner kliniği. 7/24 acil hizmet, uzman kadro, modern ekipman. Hemen randevu alın! ☎ 0212 123 45 67"
```

### URL Structure
```
✓ İyi: /blog/kedi-asi-takvimi
✗ Kötü: /blog/post?id=123

✓ İyi: /hizmetler/genel-muayene
✗ Kötü: /services.php?cat=1
```

### Image Alt Text
```
✓ İyi: alt="Golden Retriever köpek aşı uygulaması"
✗ Kötü: alt="image1.jpg"
```

---

## 🔍 Competitor Analysis

### Analiz Edilecek Rakipler
1. Bölgedeki diğer veteriner klinikleri
2. Büyük şehirdeki tanınmış veterinerler
3. Online veteriner danışmanlık siteleri

### Analiz Kriterleri
- Hangi anahtar kelimelerde ranklanıyorlar?
- Ne tür içerik üretiyorlar?
- Backlink stratejileri neler?
- Sosyal medya varlıkları nasıl?

---

## 📈 Sonuç

Bu rehber doğrultusunda yapılan optimizasyonlarla:
- Google'da daha üst sıralarda yer alacaksınız
- Organik trafik artacak
- Dönüşüm oranları yükselecek
- Brand awareness güçlenecek
- Rekabet avantajı elde edeceksiniz

**Önemli:** SEO uzun vadeli bir stratejidir. İlk sonuçlar 3-6 ay içinde görülmeye başlar.
