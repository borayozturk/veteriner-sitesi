# ✅ Deployment Checklist - Render.com

## 📋 Yayına Alma Adımları

### 1️⃣ GitHub'a Yükleyin

```bash
git init
git add .
git commit -m "Ready for deployment"
git branch -M main
git remote add origin https://github.com/KULLANICI_ADINIZ/petkey-veteriner.git
git push -u origin main
```

---

### 2️⃣ Render.com'a Kayıt Olun

1. [render.com](https://render.com) → Sign Up with GitHub
2. GitHub hesabınızı bağlayın

---

### 3️⃣ PostgreSQL Oluşturun (5 dakika)

1. Dashboard → **New +** → **PostgreSQL**
2. Ayarlar:
   - Name: `petkey-database`
   - Database: `petkey_db`
   - Region: **Frankfurt**
   - Plan: **Free**
3. **Create Database**
4. ✅ **Internal Database URL'i kopyalayın** (sonra lazım)

---

### 4️⃣ Backend Deploy Edin (10 dakika)

1. **New +** → **Web Service**
2. GitHub repo'nuzu seçin
3. Ayarlar:
   ```
   Name: petkey-backend
   Region: Frankfurt
   Root Directory: backend
   Runtime: Python 3
   Build Command: ./build.sh
   Start Command: gunicorn petkey_api.wsgi:application
   Plan: Free
   ```

4. **Environment Variables** ekleyin:
   ```
   DEBUG=False
   SECRET_KEY=BURAYA-RANDOM-50-KARAKTER-ANAHTAR
   ALLOWED_HOSTS=.onrender.com
   CORS_ALLOWED_ORIGINS=https://FRONTEND-URL.onrender.com
   CSRF_TRUSTED_ORIGINS=https://FRONTEND-URL.onrender.com
   DATABASE_URL=[Adım 3'teki Internal URL]
   ```

5. **Create Web Service** → Deploy bekleyin (5-10 dk)
6. ✅ Backend URL'inizi not edin: `https://petkey-backend.onrender.com`

---

### 5️⃣ Frontend Deploy Edin (10 dakika)

1. **New +** → **Static Site**
2. Aynı GitHub repo'yu seçin
3. Ayarlar:
   ```
   Name: petkey-frontend
   Root Directory: (boş bırakın)
   Build Command: npm install && npm run build
   Publish Directory: dist
   Auto-Deploy: Yes
   ```

4. **Environment Variables**:
   ```
   VITE_API_URL=https://petkey-backend.onrender.com
   ```

5. **Create Static Site** → Deploy bekleyin (5-10 dk)
6. ✅ Frontend URL'inizi not edin: `https://petkey-frontend.onrender.com`

---

### 6️⃣ Backend Environment Variables'ı Güncelleyin

1. Backend servisinize gidin → **Environment**
2. `CORS_ALLOWED_ORIGINS` ve `CSRF_TRUSTED_ORIGINS` güncelleyin:
   ```
   CORS_ALLOWED_ORIGINS=https://petkey-frontend.onrender.com
   CSRF_TRUSTED_ORIGINS=https://petkey-frontend.onrender.com
   ```
3. **Save Changes** → Otomatik redeploy olur

---

### 7️⃣ İlk Admin Kullanıcısı Oluşturun

1. Backend servisinize gidin → **Shell** sekmesi
2. Komutu çalıştırın:
   ```bash
   python manage.py createsuperuser
   ```
3. Kullanıcı adı, email, şifre girin

---

### 8️⃣ Test Edin

✅ **Backend API**:
```
https://petkey-backend.onrender.com/api/
```

✅ **Admin Panel**:
```
https://petkey-backend.onrender.com/admin
```

✅ **Frontend**:
```
https://petkey-frontend.onrender.com
```

---

## 🎉 Tamamlandı!

Siteniz artık yayında!

### Sonraki Adımlar:

1. **Admin paneline girin** ve içerikleri düzenleyin
2. **Kendi domain'inizi bağlayın** (opsiyonel)
3. **SSL otomatik** -걱정 yok!

---

## 🔄 Güncelleme Nasıl Yapılır?

```bash
# Değişikliklerinizi yapın
git add .
git commit -m "Güncelleme mesajı"
git push

# Render otomatik deploy eder! 🚀
```

---

## 🐛 Sorun mu Var?

### Build Hatası
1. Render Dashboard → Servisiniz → **Logs**
2. Hatayı okuyun
3. DEPLOYMENT.md'deki "Sorun Giderme" bölümüne bakın

### 404 Hatası
- CORS ayarlarını kontrol edin
- Frontend VITE_API_URL'in doğru olduğundan emin olun

### Database Hatası
- DATABASE_URL'in doğru kopyalandığından emin olun
- PostgreSQL servisinin çalıştığını kontrol edin

---

## 💰 Maliyet

- **Free Plan**: Her şey ücretsiz!
  - ⚠️ PostgreSQL 90 gün sonra silinir
  - Upgrade için: $7/ay (PostgreSQL kalıcı olur)

---

## 🎯 SECRET_KEY Nasıl Oluşturulur?

Terminal'de:
```python
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

Çıktıyı kopyalayıp Render environment variables'a yapıştırın.

---

## 📞 Yardım

Detaylı bilgi için: [DEPLOYMENT.md](DEPLOYMENT.md)
