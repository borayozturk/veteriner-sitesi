import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaSave, FaSpinner } from 'react-icons/fa';

const ServicesPageEditor = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({
    hero_title_line1: '',
    hero_title_line2: '',
    hero_description: '',
    hero_phone: '',
    hero_phone_link: '',
    feature_pills: [],
    stats: [],
    cta_title: '',
    cta_subtitle: '',
    cta_description: '',
    cta_phone: ''
  });

  useEffect(() => {
    fetchPageSettings();
  }, []);

  const fetchPageSettings = async () => {
    try {
      const response = await fetch(import.meta.env.VITE_API_URL + '/api/services-page/');
      const data = await response.json();
      console.log('Fetched services page data:', data);
      setFormData(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching services page settings:', error);
      setMessage({ type: 'error', text: 'Sayfa ayarları yüklenemedi' });
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/services-page/1/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Değişiklikler başarıyla kaydedildi!' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } else {
        throw new Error('Kaydetme başarısız');
      }
    } catch (error) {
      console.error('Error saving:', error);
      setMessage({ type: 'error', text: 'Kaydetme sırasında bir hata oluştu' });
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFeaturePillChange = (index, field, value) => {
    const newPills = [...formData.feature_pills];
    newPills[index] = { ...newPills[index], [field]: value };
    setFormData(prev => ({ ...prev, feature_pills: newPills }));
  };

  const handleStatChange = (index, field, value) => {
    const newStats = [...formData.stats];
    newStats[index] = { ...newStats[index], [field]: value };
    setFormData(prev => ({ ...prev, stats: newStats }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <FaSpinner className="animate-spin text-4xl text-purple-600" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl p-8"
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Hizmetler Sayfası Düzenle</h1>
          <p className="text-gray-600">Hero bölümü, istatistikler ve CTA alanlarını düzenleyin</p>
        </div>

        {message.text && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Hero Section */}
          <div className="border-b pb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Hero Bölümü</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Ana Başlık Satır 1
                </label>
                <input
                  type="text"
                  name="hero_title_line1"
                  value={formData.hero_title_line1}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Evcil Dostlarınız İçin"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Ana Başlık Satır 2 (Vurgulu)
                </label>
                <input
                  type="text"
                  name="hero_title_line2"
                  value={formData.hero_title_line2}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Kapsamlı Hizmetler"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Açıklama
                </label>
                <textarea
                  name="hero_description"
                  value={formData.hero_description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Modern ekipmanlarımız ve uzman veteriner kadromuzla..."
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Telefon Numarası (Görünen)
                  </label>
                  <input
                    type="text"
                    name="hero_phone"
                    value={formData.hero_phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="(0212) 123 45 67"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Telefon Link (tel: formatı)
                  </label>
                  <input
                    type="text"
                    name="hero_phone_link"
                    value={formData.hero_phone_link}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="+902121234567"
                  />
                  <p className="text-xs text-gray-500 mt-1">Telefon butonunda kullanılır</p>
                </div>
              </div>
            </div>
          </div>

          {/* Feature Pills */}
          <div className="border-b pb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Özellik Pilleri (3 adet)</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {formData.feature_pills?.map((pill, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <label className="block text-xs font-semibold text-gray-600 mb-2">
                    İkon (Emoji)
                  </label>
                  <input
                    type="text"
                    value={pill.icon}
                    onChange={(e) => handleFeaturePillChange(index, 'icon', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded mb-3"
                    placeholder="🏥"
                  />
                  <label className="block text-xs font-semibold text-gray-600 mb-2">
                    Metin
                  </label>
                  <input
                    type="text"
                    value={pill.text}
                    onChange={(e) => handleFeaturePillChange(index, 'text', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                    placeholder="Modern Klinik"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="border-b pb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">İstatistikler (5 adet)</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {formData.stats?.map((stat, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-bold text-sm text-gray-700 mb-3">İstatistik {index + 1}</h3>
                  <div className="space-y-2">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Sayı</label>
                      <input
                        type="text"
                        value={stat.number}
                        onChange={(e) => handleStatChange(index, 'number', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                        placeholder="21+"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Etiket</label>
                      <input
                        type="text"
                        value={stat.label}
                        onChange={(e) => handleStatChange(index, 'label', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                        placeholder="Hizmet Dalı"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">İkon</label>
                      <input
                        type="text"
                        value={stat.icon}
                        onChange={(e) => handleStatChange(index, 'icon', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                        placeholder="🩺"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">
                        Gradient (Tailwind class)
                      </label>
                      <input
                        type="text"
                        value={stat.gradient}
                        onChange={(e) => handleStatChange(index, 'gradient', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                        placeholder="from-emerald-500 to-cyan-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="border-b pb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">CTA Bölümü (Daha Fazla Bilgi)</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Başlık
                </label>
                <input
                  type="text"
                  name="cta_title"
                  value={formData.cta_title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Daha Fazla Bilgi İçin"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Alt Başlık (Vurgulu)
                </label>
                <input
                  type="text"
                  name="cta_subtitle"
                  value={formData.cta_subtitle}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Bize Ulaşın"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Açıklama
                </label>
                <textarea
                  name="cta_description"
                  value={formData.cta_description}
                  onChange={handleInputChange}
                  rows="2"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Size en uygun hizmeti bulmak ve randevu oluşturmak için..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Telefon Numarası
                </label>
                <input
                  type="text"
                  name="cta_phone"
                  value={formData.cta_phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="(0212) 123 45 67"
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <FaSpinner className="animate-spin" />
                  <span>Kaydediliyor...</span>
                </>
              ) : (
                <>
                  <FaSave />
                  <span>Değişiklikleri Kaydet</span>
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ServicesPageEditor;
