import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FaCalendarAlt, FaClock, FaCheckCircle, FaTimes, FaSearch,
  FaFilter, FaEye, FaPaw, FaPhone, FaEnvelope
} from 'react-icons/fa';

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    filterAppointments();
  }, [searchTerm, statusFilter, appointments]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      console.log('Fetching appointments from API...');
      // Fetch real appointments from API
      const response = await fetch('http://localhost:8000/api/appointments/');
      console.log('Response status:', response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Appointments data:', data);
      console.log('Is array?', Array.isArray(data));

      // Ensure data is an array
      const dataArray = Array.isArray(data) ? data : (data.results || []);
      console.log('Data array:', dataArray);

      // Transform data to match expected format
      const transformedData = dataArray.map(apt => ({
        id: apt.id,
        petName: apt.pet_name,
        petType: apt.pet_type,
        ownerName: apt.owner_name,
        ownerPhone: apt.owner_phone,
        ownerEmail: apt.owner_email,
        date: apt.date,
        time: apt.time,
        status: apt.status,
        service: apt.service,
        notes: apt.notes || ''
      }));

      console.log('Transformed data:', transformedData);
      setAppointments(transformedData);
      setLoading(false);
    } catch (error) {
      console.error('Randevular yüklenemedi:', error);
      // If API fails, show empty array instead of mock data
      setAppointments([]);
      setLoading(false);
    }
  };

  const fetchAppointments_OLD_MOCK = async () => {
    try {
      setLoading(true);
      // OLD Mock data - replaced with real API
      const mockAppointments = [
        {
          id: 1,
          petName: 'Pamuk',
          petType: 'Golden Retriever',
          ownerName: 'Ali Yılmaz',
          ownerPhone: '0532 123 45 67',
          ownerEmail: 'ali@example.com',
          date: '2025-01-15',
          time: '10:00',
          status: 'pending',
          service: 'Genel Muayene',
          notes: 'İlk muayene'
        },
        {
          id: 2,
          petName: 'Minnoş',
          petType: 'Kedi',
          ownerName: 'Ayşe Demir',
          ownerPhone: '0533 234 56 78',
          ownerEmail: 'ayse@example.com',
          date: '2025-01-15',
          time: '11:30',
          status: 'confirmed',
          service: 'Aşı',
          notes: 'Yıllık aşı kontrolü'
        },
        {
          id: 3,
          petName: 'Karabaş',
          petType: 'Kangal',
          ownerName: 'Mehmet Kaya',
          ownerPhone: '0534 345 67 89',
          ownerEmail: 'mehmet@example.com',
          date: '2025-01-16',
          time: '14:00',
          status: 'pending',
          service: 'Cerrahi',
          notes: 'Kısırlaştırma operasyonu'
        },
        {
          id: 4,
          petName: 'Boncuk',
          petType: 'Muhabbet Kuşu',
          ownerName: 'Fatma Öz',
          ownerPhone: '0535 456 78 90',
          ownerEmail: 'fatma@example.com',
          date: '2025-01-16',
          time: '15:30',
          status: 'completed',
          service: 'Kontrol',
          notes: 'Rutin kontrol'
        },
        {
          id: 5,
          petName: 'Cıvıl',
          petType: 'Muhabbet Kuşu',
          ownerName: 'Can Arslan',
          ownerPhone: '0536 567 89 01',
          ownerEmail: 'can@example.com',
          date: '2025-01-17',
          time: '09:00',
          status: 'cancelled',
          service: 'Aşı',
          notes: 'Hasta iptal etti'
        },
        {
          id: 6,
          petName: 'Tombik',
          petType: 'Kedi',
          ownerName: 'Zeynep Yıldız',
          ownerPhone: '0537 678 90 12',
          ownerEmail: 'zeynep@example.com',
          date: '2025-01-17',
          time: '10:30',
          status: 'confirmed',
          service: 'Diş Temizliği',
          notes: 'Diş taşı temizliği'
        },
      ];
      setAppointments(mockAppointments);
      setLoading(false);
    } catch (error) {
      console.error('Randevular yüklenemedi:', error);
      setLoading(false);
    }
  };

  const filterAppointments = () => {
    let filtered = appointments;

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(apt => apt.status === statusFilter);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(apt =>
        apt.petName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.petType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.service.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredAppointments(filtered);
  };

  const updateAppointmentStatus = async (id, newStatus) => {
    try {
      // Update on backend
      const response = await fetch(`http://localhost:8000/api/appointments/${id}/update_status/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        // Update local state
        setAppointments(prev =>
          prev.map(apt => apt.id === id ? { ...apt, status: newStatus } : apt)
        );
        if (selectedAppointment?.id === id) {
          setSelectedAppointment(prev => ({ ...prev, status: newStatus }));
        }
      } else {
        alert('Durum güncellenemedi. Lütfen tekrar deneyin.');
      }
    } catch (error) {
      console.error('Durum güncelleme hatası:', error);
      alert('Bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  const statusColors = {
    pending: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Bekliyor', icon: FaClock },
    confirmed: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Onaylandı', icon: FaCheckCircle },
    completed: { bg: 'bg-green-100', text: 'text-green-700', label: 'Tamamlandı', icon: FaCheckCircle },
    cancelled: { bg: 'bg-red-100', text: 'text-red-700', label: 'İptal', icon: FaTimes },
  };

  const stats = {
    total: appointments.length,
    pending: appointments.filter(a => a.status === 'pending').length,
    confirmed: appointments.filter(a => a.status === 'confirmed').length,
    completed: appointments.filter(a => a.status === 'completed').length,
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
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm mb-1">Toplam</p>
              <p className="text-3xl font-bold">{stats.total}</p>
            </div>
            <FaCalendarAlt className="text-5xl text-white/20" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm mb-1">Bekleyen</p>
              <p className="text-3xl font-bold">{stats.pending}</p>
            </div>
            <FaClock className="text-5xl text-white/20" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-blue-400 to-blue-500 rounded-2xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm mb-1">Onaylanan</p>
              <p className="text-3xl font-bold">{stats.confirmed}</p>
            </div>
            <FaCheckCircle className="text-5xl text-white/20" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm mb-1">Tamamlanan</p>
              <p className="text-3xl font-bold">{stats.completed}</p>
            </div>
            <FaPaw className="text-5xl text-white/20" />
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
      >
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Pet adı, sahip adı, hizmet ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <FaFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-12 pr-8 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none appearance-none bg-white cursor-pointer min-w-[200px]"
            >
              <option value="all">Tüm Durumlar</option>
              <option value="pending">Bekleyen</option>
              <option value="confirmed">Onaylanan</option>
              <option value="completed">Tamamlanan</option>
              <option value="cancelled">İptal Edilen</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Appointments List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
      >
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <FaCalendarAlt className="text-purple-600" />
            Randevular ({filteredAppointments.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          {filteredAppointments.length > 0 ? (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Pet Bilgileri</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Sahip</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Tarih & Saat</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Hizmet</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Durum</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredAppointments.map((appointment) => {
                  const StatusIcon = statusColors[appointment.status].icon;
                  return (
                    <tr key={appointment.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                            <FaPaw className="text-purple-600" />
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">{appointment.petName}</p>
                            <p className="text-sm text-gray-500">{appointment.petType}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-gray-900">{appointment.ownerName}</p>
                          <p className="text-sm text-gray-500 flex items-center gap-1">
                            <FaPhone size={10} /> {appointment.ownerPhone}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-gray-900">{new Date(appointment.date).toLocaleDateString('tr-TR')}</p>
                          <p className="text-sm text-gray-500 flex items-center gap-1">
                            <FaClock size={10} /> {appointment.time}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                          {appointment.service}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-2 px-3 py-1 ${statusColors[appointment.status].bg} ${statusColors[appointment.status].text} rounded-full text-sm font-bold`}>
                          <StatusIcon size={12} />
                          {statusColors[appointment.status].label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedAppointment(appointment)}
                            className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                            title="Detayları Görüntüle"
                          >
                            <FaEye />
                          </button>
                          {appointment.status === 'pending' && (
                            <button
                              onClick={() => updateAppointmentStatus(appointment.id, 'confirmed')}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Onayla"
                            >
                              <FaCheckCircle />
                            </button>
                          )}
                          {(appointment.status === 'pending' || appointment.status === 'confirmed') && (
                            <button
                              onClick={() => updateAppointmentStatus(appointment.id, 'cancelled')}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="İptal Et"
                            >
                              <FaTimes />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <FaCalendarAlt className="text-5xl mx-auto mb-3 opacity-30" />
              <p className="font-medium">Randevu bulunamadı</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Appointment Detail Modal */}
      {selectedAppointment && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedAppointment(null)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-900">Randevu Detayları</h3>
              <button
                onClick={() => setSelectedAppointment(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaTimes className="text-gray-600" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Pet Info */}
              <div className="bg-purple-50 rounded-xl p-6">
                <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FaPaw className="text-purple-600" />
                  Pet Bilgileri
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Pet Adı</p>
                    <p className="font-bold text-gray-900">{selectedAppointment.petName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Tür</p>
                    <p className="font-bold text-gray-900">{selectedAppointment.petType}</p>
                  </div>
                </div>
              </div>

              {/* Owner Info */}
              <div className="bg-blue-50 rounded-xl p-6">
                <h4 className="font-bold text-gray-900 mb-4">Sahip Bilgileri</h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">İsim</p>
                    <p className="font-bold text-gray-900">{selectedAppointment.ownerName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1 flex items-center gap-2">
                      <FaPhone size={12} /> Telefon
                    </p>
                    <p className="font-bold text-gray-900">{selectedAppointment.ownerPhone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1 flex items-center gap-2">
                      <FaEnvelope size={12} /> E-posta
                    </p>
                    <p className="font-bold text-gray-900">{selectedAppointment.ownerEmail}</p>
                  </div>
                </div>
              </div>

              {/* Appointment Info */}
              <div className="bg-green-50 rounded-xl p-6">
                <h4 className="font-bold text-gray-900 mb-4">Randevu Bilgileri</h4>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Tarih</p>
                    <p className="font-bold text-gray-900">{new Date(selectedAppointment.date).toLocaleDateString('tr-TR')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Saat</p>
                    <p className="font-bold text-gray-900">{selectedAppointment.time}</p>
                  </div>
                </div>
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-1">Hizmet</p>
                  <p className="font-bold text-gray-900">{selectedAppointment.service}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Durum</p>
                  <span className={`inline-flex items-center gap-2 px-3 py-1 ${statusColors[selectedAppointment.status].bg} ${statusColors[selectedAppointment.status].text} rounded-full text-sm font-bold`}>
                    {statusColors[selectedAppointment.status].label}
                  </span>
                </div>
              </div>

              {/* Notes */}
              {selectedAppointment.notes && (
                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="font-bold text-gray-900 mb-2">Notlar</h4>
                  <p className="text-gray-700">{selectedAppointment.notes}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                {selectedAppointment.status === 'pending' && (
                  <button
                    onClick={() => {
                      updateAppointmentStatus(selectedAppointment.id, 'confirmed');
                      setSelectedAppointment(null);
                    }}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-bold rounded-xl hover:shadow-lg transition-all"
                  >
                    Randevuyu Onayla
                  </button>
                )}
                {selectedAppointment.status === 'confirmed' && (
                  <button
                    onClick={() => {
                      updateAppointmentStatus(selectedAppointment.id, 'completed');
                      setSelectedAppointment(null);
                    }}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-xl hover:shadow-lg transition-all"
                  >
                    Tamamlandı Olarak İşaretle
                  </button>
                )}
                {(selectedAppointment.status === 'pending' || selectedAppointment.status === 'confirmed') && (
                  <button
                    onClick={() => {
                      updateAppointmentStatus(selectedAppointment.id, 'cancelled');
                      setSelectedAppointment(null);
                    }}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-xl hover:shadow-lg transition-all"
                  >
                    İptal Et
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default AppointmentsPage;
