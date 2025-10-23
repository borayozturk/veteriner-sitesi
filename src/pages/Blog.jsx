import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaCalendar, FaUser, FaArrowRight, FaTag, FaSearch } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import api from '../services/api';
import SEO from '../components/common/SEO';
import { useSEO } from '../contexts/SEOContext';
import { BlogPostSkeleton, HeroSkeleton } from '../components/common/LoadingSkeleton';

const Blog = () => {
  const { getSEOForPage, loading: seoLoading } = useSEO();
  const seoSettings = getSEOForPage('blog');
  const [activeCategory, setActiveCategory] = useState('Tümü');
  const [blogPosts, setBlogPosts] = useState([]);
  const [categories, setCategories] = useState(['Tümü']);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch blog posts and categories from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch blog posts
        const postsData = await api.blog.getAll();
        const posts = postsData.results || postsData;

        // Transform API data to match component structure
        const transformedPosts = posts.map(post => ({
          id: post.id,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          image: post.featured_image || 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=800',
          category: post.category,
          tags: post.tags ? post.tags.split(',').map(t => t.trim()) : [],
          author: post.author_name || 'Veteriner Hekim',
          date: new Date(post.published_at || post.created_at).toLocaleDateString('tr-TR'),
          views: post.views
        }));

        setBlogPosts(transformedPosts);

        // Fetch categories
        const categoriesData = await api.blog.getCategories();
        setCategories(['Tümü', ...categoriesData]);
      } catch (error) {
        console.error('Blog verileri yüklenemedi:', error);
        // Fallback to empty array on error
        setBlogPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Get all unique tags
  const allTags = [...new Set(blogPosts.flatMap(post => post.tags))];

  // Filter posts by category and search
  let filteredPosts = activeCategory === 'Tümü'
    ? blogPosts
    : blogPosts.filter(post => post.category === activeCategory);

  if (searchQuery.trim()) {
    filteredPosts = filteredPosts.filter(post =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }

  // Show all posts
  const regularPosts = blogPosts;

  // Color palette for categories
  const categoryColors = {
    'Sağlık': 'from-blue-500 to-cyan-500',
    'Bakım': 'from-purple-500 to-pink-500',
    'Beslenme': 'from-green-500 to-emerald-500',
    'Koruma': 'from-orange-500 to-amber-500',
  };

  // Loading state
  if (loading) {
    return (
      <>
        <SEO
          title={seoSettings?.meta_title || "Blog"}
          description={seoSettings?.meta_description || "Evcil hayvan sağlığı hakkında blog yazıları"}
        />
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
          {/* Hero Skeleton */}
          <HeroSkeleton />

          {/* Blog Posts Grid Skeleton */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <BlogPostSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }

  // Structured data for Blog page
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "PetKey Veteriner Blog",
    "description": "Evcil hayvanlarınızın sağlığı ve bakımı hakkında uzman veteriner hekimlerimizden güncel bilgiler ve tavsiyeler.",
    "url": "https://petkey.com/blog",
    "publisher": {
      "@type": "Organization",
      "name": "PetKey Veteriner Kliniği",
      "logo": {
        "@type": "ImageObject",
        "url": "https://petkey.com/logo.png"
      }
    }
  };

  return (
    <div className="bg-white">
      {!seoLoading && (
        <SEO
          title={seoSettings.title}
          description={seoSettings.description}
          keywords={seoSettings.keywords}
          image={seoSettings.ogImage}
          canonical={seoSettings.canonical}
          structuredData={structuredData}
        />
      )}

      {/* BLOG GRID - Simple Layout */}
      <section className="pt-24 pb-12 bg-white">
        <div className="container-custom">
          {/* Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularPosts.map((post, index) => {
              const gradient = categoryColors[post.category] || 'from-gray-500 to-gray-600';

              // Create larger cards every 4th item
              const isFeatured = (index + 1) % 4 === 0;

              return (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05, duration: 0.5 }}
                  className={`group ${isFeatured ? 'md:col-span-2' : ''}`}
                >
                  <Link to={`/blog/${post.slug}`} className="block h-full">
                    <motion.div
                      whileHover={{ y: -8, scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                      className={`relative h-full bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 ${
                        isFeatured ? 'p-0' : 'p-0'
                      }`}
                    >
                      {/* Gradient Accent */}
                      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient}`} />

                      {/* Image */}
                      <div className={`relative overflow-hidden ${isFeatured ? 'h-80' : 'h-56'}`}>
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        {/* Category Badge on Image */}
                        <div className="absolute top-4 left-4">
                          <div className={`px-4 py-2 bg-gradient-to-r ${gradient} text-white text-xs font-bold rounded-full shadow-lg`}>
                            {post.category}
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        {/* Title */}
                        <h3 className={`font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-purple-600 transition-colors ${
                          isFeatured ? 'text-2xl' : 'text-xl'
                        }`}>
                          {post.title}
                        </h3>

                        {/* Excerpt */}
                        <p className={`text-gray-600 mb-4 leading-relaxed ${
                          isFeatured ? 'line-clamp-3' : 'line-clamp-2'
                        }`}>
                          {post.excerpt}
                        </p>

                        {/* Meta Info */}
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4 pb-4 border-b border-gray-100">
                          <div className="flex items-center gap-2">
                            <FaCalendar size={12} />
                            <span>{post.date}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FaUser size={12} />
                            <span className="truncate">{post.author}</span>
                          </div>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.tags.slice(0, 2).map((tag, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>

                        {/* CTA */}
                        <div className="flex items-center gap-2 text-sm font-semibold text-gray-400 group-hover:text-purple-600 group-hover:gap-3 transition-all">
                          <span>Devamını Oku</span>
                          <FaArrowRight size={14} />
                        </div>
                      </div>

                      {/* Hover Gradient Background */}
                      <div className={`absolute -bottom-12 -right-12 w-48 h-48 bg-gradient-to-br ${gradient} rounded-full opacity-0 group-hover:opacity-[0.06] blur-3xl transition-opacity duration-700`} />
                    </motion.div>
                  </Link>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* TAGS CLOUD SECTION */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
              Popüler Konular
            </h2>
            <p className="text-xl text-gray-600">
              İlgilendiğiniz konulara göre yazıları keşfedin
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-3 max-w-5xl mx-auto"
          >
            {allTags.map((tag, index) => (
              <Link
                key={index}
                to={`/blog/etiket/${tag.toLowerCase().replace(/\s+/g, '-')}`}
                className="group relative px-6 py-3 bg-white border-2 border-gray-200 rounded-full font-semibold text-gray-700 hover:border-purple-500 hover:text-purple-600 transition-all duration-300 hover:shadow-lg hover:scale-105"
              >
                <FaTag className="inline mr-2 text-purple-500" size={14} />
                {tag}
              </Link>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-24 bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto bg-gradient-to-br from-purple-600 to-pink-600 rounded-[3rem] p-12 md:p-16 text-center text-white shadow-2xl relative overflow-hidden"
          >
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />

            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
                Evcil Dostunuz İçin Randevu Alın
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Uzman veteriner hekimlerimizle 7/24 iletişime geçin
              </p>
              <Link
                to="/randevu"
                className="inline-flex items-center gap-3 px-8 py-4 bg-white text-purple-600 font-bold rounded-full hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                <span>Online Randevu Al</span>
                <FaArrowRight />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Blog;
