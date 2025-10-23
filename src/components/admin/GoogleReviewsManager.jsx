import { useState, useEffect } from 'react';
import { FaPlus, FaTrash, FaStar, FaEye, FaEyeSlash, FaSave } from 'react-icons/fa';

const GoogleReviewsManager = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    initial: '',
    rating: 5,
    text: '',
    date: '',
    verified: true,
    local_guide: false,
    is_active: true,
    order: 0
  });

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setError(null);
      const response = await fetch('http://localhost:8000/api/google-reviews/');

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      // Handle paginated response from Django REST framework
      const reviewsArray = data.results || data;
      setReviews(Array.isArray(reviewsArray) ? reviewsArray : []);
    } catch (error) {
      console.error('Yorumlar yüklenirken hata:', error);
      setError(`Yorumlar yüklenemedi: ${error.message}`);
      setMessage(`Hata: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submit başladı, formData:', formData);
    setSaving(true);
    setMessage('');

    try {
      const url = editingReview
        ? `http://localhost:8000/api/google-reviews/${editingReview.id}/`
        : 'http://localhost:8000/api/google-reviews/';

      const method = editingReview ? 'PUT' : 'POST';

      console.log('Fetch yapılıyor:', method, url);
      console.log('Gönderilen data:', formData);

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      console.log('Response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Başarılı response:', data);
        setMessage(editingReview ? 'Yorum güncellendi!' : 'Yorum eklendi!');
        await fetchReviews();
        resetForm();
        setTimeout(() => setMessage(''), 3000);
      } else {
        const errorData = await response.json();
        console.error('API Error:', response.status, errorData);
        setMessage(`İşlem başarısız: ${JSON.stringify(errorData)}`);
      }
    } catch (error) {
      console.error('Hata:', error);
      setMessage('Bir hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Bu yorumu silmek istediğinizden emin misiniz?')) return;

    try {
      const response = await fetch(`http://localhost:8000/api/google-reviews/${id}/`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMessage('Yorum silindi');
        fetchReviews();
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      console.error('Silme hatası:', error);
      setMessage('Silme işlemi başarısız');
    }
  };

  const toggleActive = async (review) => {
    try {
      const response = await fetch(`http://localhost:8000/api/google-reviews/${review.id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_active: !review.is_active }),
      });

      if (response.ok) {
        fetchReviews();
      }
    } catch (error) {
      console.error('Güncelleme hatası:', error);
    }
  };

  const startEdit = (review) => {
    setEditingReview(review);
    setFormData({
      name: review.name,
      initial: review.initial,
      rating: review.rating,
      text: review.text,
      date: review.date,
      verified: review.verified,
      local_guide: review.local_guide,
      is_active: review.is_active,
      order: review.order || 0
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setEditingReview(null);
    setFormData({
      name: '',
      initial: '',
      rating: 5,
      text: '',
      date: '',
      verified: true,
      local_guide: false,
      is_active: true,
      order: 0
    });
    setShowForm(false);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 font-semibold">Yorumlar yükleniyor...</p>
      </div>
    </div>;
  }

  if (error) {
    return <div className="p-6 bg-red-50 border-2 border-red-200 rounded-xl">
      <h3 className="text-lg font-bold text-red-800 mb-2">Bir Hata Oluştu</h3>
      <p className="text-red-700">{error}</p>
      <button
        onClick={fetchReviews}
        className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
      >
        Tekrar Dene
      </button>
    </div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Google Yorumları Yönetimi</h2>
          <p className="text-sm text-gray-600 mt-1">Anasayfada gösterilecek Google yorumlarını ekleyin ve düzenleyin</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all"
        >
          <FaPlus />
          {showForm ? 'İptal' : 'Yeni Yorum Ekle'}
        </button>
      </div>

      {/* Message */}
      {message && (
        <div className={`p-4 rounded-lg ${message.includes('başarısız') || message.includes('oluştu') ? 'bg-red-50 text-red-800' : 'bg-green-50 text-green-800'}`}>
          {message}
        </div>
      )}

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-emerald-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            {editingReview ? 'Yorumu Düzenle' : 'Yeni Yorum Ekle'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">İsim *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Ahmet Yılmaz"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">İlk Harf *</label>
                <input
                  type="text"
                  required
                  maxLength="1"
                  value={formData.initial}
                  onChange={(e) => setFormData({ ...formData, initial: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="A"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Puan *</label>
                <select
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value={5}>5 Yıldız</option>
                  <option value={4}>4 Yıldız</option>
                  <option value={3}>3 Yıldız</option>
                  <option value={2}>2 Yıldız</option>
                  <option value={1}>1 Yıldız</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tarih</label>
                <input
                  type="text"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="3 gün önce"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sıralama</label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="0"
                />
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.verified}
                    onChange={(e) => setFormData({ ...formData, verified: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                  />
                  <span className="text-sm text-gray-700">Doğrulanmış</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.local_guide}
                    onChange={(e) => setFormData({ ...formData, local_guide: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                  />
                  <span className="text-sm text-gray-700">Yerel Rehber</span>
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Yorum Metni *</label>
              <textarea
                required
                rows="4"
                value={formData.text}
                onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Harika bir deneyimdi..."
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
              >
                İptal
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg hover:from-emerald-600 hover:to-emerald-700 disabled:opacity-50 transition-all"
              >
                <FaSave />
                {saving ? 'Kaydediliyor...' : editingReview ? 'Güncelle' : 'Ekle'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reviews List */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-50 to-blue-50 border-b border-gray-200">
          <h3 className="font-bold text-gray-900">Mevcut Yorumlar ({reviews.length})</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {reviews.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <p className="text-lg">Henüz yorum eklenmemiş</p>
              <p className="text-sm mt-2">Yukarıdaki butonu kullanarak yeni yorum ekleyebilirsiniz</p>
            </div>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className={`p-6 hover:bg-gray-50 transition-colors ${!review.is_active ? 'opacity-50' : ''}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {review.initial}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">{review.name}</h4>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <FaStar key={i} className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'} size={14} />
                            ))}
                          </div>
                          {review.date && <span>• {review.date}</span>}
                          {review.verified && <span className="text-emerald-600">• ✓ Doğrulanmış</span>}
                          {review.local_guide && <span className="text-blue-600">• 🎖️ Yerel Rehber</span>}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{review.text}</p>
                    <div className="mt-2 text-sm text-gray-500">
                      Sıralama: {review.order || 0}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleActive(review)}
                      className={`p-2 rounded-lg transition-all ${review.is_active ? 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                      title={review.is_active ? 'Gizle' : 'Göster'}
                    >
                      {review.is_active ? <FaEye size={18} /> : <FaEyeSlash size={18} />}
                    </button>
                    <button
                      onClick={() => startEdit(review)}
                      className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-all"
                    >
                      Düzenle
                    </button>
                    <button
                      onClick={() => handleDelete(review.id)}
                      className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all"
                    >
                      <FaTrash size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default GoogleReviewsManager;
