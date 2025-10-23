import { useState, useEffect } from 'react';
import { FaSave, FaPlus, FaTrash, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import api from '../../services/api';

const ContactPageEditor = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const [formData, setFormData] = useState({
    hero_title: '',
    hero_subtitle: '',
    phone_number: '',
    phone_label: '',
    whatsapp_number: '',
    whatsapp_label: '',
    email_primary: '',
    email_secondary: '',
    address_line1: '',
    address_line2: '',
    google_maps_url: '',
    google_maps_embed: '',
    working_hours: [],
    why_contact_us: [],
    emergency_title: '',
    emergency_subtitle: '',
    emergency_phone: '',
    emergency_whatsapp: '',
  });

  useEffect(() => {
    fetchContactPage();
  }, []);

  const fetchContactPage = async () => {
    try {
      const data = await api.contactPage.get();
      // API returns array, get first element
      const pageData = Array.isArray(data) ? data[0] : data;

      // Merge with default formData to ensure all fields exist
      setFormData({
        hero_title: pageData?.hero_title || '',
        hero_subtitle: pageData?.hero_subtitle || '',
        phone_number: pageData?.phone_number || '',
        phone_label: pageData?.phone_label || '',
        whatsapp_number: pageData?.whatsapp_number || '',
        whatsapp_label: pageData?.whatsapp_label || '',
        email_primary: pageData?.email_primary || '',
        email_secondary: pageData?.email_secondary || '',
        address_line1: pageData?.address_line1 || '',
        address_line2: pageData?.address_line2 || '',
        google_maps_url: pageData?.google_maps_url || '',
        google_maps_embed: pageData?.google_maps_embed || '',
        working_hours: pageData?.working_hours || [],
        why_contact_us: pageData?.why_contact_us || [],
        emergency_title: pageData?.emergency_title || '',
        emergency_subtitle: pageData?.emergency_subtitle || '',
        emergency_phone: pageData?.emergency_phone || '',
        emergency_whatsapp: pageData?.emergency_whatsapp || '',
      });
    } catch (error) {
      console.error('İletişim sayfası yüklenemedi:', error);
      showMessage('error', 'Sayfa yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleWorkingHourChange = (index, field, value) => {
    const newHours = [...(formData.working_hours || [])];
    newHours[index][field] = value;
    setFormData(prev => ({ ...prev, working_hours: newHours }));
  };

  const addWorkingHour = () => {
    setFormData(prev => ({
      ...prev,
      working_hours: [...(prev.working_hours || []), { day: '', hours: '' }]
    }));
  };

  const removeWorkingHour = (index) => {
    setFormData(prev => ({
      ...prev,
      working_hours: (prev.working_hours || []).filter((_, i) => i !== index)
    }));
  };

  const handleWhyContactChange = (index, field, value) => {
    const newItems = [...(formData.why_contact_us || [])];
    newItems[index][field] = value;
    setFormData(prev => ({ ...prev, why_contact_us: newItems }));
  };

  const addWhyContact = () => {
    setFormData(prev => ({
      ...prev,
      why_contact_us: [...(prev.why_contact_us || []), { icon: '🏥', title: '', description: '' }]
    }));
  };

  const removeWhyContact = (index) => {
    setFormData(prev => ({
      ...prev,
      why_contact_us: (prev.why_contact_us || []).filter((_, i) => i !== index)
    }));
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await api.contactPage.update(formData);
      showMessage('success', 'Değişiklikler kaydedildi!');
    } catch (error) {
      console.error('Kaydetme hatası:', error);
      showMessage('error', 'Kaydetme sırasında hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">İletişim Sayfası Düzenle</h1>
        <p className="text-gray-600">İletişim sayfasının içeriğini buradan düzenleyebilirsiniz.</p>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-xl ${
          message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {message.type === 'success' ? '✅' : '❌'} {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Hero Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            📝 Hero Bölümü
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ana Başlık</label>
              <input
                type="text"
                value={formData.hero_title}
                onChange={(e) => handleChange('hero_title', e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Alt Başlık</label>
              <textarea
                value={formData.hero_subtitle}
                onChange={(e) => handleChange('hero_subtitle', e.target.value)}
                rows="2"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              />
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            📞 İletişim Bilgileri
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Telefon Numarası</label>
              <input
                type="text"
                value={formData.phone_number}
                onChange={(e) => handleChange('phone_number', e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Telefon Etiketi</label>
              <input
                type="text"
                value={formData.phone_label}
                onChange={(e) => handleChange('phone_label', e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp Numarası</label>
              <input
                type="text"
                value={formData.whatsapp_number}
                onChange={(e) => handleChange('whatsapp_number', e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp Etiketi</label>
              <input
                type="text"
                value={formData.whatsapp_label}
                onChange={(e) => handleChange('whatsapp_label', e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Birincil E-posta</label>
              <input
                type="email"
                value={formData.email_primary}
                onChange={(e) => handleChange('email_primary', e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">İkincil E-posta</label>
              <input
                type="email"
                value={formData.email_secondary}
                onChange={(e) => handleChange('email_secondary', e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Address & Map */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <FaMapMarkerAlt className="text-purple-600" /> Adres ve Konum
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Adres Satır 1</label>
              <input
                type="text"
                value={formData.address_line1}
                onChange={(e) => handleChange('address_line1', e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Adres Satır 2</label>
              <input
                type="text"
                value={formData.address_line2}
                onChange={(e) => handleChange('address_line2', e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Google Maps URL
                <span className="text-xs text-gray-500 ml-2">(Haritada konuma sağ tıklayın → Paylaş → Link kopyala)</span>
              </label>
              <input
                type="url"
                value={formData.google_maps_url}
                onChange={(e) => handleChange('google_maps_url', e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Google Maps Embed URL
                <span className="text-xs text-gray-500 ml-2">(Google Maps → Paylaş → Harita yerleştir → HTML kodu kopyala → src kısmını yapıştır)</span>
              </label>
              <textarea
                value={formData.google_maps_embed}
                onChange={(e) => handleChange('google_maps_embed', e.target.value)}
                rows="3"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none font-mono text-sm"
              />
            </div>
          </div>
        </div>

        {/* Working Hours */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <FaClock className="text-purple-600" /> Çalışma Saatleri
            </h2>
            <button
              type="button"
              onClick={addWorkingHour}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
            >
              <FaPlus /> Ekle
            </button>
          </div>
          <div className="space-y-3">
            {(formData.working_hours || []).map((hour, index) => (
              <div key={index} className="flex gap-3 items-center">
                <input
                  type="text"
                  placeholder="Gün (örn: Pazartesi - Cuma)"
                  value={hour.day}
                  onChange={(e) => handleWorkingHourChange(index, 'day', e.target.value)}
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="Saatler (örn: 09:00 - 19:00)"
                  value={hour.hours}
                  onChange={(e) => handleWorkingHourChange(index, 'hours', e.target.value)}
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => removeWorkingHour(index)}
                  className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Why Contact Us */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              💡 Neden Bize Ulaşmalısınız
            </h2>
            <button
              type="button"
              onClick={addWhyContact}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
            >
              <FaPlus /> Ekle
            </button>
          </div>
          <div className="space-y-4">
            {(formData.why_contact_us || []).map((item, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-gray-700">Öğe {index + 1}</h3>
                  <button
                    type="button"
                    onClick={() => removeWhyContact(index)}
                    className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                  >
                    <FaTrash />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">İkon (Emoji)</label>
                    <input
                      type="text"
                      placeholder="🏥"
                      value={item.icon}
                      onChange={(e) => handleWhyContactChange(index, 'icon', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-2xl text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Başlık</label>
                    <input
                      type="text"
                      placeholder="7/24 Hizmet"
                      value={item.title}
                      onChange={(e) => handleWhyContactChange(index, 'title', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
                    <input
                      type="text"
                      placeholder="Her zaman ulaşılabilir"
                      value={item.description}
                      onChange={(e) => handleWhyContactChange(index, 'description', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            🚨 Acil Durum Bölümü
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Başlık</label>
              <input
                type="text"
                value={formData.emergency_title}
                onChange={(e) => handleChange('emergency_title', e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Alt Başlık</label>
              <textarea
                value={formData.emergency_subtitle}
                onChange={(e) => handleChange('emergency_subtitle', e.target.value)}
                rows="2"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Acil Telefon</label>
              <input
                type="text"
                value={formData.emergency_phone}
                onChange={(e) => handleChange('emergency_phone', e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Acil WhatsApp</label>
              <input
                type="text"
                value={formData.emergency_whatsapp}
                onChange={(e) => handleChange('emergency_whatsapp', e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {saving ? (
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
      </form>
    </div>
  );
};

export default ContactPageEditor;
