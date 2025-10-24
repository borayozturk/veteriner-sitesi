import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEdit, FaSave, FaTimes, FaPlus, FaTrash, FaEye, FaEyeSlash } from 'react-icons/fa';

const ServicesManagePage = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await fetch(import.meta.env.VITE_API_URL + '/api/services/all/', {
        headers: {
          'Accept': 'application/json; charset=utf-8',
        },
      });
      const data = await response.json();
      console.log('🔍 Admin - Fetched ALL services:', data.length, 'services');
      setServices(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (error) {
      console.error('Hizmetler yüklenemedi:', error);
      setLoading(false);
    }
  };

  const handleToggleActive = async (service) => {
    try {
      setSaving(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/services/${service.id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Accept': 'application/json; charset=utf-8',
        },
        body: JSON.stringify({
          is_active: !service.is_active
        }),
      });

      if (!response.ok) {
        throw new Error('Güncelleme başarısız');
      }

      // Refetch all services from backend to get fresh data
      await fetchServices();
      setSaving(false);
    } catch (error) {
      console.error('Hizmet güncellenemedi:', error);
      alert('Hizmet durumu güncellenirken bir hata oluştu.');
      setSaving(false);
    }
  };

  const handleEditService = (service) => {
    // Navigate to page editor with service slug as query parameter
    navigate(`/admin/sayfa-duzenle?page=${service.slug}`);
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
        <h1 className="text-4xl font-bold mb-2">Hizmetler</h1>
        <p className="text-purple-100">Sunduğunuz hizmetleri seçin. Aktif hizmetler web sitesinde görünür.</p>
      </motion.div>

      {/* Services Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid gap-4"
      >
        {services.length > 0 ? (
          services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className={`bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all group border-2 ${
                service.is_active
                  ? 'border-green-200 bg-gradient-to-r from-green-50 to-white'
                  : 'border-gray-200 opacity-60'
              }`}
            >
              <div className="p-6">
                <div className="flex items-center justify-between gap-4">
                  {/* Service Info */}
                  <div className="flex items-center gap-4 flex-1">
                    {/* Icon */}
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${
                      service.is_active
                        ? 'bg-gradient-to-br from-purple-600 to-pink-600'
                        : 'bg-gray-300'
                    }`}>
                      <span className="text-3xl">{service.icon}</span>
                    </div>

                    {/* Details */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">
                          {service.title}
                        </h3>
                        {service.is_active && (
                          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                            Aktif
                          </span>
                        )}
                        {!service.is_active && (
                          <span className="px-3 py-1 bg-gray-200 text-gray-600 text-xs font-bold rounded-full">
                            Pasif
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {service.short_description}
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        Slug: <span className="font-mono">{service.slug}</span>
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex-shrink-0 flex gap-3">
                    <button
                      onClick={() => handleEditService(service)}
                      className="flex items-center gap-2 px-6 py-3 bg-blue-100 text-blue-700 font-semibold rounded-xl hover:bg-blue-200 transition-all"
                    >
                      <FaEdit size={16} />
                      <span>Düzenle</span>
                    </button>

                    <button
                      onClick={() => handleToggleActive(service)}
                      disabled={saving}
                      className={`flex items-center gap-2 px-6 py-3 font-semibold rounded-xl transition-all ${
                        service.is_active
                          ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:shadow-lg hover:scale-105'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {service.is_active ? (
                        <>
                          <FaEyeSlash size={16} />
                          <span>Gizle</span>
                        </>
                      ) : (
                        <>
                          <FaEye size={16} />
                          <span>Göster</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-20">
            <p className="font-medium text-gray-500">Henüz hizmet bulunmuyor</p>
          </div>
        )}
      </motion.div>

      {/* Info Box */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6"
      >
        <div className="flex gap-3">
          <span className="text-2xl">ℹ️</span>
          <div>
            <h3 className="font-bold text-blue-900 mb-2">Bilgi</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• <strong>Aktif hizmetler</strong> web sitesinde ziyaretçilere gösterilir</li>
              <li>• <strong>Pasif hizmetler</strong> gizlenir, ancak sayfa içerikleri korunur</li>
              <li>• Hizmet sırasını ve detaylarını değiştirmek için gelişmiş ayarlardan yararlanın</li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-2 gap-6"
      >
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-green-500 rounded-2xl flex items-center justify-center">
              <FaEye className="text-white text-2xl" />
            </div>
            <div>
              <p className="text-sm text-green-600 font-semibold">Aktif Hizmetler</p>
              <p className="text-3xl font-black text-green-900">
                {services.filter(s => s.is_active).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-50 to-slate-50 border-2 border-gray-200 rounded-2xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gray-400 rounded-2xl flex items-center justify-center">
              <FaEyeSlash className="text-white text-2xl" />
            </div>
            <div>
              <p className="text-sm text-gray-600 font-semibold">Pasif Hizmetler</p>
              <p className="text-3xl font-black text-gray-900">
                {services.filter(s => !s.is_active).length}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ServicesManagePage;
