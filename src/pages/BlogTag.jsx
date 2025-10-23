import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { FaCalendar, FaUser, FaArrowRight, FaArrowLeft, FaTag } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import api from '../services/api';

const BlogTag = () => {
  const { tag } = useParams();
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get tag display name
  const tagName = tag.replace(/-/g, ' ');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        // Fetch all posts
        const postsData = await api.blog.getAll();
        const posts = postsData.results || postsData;

        // Transform posts
        const transformedPosts = posts.map(post => ({
          id: post.id,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          image: post.featured_image || 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=800',
          category: post.category,
          tags: post.tags ? post.tags.split(',').map(t => t.trim()) : [],
          author: post.author_name || 'Veteriner Hekim',
          date: new Date(post.published_at || post.created_at).toLocaleDateString('tr-TR')
        }));

        // Filter by tag
        const filtered = transformedPosts.filter(post =>
          post.tags.some(t => t.toLowerCase().replace(/\s+/g, '-') === tag)
        );

        setFilteredPosts(filtered);

        // Get all unique tags
        const uniqueTags = [...new Set(transformedPosts.flatMap(post => post.tags))];
        setAllTags(uniqueTags);
      } catch (error) {
        console.error('Blog yazıları yüklenemedi:', error);
        setFilteredPosts([]);
        setAllTags([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [tag]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-gradient-to-b from-gray-50 to-white">
        <div className="container-custom">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-purple-600 font-semibold transition-colors"
            >
              <FaArrowLeft />
              <span>Blog'a Dön</span>
            </Link>
          </motion.div>

          {/* Tag Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex justify-center mb-6"
          >
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200">
              <FaTag className="text-purple-600 text-xl" />
              <span className="text-lg font-bold text-purple-600">#{tagName}</span>
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-6xl font-extrabold text-gray-900 text-center max-w-4xl mx-auto mb-4 leading-tight capitalize"
          >
            {tagName}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-gray-600 text-center"
          >
            {filteredPosts.length} yazı bulundu
          </motion.p>
        </div>

        {/* Background Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-20" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-100 rounded-full blur-3xl opacity-20" />
      </section>

      {/* Content Section */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <div className="grid lg:grid-cols-12 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-8">
              {filteredPosts.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-8">
                  {filteredPosts.map((post, index) => (
                    <motion.article
                      key={post.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -8 }}
                      className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all group"
                    >
                      <Link to={`/blog/${post.slug}`}>
                        {/* Image */}
                        <div className="aspect-video overflow-hidden relative">
                          <img
                            src={post.image}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>

                        {/* Content */}
                        <div className="p-6">
                          {/* Category Badge */}
                          <div className="inline-block bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-xs font-bold mb-3 uppercase">
                            {post.category}
                          </div>

                          {/* Title */}
                          <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-purple-600 transition-colors">
                            {post.title}
                          </h2>

                          {/* Excerpt */}
                          <p className="text-gray-600 mb-4 line-clamp-2">
                            {post.excerpt}
                          </p>

                          {/* Meta Info */}
                          <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                            <div className="flex items-center gap-2">
                              <FaCalendar size={12} />
                              <span>{post.date}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <FaUser size={12} />
                              <span>{post.author}</span>
                            </div>
                          </div>

                          {/* Read More */}
                          <div className="flex items-center gap-2 text-purple-600 font-semibold text-sm group-hover:gap-3 transition-all">
                            <span>Devamını Oku</span>
                            <FaArrowRight />
                          </div>
                        </div>
                      </Link>
                    </motion.article>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Yazı Bulunamadı
                  </h3>
                  <p className="text-gray-600">
                    Bu etiket için henüz yazı bulunmuyor.
                  </p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-4">
              <div className="sticky top-24">
                {/* Popular Tags */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 mb-8"
                >
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <FaTag className="text-purple-600" />
                    Popüler Etiketler
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {allTags.map((t, index) => {
                      const tagSlug = t.toLowerCase().replace(/\s+/g, '-');
                      const isActive = tagSlug === tag;
                      return (
                        <Link
                          key={index}
                          to={`/blog/etiket/${tagSlug}`}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                            isActive
                              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                              : 'bg-gray-100 text-gray-700 hover:bg-purple-50 hover:text-purple-600'
                          }`}
                        >
                          #{t}
                        </Link>
                      );
                    })}
                  </div>
                </motion.div>

                {/* CTA Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl p-8 text-white shadow-xl"
                >
                  <h3 className="text-2xl font-bold mb-4">
                    Randevu Almak İster misiniz?
                  </h3>
                  <p className="mb-6 opacity-90">
                    Evcil dostunuzun sağlığı için hemen randevu oluşturun.
                  </p>
                  <Link
                    to="/randevu"
                    className="inline-flex items-center gap-3 px-6 py-3 bg-white text-purple-600 font-bold rounded-full hover:shadow-xl hover:scale-105 transition-all duration-300"
                  >
                    <span>Randevu Al</span>
                    <FaArrowRight />
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogTag;
