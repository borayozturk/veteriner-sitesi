# 🚀 PetKey Veteriner - Deployment Rehberi

## Render.com ile Tek Platform Deployment (ÖNERİLEN)

Render.com hem backend hem frontend'i ücretsiz olarak barındırabilirsiniz.

---

## 📋 Ön Hazırlık

### 1. GitHub'a Yükleyin

```bash
# Git repo oluşturun (eğer yoksa)
git init
git add .
git commit -m "Initial commit"

# GitHub'da yeni repo oluşturun ve bağlayın
git remote add origin https://github.com/KULLANICI_ADINIZ/petkey-veteriner.git
git branch -M main
git push -u origin main
```

---

## 🔧 Backend Deployment (Django)

### Adım 1: Render'da PostgreSQL Oluşturun

1. [render.com](https://render.com) adresine gidin
2. **"New +"** → **"PostgreSQL"** seçin
3. Ayarlar:
   - **Name**: `petkey-database`
   - **Database**: `petkey_db`
   - **User**: `petkey_user`
   - **Region**: Frankfurt (Avrupa için)
   - **Plan**: Free
4. **"Create Database"** tıklayın
5. **Internal Database URL**'i kopyalayın (sonra lazım olacak)

### Adım 2: Backend Web Service Oluşturun

1. **"New +"** → **"Web Service"** seçin
2. GitHub repository'nizi bağlayın ve seçin
3. Ayarlar:
   - **Name**: `petkey-backend`
   - **Region**: Frankfurt
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `./build.sh`
   - **Start Command**: `gunicorn petkey_api.wsgi:application`
   - **Plan**: Free

4. **Environment Variables** (Advanced sekmesi):
```
DEBUG=False
SECRET_KEY=django-insecure-BURAYA-GUVENLİ-BİR-ANAHTAR-YAZIN-123456789
ALLOWED_HOSTS=.onrender.com
CORS_ALLOWED_ORIGINS=https://petkey-frontend.onrender.com
CSRF_TRUSTED_ORIGINS=https://petkey-frontend.onrender.com
DATABASE_URL=[PostgreSQL Internal URL'i buraya yapıştırın]
```

5. **"Create Web Service"** tıklayın
6. Deploy tamamlandığında backend URL'inizi not edin:
   ```
   https://petkey-backend.onrender.com
   ```

---

## 🎨 Frontend Deployment (React)

### Adım 1: Frontend için Static Site Oluşturun

1. **"New +"** → **"Static Site"** seçin
2. Aynı GitHub repository'yi seçin
3. Ayarlar:
   - **Name**: `petkey-frontend`
   - **Root Directory**: `.` (boş bırakın veya `/`)
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
   - **Auto-Deploy**: Yes

4. **Environment Variables**:
```
VITE_API_URL=https://petkey-backend.onrender.com
```

5. **"Create Static Site"** tıklayın

---

## ✅ Deployment Sonrası

### Backend'i Test Edin

```bash
# Admin paneline girin
https://petkey-backend.onrender.com/admin

# API'yi test edin
https://petkey-backend.onrender.com/api/
```

### Frontend'i Test Edin

```
https://petkey-frontend.onrender.com
```

### İlk Kullanıcı Oluşturun

Render dashboard'da backend servisinize gidin → **"Shell"** sekmesi:

```bash
python manage.py createsuperuser
```

---

## 🌐 Kendi Domain Adınızı Bağlama

### Frontend için:

1. Render dashboard → Frontend siteniz → **"Settings"**
2. **"Custom Domain"** bölümüne gidin
3. Domain'inizi ekleyin (örn: `www.petkeyveteriner.com`)
4. DNS kayıtlarını ayarlayın (Render size gösterecek)

### Backend için:

1. Backend servisinize gidin → **"Settings"**
2. **"Custom Domain"** ekleyin (örn: `api.petkeyveteriner.com`)
3. Frontend environment variables'ı güncelleyin:
   ```
   VITE_API_URL=https://api.petkeyveteriner.com
   ```

---

## 🔒 Güvenlik Önerileri

### 1. SECRET_KEY Oluşturun

Python shell'de:
```python
from django.core.management.utils import get_random_secret_key
print(get_random_secret_key())
```

Bu çıktıyı Render environment variables'da `SECRET_KEY` olarak kullanın.

### 2. ALLOWED_HOSTS Güncelleyin

```
ALLOWED_HOSTS=petkey-backend.onrender.com,api.petkeyveteriner.com
```

### 3. CORS Ayarlarını Güncelleyin

```
CORS_ALLOWED_ORIGINS=https://petkey-frontend.onrender.com,https://www.petkeyveteriner.com
CSRF_TRUSTED_ORIGINS=https://petkey-frontend.onrender.com,https://www.petkeyveteriner.com
```

---

## 🐛 Sorun Giderme

### Build Başarısız Olursa

Render logs'lara bakın:
- Backend: Dashboard → petkey-backend → **"Logs"**
- Frontend: Dashboard → petkey-frontend → **"Logs"**

### Yaygın Hatalar:

**1. ModuleNotFoundError**
```bash
# requirements.txt eksik paket varsa
pip freeze > backend/requirements.txt
```

**2. Static Files 404**
```bash
# Render shell'de
python manage.py collectstatic --no-input
```

**3. Database Bağlantı Hatası**
- DATABASE_URL'in doğru olduğundan emin olun
- PostgreSQL servisinin çalıştığından emin olun

**4. CORS Hatası**
- CORS_ALLOWED_ORIGINS'e frontend URL'ini ekleyin
- CSRF_TRUSTED_ORIGINS'e frontend URL'ini ekleyin

---

## 💰 Maliyet

- **Free Plan**: Her ikisi de ücretsiz!
  - Backend: 750 saat/ay (yeterli)
  - Frontend: Sınırsız
  - PostgreSQL: 90 gün sonra otomatik silinir (Paid plan gerekir)

- **Hobby Plan** ($7/ay/servis):
  - PostgreSQL kalıcı olur
  - Daha fazla RAM ve CPU
  - Kendi domain kullanabilirsiniz

---

## 🎉 Tamamdır!

Artık siteniz yayında:
- **Frontend**: https://petkey-frontend.onrender.com
- **Backend**: https://petkey-backend.onrender.com
- **Admin Panel**: https://petkey-backend.onrender.com/admin

---

## 📚 Alternatif Platformlar

### Railway.app
- Benzer Render'a
- Daha kolay kurulum
- $5/ay'dan başlayan ücretli planlar

### DigitalOcean App Platform
- Daha gelişmiş özellikler
- $5/ay'dan başlayan planlar

### Vercel + Railway
- Frontend: Vercel (ücretsiz)
- Backend: Railway (ücretsiz deneme)

---

## 🔄 Güncelleme Yapma

Her GitHub push'unda otomatik deploy olur. Manuel deploy için:

1. Render Dashboard → Servisiniz → **"Manual Deploy"** → **"Deploy latest commit"**

---

## 📞 Destek

Sorun yaşarsanız:
- Render Docs: https://render.com/docs
- Django Docs: https://docs.djangoproject.com/en/5.2/howto/deployment/
