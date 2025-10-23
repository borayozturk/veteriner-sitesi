import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaImages, FaPlus, FaTrash, FaEye, FaDownload, FaCalendar, FaTag, FaTimes, FaUpload, FaEdit } from 'react-icons/fa';
import api from '../../services/api';

const GalleryPage = () => {
  const [images, setImages] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedImage, setSelectedImage] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editingImage, setEditingImage] = useState(null);
  const [newImage, setNewImage] = useState({
    title: '',
    description: '',
    image: '',
    category: 'dogs',
    tags: ''
  });

  useEffect(() => {
    fetchImages();
  }, []);

  useEffect(() => {
    filterImages();
  }, [categoryFilter, images]);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const imagesData = await api.gallery.getAll();
      const galleryImages = imagesData.results || imagesData;
      setImages(galleryImages);
      setLoading(false);
    } catch (error) {
      console.error('Galeri resimleri yüklenemedi:', error);
      setLoading(false);
    }
  };

  const filterImages = () => {
    let filtered = images;

    // Filter by category
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(img => img.category === categoryFilter);
    }

    setFilteredImages(filtered);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bu resmi silmek istediğinizden emin misiniz?')) {
      try {
        await api.gallery.delete(id);
        setImages(prev => prev.filter(img => img.id !== id));
      } catch (error) {
        console.error('Resim silinemedi:', error);
        alert('Resim silinirken bir hata oluştu.');
      }
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!newImage.title || !newImage.image) {
      alert('Lütfen başlık ve resim URL\'si girin.');
      return;
    }

    try {
      setUploading(true);
      const uploadedImage = await api.gallery.create(newImage);
      setImages(prev => [uploadedImage, ...prev]);
      setShowUploadModal(false);
      setNewImage({
        title: '',
        description: '',
        image: '',
        category: 'dogs',
        tags: ''
      });
      alert('Resim başarıyla eklendi!');
    } catch (error) {
      console.error('Resim eklenemedi:', error);
      alert('Resim eklenirken bir hata oluştu.');
    } finally {
      setUploading(false);
    }
  };

  const handleEditClick = (image) => {
    setEditingImage({
      id: image.id,
      title: image.title,
      description: image.description || '',
      image: image.image,
      category: image.category,
      tags: image.tags || ''
    });
    setShowEditModal(true);
  };

  const handleEdit = async (e) => {
    e.preventDefault();

    if (!editingImage.title || !editingImage.image) {
      alert('Lütfen başlık ve resim URL\'si girin.');
      return;
    }

    try {
      setUploading(true);
      const updatedImage = await api.gallery.update(editingImage.id, {
        title: editingImage.title,
        description: editingImage.description,
        image: editingImage.image,
        category: editingImage.category,
        tags: editingImage.tags
      });
      setImages(prev => prev.map(img => img.id === editingImage.id ? updatedImage : img));
      setShowEditModal(false);
      setEditingImage(null);
      alert('Resim başarıyla güncellendi!');
    } catch (error) {
      console.error('Resim güncellenemedi:', error);
      alert('Resim güncellenirken bir hata oluştu.');
    } finally {
      setUploading(false);
    }
  };

  // Get unique categories
  const categories = [...new Set(images.map(img => img.category))].filter(Boolean);

  const stats = {
    total: images.length,
    categories: categories.length,
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm mb-1">Toplam Resim</p>
              <p className="text-3xl font-bold">{stats.total}</p>
            </div>
            <FaImages className="text-5xl text-white/20" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm mb-1">Kategoriler</p>
              <p className="text-3xl font-bold">{stats.categories}</p>
            </div>
            <FaTag className="text-5xl text-white/20" />
          </div>
        </motion.div>
      </div>

      {/* Filters and Add Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
      >
        <div className="flex flex-col md:flex-row gap-4">
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none appearance-none bg-white cursor-pointer"
          >
            <option value="all">Tüm Kategoriler</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          {/* Add Button */}
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:shadow-lg transition-all whitespace-nowrap"
          >
            <FaPlus />
            Yeni Resim Ekle
          </button>
        </div>
      </motion.div>

      {/* Gallery Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid md:grid-cols-3 lg:grid-cols-4 gap-6"
      >
        {filteredImages.length > 0 ? (
          filteredImages.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all group"
            >
              {/* Image */}
              <div className="aspect-square overflow-hidden relative cursor-pointer" onClick={() => setSelectedImage(image)}>
                <img
                  src={image.image}
                  alt={image.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button className="px-6 py-3 bg-white text-gray-900 font-bold rounded-xl hover:scale-105 transition-transform flex items-center gap-2">
                    <FaEye />
                    Görüntüle
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                {/* Category Badge */}
                <div className="inline-block bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-xs font-bold mb-2 uppercase">
                  {image.category}
                </div>

                {/* Title */}
                <h3 className="text-sm font-bold text-gray-900 mb-2 line-clamp-2">
                  {image.title}
                </h3>

                {/* Description */}
                {image.description && (
                  <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                    {image.description}
                  </p>
                )}

                {/* Meta Info */}
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-3 pb-3 border-b border-gray-100">
                  <FaCalendar size={10} />
                  <span>{new Date(image.created_at).toLocaleDateString('tr-TR')}</span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedImage(image)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors text-xs"
                  >
                    <FaEye size={12} />
                    Görüntüle
                  </button>
                  <button
                    onClick={() => handleEditClick(image)}
                    className="px-3 py-2 bg-purple-100 text-purple-700 font-semibold rounded-lg hover:bg-purple-200 transition-colors"
                    title="Düzenle"
                  >
                    <FaEdit size={12} />
                  </button>
                  <a
                    href={image.image}
                    download
                    className="px-3 py-2 bg-blue-100 text-blue-700 font-semibold rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    <FaDownload size={12} />
                  </a>
                  <button
                    onClick={() => handleDelete(image.id)}
                    className="px-3 py-2 bg-red-100 text-red-700 font-semibold rounded-lg hover:bg-red-200 transition-colors"
                  >
                    <FaTrash size={12} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full text-center py-20">
            <FaImages className="text-5xl mx-auto mb-3 opacity-30 text-gray-500" />
            <p className="font-medium text-gray-500">Resim bulunamadı</p>
          </div>
        )}
      </motion.div>

      {/* Image Detail Modal */}
      {selectedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-5xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <div className="flex items-center justify-between mb-4">
              <div className="bg-white rounded-xl px-4 py-2">
                <h3 className="font-bold text-gray-900">{selectedImage.title}</h3>
              </div>
              <button
                onClick={() => setSelectedImage(null)}
                className="p-3 bg-white text-gray-900 rounded-xl hover:bg-gray-100 transition-colors font-bold"
              >
                Kapat
              </button>
            </div>

            {/* Image */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={selectedImage.image}
                alt={selectedImage.title}
                className="w-full h-auto max-h-[70vh] object-contain"
              />

              {/* Info */}
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-4 py-2 bg-purple-100 text-purple-600 rounded-full text-sm font-bold uppercase">
                    {selectedImage.category}
                  </span>
                  <span className="flex items-center gap-2 text-sm text-gray-600">
                    <FaCalendar size={12} />
                    {new Date(selectedImage.created_at).toLocaleDateString('tr-TR')}
                  </span>
                </div>

                {selectedImage.description && (
                  <p className="text-gray-700 mb-4">{selectedImage.description}</p>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <a
                    href={selectedImage.image}
                    download
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-xl hover:shadow-lg transition-all"
                  >
                    <FaDownload />
                    İndir
                  </a>
                  <button
                    onClick={() => {
                      setSelectedImage(null);
                      handleEditClick(selectedImage);
                    }}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold rounded-xl hover:shadow-lg transition-all"
                  >
                    <FaEdit />
                    Düzenle
                  </button>
                  <button
                    onClick={() => {
                      handleDelete(selectedImage.id);
                      setSelectedImage(null);
                    }}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-xl hover:shadow-lg transition-all"
                  >
                    <FaTrash />
                    Sil
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setShowUploadModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-8 max-w-2xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <FaUpload className="text-purple-600" />
                Yeni Galeri Resmi Ekle
              </h2>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaTimes className="text-gray-600" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleUpload} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Başlık *
                </label>
                <input
                  type="text"
                  value={newImage.title}
                  onChange={(e) => setNewImage({ ...newImage, title: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none"
                  placeholder="Örn: Mutlu Köpek 1"
                  required
                />
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Resim URL *
                </label>
                <input
                  type="url"
                  value={newImage.image}
                  onChange={(e) => setNewImage({ ...newImage, image: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none"
                  placeholder="https://example.com/image.jpg"
                  required
                />
              </div>

              {/* Image Preview */}
              {newImage.image && (
                <div className="border-2 border-gray-200 rounded-xl overflow-hidden">
                  <img
                    src={newImage.image}
                    alt="Önizleme"
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x300?text=Geçersiz+URL';
                    }}
                  />
                </div>
              )}

              {/* Category */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Kategori *
                </label>
                <select
                  value={newImage.category}
                  onChange={(e) => setNewImage({ ...newImage, category: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none appearance-none bg-white cursor-pointer"
                  required
                >
                  <option value="dogs">Köpekler</option>
                  <option value="cats">Kediler</option>
                  <option value="clinic">Klinik</option>
                  <option value="team">Ekip</option>
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Açıklama
                </label>
                <textarea
                  value={newImage.description}
                  onChange={(e) => setNewImage({ ...newImage, description: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none resize-none"
                  rows="3"
                  placeholder="Resim hakkında kısa açıklama..."
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Etiketler
                </label>
                <input
                  type="text"
                  value={newImage.tags}
                  onChange={(e) => setNewImage({ ...newImage, tags: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none"
                  placeholder="köpek, tedavi, sağlık (virgülle ayırın)"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {uploading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Ekleniyor...
                    </>
                  ) : (
                    <>
                      <FaUpload />
                      Resmi Ekle
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-all"
                >
                  İptal
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => {
            setShowEditModal(false);
            setEditingImage(null);
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <FaEdit className="text-purple-600" />
                Resmi Düzenle
              </h2>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingImage(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaTimes className="text-gray-600" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleEdit} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Başlık *
                </label>
                <input
                  type="text"
                  value={editingImage.title}
                  onChange={(e) => setEditingImage({ ...editingImage, title: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none"
                  placeholder="Örn: Mutlu Köpek 1"
                  required
                />
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Resim URL *
                </label>
                <input
                  type="url"
                  value={editingImage.image}
                  onChange={(e) => setEditingImage({ ...editingImage, image: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none"
                  placeholder="https://example.com/image.jpg"
                  required
                />
              </div>

              {/* Image Preview */}
              {editingImage.image && (
                <div className="border-2 border-gray-200 rounded-xl overflow-hidden">
                  <img
                    src={editingImage.image}
                    alt="Önizleme"
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x300?text=Geçersiz+URL';
                    }}
                  />
                </div>
              )}

              {/* Category */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Kategori *
                </label>
                <select
                  value={editingImage.category}
                  onChange={(e) => setEditingImage({ ...editingImage, category: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none appearance-none bg-white cursor-pointer"
                  required
                >
                  <option value="dogs">Köpekler</option>
                  <option value="cats">Kediler</option>
                  <option value="clinic">Klinik</option>
                  <option value="team">Ekip</option>
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Açıklama
                </label>
                <textarea
                  value={editingImage.description}
                  onChange={(e) => setEditingImage({ ...editingImage, description: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none resize-none"
                  rows="3"
                  placeholder="Resim hakkında kısa açıklama..."
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Etiketler
                </label>
                <input
                  type="text"
                  value={editingImage.tags}
                  onChange={(e) => setEditingImage({ ...editingImage, tags: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none"
                  placeholder="köpek, tedavi, sağlık (virgülle ayırın)"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {uploading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Güncelleniyor...
                    </>
                  ) : (
                    <>
                      <FaEdit />
                      Güncelle
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingImage(null);
                  }}
                  className="px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-all"
                >
                  İptal
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default GalleryPage;
