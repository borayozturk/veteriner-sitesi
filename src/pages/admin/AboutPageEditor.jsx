import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaSave, FaUndo, FaPlus, FaTrash } from 'react-icons/fa';
import api from '../../services/api';

const AboutPageEditor = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    hero_subtitle: '',
    stats: [
      { number: '', label: '' },
      { number: '', label: '' },
      { number: '', label: '' },
      { number: '', label: '' }
    ],
    story_title: '',
    story_paragraph_1: '',
    story_paragraph_2: '',
    values: []
  });
  const [originalData, setOriginalData] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await api.aboutPage.get();
      if (data) {
        // Ensure values array exists
        const formattedData = {
          ...data,
          values: data.values || []
        };
        setFormData(formattedData);
        setOriginalData(formattedData);
      }
      setLoading(false);
    } catch (error) {
      console.error('Veri yüklenemedi:', error);
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await api.aboutPage.update(formData);
      alert('Hakkımızda sayfası başarıyla güncellendi!');
      setOriginalData(formData);
      setSaving(false);
    } catch (error) {
      console.error('Kaydetme hatası:', error);
      alert('Kaydetme sırasında bir hata oluştu.');
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (originalData && window.confirm('Tüm değişiklikler kaybolacak. Emin misiniz?')) {
      setFormData(originalData);
    }
  };

  const updateStat = (index, field, value) => {
    const newStats = [...formData.stats];
    newStats[index] = { ...newStats[index], [field]: value };
    setFormData({ ...formData, stats: newStats });
  };

  const updateValue = (index, field, value) => {
    const newValues = [...(formData.values || [])];
    newValues[index] = { ...newValues[index], [field]: value };
    setFormData({ ...formData, values: newValues });
  };

  const addValue = () => {
    setFormData({
      ...formData,
      values: [...(formData.values || []), { icon: 'FaHeart', title: '', description: '' }]
    });
  };

  const removeValue = (index) => {
    setFormData({
      ...formData,
      values: (formData.values || []).filter((_, i) => i !== index)
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white shadow-lg"
      >
        <h1 className="text-4xl font-bold mb-2">Hakkımızda Sayfası Düzenle</h1>
        <p className="text-purple-100">Hero bölümü, istatistikler ve hikaye metnini düzenleyin</p>
      </motion.div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
      >
        <div className="space-y-8">
          {/* Hero Section */}
          <div className="border-b border-gray-200 pb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">🎯 Hero Bölümü</h2>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Alt Başlık
              </label>
              <textarea
                value={formData.hero_subtitle}
                onChange={(e) => setFormData({ ...formData, hero_subtitle: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none resize-none"
                rows="2"
                placeholder="Örn: Evcil dostlarınızın sağlığı ve mutluluğu için 10+ yıldır hizmetinizdeyiz"
              />
              <p className="text-xs text-gray-500 mt-1">Ana başlığın altında görünen metin</p>
            </div>
          </div>

          {/* Stats Section */}
          <div className="border-b border-gray-200 pb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">📊 İstatistikler</h2>

            <div className="grid md:grid-cols-2 gap-6">
              {formData.stats.map((stat, index) => (
                <div key={index} className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">İstatistik {index + 1}</h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Sayı/Değer
                      </label>
                      <input
                        type="text"
                        value={stat.number}
                        onChange={(e) => updateStat(index, 'number', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all outline-none"
                        placeholder="Örn: 10+, 25K+, %99"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Açıklama
                      </label>
                      <input
                        type="text"
                        value={stat.label}
                        onChange={(e) => updateStat(index, 'label', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all outline-none"
                        placeholder="Örn: Yıllık Tecrübe, Mutlu Hasta"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Story Section */}
          <div className="border-b border-gray-200 pb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">📖 Hikayemiz Bölümü</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Bölüm Başlığı
                </label>
                <input
                  type="text"
                  value={formData.story_title}
                  onChange={(e) => setFormData({ ...formData, story_title: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none"
                  placeholder="Örn: Hikayemiz"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Paragraf 1
                </label>
                <textarea
                  value={formData.story_paragraph_1}
                  onChange={(e) => setFormData({ ...formData, story_paragraph_1: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none resize-none"
                  rows="4"
                  placeholder="İlk paragraf..."
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Paragraf 2
                </label>
                <textarea
                  value={formData.story_paragraph_2}
                  onChange={(e) => setFormData({ ...formData, story_paragraph_2: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none resize-none"
                  rows="4"
                  placeholder="İkinci paragraf..."
                />
              </div>
            </div>
          </div>

          {/* Values Section */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">💎 Değerlerimiz</h2>
              <button
                type="button"
                onClick={addValue}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <FaPlus /> Değer Ekle
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {(formData.values || []).map((value, index) => (
                <div key={index} className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900">Değer {index + 1}</h3>
                    <button
                      type="button"
                      onClick={() => removeValue(index)}
                      className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                    >
                      <FaTrash />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        İkon (React Icons ismi)
                      </label>
                      <input
                        type="text"
                        value={value.icon || ''}
                        onChange={(e) => updateValue(index, 'icon', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all outline-none"
                        placeholder="Örn: FaHeart, FaAward, FaUserMd, FaPaw"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Kullanılabilir: FaHeart, FaAward, FaUserMd, FaPaw, FaStar, FaShieldAlt
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Başlık
                      </label>
                      <input
                        type="text"
                        value={value.title || ''}
                        onChange={(e) => updateValue(index, 'title', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all outline-none"
                        placeholder="Örn: Sevgi ve Özen"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Açıklama
                      </label>
                      <textarea
                        value={value.description || ''}
                        onChange={(e) => updateValue(index, 'description', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all outline-none resize-none"
                        rows="3"
                        placeholder="Değerin açıklaması..."
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {(formData.values || []).length === 0 && (
              <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                <p className="text-gray-500 mb-4">Henüz değer eklenmemiş</p>
                <button
                  type="button"
                  onClick={addValue}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  İlk Değeri Ekle
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-end mt-8 pt-8 border-t border-gray-200">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-300 transition-colors"
            disabled={saving}
          >
            <FaUndo />
            Sıfırla
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaSave />
            {saving ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AboutPageEditor;
