import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FaCog, FaSave, FaGlobe, FaCheckCircle, FaPhone, FaEnvelope,
  FaMapMarkerAlt, FaClock, FaFacebook, FaInstagram, FaTwitter, FaWhatsapp
} from 'react-icons/fa';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [settings, setSettings] = useState({
    // Header Ayarları
    site_title: 'Veteriner Kliniği',
    site_logo_image: null,
    site_logo_text: 'Veteriner',
    site_logo_subtitle: 'Veteriner Kliniği',
    site_logo_emoji: '🐾',

    // İletişim Bilgileri
    contact_phone: '(0212) 123 45 67',
    contact_phone_link: '+902121234567',
    contact_whatsapp: '+905001234567',
    contact_email: 'info@veteriner.com',
    contact_address: 'Kadıköy, İstanbul',

    // Footer Ayarları
    footer_about_text: 'Sevimli dostlarınızın sağlığı için modern ekipman ve deneyimli kadromuzla 7/24 hizmetinizdeyiz.',
    footer_facebook_url: 'https://facebook.com/veteriner',
    footer_instagram_url: 'https://instagram.com/veteriner',
    footer_twitter_url: 'https://twitter.com/veteriner',

    // Çalışma Saatleri
    working_hours_weekday: '09:00 - 18:00',
    working_hours_weekend: '10:00 - 16:00',
    working_hours_info: '7/24 Acil Servis',
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:8000/api/site-settings/get_settings/');
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
        console.log('✅ Settings loaded:', data);
      }
    } catch (error) {
      console.error('❌ Error loading settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setSettings({
      ...settings,
      [field]: value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSettings({
        ...settings,
        site_logo_image: file,
      });
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus(null);

    try {
      const formData = new FormData();

      // Append all settings to FormData
      Object.keys(settings).forEach(key => {
        if (key === 'site_logo_image' && settings[key] instanceof File) {
          formData.append(key, settings[key]);
        } else if (key !== 'site_logo_image') {
          formData.append(key, settings[key]);
        }
      });

      const response = await fetch('http://localhost:8000/api/site-settings/update_settings/', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setSaveStatus('success');
        console.log('✅ Settings saved successfully');
        // Reload settings to get the new image URL
        await loadSettings();
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      console.error('❌ Settings save failed:', error);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  const tabs = [
    { id: 'general', label: 'Genel & Header', icon: FaGlobe },
    { id: 'contact', label: 'İletişim', icon: FaPhone },
    { id: 'whatsapp', label: 'WhatsApp İletişim Hattı', icon: FaWhatsapp },
    { id: 'footer', label: 'Footer', icon: FaCog },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Ayarlar yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <FaCog className="text-purple-600" />
            Site Ayarları
          </h1>
          <p className="text-gray-600 mt-1">Header, Footer ve iletişim bilgilerini yönetin</p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isSaving ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Kaydediliyor...
            </>
          ) : (
            <>
              <FaSave />
              Değişiklikleri Kaydet
            </>
          )}
        </button>
      </div>

      {/* Success/Error Message */}
      {saveStatus === 'success' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border-2 border-green-300 rounded-xl p-4 flex items-center gap-3"
        >
          <FaCheckCircle className="text-green-600 text-xl" />
          <span className="text-green-800 font-semibold">Ayarlar başarıyla kaydedildi!</span>
        </motion.div>
      )}

      {saveStatus === 'error' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border-2 border-red-300 rounded-xl p-4 flex items-center gap-3"
        >
          <span className="text-red-800 font-semibold">❌ Ayarlar kaydedilemedi. Lütfen tekrar deneyin.</span>
        </motion.div>
      )}

      {/* Tabs and Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Tabs */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full px-6 py-4 flex items-center gap-3 transition-all border-l-4 ${
                    activeTab === tab.id
                      ? 'bg-purple-50 border-purple-600 text-purple-600'
                      : 'bg-white border-transparent text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="text-xl" />
                  <span className="font-semibold">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            {/* General Settings - Header & Logo */}
            {activeTab === 'general' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Genel Ayarlar & Header</h2>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Site Başlığı (Browser Tab)
                  </label>
                  <input
                    type="text"
                    value={settings.site_title}
                    onChange={(e) => handleChange('site_title', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none"
                    placeholder="Veteriner Kliniği"
                  />
                  <p className="text-xs text-gray-500 mt-1">Tarayıcı sekmesinde görünecek başlık</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Logo Metni (Ana Başlık)
                    </label>
                    <input
                      type="text"
                      value={settings.site_logo_text}
                      onChange={(e) => handleChange('site_logo_text', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none"
                      placeholder="Veteriner"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Logo Alt Yazısı
                    </label>
                    <input
                      type="text"
                      value={settings.site_logo_subtitle}
                      onChange={(e) => handleChange('site_logo_subtitle', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none"
                      placeholder="Veteriner Kliniği"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Logo Emoji
                  </label>
                  <input
                    type="text"
                    value={settings.site_logo_emoji}
                    onChange={(e) => handleChange('site_logo_emoji', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none"
                    placeholder="🐾"
                  />
                  <p className="text-xs text-gray-500 mt-1">Logo resmi yoksa emoji gösterilir</p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Logo Resmi Yükle
                  </label>
                  <div className="space-y-4">
                    {settings.site_logo_image && typeof settings.site_logo_image === 'string' && (
                      <div className="flex items-center gap-4 p-6 bg-gray-50 rounded-xl border-2 border-gray-200">
                        <img
                          src={settings.site_logo_image}
                          alt="Mevcut Logo"
                          className="h-24 w-auto max-w-[300px] object-contain rounded-lg border-2 border-purple-200 p-2 bg-white"
                        />
                        <div>
                          <p className="text-sm font-semibold text-gray-700">Mevcut Logo</p>
                          <p className="text-xs text-gray-500">Yeni logo yükleyerek değiştirebilirsiniz</p>
                        </div>
                      </div>
                    )}

                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="block w-full text-sm text-gray-700 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 file:transition-all cursor-pointer border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all"
                    />
                    <p className="text-xs text-gray-500">PNG, JPG veya SVG formatında logo yükleyebilirsiniz. Logo resmi yüklü ise emoji yerine logo gösterilir.</p>
                  </div>
                </div>

                {/* Preview */}
                <div className="mt-8 p-6 bg-gray-50 rounded-xl border-2 border-gray-200">
                  <p className="text-sm font-bold text-gray-700 mb-4">Önizleme:</p>
                  <div className="flex items-center gap-3 bg-white p-4 rounded-lg">
                    {settings.site_logo_image && typeof settings.site_logo_image === 'string' ? (
                      <img
                        src={settings.site_logo_image}
                        alt="Logo"
                        className="h-16 w-auto max-w-[200px] object-contain"
                      />
                    ) : settings.site_logo_emoji ? (
                      <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                        {settings.site_logo_emoji}
                      </div>
                    ) : null}
                    {(settings.site_logo_text || settings.site_logo_subtitle) && (
                      <div>
                        {settings.site_logo_text && (
                          <h3 className="text-2xl font-extrabold text-gray-900">{settings.site_logo_text}</h3>
                        )}
                        {settings.site_logo_subtitle && (
                          <p className="text-sm text-gray-600">{settings.site_logo_subtitle}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Contact Settings */}
            {activeTab === 'contact' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">İletişim Bilgileri</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      <FaPhone className="inline mr-2" />
                      Telefon Numarası
                    </label>
                    <input
                      type="text"
                      value={settings.contact_phone}
                      onChange={(e) => handleChange('contact_phone', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none"
                      placeholder="(0212) 123 45 67"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Telefon Link (tel: formatı)
                    </label>
                    <input
                      type="text"
                      value={settings.contact_phone_link}
                      onChange={(e) => handleChange('contact_phone_link', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none"
                      placeholder="+902121234567"
                    />
                    <p className="text-xs text-gray-500 mt-1">Telefon linklerinde kullanılır</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    <FaEnvelope className="inline mr-2" />
                    E-posta Adresi
                  </label>
                  <input
                    type="email"
                    value={settings.contact_email}
                    onChange={(e) => handleChange('contact_email', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none"
                    placeholder="info@veteriner.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    <FaMapMarkerAlt className="inline mr-2" />
                    Adres
                  </label>
                  <textarea
                    value={settings.contact_address}
                    onChange={(e) => handleChange('contact_address', e.target.value)}
                    rows="3"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none resize-none"
                    placeholder="Kadıköy, İstanbul"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-4">
                    <FaClock className="inline mr-2" />
                    Çalışma Saatleri
                  </label>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-2">Hafta İçi</label>
                      <input
                        type="text"
                        value={settings.working_hours_weekday}
                        onChange={(e) => handleChange('working_hours_weekday', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none"
                        placeholder="09:00 - 18:00"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-2">Hafta Sonu</label>
                      <input
                        type="text"
                        value={settings.working_hours_weekend}
                        onChange={(e) => handleChange('working_hours_weekend', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none"
                        placeholder="10:00 - 16:00"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-2">Ek Bilgi</label>
                      <input
                        type="text"
                        value={settings.working_hours_info}
                        onChange={(e) => handleChange('working_hours_info', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none"
                        placeholder="7/24 Acil Servis"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* WhatsApp Settings */}
            {activeTab === 'whatsapp' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                    <FaWhatsapp className="text-white text-2xl" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">WhatsApp İletişim Hattı</h2>
                    <p className="text-sm text-gray-600">Sitenizdeki WhatsApp butonunu yönetin</p>
                  </div>
                </div>

                <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-lg">💡</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-green-900 mb-1">WhatsApp Butonu Hakkında</h3>
                      <p className="text-sm text-green-800">
                        Site ziyaretçileri sağ alt köşedeki WhatsApp butonuna tıklayarak direkt olarak WhatsApp üzerinden sizinle iletişime geçebilir.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    <FaWhatsapp className="inline mr-2 text-green-600" />
                    WhatsApp Numarası
                  </label>
                  <input
                    type="text"
                    value={settings.contact_whatsapp}
                    onChange={(e) => handleChange('contact_whatsapp', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all outline-none text-lg font-mono"
                    placeholder="+905001234567"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    🌍 <strong>Önemli:</strong> Uluslararası format kullanın (Örn: +905001234567)
                  </p>
                </div>

                <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6">
                  <h3 className="font-bold text-gray-900 mb-3">📋 Doğru Format Örnekleri:</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <code className="bg-white px-3 py-1 rounded border border-gray-300">+905001234567</code>
                      <span className="text-gray-600">(Türkiye)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <code className="bg-white px-3 py-1 rounded border border-gray-300">+905551234567</code>
                      <span className="text-gray-600">(Türkiye)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-red-600 font-bold">✗</span>
                      <code className="bg-white px-3 py-1 rounded border border-gray-300">0555 123 45 67</code>
                      <span className="text-gray-600">(Hatalı - + ve ülke kodu yok)</span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">🎯</span>
                    <div>
                      <h3 className="font-bold text-blue-900 mb-1">Nasıl Çalışır?</h3>
                      <p className="text-sm text-blue-800 mb-2">
                        Ziyaretçiler butona tıkladığında WhatsApp'a yönlendirilir ve otomatik mesaj ile sohbet başlatır:
                      </p>
                      <div className="bg-white rounded-lg p-3 border border-blue-200">
                        <p className="text-sm text-gray-700 italic">
                          "Merhaba! Web sitenizden ulaşıyorum. Bilgi almak istiyorum."
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Footer Settings */}
            {activeTab === 'footer' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Footer Ayarları</h2>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Hakkında Metni
                  </label>
                  <textarea
                    value={settings.footer_about_text}
                    onChange={(e) => handleChange('footer_about_text', e.target.value)}
                    rows="4"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none resize-none"
                    placeholder="Sevimli dostlarınızın sağlığı için..."
                  />
                  <p className="text-xs text-gray-500 mt-1">Footer'da görünecek açıklama metni</p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-4">
                    Sosyal Medya Linkleri
                  </label>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-2">
                        <FaFacebook className="inline mr-2" />
                        Facebook URL
                      </label>
                      <input
                        type="url"
                        value={settings.footer_facebook_url}
                        onChange={(e) => handleChange('footer_facebook_url', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none"
                        placeholder="https://facebook.com/veteriner"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-2">
                        <FaInstagram className="inline mr-2" />
                        Instagram URL
                      </label>
                      <input
                        type="url"
                        value={settings.footer_instagram_url}
                        onChange={(e) => handleChange('footer_instagram_url', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none"
                        placeholder="https://instagram.com/veteriner"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-2">
                        <FaTwitter className="inline mr-2" />
                        Twitter URL
                      </label>
                      <input
                        type="url"
                        value={settings.footer_twitter_url}
                        onChange={(e) => handleChange('footer_twitter_url', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none"
                        placeholder="https://twitter.com/veteriner"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
