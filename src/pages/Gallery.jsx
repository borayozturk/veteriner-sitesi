import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { FaTimes, FaChevronLeft, FaChevronRight, FaDownload, FaShare, FaHeart, FaSearch, FaFilter, FaExpand, FaInfoCircle, FaCalendar } from 'react-icons/fa';
import api from '../services/api';

const Gallery = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [viewMode, setViewMode] = useState('masonry'); // 'masonry', 'grid', 'list'
  const [selectedImage, setSelectedImage] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [likedImages, setLikedImages] = useState(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('recent'); // 'recent', 'popular', 'name'
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch gallery images from API
  useEffect(() => {
    const fetchGalleryImages = async () => {
      try {
        setLoading(true);
        const response = await api.gallery.getAll();
        const images = response.results || response;

        // Transform backend data to frontend format
        const transformedImages = images.map((img) => ({
          id: img.id,
          category: img.category,
          image: img.image,
          title: img.title,
          description: img.description,
          date: new Date(img.created_at),
          likes: Math.floor(Math.random() * 100) + 50,
          tags: img.tags ? img.tags.split(',').map(t => t.trim()) : []
        }));

        setGalleryItems(transformedImages);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch gallery images:', error);
        setLoading(false);
      }
    };

    fetchGalleryImages();
  }, []);

  // Calculate categories with counts from galleryItems
  const categories = [
    { id: 'all', name: 'Tümü', icon: '🐾', count: galleryItems.length },
    { id: 'dogs', name: 'Köpekler', icon: '🐕', count: galleryItems.filter(img => img.category === 'dogs').length },
    { id: 'cats', name: 'Kediler', icon: '🐈', count: galleryItems.filter(img => img.category === 'cats').length },
    { id: 'clinic', name: 'Klinik', icon: '🏥', count: galleryItems.filter(img => img.category === 'clinic').length },
    { id: 'team', name: 'Ekibimiz', icon: '👨‍⚕️', count: galleryItems.filter(img => img.category === 'team').length },
  ];

  // Filter and sort
  let filteredItems = activeCategory === 'all'
    ? galleryItems
    : galleryItems.filter(item => item.category === activeCategory);

  // Search filter
  if (searchQuery) {
    filteredItems = filteredItems.filter(item =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }

  // Sort
  filteredItems = [...filteredItems].sort((a, b) => {
    if (sortBy === 'recent') return b.date - a.date;
    if (sortBy === 'popular') return b.likes - a.likes;
    if (sortBy === 'name') return a.title.localeCompare(b.title);
    return 0;
  });

  // Lightbox navigation
  const handlePrevious = () => {
    const currentIndex = filteredItems.findIndex(item => item.id === selectedImage.id);
    const previousIndex = currentIndex > 0 ? currentIndex - 1 : filteredItems.length - 1;
    setSelectedImage(filteredItems[previousIndex]);
  };

  const handleNext = () => {
    const currentIndex = filteredItems.findIndex(item => item.id === selectedImage.id);
    const nextIndex = currentIndex < filteredItems.length - 1 ? currentIndex + 1 : 0;
    setSelectedImage(filteredItems[nextIndex]);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedImage) return;
      if (e.key === 'Escape') setSelectedImage(null);
      if (e.key === 'ArrowLeft') handlePrevious();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage]);

  // Like/Unlike
  const toggleLike = (id) => {
    setLikedImages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  // Download image
  const handleDownload = (image) => {
    const link = document.createElement('a');
    link.href = image.image;
    link.download = `${image.title}.jpg`;
    link.click();
  };

  // Share
  const handleShare = async (image) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: image.title,
          text: image.description,
          url: window.location.href
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link kopyalandı!');
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold text-lg">Galeri yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 pt-24">
      {/* FILTERS & CONTROLS */}
      <section className="bg-gray-50 border-b-2 border-gray-300 py-6">
        <div className="container mx-auto px-4">
          {/* Category Filters */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-5 py-2.5 rounded-full font-semibold transition-all duration-300 flex items-center gap-2 text-sm ${
                  activeCategory === category.id
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'bg-white text-gray-800 hover:bg-gray-100 shadow-sm border border-gray-200'
                }`}
              >
                <span className="text-lg">{category.icon}</span>
                <span>{category.name}</span>
                <span className="text-xs opacity-75">({category.count})</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY SECTION */}
      <section className="py-20">
        <div className="container-custom">
          {filteredItems.length === 0 ? (
            // Empty State
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <div className="text-8xl mb-6">🔍</div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Sonuç Bulunamadı</h3>
              <p className="text-gray-600 mb-6">Arama kriterlerinize uygun fotoğraf bulunamadı.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                }}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:shadow-xl transition-all"
              >
                Tüm Fotoğrafları Göster
              </button>
            </motion.div>
          ) : viewMode === 'masonry' ? (
            // MASONRY LAYOUT
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8">
              {filteredItems.map((item, index) => (
                <GalleryCard
                  key={item.id}
                  item={item}
                  index={index}
                  onSelect={setSelectedImage}
                  isLiked={likedImages.has(item.id)}
                  onToggleLike={toggleLike}
                />
              ))}
            </div>
          ) : (
            // GRID LAYOUT
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredItems.map((item, index) => (
                <GalleryCard
                  key={item.id}
                  item={item}
                  index={index}
                  onSelect={setSelectedImage}
                  isLiked={likedImages.has(item.id)}
                  onToggleLike={toggleLike}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* LIGHTBOX MODAL */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            {/* Close Button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => setSelectedImage(null)}
              className="absolute top-6 right-6 w-14 h-14 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all z-50"
            >
              <FaTimes size={24} />
            </motion.button>

            {/* Navigation */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrevious();
              }}
              className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all z-50"
            >
              <FaChevronLeft size={24} />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all z-50"
            >
              <FaChevronRight size={24} />
            </button>

            {/* Main Content */}
            <div className="max-w-7xl w-full mx-auto flex flex-col lg:flex-row gap-6 items-center" onClick={(e) => e.stopPropagation()}>
              {/* Image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: "spring", damping: 25 }}
                className="flex-1 relative"
              >
                <img
                  src={selectedImage.image}
                  alt={selectedImage.title}
                  className="w-full h-auto max-h-[80vh] object-contain rounded-2xl shadow-2xl"
                />
              </motion.div>

              {/* Info Panel */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ delay: 0.1 }}
                className="w-full lg:w-96 bg-white/10 backdrop-blur-xl rounded-2xl p-8 text-white"
              >
                <h2 className="text-3xl font-bold mb-4">{selectedImage.title}</h2>
                <p className="text-gray-300 mb-6">{selectedImage.description}</p>

                {/* Meta Info */}
                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-3 text-gray-300">
                    <FaCalendar />
                    <span>{selectedImage.date.toLocaleDateString('tr-TR')}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <FaHeart className={likedImages.has(selectedImage.id) ? 'text-red-500' : ''} />
                    <span>{selectedImage.likes} beğeni</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedImage.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-white/20 rounded-full text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => toggleLike(selectedImage.id)}
                    className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                      likedImages.has(selectedImage.id)
                        ? 'bg-red-500 hover:bg-red-600'
                        : 'bg-white/20 hover:bg-white/30'
                    }`}
                  >
                    <FaHeart />
                    {likedImages.has(selectedImage.id) ? 'Beğenildi' : 'Beğen'}
                  </button>
                  <button
                    onClick={() => handleDownload(selectedImage)}
                    className="px-6 py-3 bg-white/20 hover:bg-white/30 rounded-xl font-semibold transition-all flex items-center justify-center"
                  >
                    <FaDownload />
                  </button>
                  <button
                    onClick={() => handleShare(selectedImage)}
                    className="px-6 py-3 bg-white/20 hover:bg-white/30 rounded-xl font-semibold transition-all flex items-center justify-center"
                  >
                    <FaShare />
                  </button>
                </div>
              </motion.div>
            </div>

            {/* Counter */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 bg-white/10 backdrop-blur-xl rounded-full text-white font-semibold">
              {filteredItems.findIndex(item => item.id === selectedImage.id) + 1} / {filteredItems.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// GALLERY CARD COMPONENT
const GalleryCard = ({ item, index, onSelect, isLiked, onToggleLike }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ delay: index * 0.02 }}
      whileHover={{ y: -8 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative break-inside-avoid mb-0 cursor-pointer"
    >
      <div className="relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border-2 border-gray-100 hover:border-purple-200">
        {/* Image */}
        <div className="relative overflow-hidden">
          <motion.img
            src={item.image}
            alt={item.title}
            className="w-full h-auto object-cover"
            loading="lazy"
            animate={{ scale: isHovered ? 1.1 : 1 }}
            transition={{ duration: 0.6 }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
            transition={{ duration: 0.3 }}
            className="absolute top-4 right-4 flex gap-2"
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleLike(item.id);
              }}
              className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-xl transition-all ${
                isLiked
                  ? 'bg-red-500 text-white'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              <FaHeart size={16} />
            </button>
          </motion.div>

          {/* Info Overlay */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-0 left-0 right-0 p-6 text-white"
            onClick={() => onSelect(item)}
          >
            <h3 className="font-bold text-xl mb-2">{item.title}</h3>
            <p className="text-sm text-gray-200 mb-3 line-clamp-2">{item.description}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                <FaHeart size={14} />
                <span>{item.likes}</span>
              </div>
              <button className="px-4 py-2 bg-white/20 backdrop-blur-xl rounded-lg text-sm font-semibold hover:bg-white/30 transition-all flex items-center gap-2">
                <FaExpand size={12} />
                Büyüt
              </button>
            </div>
          </motion.div>
        </div>

        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1.5 bg-white/90 backdrop-blur-xl rounded-full text-xs font-bold text-gray-900 shadow-lg">
            {item.category === 'dogs' && '🐕 Köpek'}
            {item.category === 'cats' && '🐈 Kedi'}
            {item.category === 'clinic' && '🏥 Klinik'}
            {item.category === 'team' && '👨‍⚕️ Ekip'}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default Gallery;
