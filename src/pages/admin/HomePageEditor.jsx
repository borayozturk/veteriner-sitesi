import { useState, useEffect } from 'react';
import { FaSave, FaHome } from 'react-icons/fa';
import GoogleReviewsManager from '../../components/admin/GoogleReviewsManager';

const HomePageEditor = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState('hero');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/homepage/content/');
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Veri yüklenirken hata:', error);
      setMessage('Veri yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const response = await fetch(`http://localhost:8000/api/homepage/1/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setMessage('Anasayfa başarıyla güncellendi!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('API Error:', response.status, errorData);
        setMessage(`Güncelleme sırasında hata oluştu: ${errorData.detail || response.statusText}`);
      }
    } catch (error) {
      console.error('Güncelleme hatası:', error);
      setMessage(`Güncelleme sırasında hata oluştu: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field, value) => {
    setData({ ...data, [field]: value });
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Yükleniyor...</div>;
  }

  if (!data) {
    return <div className="text-center text-red-600">Veri yüklenemedi</div>;
  }

  const tabs = [
    { id: 'hero', label: 'Hero Bölümü', icon: '🎯' },
    { id: 'stats', label: 'İstatistikler', icon: '📊' },
    { id: 'content', label: 'İçerik', icon: '📝' },
    { id: 'why-choose', label: 'Neden Biz', icon: '⭐' },
    { id: 'reviews', label: 'Google Yorumları', icon: '⭐' },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-xl flex items-center justify-center">
              <FaHome className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Anasayfa Düzenleyici</h1>
              <p className="text-sm text-gray-600">Anasayfanın tüm bölümlerini buradan düzenleyebilirsiniz</p>
            </div>
          </div>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-emerald-700 disabled:opacity-50 transition-all duration-200 shadow-lg shadow-emerald-500/25"
          >
            <FaSave />
            {saving ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </div>

        {message && (
          <div className={`mt-4 p-4 rounded-lg ${message.includes('başarıyla') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            {message}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="border-b border-gray-200">
          <div className="flex gap-1 p-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-emerald-50 text-emerald-700 shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-lg shadow-sm p-6">

          {/* Hero Section */}
          {activeTab === 'hero' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Hero Bölümü</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ana Başlık</label>
                <input
                  type="text"
                  value={data.hero_title}
                  onChange={(e) => handleChange('hero_title', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Alt Başlık</label>
                <textarea
                  value={data.hero_subtitle}
                  onChange={(e) => handleChange('hero_subtitle', e.target.value)}
                  rows="3"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ana Buton Metni</label>
                  <input
                    type="text"
                    value={data.hero_cta_text}
                    onChange={(e) => handleChange('hero_cta_text', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ana Buton Linki</label>
                  <input
                    type="text"
                    value={data.hero_cta_link}
                    onChange={(e) => handleChange('hero_cta_link', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">İkincil Buton Metni</label>
                  <input
                    type="text"
                    value={data.hero_secondary_cta_text}
                    onChange={(e) => handleChange('hero_secondary_cta_text', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">İkincil Buton Linki</label>
                  <input
                    type="text"
                    value={data.hero_secondary_cta_link}
                    onChange={(e) => handleChange('hero_secondary_cta_link', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Stats Section */}
          {activeTab === 'stats' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">İstatistikler</h2>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={data.show_stats}
                    onChange={(e) => handleChange('show_stats', e.target.checked)}
                    className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Bu bölümü göster</span>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map(num => (
                  <div key={num} className="p-4 border border-gray-200 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-3">İstatistik {num}</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Sayı</label>
                        <input
                          type="text"
                          value={data[`stat${num}_number`]}
                          onChange={(e) => handleChange(`stat${num}_number`, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          placeholder="15+"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Etiket</label>
                        <input
                          type="text"
                          value={data[`stat${num}_label`]}
                          onChange={(e) => handleChange(`stat${num}_label`, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          placeholder="Yıllık Deneyim"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Content Texts */}
          {activeTab === 'content' && (
            <div className="space-y-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Bölüm İçerikleri</h2>

              {/* Services */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3">🏥 Hizmetler Bölümü</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Başlık</label>
                    <input
                      type="text"
                      value={data.services_title}
                      onChange={(e) => handleChange('services_title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Alt Başlık</label>
                    <input
                      type="text"
                      value={data.services_subtitle}
                      onChange={(e) => handleChange('services_subtitle', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
              </div>

              {/* Veterinarians */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3">👨‍⚕️ Veterinerler Bölümü</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Başlık</label>
                    <input
                      type="text"
                      value={data.veterinarians_title}
                      onChange={(e) => handleChange('veterinarians_title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Alt Başlık</label>
                    <input
                      type="text"
                      value={data.veterinarians_subtitle}
                      onChange={(e) => handleChange('veterinarians_subtitle', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
              </div>

              {/* Reviews */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3">⭐ Google Yorumları</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Başlık</label>
                    <input
                      type="text"
                      value={data.reviews_title}
                      onChange={(e) => handleChange('reviews_title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Alt Başlık</label>
                    <input
                      type="text"
                      value={data.reviews_subtitle}
                      onChange={(e) => handleChange('reviews_subtitle', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ortalama Puan</label>
                    <input
                      type="text"
                      value={data.reviews_rating}
                      onChange={(e) => handleChange('reviews_rating', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Toplam Yorum</label>
                    <input
                      type="text"
                      value={data.reviews_count}
                      onChange={(e) => handleChange('reviews_count', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Buton Metni</label>
                    <input
                      type="text"
                      value={data.reviews_cta_text}
                      onChange={(e) => handleChange('reviews_cta_text', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="Tüm Yorumları Google'da Gör"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Google Yorumlar Link
                      <span className="text-xs text-gray-500 ml-1">(Tam URL)</span>
                    </label>
                    <input
                      type="url"
                      value={data.reviews_cta_link || ''}
                      onChange={(e) => handleChange('reviews_cta_link', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="https://www.google.com/maps/place/..."
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      💡 Google Maps'te işletmenizi bulun, "Yorumlar" sekmesine gidin ve tarayıcı adres çubuğundaki URL'yi buraya yapıştırın
                    </p>
                  </div>
                </div>
              </div>

              {/* Blog */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3">📝 Blog Bölümü</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Başlık</label>
                    <input
                      type="text"
                      value={data.blog_title}
                      onChange={(e) => handleChange('blog_title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Alt Başlık</label>
                    <input
                      type="text"
                      value={data.blog_subtitle}
                      onChange={(e) => handleChange('blog_subtitle', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
              </div>

              {/* Appointment CTA */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3">📅 Randevu CTA</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Başlık</label>
                    <input
                      type="text"
                      value={data.appointment_cta_title || ''}
                      onChange={(e) => handleChange('appointment_cta_title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="Evcil Dostunuz için Randevu Alın"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
                    <textarea
                      value={data.appointment_cta_description || ''}
                      onChange={(e) => handleChange('appointment_cta_description', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="Randevu açıklama metni"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Buton Metni</label>
                      <input
                        type="text"
                        value={data.appointment_cta_button || ''}
                        onChange={(e) => handleChange('appointment_cta_button', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        placeholder="Hemen Randevu Al"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Telefon (Görünen)</label>
                      <input
                        type="text"
                        value={data.appointment_cta_phone || ''}
                        onChange={(e) => handleChange('appointment_cta_phone', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        placeholder="(0212) 123 45 67"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Telefon Link (tel:)</label>
                    <input
                      type="text"
                      value={data.appointment_cta_phone_link || ''}
                      onChange={(e) => handleChange('appointment_cta_phone_link', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="+902121234567"
                    />
                  </div>

                  <div className="border-t pt-4 mt-4">
                    <h4 className="font-semibold text-gray-800 mb-3">Özellikler (4 adet)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[1, 2, 3, 4].map((num) => (
                        <div key={num}>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Özellik {num}</label>
                          <input
                            type="text"
                            value={data.appointment_cta_features?.[num - 1]?.text || ''}
                            onChange={(e) => {
                              const features = data.appointment_cta_features || [{text: ''}, {text: ''}, {text: ''}, {text: ''}];
                              features[num - 1] = { text: e.target.value };
                              handleChange('appointment_cta_features', features);
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            placeholder={['Hızlı Randevu', 'Uzman Kadro', 'Modern Ekipman', '7/24 Hizmet'][num - 1]}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t pt-4 mt-4">
                    <h4 className="font-semibold text-gray-800 mb-3">Sağ Taraf İstatistikleri</h4>
                    <div className="space-y-3">
                      {[1, 2, 3].map((num) => (
                        <div key={num} className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Stat {num} Sayı</label>
                            <input
                              type="text"
                              value={data[`appointment_cta_stat${num}_number`] || ''}
                              onChange={(e) => handleChange(`appointment_cta_stat${num}_number`, e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                              placeholder={['4.9', '5,000+', '15+'][num - 1]}
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Stat {num} Etiket</label>
                            <input
                              type="text"
                              value={data[`appointment_cta_stat${num}_label`] || ''}
                              onChange={(e) => handleChange(`appointment_cta_stat${num}_label`, e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                              placeholder={['Google Puanı', 'Mutlu Hayvan', 'Uzman Veteriner'][num - 1]}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* Why Choose Us Section */}
          {activeTab === 'why-choose' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Neden Biz Bölümü</h2>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={data.show_why_choose}
                    onChange={(e) => handleChange('show_why_choose', e.target.checked)}
                    className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Bu bölümü göster</span>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Başlık</label>
                  <input
                    type="text"
                    value={data.why_choose_title}
                    onChange={(e) => handleChange('why_choose_title', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Neden Biz?"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Alt Başlık</label>
                  <input
                    type="text"
                    value={data.why_choose_subtitle}
                    onChange={(e) => handleChange('why_choose_subtitle', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Modern teknoloji ve sevgi dolu yaklaşımımız"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Özellikler</h3>
                  <button
                    type="button"
                    onClick={() => {
                      const newFeatures = [...(data.why_choose_features || []), { icon: '⭐', title: '', description: '' }];
                      handleChange('why_choose_features', newFeatures);
                    }}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
                  >
                    + Özellik Ekle
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(data.why_choose_features || []).map((feature, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg bg-white">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-gray-900">Özellik {index + 1}</h4>
                        <button
                          type="button"
                          onClick={() => {
                            const newFeatures = (data.why_choose_features || []).filter((_, i) => i !== index);
                            handleChange('why_choose_features', newFeatures);
                          }}
                          className="text-red-600 hover:text-red-700 text-sm font-medium"
                        >
                          Sil
                        </button>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">İkon (Emoji)</label>
                          <input
                            type="text"
                            value={feature.icon}
                            onChange={(e) => {
                              const newFeatures = [...(data.why_choose_features || [])];
                              newFeatures[index].icon = e.target.value;
                              handleChange('why_choose_features', newFeatures);
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-center text-2xl"
                            placeholder="🏥"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Başlık</label>
                          <input
                            type="text"
                            value={feature.title}
                            onChange={(e) => {
                              const newFeatures = [...(data.why_choose_features || [])];
                              newFeatures[index].title = e.target.value;
                              handleChange('why_choose_features', newFeatures);
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            placeholder="Modern Klinik"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
                          <textarea
                            value={feature.description}
                            onChange={(e) => {
                              const newFeatures = [...(data.why_choose_features || [])];
                              newFeatures[index].description = e.target.value;
                              handleChange('why_choose_features', newFeatures);
                            }}
                            rows="2"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            placeholder="En son teknoloji ekipmanlar"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Save Button - Bottom (only show for non-reviews tabs) */}
        {activeTab !== 'reviews' && (
          <div className="mt-6 bg-white rounded-lg shadow-sm p-4 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-emerald-700 disabled:opacity-50 transition-all duration-200 shadow-lg shadow-emerald-500/25 font-semibold"
            >
              <FaSave />
              {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
            </button>
          </div>
        )}
      </form>

      {/* Google Reviews Tab - Outside Form */}
      {activeTab === 'reviews' && (
        <div className="space-y-6">
          <GoogleReviewsManager />
        </div>
      )}
    </div>
  );
};

export default HomePageEditor;
