import { useState, useEffect } from 'react';
import { FaSave, FaSearch, FaGlobe, FaFileAlt, FaChartLine, FaExclamationTriangle } from 'react-icons/fa';
import { useSEO } from '../../contexts/SEOContext';

const SEOManagementPage = () => {
  const { refreshSEO } = useSEO();
  const [activeTab, setActiveTab] = useState('homepage');
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [seoSettings, setSeoSettings] = useState({
    homepage: {
      title: 'İstanbul\'da 7/24 Profesyonel Veteriner Hizmeti',
      description: 'İstanbul\'un en güvenilir veteriner kliniği. Acil veteriner hizmeti, uzman kadro, modern ekipman ile evcil dostlarınıza 7/24 profesyonel sağlık hizmeti sunuyoruz.',
      keywords: 'veteriner, veteriner kliniği, acil veteriner, 7/24 veteriner, İstanbul veteriner, kedi veterineri, köpek veterineri, evcil hayvan doktoru',
      ogImage: '/og-image.jpg',
      canonical: 'https://example.com/'
    },
    services: {
      title: 'Veteriner Hizmetlerimiz',
      description: 'Genel muayene, aşılama, cerrahi operasyonlar, diş tedavisi ve daha fazlası. Evcil dostlarınız için her türlü veteriner hizmeti.',
      keywords: 'veteriner hizmetleri, aşılama, cerrahi, diş tedavisi, veteriner muayene',
      ogImage: '/og-services.jpg',
      canonical: 'https://example.com/hizmetler'
    },
    blog: {
      title: 'Veteriner Blog - Pet Bakım Rehberi',
      description: 'Evcil hayvan bakımı, sağlık tavsiyeleri, beslenme rehberi ve veteriner uzmanlarından öneriler.',
      keywords: 'veteriner blog, evcil hayvan bakımı, pet sağlığı, kedi bakımı, köpek bakımı',
      ogImage: '/og-blog.jpg',
      canonical: 'https://example.com/blog'
    },
    about: {
      title: 'Hakkımızda',
      description: 'Uzman kadromuz, modern ekipmanımız ve 7/24 hizmet anlayışımızla evcil dostlarınızın sağlığı için buradayız.',
      keywords: 'veteriner kliniği hakkında, veteriner ekibi, İstanbul veteriner',
      ogImage: '/og-about.jpg',
      canonical: 'https://example.com/hakkimizda'
    },
    contact: {
      title: 'İletişim',
      description: 'Bize ulaşın, randevu alın veya acil durumlar için 7/24 hizmetinizdeyiz. İstanbul veteriner kliniği.',
      keywords: 'veteriner iletişim, veteriner randevu, acil veteriner telefon',
      ogImage: '/og-contact.jpg',
      canonical: 'https://example.com/iletisim'
    },
    appointment: {
      title: 'Online Randevu',
      description: 'Evcil dostlarınız için hızlı ve kolay online randevu alın. 7/24 veteriner hizmeti, deneyimli kadro ile yanınızdayız.',
      keywords: 'veteriner randevu, online randevu, veteriner randevu al, acil veteriner randevusu',
      ogImage: '/og-appointment.jpg',
      canonical: 'https://example.com/randevu'
    },
    global: {
      siteName: 'Veteriner Kliniği',
      twitterHandle: '@veteriner',
      facebookUrl: 'https://facebook.com/veteriner',
      instagramUrl: 'https://instagram.com/veteriner',
      twitterUrl: 'https://twitter.com/veteriner',
      googleAnalyticsId: '',
      googleSearchConsoleId: ''
    }
  });

  const [saveStatus, setSaveStatus] = useState('');
  const [charCounts, setCharCounts] = useState({
    title: 0,
    description: 0,
    keywords: 0
  });

  // Load SEO settings from API on mount
  useEffect(() => {
    const defaultSettings = {
      homepage: {
        title: 'İstanbul\'da 7/24 Profesyonel Veteriner Hizmeti',
        description: 'İstanbul\'un en güvenilir veteriner kliniği. Acil veteriner hizmeti, uzman kadro, modern ekipman ile evcil dostlarınıza 7/24 profesyonel sağlık hizmeti sunuyoruz.',
        keywords: 'veteriner, veteriner kliniği, acil veteriner, 7/24 veteriner, İstanbul veteriner, kedi veterineri, köpek veterineri, evcil hayvan doktoru',
        ogImage: '/og-image.jpg',
        canonical: 'https://example.com/'
      },
      services: {
        title: 'Veteriner Hizmetlerimiz',
        description: 'Genel muayene, aşılama, cerrahi operasyonlar, diş tedavisi ve daha fazlası. Evcil dostlarınız için her türlü veteriner hizmeti.',
        keywords: 'veteriner hizmetleri, aşılama, cerrahi, diş tedavisi, veteriner muayene',
        ogImage: '/og-services.jpg',
        canonical: 'https://example.com/hizmetler'
      },
      blog: {
        title: 'Veteriner Blog - Pet Bakım Rehberi',
        description: 'Evcil hayvan bakımı, sağlık tavsiyeleri, beslenme rehberi ve veteriner uzmanlarından öneriler.',
        keywords: 'veteriner blog, evcil hayvan bakımı, pet sağlığı, kedi bakımı, köpek bakımı',
        ogImage: '/og-blog.jpg',
        canonical: 'https://example.com/blog'
      },
      about: {
        title: 'Hakkımızda',
        description: 'Uzman kadromuz, modern ekipmanımız ve 7/24 hizmet anlayışımızla evcil dostlarınızın sağlığı için buradayız.',
        keywords: 'veteriner kliniği hakkında, veteriner ekibi, İstanbul veteriner',
        ogImage: '/og-about.jpg',
        canonical: 'https://example.com/hakkimizda'
      },
      contact: {
        title: 'İletişim',
        description: 'Bize ulaşın, randevu alın veya acil durumlar için 7/24 hizmetinizdeyiz. İstanbul veteriner kliniği.',
        keywords: 'veteriner iletişim, veteriner randevu, acil veteriner telefon',
        ogImage: '/og-contact.jpg',
        canonical: 'https://example.com/iletisim'
      },
      appointment: {
        title: 'Online Randevu',
        description: 'Evcil dostlarınız için hızlı ve kolay online randevu alın. 7/24 veteriner hizmeti, deneyimli kadro ile yanınızdayız.',
        keywords: 'veteriner randevu, online randevu, veteriner randevu al, acil veteriner randevusu',
        ogImage: '/og-appointment.jpg',
        canonical: 'https://example.com/randevu'
      },
      global: {
        siteName: 'Veteriner Kliniği',
        twitterHandle: '@veteriner',
        facebookUrl: 'https://facebook.com/veteriner',
        instagramUrl: 'https://instagram.com/veteriner',
        twitterUrl: 'https://twitter.com/veteriner',
        googleAnalyticsId: '',
        googleSearchConsoleId: ''
      }
    };

    const loadSeoSettings = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/seo-settings/all_settings/');
        if (response.ok) {
          const data = await response.json();
          // Merge API data with defaults (API data takes priority)
          const mergedSettings = { ...defaultSettings };
          Object.keys(data).forEach(key => {
            if (data[key] && Object.keys(data[key]).length > 0) {
              mergedSettings[key] = { ...defaultSettings[key], ...data[key] };
            }
          });
          setSeoSettings(mergedSettings);
        } else {
          // Fallback to localStorage, then defaults
          const savedSettings = localStorage.getItem('seoSettings');
          if (savedSettings) {
            setSeoSettings(JSON.parse(savedSettings));
          } else {
            setSeoSettings(defaultSettings);
          }
        }
      } catch (error) {
        console.error('Error loading SEO settings:', error);
        // Fallback to localStorage, then defaults
        const savedSettings = localStorage.getItem('seoSettings');
        if (savedSettings) {
          setSeoSettings(JSON.parse(savedSettings));
        } else {
          setSeoSettings(defaultSettings);
        }
      }
    };

    const loadServices = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/services/all/');
        if (response.ok) {
          const data = await response.json();
          console.log('✅ Services loaded:', data.length, 'services');
          setServices(data);
          if (data.length > 0) {
            console.log('✅ First service selected:', data[0].title);
            setSelectedService(data[0]);
          }
        }
      } catch (error) {
        console.error('❌ Error loading services:', error);
      }
    };

    loadSeoSettings();
    loadServices();
  }, []);

  useEffect(() => {
    if (activeTab !== 'global' && activeTab !== 'service-details' && seoSettings[activeTab]) {
      const current = seoSettings[activeTab];
      setCharCounts({
        title: current.title?.length || 0,
        description: current.description?.length || 0,
        keywords: current.keywords?.length || 0
      });
    }
  }, [activeTab, seoSettings]);

  const handleInputChange = (field, value) => {
    setSeoSettings(prev => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        [field]: value
      }
    }));
  };

  const handleGlobalInputChange = (field, value) => {
    setSeoSettings(prev => ({
      ...prev,
      global: {
        ...prev.global,
        [field]: value
      }
    }));
  };

  const handleSave = async () => {
    setSaveStatus('saving');

    try {
      // Save to backend API
      const response = await fetch('http://localhost:8000/api/seo-settings/bulk_update/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(seoSettings)
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const result = await response.json();

      // Also save to localStorage as backup
      localStorage.setItem('seoSettings', JSON.stringify(seoSettings));

      // Refresh SEO context to update all pages
      refreshSEO();
      console.log('✅ SEO ayarları kaydedildi ve global context yenilendi');

      setSaveStatus('success');
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (error) {
      console.error('Error saving SEO settings:', error);

      // Try to save to localStorage as fallback
      try {
        localStorage.setItem('seoSettings', JSON.stringify(seoSettings));
        setSaveStatus('success');
        setTimeout(() => setSaveStatus(''), 3000);
      } catch (localError) {
        setSaveStatus('error');
        setTimeout(() => setSaveStatus(''), 3000);
      }
    }
  };

  const tabs = [
    { id: 'homepage', label: 'Ana Sayfa', icon: FaGlobe },
    { id: 'services', label: 'Hizmetler', icon: FaFileAlt },
    { id: 'service-details', label: 'Hizmet Detayları', icon: FaFileAlt },
    { id: 'blog', label: 'Blog', icon: FaFileAlt },
    { id: 'about', label: 'Hakkımızda', icon: FaFileAlt },
    { id: 'contact', label: 'İletişim', icon: FaFileAlt },
    { id: 'appointment', label: 'Randevu', icon: FaFileAlt },
    { id: 'global', label: 'Genel Ayarlar', icon: FaChartLine }
  ];

  const getCharCountColor = (count, max, optimal) => {
    if (count === 0) return 'text-gray-400';
    if (count > max) return 'text-red-500';
    if (count >= optimal && count <= max) return 'text-green-500';
    return 'text-yellow-500';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
            <FaSearch className="text-2xl text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">SEO Yönetimi</h1>
            <p className="text-gray-500">Meta başlıkları, açıklamalar ve anahtar kelimeleri düzenleyin</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200 overflow-x-auto">
          <div className="flex">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-semibold transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                    : 'text-gray-600 hover:text-purple-600 hover:bg-gray-50'
                }`}
              >
                <tab.icon />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'service-details' ? (
            // Service Details SEO
            <div className="space-y-6">
              {/* Service Selector */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Hizmet Seç
                </label>
                <select
                  value={selectedService?.id || ''}
                  onChange={(e) => {
                    const service = services.find(s => s.id === parseInt(e.target.value));
                    setSelectedService(service);
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {services.map(service => (
                    <option key={service.id} value={service.id}>
                      {service.title}
                    </option>
                  ))}
                </select>
              </div>

              {selectedService && (
                <>
                  {/* Meta Title */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Meta Başlık
                    </label>
                    <input
                      type="text"
                      value={selectedService.meta_title || ''}
                      onChange={(e) => setSelectedService({...selectedService, meta_title: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder={`Boş bırakılırsa "${selectedService.title}" kullanılır`}
                      maxLength={70}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Optimal: 50-60 karakter. Boş bırakılırsa hizmet başlığı kullanılır.
                    </p>
                  </div>

                  {/* Meta Description */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Meta Açıklama
                    </label>
                    <textarea
                      value={selectedService.meta_description || ''}
                      onChange={(e) => setSelectedService({...selectedService, meta_description: e.target.value})}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder={`Boş bırakılırsa "${selectedService.short_description}" kullanılır`}
                      maxLength={170}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Optimal: 150-160 karakter. Boş bırakılırsa kısa açıklama kullanılır.
                    </p>
                  </div>

                  {/* Meta Keywords */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Anahtar Kelimeler
                    </label>
                    <input
                      type="text"
                      value={selectedService.meta_keywords || ''}
                      onChange={(e) => setSelectedService({...selectedService, meta_keywords: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="veteriner, aşılama, sağlık..."
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Virgül ile ayırarak yazın.
                    </p>
                  </div>

                  {/* OG Image */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Open Graph Görsel URL
                    </label>
                    <input
                      type="text"
                      value={selectedService.og_image || ''}
                      onChange={(e) => setSelectedService({...selectedService, og_image: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="/og-service.jpg"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Sosyal medya paylaşımları için görsel (1200x630px).
                    </p>
                  </div>

                  {/* Save Button for Service */}
                  <div className="flex justify-end">
                    <button
                      onClick={async () => {
                        try {
                          const response = await fetch(`http://localhost:8000/api/services/${selectedService.id}/`, {
                            method: 'PATCH',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              meta_title: selectedService.meta_title,
                              meta_description: selectedService.meta_description,
                              meta_keywords: selectedService.meta_keywords,
                              og_image: selectedService.og_image
                            })
                          });
                          if (response.ok) {
                            alert('Hizmet SEO ayarları kaydedildi!');
                          }
                        } catch (error) {
                          console.error('Error saving service SEO:', error);
                          alert('Kayıt hatası!');
                        }
                      }}
                      className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700"
                    >
                      Bu Hizmetin SEO'sunu Kaydet
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : activeTab === 'global' ? (
            // Global Settings
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Site Adı
                </label>
                <input
                  type="text"
                  value={seoSettings.global?.siteName || ''}
                  onChange={(e) => handleGlobalInputChange('siteName', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="PetKey Veteriner"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Twitter Handle
                  </label>
                  <input
                    type="text"
                    value={seoSettings.global?.twitterHandle || ''}
                    onChange={(e) => handleGlobalInputChange('twitterHandle', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="@petkey"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Facebook URL
                  </label>
                  <input
                    type="url"
                    value={seoSettings.global?.facebookUrl || ''}
                    onChange={(e) => handleGlobalInputChange('facebookUrl', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="https://facebook.com/petkey"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Instagram URL
                  </label>
                  <input
                    type="url"
                    value={seoSettings.global?.instagramUrl || ''}
                    onChange={(e) => handleGlobalInputChange('instagramUrl', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="https://instagram.com/petkey"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Twitter URL
                  </label>
                  <input
                    type="url"
                    value={seoSettings.global?.twitterUrl || ''}
                    onChange={(e) => handleGlobalInputChange('twitterUrl', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="https://twitter.com/petkey"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Google Analytics ID
                  </label>
                  <input
                    type="text"
                    value={seoSettings.global?.googleAnalyticsId || ''}
                    onChange={(e) => handleGlobalInputChange('googleAnalyticsId', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="G-XXXXXXXXXX"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Google Search Console ID
                  </label>
                  <input
                    type="text"
                    value={seoSettings.global?.googleSearchConsoleId || ''}
                    onChange={(e) => handleGlobalInputChange('googleSearchConsoleId', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="google-site-verification=XXXX"
                  />
                </div>
              </div>
            </div>
          ) : (
            // Page-specific settings
            <div className="space-y-6">
              {/* Title */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Meta Başlık
                  </label>
                  <span className={`text-sm font-medium ${getCharCountColor(charCounts.title, 60, 50)}`}>
                    {charCounts.title}/60 karakter
                  </span>
                </div>
                <input
                  type="text"
                  value={seoSettings[activeTab]?.title || ''}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Sayfa başlığı"
                  maxLength={70}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Optimal: 50-60 karakter. Arama motorlarında görünecek başlık.
                </p>
              </div>

              {/* Description */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Meta Açıklama
                  </label>
                  <span className={`text-sm font-medium ${getCharCountColor(charCounts.description, 160, 150)}`}>
                    {charCounts.description}/160 karakter
                  </span>
                </div>
                <textarea
                  value={seoSettings[activeTab]?.description || ''}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Sayfa açıklaması"
                  maxLength={170}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Optimal: 150-160 karakter. Arama sonuçlarında görünecek açıklama.
                </p>
              </div>

              {/* Keywords */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Anahtar Kelimeler
                  </label>
                  <span className="text-sm text-gray-500">
                    {charCounts.keywords} karakter
                  </span>
                </div>
                <input
                  type="text"
                  value={seoSettings[activeTab]?.keywords || ''}
                  onChange={(e) => handleInputChange('keywords', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="anahtar kelime, kelime 2, kelime 3"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Virgül ile ayırarak yazın. Örnek: veteriner, veteriner kliniği, acil veteriner
                </p>
              </div>

              {/* OG Image */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Open Graph Görseli (Sosyal Medya)
                </label>
                <input
                  type="text"
                  value={seoSettings[activeTab]?.ogImage || ''}
                  onChange={(e) => handleInputChange('ogImage', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="/og-image.jpg"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Önerilen boyut: 1200x630px. Facebook, Twitter gibi platformlarda paylaşıldığında görünecek görsel.
                </p>
              </div>

              {/* Canonical URL */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Canonical URL
                </label>
                <input
                  type="url"
                  value={seoSettings[activeTab]?.canonical || ''}
                  onChange={(e) => handleInputChange('canonical', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="https://petkey.com/"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Sayfanın asıl URL adresi. Duplicate content sorunlarını önler.
                </p>
              </div>

              {/* Preview */}
              <div className="bg-gray-50 rounded-lg p-6 border-2 border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <FaSearch className="text-purple-600" />
                  Google Arama Önizlemesi
                </h3>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="text-xs text-gray-600 mb-1">
                    https://petkey.com › {activeTab === 'homepage' ? '' : activeTab}
                  </div>
                  <div className="text-xl text-blue-600 hover:underline cursor-pointer mb-1">
                    {seoSettings[activeTab]?.title || 'Sayfa başlığı'}
                  </div>
                  <div className="text-sm text-gray-700">
                    {seoSettings[activeTab]?.description || 'Sayfa açıklaması'}
                  </div>
                </div>
                {(charCounts.title > 60 || charCounts.description > 160) && (
                  <div className="mt-3 flex items-start gap-2 text-sm text-yellow-700 bg-yellow-50 p-3 rounded-lg">
                    <FaExclamationTriangle className="mt-0.5 flex-shrink-0" />
                    <p>
                      Başlık veya açıklama çok uzun. Arama motorlarında kesilerek görünebilir.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saveStatus === 'saving'}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
            saveStatus === 'success'
              ? 'bg-green-600 text-white'
              : saveStatus === 'error'
              ? 'bg-red-600 text-white'
              : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700'
          }`}
        >
          <FaSave />
          {saveStatus === 'saving' ? 'Kaydediliyor...' : saveStatus === 'success' ? 'Kaydedildi!' : saveStatus === 'error' ? 'Hata!' : 'Değişiklikleri Kaydet'}
        </button>
      </div>

      {/* SEO Tips */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
        <h3 className="text-lg font-bold text-purple-900 mb-4 flex items-center gap-2">
          <FaChartLine className="text-purple-600" />
          SEO İpuçları
        </h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-purple-600">•</span>
            <span>Meta başlıklarınızda hedef anahtar kelimeleri kullanın</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-600">•</span>
            <span>Her sayfa için benzersiz başlık ve açıklama yazın</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-600">•</span>
            <span>Açıklamalarınızı kullanıcıları tıklamaya teşvik edecek şekilde yazın</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-600">•</span>
            <span>Karakter sınırlarına dikkat edin (başlık: 50-60, açıklama: 150-160)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-600">•</span>
            <span>Sosyal medya paylaşımları için kaliteli OG görselleri kullanın (1200x630px)</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SEOManagementPage;
