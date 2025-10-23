import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBlog, FaSearch, FaPlus, FaEdit, FaTrash, FaEye, FaCalendar, FaTag, FaTimes, FaSave } from 'react-icons/fa';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import api from '../../services/api';

// TipTap Editor Component
const RichTextEditor = ({ content, onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
      Image,
      Placeholder.configure({
        placeholder: 'Blog yazınızı buraya yazın...',
      }),
    ],
    content: content || '<p></p>',
    editorProps: {
      attributes: {
        class: 'prose max-w-none p-4 min-h-[400px] focus:outline-none',
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      if (onChange) {
        onChange(html);
      }
    },
  });

  useEffect(() => {
    // Don't update editor content during initialization or if editor is not ready
    if (!editor || !editor.isEditable) return;

    // Get current editor content
    const editorContent = editor.getHTML();
    const newContent = content || '<p></p>';

    // Only update if content is actually different (ignoring whitespace differences)
    const normalizeHTML = (html) => html.replace(/\s+/g, ' ').trim();

    if (normalizeHTML(newContent) !== normalizeHTML(editorContent)) {
      // Use queueMicrotask to avoid render cycle issues
      queueMicrotask(() => {
        if (editor && !editor.isDestroyed) {
          editor.commands.setContent(newContent, false);
        }
      });
    }
  }, [content, editor]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (editor && !editor.isDestroyed) {
        editor.destroy();
      }
    };
  }, [editor]);

  if (!editor) {
    return (
      <div className="border-2 border-gray-200 rounded-xl p-4 min-h-[400px] flex items-center justify-center">
        <p className="text-gray-400">Editör yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="border-2 border-gray-200 rounded-xl overflow-hidden">
      {/* Toolbar */}
      <div className="bg-gray-50 border-b-2 border-gray-200 p-3 flex flex-wrap gap-2">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-3 py-1 rounded-lg font-bold transition-colors ${
            editor.isActive('bold') ? 'bg-purple-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          B
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-3 py-1 rounded-lg italic transition-colors ${
            editor.isActive('italic') ? 'bg-purple-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          I
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`px-3 py-1 rounded-lg line-through transition-colors ${
            editor.isActive('strike') ? 'bg-purple-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          S
        </button>
        <div className="w-px bg-gray-300 mx-1" />
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`px-3 py-1 rounded-lg font-bold transition-colors ${
            editor.isActive('heading', { level: 1 }) ? 'bg-purple-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          H1
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`px-3 py-1 rounded-lg font-bold transition-colors ${
            editor.isActive('heading', { level: 2 }) ? 'bg-purple-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          H2
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`px-3 py-1 rounded-lg font-bold transition-colors ${
            editor.isActive('heading', { level: 3 }) ? 'bg-purple-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          H3
        </button>
        <div className="w-px bg-gray-300 mx-1" />
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-3 py-1 rounded-lg transition-colors ${
            editor.isActive('bulletList') ? 'bg-purple-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          • Liste
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`px-3 py-1 rounded-lg transition-colors ${
            editor.isActive('orderedList') ? 'bg-purple-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          1. Liste
        </button>
        <div className="w-px bg-gray-300 mx-1" />
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`px-3 py-1 rounded-lg transition-colors ${
            editor.isActive('blockquote') ? 'bg-purple-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          " Alıntı
        </button>
        <button
          onClick={() => {
            const url = window.prompt('URL:');
            if (url) {
              editor.chain().focus().setLink({ href: url }).run();
            }
          }}
          className={`px-3 py-1 rounded-lg transition-colors ${
            editor.isActive('link') ? 'bg-purple-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          🔗 Link
        </button>
      </div>

      {/* Editor Content */}
      <EditorContent editor={editor} />
    </div>
  );
};

const BlogManagementPage = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showEditor, setShowEditor] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [veterinarians, setVeterinarians] = useState([]);
  const [vetsLoading, setVetsLoading] = useState(true);
  const [imageUploadMethod, setImageUploadMethod] = useState('url'); // 'url' or 'file'
  const [imagePreview, setImagePreview] = useState('');

  // Form fields
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    tags: '',
    featured_image: '',
    author: '',
  });

  useEffect(() => {
    fetchPosts();
    fetchVeterinarians();
  }, []);

  const fetchVeterinarians = async () => {
    try {
      setVetsLoading(true);
      const vets = await api.veterinarians.getAll();
      // Handle both array and paginated response
      const vetList = Array.isArray(vets) ? vets : (vets.results || []);
      setVeterinarians(vetList);
      setVetsLoading(false);
    } catch (error) {
      console.error('Veterinerler yüklenemedi:', error);
      setVeterinarians([]);
      setVetsLoading(false);
    }
  };

  useEffect(() => {
    filterPosts();
  }, [searchTerm, categoryFilter, posts]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const postsData = await api.blog.getAll();
      const blogPosts = postsData.results || postsData;
      setPosts(blogPosts);
      setLoading(false);
    } catch (error) {
      console.error('Blog yazıları yüklenemedi:', error);
      setLoading(false);
    }
  };

  const filterPosts = () => {
    let filtered = posts;

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(post => post.category === categoryFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (post.tags && post.tags.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredPosts(filtered);
  };

  const handleCreateNew = () => {
    setEditingPost(null);
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      category: '',
      tags: '',
      featured_image: '',
      author: veterinarians.length > 0 ? veterinarians[0].id : '',
    });
    setImagePreview('');
    setImageUploadMethod('url');
    setShowEditor(true);
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      tags: post.tags || '',
      featured_image: post.featured_image || '',
      author: post.author || (veterinarians.length > 0 ? veterinarians[0].id : ''),
    });
    setImagePreview(post.featured_image || '');
    setShowEditor(true);
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Lütfen sadece resim dosyası seçin.');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Dosya boyutu 5MB\'dan küçük olmalıdır.');
        return;
      }

      // Convert to base64 for preview and storage
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setImagePreview(base64String);
        setFormData({ ...formData, featured_image: base64String });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      if (!formData.title || !formData.content || !formData.category || !formData.author) {
        alert('Lütfen başlık, içerik, kategori ve yazar alanlarını doldurun.');
        return;
      }

      const postData = {
        title: formData.title,
        excerpt: formData.excerpt,
        content: formData.content,
        category: formData.category,
        tags: formData.tags,
        author: parseInt(formData.author),
        status: 'published',
        published_at: new Date().toISOString(),
      };

      // Only include featured_image if it's not empty
      if (formData.featured_image && formData.featured_image.trim() !== '') {
        postData.featured_image = formData.featured_image;
      }

      console.log('Sending postData:', postData);

      if (editingPost) {
        // Update existing post
        await api.blog.update(editingPost.slug, postData);
      } else {
        // Create new post
        await api.blog.create(postData);
      }

      setShowEditor(false);
      fetchPosts();
    } catch (error) {
      console.error('Blog yazısı kaydedilemedi:', error);
      alert('Blog yazısı kaydedilirken bir hata oluştu.');
    }
  };

  const handleDelete = async (slug) => {
    if (window.confirm('Bu blog yazısını silmek istediğinizden emin misiniz?')) {
      try {
        await api.blog.delete(slug);
        // Refresh the posts list after successful deletion
        await fetchPosts();
        alert('Blog yazısı başarıyla silindi.');
      } catch (error) {
        console.error('Blog yazısı silinemedi:', error);
        console.error('Error details:', error.response || error.message);
        alert(`Blog yazısı silinirken bir hata oluştu: ${error.message || 'Bilinmeyen hata'}`);
      }
    }
  };

  const categories = [...new Set(posts.map(post => post.category))].filter(Boolean);

  const stats = {
    total: posts.length,
    totalViews: posts.reduce((sum, post) => sum + (post.views || 0), 0),
    avgViews: posts.length > 0 ? Math.round(posts.reduce((sum, post) => sum + (post.views || 0), 0) / posts.length) : 0,
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm mb-1">Toplam Yazı</p>
              <p className="text-3xl font-bold">{stats.total}</p>
            </div>
            <FaBlog className="text-5xl text-white/20" />
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
              <p className="text-blue-100 text-sm mb-1">Toplam Görüntülenme</p>
              <p className="text-3xl font-bold">{stats.totalViews}</p>
            </div>
            <FaEye className="text-5xl text-white/20" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm mb-1">Ort. Görüntülenme</p>
              <p className="text-3xl font-bold">{stats.avgViews}</p>
            </div>
            <FaEye className="text-5xl text-white/20" />
          </div>
        </motion.div>
      </div>

      {/* Filters and Add Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Başlık, içerik veya etiket ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none appearance-none bg-white cursor-pointer"
          >
            <option value="all">Tüm Kategoriler</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          <button
            onClick={handleCreateNew}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:shadow-lg transition-all whitespace-nowrap"
          >
            <FaPlus />
            Yeni Yazı
          </button>
        </div>
      </motion.div>

      {/* Blog Posts Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all group"
            >
              <div className="aspect-video overflow-hidden relative">
                <img
                  src={post.featured_image || 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=800'}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-gray-900 flex items-center gap-2">
                  <FaEye size={12} />
                  {post.views || 0}
                </div>
              </div>

              <div className="p-6">
                <div className="inline-block bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-xs font-bold mb-3 uppercase">
                  {post.category}
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                  {post.title}
                </h3>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {post.excerpt}
                </p>

                <div className="flex items-center gap-4 text-xs text-gray-500 mb-4 pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-1">
                    <FaCalendar size={10} />
                    <span>{new Date(post.published_at || post.created_at).toLocaleDateString('tr-TR')}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FaTag size={10} />
                    <span>{post.tags ? post.tags.split(',').length : 0} etiket</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <a
                    href={`/blog/${post.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <FaEye size={14} />
                    Görüntüle
                  </a>
                  <button
                    onClick={() => handleEdit(post)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 font-semibold rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    <FaEdit size={14} />
                    Düzenle
                  </button>
                  <button
                    onClick={() => handleDelete(post.slug)}
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
            <FaBlog className="text-5xl mx-auto mb-3 opacity-30 text-gray-500" />
            <p className="font-medium text-gray-500">Blog yazısı bulunamadı</p>
          </div>
        )}
      </motion.div>

      {/* Blog Editor Modal */}
      <AnimatePresence>
        {showEditor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setShowEditor(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl max-w-5xl w-full my-8"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-900">
                  {editingPost ? 'Blog Yazısını Düzenle' : 'Yeni Blog Yazısı'}
                </h3>
                <button
                  onClick={() => setShowEditor(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <FaTimes className="text-gray-600" />
                </button>
              </div>

              {/* Form */}
              <div className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
                {/* Title */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Başlık *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Blog yazısının başlığı"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none"
                  />
                </div>

                {/* Category and Author */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">
                      Kategori *
                    </label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      placeholder="Örn: Sağlık, Bakım, Eğitim"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">
                      Yazar *
                    </label>
                    <select
                      value={formData.author}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none appearance-none bg-white cursor-pointer"
                      disabled={vetsLoading}
                    >
                      <option value="">
                        {vetsLoading ? 'Yükleniyor...' : 'Yazar Seçin'}
                      </option>
                      {Array.isArray(veterinarians) && veterinarians.map(vet => (
                        <option key={vet.id} value={vet.id}>
                          {vet.name} - {vet.specialty}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Excerpt */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Özet
                  </label>
                  <textarea
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    placeholder="Kısa bir özet (liste görünümünde gösterilecek)"
                    rows="3"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none resize-none"
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Etiketler
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="Virgülle ayırarak yazın: kedi, köpek, sağlık"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none"
                  />
                </div>

                {/* Featured Image */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Kapak Görseli
                  </label>

                  {/* Toggle between URL and File Upload */}
                  <div className="flex gap-2 mb-3">
                    <button
                      type="button"
                      onClick={() => setImageUploadMethod('url')}
                      className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
                        imageUploadMethod === 'url'
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      URL Gir
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageUploadMethod('file')}
                      className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
                        imageUploadMethod === 'file'
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Dosya Yükle
                    </button>
                  </div>

                  {/* URL Input */}
                  {imageUploadMethod === 'url' && (
                    <input
                      type="text"
                      value={formData.featured_image}
                      onChange={(e) => {
                        setFormData({ ...formData, featured_image: e.target.value });
                        setImagePreview(e.target.value);
                      }}
                      placeholder="https://example.com/image.jpg"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none"
                    />
                  )}

                  {/* File Upload */}
                  {imageUploadMethod === 'file' && (
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-purple-500 transition-all">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileChange}
                        className="hidden"
                        id="image-upload"
                      />
                      <label
                        htmlFor="image-upload"
                        className="cursor-pointer flex flex-col items-center"
                      >
                        <svg
                          className="w-12 h-12 text-gray-400 mb-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>
                        <span className="text-sm font-semibold text-gray-700">
                          Resim seçmek için tıklayın
                        </span>
                        <span className="text-xs text-gray-500 mt-1">
                          PNG, JPG, GIF (Max 5MB)
                        </span>
                      </label>
                    </div>
                  )}

                  {/* Image Preview */}
                  {imagePreview && (
                    <div className="mt-4 relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-xl"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=800';
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview('');
                          setFormData({ ...formData, featured_image: '' });
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  )}
                </div>

                {/* Content Editor */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    İçerik *
                  </label>
                  <RichTextEditor
                    key={editingPost ? editingPost.id : 'new-post'}
                    content={formData.content}
                    onChange={(html) => setFormData({ ...formData, content: html })}
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-gray-100 flex gap-3">
                <button
                  onClick={() => setShowEditor(false)}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-all"
                >
                  İptal
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:shadow-lg transition-all"
                >
                  <FaSave />
                  {editingPost ? 'Güncelle' : 'Kaydet'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BlogManagementPage;
