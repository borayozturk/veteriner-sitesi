import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { FaCalendar, FaUser, FaTag, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import api from '../services/api';
import ShareButtons from '../components/common/ShareButtons';

const BlogDetail = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        // Fetch post by slug
        const postData = await api.blog.getBySlug(slug);

        // Transform API data
        const transformedPost = {
          id: postData.id,
          title: postData.title,
          slug: postData.slug,
          excerpt: postData.excerpt,
          content: postData.content,
          image: postData.featured_image || 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=800',
          category: postData.category,
          tags: postData.tags ? postData.tags.split(',').map(t => t.trim()) : [],
          author: postData.author_name || 'Veteriner Hekim',
          date: new Date(postData.published_at || postData.created_at).toLocaleDateString('tr-TR'),
          views: postData.views
        };

        setPost(transformedPost);

        // Fetch related posts (same category)
        const allPosts = await api.blog.getAll();
        const posts = allPosts.results || allPosts;
        const related = posts
          .filter(p => p.category === postData.category && p.id !== postData.id)
          .slice(0, 3)
          .map(p => ({
            id: p.id,
            title: p.title,
            slug: p.slug,
            excerpt: p.excerpt,
            image: p.featured_image || 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=800',
            category: p.category,
            tags: p.tags ? p.tags.split(',').map(t => t.trim()) : [],
            author: p.author_name || 'Veteriner Hekim',
            date: new Date(p.published_at || p.created_at).toLocaleDateString('tr-TR')
          }));

        setRelatedPosts(related);
      } catch (error) {
        console.error('Blog yazısı yüklenemedi:', error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Blog yazısı yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Blog Yazısı Bulunamadı</h1>
          <Link to="/blog" className="text-purple-600 hover:text-purple-700 font-semibold">
            ← Blog'a Dön
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Hero Section - Ultra Modern */}
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

          {/* Category Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex justify-center mb-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200">
              <FaTag className="text-purple-600" />
              <span className="text-sm font-semibold text-purple-600">{post.category}</span>
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-6xl font-extrabold text-gray-900 text-center max-w-4xl mx-auto mb-8 leading-tight"
          >
            {post.title}
          </motion.h1>

          {/* Meta Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-6 text-gray-600 mb-12"
          >
            <div className="flex items-center gap-2">
              <FaCalendar className="text-purple-600" />
              <span>{post.date}</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-gray-400" />
            <div className="flex items-center gap-2">
              <FaUser className="text-purple-600" />
              <span>{post.author}</span>
            </div>
          </motion.div>

          {/* Featured Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="max-w-5xl mx-auto rounded-3xl overflow-hidden shadow-2xl"
          >
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-[400px] md:h-[600px] object-cover"
            />
          </motion.div>
        </div>

        {/* Background Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-20" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-100 rounded-full blur-3xl opacity-20" />
      </section>

      {/* Content Section */}
      <section className="py-20">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
              style={{
                '--tw-prose-headings': '#111827',
                '--tw-prose-links': '#9333ea',
                '--tw-prose-bold': '#111827',
                '--tw-prose-body': '#4b5563',
              }}
            />

            {/* Share Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-12"
            >
              <ShareButtons
                url={window.location.href}
                title={post.title}
                description={post.excerpt}
              />
            </motion.div>

            {/* Tags */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mt-12 pt-8 border-t border-gray-200"
            >
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                Etiketler
              </h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <Link
                    key={index}
                    to={`/blog/etiket/${tag.toLowerCase().replace(/\s+/g, '-')}`}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-purple-50 hover:text-purple-600 transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </motion.div>

            {/* Author Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mt-12 p-8 bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl border border-purple-100"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white text-2xl font-bold">
                  {post.author.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{post.author}</h3>
                  <p className="text-gray-600">Veteriner Hekim</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
                İlgili Yazılar
              </h2>
              <p className="text-xl text-gray-600">
                Bu kategorideki diğer yazılarımız
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost, index) => (
                <motion.article
                  key={relatedPost.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all group"
                >
                  <Link to={`/blog/${relatedPost.slug}`}>
                    {/* Image */}
                    <div className="aspect-video overflow-hidden relative">
                      <img
                        src={relatedPost.image}
                        alt={relatedPost.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      {/* Category */}
                      <div className="inline-block bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-xs font-bold mb-3 uppercase">
                        {relatedPost.category}
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-purple-600 transition-colors">
                        {relatedPost.title}
                      </h3>

                      {/* Excerpt */}
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {relatedPost.excerpt}
                      </p>

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
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl p-12 text-center text-white shadow-2xl"
          >
            <h2 className="text-4xl font-extrabold mb-4">
              Evcil Dostunuz İçin Randevu Alın
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Uzman veteriner hekimlerimizle hemen iletişime geçin
            </p>
            <Link
              to="/randevu"
              className="inline-flex items-center gap-3 px-8 py-4 bg-white text-purple-600 font-bold rounded-full hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              <span>Online Randevu Al</span>
              <FaArrowRight />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default BlogDetail;
