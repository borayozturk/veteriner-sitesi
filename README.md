# 🐾 PetKey Veteriner Kliniği

Modern, responsive ve kullanıcı dostu veteriner kliniği web sitesi. React.js ve Tailwind CSS ile geliştirilmiştir.

![React](https://img.shields.io/badge/React-18.3-blue?logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css)
![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-Latest-FF0055)

## ✨ Özellikler

### 🎨 Ultra Modern 2025+ UI/UX Tasarım
- **2025+ Standartları**: En güncel tasarım trendlerinin üzerinde
- **Gerçek Pet Fotoğrafları**: Unsplash'ten yüksek kaliteli fotoğraflar
- **Glassmorphism & Blur Effects**: Modern cam efekti ve blur animasyonları
- **Micro-interactions**: Hover ve tıklama animasyonları
- **3D Card Effects**: Kartlarda derinlik ve gölge efektleri
- **Gradient Scrollbar**: Özel renklendirilmiş scrollbar
- **Responsive**: Tüm cihazlarda pixel-perfect görünüm

### 🚀 Teknik Özellikler
- ⚡ **Vite**: Hızlı geliştirme ve build
- ⚛️ **React 18**: En son React özellikleri
- 🎨 **Tailwind CSS**: Utility-first CSS framework
- 🎭 **Framer Motion**: Profesyonel animasyonlar
- 🧭 **React Router**: SPA routing
- 📱 **Fully Responsive**: Mobil öncelikli tasarım
- 🎯 **SEO Friendly**: Optimize edilmiş sayfa yapısı

### 📄 Sayfalar

#### 🏠 Ana Sayfa
- Hero section (animasyonlu)
- İstatistikler (15+ Veteriner, 5000+ Mutlu Dost)
- Özellikler showcase
- Öne çıkan hizmetler (ilk 6)
- Neden biz bölümü
- CTA (Call-to-Action) alanı

#### 🏥 Hizmetler Sayfası
- 17 farklı veteriner hizmeti
- Grid layout
- Filtrelenebilir kartlar
- Hover efektleri

#### 📋 Hizmet Detay Sayfaları
Her hizmet için özel detay sayfası:
1. **Yurtdışı Çıkış İşlemleri** - Seyahat evrakları
2. **Kalp Muayenesi** - EKG, Ekokardiyografi
3. **Check-Up** - Kapsamlı sağlık kontrolü
4. **Kuduz Titrasyon Testi** - AB ülkeleri için
5. **Aşılama** - Karma, kuduz ve diğer aşılar
6. **Cerrahi Operasyonlar** - Kısırlaştırma, ortopedi
7. **Parazit Tedavisi** - İç/dış parazit
8. **Laboratuvar Hizmetleri** - Kan, idrar testleri
9. **Doğum ve Jinekoloji** - Gebelik takibi
10. **Viral Hastalıklar** - Parvo, distemper tedavisi
11. **Görüntüleme Hizmetleri** - Röntgen, ultrason
12. **Mikroçip İmplantasyonu** - Pet tracking
13. **Kedi & Köpek Konaklaması** - Pet hotel
14. **Mama ve Besin Desteği** - Premium mamalar
15. **Pet Kuaför** - Tıraş, banyo, bakım
16. **Pet Malzeme** - Oyuncak, aksesuar
17. **Aşılı Hayvan Sertifikası** - Resmi belgeler

#### ℹ️ Hakkımızda
- Klinik hikayesi
- Değerlerimiz
- Uzman kadro (4 veteriner hekim)
- Misyon ve vizyon

#### 🖼️ Galeri
- Kategorize edilmiş galeri
- Filtreleme sistemi
- Responsive grid layout
- Hover efektleri

#### 📰 Blog
- 6+ makale
- Kategori badge'leri
- Yazar ve tarih bilgisi
- Pagination

## 🛠️ Teknolojiler

```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.x",
    "framer-motion": "^11.x",
    "react-icons": "^5.x"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.3",
    "tailwindcss": "^3.4.15",
    "postcss": "^8.4.49",
    "autoprefixer": "^10.4.20",
    "vite": "^5.4.11"
  }
}
```

## 🎨 Renk Paleti

```javascript
colors: {
  primary: {
    DEFAULT: '#2B1354',  // Koyu mor
    light: '#4A2680',
    dark: '#1A0B33',
  },
  secondary: {
    DEFAULT: '#FF8F30',  // Turuncu
    light: '#FFB366',
    dark: '#E67A1A',
  },
  accent: {
    DEFAULT: '#7DBB00',  // Yeşil
    light: '#9AD633',
    dark: '#5E8C00',
  }
}
```

## 📦 Kurulum

### Gereksinimler
- Node.js 16+
- npm veya yarn

### Adımlar

1. **Projeyi klonlayın:**
```bash
git clone <repository-url>
cd petkey-veteriner
```

2. **Bağımlılıkları yükleyin:**
```bash
npm install
```

3. **Geliştirme sunucusunu başlatın:**
```bash
npm run dev
```

4. **Tarayıcıda açın:**
```
http://localhost:5173
```

## 🏗️ Build

**Production build oluşturma:**
```bash
npm run build
```

**Build önizleme:**
```bash
npm run preview
```

## 📁 Proje Yapısı

```
petkey-veteriner/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.jsx         # Ana navigasyon
│   │   │   └── Footer.jsx         # Footer
│   │   └── common/
│   │       └── ServiceCard.jsx    # Hizmet kartı
│   ├── pages/
│   │   ├── Home.jsx               # Ana sayfa
│   │   ├── Services.jsx           # Hizmetler listesi
│   │   ├── ServiceDetail.jsx      # Hizmet detayı
│   │   ├── About.jsx              # Hakkımızda
│   │   ├── Gallery.jsx            # Galeri
│   │   └── Blog.jsx               # Blog
│   ├── data/
│   │   └── services.js            # Hizmet verileri
│   ├── App.jsx                    # Ana component
│   ├── main.jsx                   # Entry point
│   └── index.css                  # Global styles
├── public/                        # Static dosyalar
├── tailwind.config.js             # Tailwind yapılandırması
├── vite.config.js                 # Vite yapılandırması
└── package.json
```

## 🎯 Component Detayları

### Header
- Sticky navigation
- Mobil responsive hamburger menu
- Scroll ile background değişimi
- Üst bar (telefon, email, adres)

### Footer
- 4 sütunlu layout
- Hızlı linkler
- Sosyal medya linkleri
- İletişim bilgileri

### ServiceCard
- Hover animasyonları
- Icon display
- Link to detail page
- Responsive design

## 🚀 Performans

- ⚡ Vite kullanımı ile hızlı HMR
- 🎨 Tailwind CSS JIT modu
- 🔄 Code splitting (React Router)
- 📦 Optimized production build
- 🖼️ Lazy loading ready

## 🌐 Tarayıcı Desteği

- ✅ Chrome (son 2 versiyon)
- ✅ Firefox (son 2 versiyon)
- ✅ Safari (son 2 versiyon)
- ✅ Edge (son 2 versiyon)

## 📱 Responsive Breakpoints

```css
sm: 640px   /* Mobil */
md: 768px   /* Tablet */
lg: 1024px  /* Laptop */
xl: 1280px  /* Desktop */
2xl: 1536px /* Large Desktop */
```

## 🎨 Özelleştirme

### Renkleri Değiştirme
`tailwind.config.js` dosyasındaki `colors` objesini düzenleyin.

### Font Değiştirme
`src/index.css` dosyasındaki Google Fonts import'unu değiştirin.

### İçerik Güncelleme
`src/data/services.js` dosyasındaki hizmet verilerini güncelleyin.

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 👨‍💻 Geliştirici

React.js ve Tailwind CSS ile ❤️ ile geliştirildi.

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'feat: Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📞 İletişim

Sorularınız için: info@petkeyveteriner.com

---

**Not**: Bu proje petkeyveteriner.com sitesinin modern React.js versiyonudur. 2025 UI/UX standartlarına uygun olarak tasarlanmıştır.
