import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaUserMd, FaSearch, FaPlus, FaEdit, FaTrash, FaTimes,
  FaPhone, FaEnvelope, FaStar, FaGraduationCap, FaCheckCircle, FaTimesCircle, FaUpload
} from 'react-icons/fa';
import api from '../../services/api';

const VeterinariansPage = () => {
  const [vets, setVets] = useState([]);
  const [filteredVets, setFilteredVets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, active, inactive
  const [showModal, setShowModal] = useState(false);
  const [editingVet, setEditingVet] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    specialty: '',
    bio: '',
    avatar: '',
    experience_years: '',
    education: '',
    graduation_year: '',
    certifications: '',
    expertise_areas: '',
    achievements: '',
    monday_hours: '',
    tuesday_hours: '',
    wednesday_hours: '',
    thursday_hours: '',
    friday_hours: '',
    saturday_hours: '',
    sunday_hours: '',
    phone: '',
    email: '',
    address: '',
    is_active: true
  });

  useEffect(() => {
    fetchVets();
  }, []);

  useEffect(() => {
    filterVets();
  }, [searchTerm, filterStatus, vets]);

  const fetchVets = async () => {
    try {
      setLoading(true);
      const vetsData = await api.veterinarians.getAll();
      const veterinarians = vetsData.results || vetsData;
      setVets(veterinarians);
      setLoading(false);
    } catch (error) {
      console.error('Veterinerler yüklenemedi:', error);
      setLoading(false);
    }
  };

  const filterVets = () => {
    let filtered = vets;

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(vet =>
        filterStatus === 'active' ? vet.is_active : !vet.is_active
      );
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(vet =>
        vet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vet.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (vet.email && vet.email.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredVets(filtered);
  };

  const handleOpenModal = (vet = null) => {
    if (vet) {
      setEditingVet(vet);
      setFormData({
        name: vet.name || '',
        specialty: vet.specialty || '',
        bio: vet.bio || '',
        avatar: vet.avatar || '',
        experience_years: vet.experience_years || '',
        education: vet.education || '',
        graduation_year: vet.graduation_year || '',
        certifications: vet.certifications || '',
        expertise_areas: vet.expertise_areas || '',
        achievements: vet.achievements || '',
        monday_hours: vet.monday_hours || '',
        tuesday_hours: vet.tuesday_hours || '',
        wednesday_hours: vet.wednesday_hours || '',
        thursday_hours: vet.thursday_hours || '',
        friday_hours: vet.friday_hours || '',
        saturday_hours: vet.saturday_hours || '',
        sunday_hours: vet.sunday_hours || '',
        phone: vet.phone || '',
        email: vet.email || '',
        address: vet.address || '',
        is_active: vet.is_active !== undefined ? vet.is_active : true
      });
    } else {
      setEditingVet(null);
      setFormData({
        name: '',
        specialty: '',
        bio: '',
        avatar: '',
        experience_years: '',
        education: '',
        graduation_year: '',
        certifications: '',
        expertise_areas: '',
        achievements: '',
        monday_hours: '',
        tuesday_hours: '',
        wednesday_hours: '',
        thursday_hours: '',
        friday_hours: '',
        saturday_hours: '',
        sunday_hours: '',
        phone: '',
        email: '',
        address: '',
        is_active: true
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingVet(null);
    setAvatarFile(null);
    setAvatarPreview('');
    setFormData({
      name: '',
      specialty: '',
      bio: '',
      avatar: '',
      experience_years: '',
      education: '',
      graduation_year: '',
      certifications: '',
      expertise_areas: '',
      achievements: '',
      monday_hours: '',
      tuesday_hours: '',
      wednesday_hours: '',
      thursday_hours: '',
      friday_hours: '',
      saturday_hours: '',
      sunday_hours: '',
      phone: '',
      email: '',
      address: '',
      is_active: true
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setFormData({ ...formData, avatar: '' }); // Clear URL if file is selected

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      // Validate required fields
      if (!formData.name || !formData.specialty) {
        alert('Ad ve uzmanlık alanı zorunludur.');
        return;
      }

      if (avatarFile) {
        // Use FormData for file upload
        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.name);
        formDataToSend.append('specialty', formData.specialty);
        formDataToSend.append('bio', formData.bio);
        formDataToSend.append('avatar', avatarFile); // File upload
        formDataToSend.append('experience_years', formData.experience_years ? parseInt(formData.experience_years) : 0);
        formDataToSend.append('education', formData.education);
        formDataToSend.append('graduation_year', formData.graduation_year ? parseInt(formData.graduation_year) : '');
        formDataToSend.append('certifications', formData.certifications);
        formDataToSend.append('expertise_areas', formData.expertise_areas);
        formDataToSend.append('achievements', formData.achievements);
        formDataToSend.append('monday_hours', formData.monday_hours);
        formDataToSend.append('tuesday_hours', formData.tuesday_hours);
        formDataToSend.append('wednesday_hours', formData.wednesday_hours);
        formDataToSend.append('thursday_hours', formData.thursday_hours);
        formDataToSend.append('friday_hours', formData.friday_hours);
        formDataToSend.append('saturday_hours', formData.saturday_hours);
        formDataToSend.append('sunday_hours', formData.sunday_hours);
        formDataToSend.append('phone', formData.phone);
        formDataToSend.append('email', formData.email);
        formDataToSend.append('address', formData.address);
        formDataToSend.append('is_active', formData.is_active);

        const url = editingVet
          ? `http://localhost:8000/api/veterinarians/${editingVet.id}/`
          : 'http://localhost:8000/api/veterinarians/';

        const method = editingVet ? 'PUT' : 'POST';

        const response = await fetch(url, {
          method: method,
          body: formDataToSend,
        });

        if (!response.ok) {
          throw new Error('Fotoğraf yüklenirken bir hata oluştu.');
        }

        alert(editingVet ? 'Veteriner başarıyla güncellendi!' : 'Veteriner başarıyla eklendi!');
      } else {
        // Use regular JSON for URL-based avatar - don't include avatar field if it's a URL
        const vetData = {
          name: formData.name,
          specialty: formData.specialty,
          bio: formData.bio,
          // Don't include avatar in the JSON request - update it separately if needed
          experience_years: formData.experience_years ? parseInt(formData.experience_years) : 0,
          education: formData.education,
          graduation_year: formData.graduation_year ? parseInt(formData.graduation_year) : null,
          certifications: formData.certifications,
          expertise_areas: formData.expertise_areas,
          achievements: formData.achievements,
          monday_hours: formData.monday_hours,
          tuesday_hours: formData.tuesday_hours,
          wednesday_hours: formData.wednesday_hours,
          thursday_hours: formData.thursday_hours,
          friday_hours: formData.friday_hours,
          saturday_hours: formData.saturday_hours,
          sunday_hours: formData.sunday_hours,
          phone: formData.phone,
          email: formData.email,
          address: formData.address,
          is_active: formData.is_active
        };

        if (editingVet) {
          // Update existing veterinarian
          const response = await api.veterinarians.update(editingVet.id, vetData);

          // If there's a URL avatar, update it separately via direct fetch
          if (formData.avatar && formData.avatar.trim() !== '') {
            await fetch(`http://localhost:8000/api/veterinarians/${editingVet.id}/`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ avatar: formData.avatar }),
            });
          }

          alert('Veteriner başarıyla güncellendi!');
        } else {
          // Create new veterinarian
          const newVet = await api.veterinarians.create(vetData);

          // If there's a URL avatar, update it after creation
          if (formData.avatar && formData.avatar.trim() !== '' && newVet.id) {
            await fetch(`http://localhost:8000/api/veterinarians/${newVet.id}/`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ avatar: formData.avatar }),
            });
          }

          alert('Veteriner başarıyla eklendi!');
        }
      }

      handleCloseModal();
      fetchVets(); // Refresh the list
    } catch (error) {
      console.error('Veteriner kaydedilemedi:', error);
      alert('Veteriner kaydedilirken bir hata oluştu.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bu veterineri silmek istediğinizden emin misiniz?')) {
      try {
        await api.veterinarians.delete(id);
        setVets(prev => prev.filter(vet => vet.id !== id));
        alert('Veteriner başarıyla silindi!');
      } catch (error) {
        console.error('Veteriner silinemedi:', error);
        alert('Veteriner silinirken bir hata oluştu.');
      }
    }
  };

  const stats = {
    total: vets.length,
    active: vets.filter(v => v.is_active).length,
    inactive: vets.filter(v => !v.is_active).length,
    avgExperience: vets.length > 0 ? Math.round(vets.reduce((sum, vet) => sum + (vet.experience_years || 0), 0) / vets.length) : 0,
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
          className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm mb-1">Toplam Veteriner</p>
              <p className="text-3xl font-bold">{stats.total}</p>
            </div>
            <FaUserMd className="text-5xl text-white/20" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm mb-1">Aktif</p>
              <p className="text-3xl font-bold">{stats.active}</p>
            </div>
            <FaCheckCircle className="text-5xl text-white/20" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm mb-1">Pasif</p>
              <p className="text-3xl font-bold">{stats.inactive}</p>
            </div>
            <FaTimesCircle className="text-5xl text-white/20" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm mb-1">Ort. Deneyim</p>
              <p className="text-3xl font-bold">{stats.avgExperience} yıl</p>
            </div>
            <FaGraduationCap className="text-5xl text-white/20" />
          </div>
        </motion.div>
      </div>

      {/* Search, Filter and Add Button */}
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
              placeholder="İsim, uzmanlık veya e-posta ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none"
            />
          </div>

          {/* Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none font-semibold"
          >
            <option value="all">Tümü</option>
            <option value="active">Aktif</option>
            <option value="inactive">Pasif</option>
          </select>

          {/* Add Button */}
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:shadow-lg transition-all whitespace-nowrap"
          >
            <FaPlus />
            Yeni Veteriner
          </button>
        </div>
      </motion.div>

      {/* Veterinarians Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredVets.length > 0 ? (
          filteredVets.map((vet, index) => (
            <motion.div
              key={vet.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all group"
            >
              {/* Image */}
              <div className="aspect-square overflow-hidden relative">
                <img
                  src={
                    vet.avatar
                      ? (vet.avatar.startsWith('http')
                          ? vet.avatar
                          : `http://localhost:8000${vet.avatar.startsWith('/') ? vet.avatar : '/media/' + vet.avatar}`)
                      : 'https://via.placeholder.com/400?text=Veteriner'
                  }
                  alt={vet.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Status Badge */}
                <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2 ${
                  vet.is_active ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
                }`}>
                  {vet.is_active ? <FaCheckCircle size={12} /> : <FaTimesCircle size={12} />}
                  {vet.is_active ? 'Aktif' : 'Pasif'}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Specialty Badge */}
                <div className="inline-block bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-xs font-bold mb-3 uppercase">
                  {vet.specialty}
                </div>

                {/* Name */}
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {vet.name}
                </h3>

                {/* Bio */}
                {vet.bio && (
                  <div className="mb-3">
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {vet.bio}
                    </p>
                  </div>
                )}

                {/* Experience */}
                {vet.experience_years > 0 && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                    <FaGraduationCap className="text-purple-600" />
                    <span>{vet.experience_years} yıl deneyim</span>
                  </div>
                )}

                {/* Contact Info */}
                <div className="space-y-2 mb-4 pb-4 border-b border-gray-100">
                  {vet.phone && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FaPhone size={12} className="text-purple-600" />
                      <span>{vet.phone}</span>
                    </div>
                  )}
                  {vet.email && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FaEnvelope size={12} className="text-purple-600" />
                      <span className="truncate">{vet.email}</span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenModal(vet)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 font-semibold rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    <FaEdit size={14} />
                    Düzenle
                  </button>
                  <button
                    onClick={() => handleDelete(vet.id)}
                    className="px-4 py-2 bg-red-100 text-red-700 font-semibold rounded-lg hover:bg-red-200 transition-colors"
                  >
                    <FaTrash size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full text-center py-20">
            <FaUserMd className="text-5xl mx-auto mb-3 opacity-30 text-gray-500" />
            <p className="font-medium text-gray-500">Veteriner bulunamadı</p>
          </div>
        )}
      </motion.div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto"
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl max-w-4xl w-full my-8"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 rounded-t-2xl flex items-center justify-between">
                <h3 className="text-2xl font-bold text-white">
                  {editingVet ? 'Veteriner Düzenle' : 'Yeni Veteriner'}
                </h3>
                <button
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <FaTimes className="text-white text-xl" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Ad Soyad *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none"
                      placeholder="Dr. Ahmet Yılmaz"
                    />
                  </div>

                  {/* Specialty */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Uzmanlık Alanı *
                    </label>
                    <input
                      type="text"
                      value={formData.specialty}
                      onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none"
                      placeholder="İç Hastalıklar"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Telefon
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none"
                      placeholder="+90 555 123 45 67"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      E-posta
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none"
                      placeholder="ahmet@example.com"
                    />
                  </div>

                  {/* Experience Years */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Deneyim (Yıl)
                    </label>
                    <input
                      type="number"
                      value={formData.experience_years}
                      onChange={(e) => setFormData({ ...formData, experience_years: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none"
                      placeholder="10"
                      min="0"
                    />
                  </div>

                  {/* Graduation Year */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Mezuniyet Yılı
                    </label>
                    <input
                      type="number"
                      value={formData.graduation_year}
                      onChange={(e) => setFormData({ ...formData, graduation_year: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none"
                      placeholder="2010"
                      min="1950"
                      max="2030"
                    />
                  </div>

                  {/* Avatar - URL or File Upload */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Fotoğraf
                    </label>

                    {/* URL Input */}
                    <input
                      type="text"
                      value={formData.avatar}
                      onChange={(e) => {
                        setFormData({ ...formData, avatar: e.target.value });
                        setAvatarFile(null); // Clear file if URL is entered
                        setAvatarPreview('');
                      }}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none mb-3"
                      placeholder="https://example.com/photo.jpg veya aşağıdan dosya seçin"
                    />

                    {/* File Upload and Preview */}
                    <div className="flex items-center gap-4">
                      <label className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl hover:border-purple-500 transition-colors">
                          <FaUpload />
                          <span className="text-sm font-semibold">
                            {avatarFile ? avatarFile.name : 'Bilgisayardan Fotoğraf Seç'}
                          </span>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>

                      {/* Preview */}
                      {(avatarPreview || formData.avatar) && (
                        <div className="w-24 h-24 rounded-xl overflow-hidden border-2 border-gray-200">
                          <img
                            src={avatarPreview || formData.avatar}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      URL girebilir veya bilgisayarınızdan dosya yükleyebilirsiniz
                    </p>
                  </div>

                  {/* Bio */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Biyografi
                    </label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      rows="4"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none resize-none"
                      placeholder="Veteriner hakkında kısa bilgi..."
                    />
                  </div>

                  {/* Education */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Eğitim
                    </label>
                    <textarea
                      value={formData.education}
                      onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                      rows="3"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none resize-none"
                      placeholder="Ankara Üniversitesi Veteriner Fakültesi, 2010"
                    />
                  </div>

                  {/* Certifications */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Sertifikalar
                    </label>
                    <textarea
                      value={formData.certifications}
                      onChange={(e) => setFormData({ ...formData, certifications: e.target.value })}
                      rows="3"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none resize-none"
                      placeholder="Her satıra bir sertifika&#10;Örnek: Ortopedi Uzmanı Sertifikası - ECVS (2015)&#10;İç Hastalıklar Uzmanı - ACVIM (2017)"
                    />
                  </div>

                  {/* Expertise Areas */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Uzmanlık Alanları
                    </label>
                    <textarea
                      value={formData.expertise_areas}
                      onChange={(e) => setFormData({ ...formData, expertise_areas: e.target.value })}
                      rows="4"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none resize-none"
                      placeholder="Her satıra bir uzmanlık alanı&#10;Örnek: Cerrahi - Yumuşak doku ve ortopedik cerrahi&#10;İç Hastalıklar - Kardiyoloji, gastroenteroloji&#10;Acil Tıp - 7/24 acil müdahale uzmanlığı"
                    />
                  </div>

                  {/* Achievements */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Başarılar ve Ödüller
                    </label>
                    <textarea
                      value={formData.achievements}
                      onChange={(e) => setFormData({ ...formData, achievements: e.target.value })}
                      rows="4"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none resize-none"
                      placeholder="Her satıra bir başarı veya ödül&#10;Örnek: Yılın Veterineri Ödülü - 2020&#10;En İyi Cerrahi Müdahale Ödülü - 2019&#10;500+ başarılı operasyon"
                    />
                  </div>

                  {/* Address */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Adres
                    </label>
                    <textarea
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      rows="2"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none resize-none"
                      placeholder="Klinik adresi..."
                    />
                  </div>

                  {/* Weekly Working Hours */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-3">
                      Haftalık Çalışma Programı
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Monday */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">
                          Pazartesi
                        </label>
                        <input
                          type="text"
                          value={formData.monday_hours}
                          onChange={(e) => setFormData({ ...formData, monday_hours: e.target.value })}
                          className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all outline-none"
                          placeholder="09:00-18:00"
                        />
                      </div>

                      {/* Tuesday */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">
                          Salı
                        </label>
                        <input
                          type="text"
                          value={formData.tuesday_hours}
                          onChange={(e) => setFormData({ ...formData, tuesday_hours: e.target.value })}
                          className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all outline-none"
                          placeholder="09:00-18:00"
                        />
                      </div>

                      {/* Wednesday */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">
                          Çarşamba
                        </label>
                        <input
                          type="text"
                          value={formData.wednesday_hours}
                          onChange={(e) => setFormData({ ...formData, wednesday_hours: e.target.value })}
                          className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all outline-none"
                          placeholder="09:00-18:00"
                        />
                      </div>

                      {/* Thursday */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">
                          Perşembe
                        </label>
                        <input
                          type="text"
                          value={formData.thursday_hours}
                          onChange={(e) => setFormData({ ...formData, thursday_hours: e.target.value })}
                          className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all outline-none"
                          placeholder="09:00-18:00"
                        />
                      </div>

                      {/* Friday */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">
                          Cuma
                        </label>
                        <input
                          type="text"
                          value={formData.friday_hours}
                          onChange={(e) => setFormData({ ...formData, friday_hours: e.target.value })}
                          className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all outline-none"
                          placeholder="09:00-18:00"
                        />
                      </div>

                      {/* Saturday */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">
                          Cumartesi
                        </label>
                        <input
                          type="text"
                          value={formData.saturday_hours}
                          onChange={(e) => setFormData({ ...formData, saturday_hours: e.target.value })}
                          className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all outline-none"
                          placeholder="10:00-14:00 veya Kapalı"
                        />
                      </div>

                      {/* Sunday */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">
                          Pazar
                        </label>
                        <input
                          type="text"
                          value={formData.sunday_hours}
                          onChange={(e) => setFormData({ ...formData, sunday_hours: e.target.value })}
                          className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all outline-none"
                          placeholder="Kapalı"
                        />
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Boş bırakırsanız o gün çalışma saati gösterilmez. Örnek: 09:00-18:00 veya 14:00-19:00
                    </p>
                  </div>

                  {/* Is Active */}
                  <div className="md:col-span-2">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.is_active}
                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                        className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                      />
                      <span className="text-sm font-bold text-gray-700">Aktif</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="bg-gray-50 p-6 rounded-b-2xl flex gap-3 justify-end">
                <button
                  onClick={handleCloseModal}
                  className="px-6 py-3 bg-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-300 transition-colors"
                >
                  İptal
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:shadow-lg transition-all"
                >
                  {editingVet ? 'Güncelle' : 'Kaydet'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VeterinariansPage;
