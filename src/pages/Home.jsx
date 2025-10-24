import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaCheck, FaAward, FaHeart, FaClock, FaUserMd, FaPhone, FaStar, FaArrowRight, FaGoogle, FaCalendar, FaUser, FaPaw } from 'react-icons/fa';
import { useState, useRef, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import CountUp from 'react-countup';
import { services } from '../data/services';
import ServiceCard from '../components/common/ServiceCard';
import { petImages } from '../utils/petImages';
import api from '../services/api';
import SEO from '../components/common/SEO';
import { useSEO } from '../contexts/SEOContext';

const Home = () => {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);

  // Get SEO settings from context
  const { getSEOForPage, loading: seoLoading } = useSEO();
  const seoSettings = getSEOForPage('homepage');

  const features = [
    {
      icon: '🏥',
      title: 'Modern Klinik',
      description: 'En son teknoloji ekipmanlarla donatılmış kliniğimiz',
      gradient: 'from-blue-500/10 to-cyan-500/10',
      shadow: 'shadow-blue-500/20'
    },
    {
      icon: '👨‍⚕️',
      title: 'Uzman Kadro',
      description: 'Alanında deneyimli veteriner hekimlerimiz',
      gradient: 'from-purple-500/10 to-pink-500/10',
      shadow: 'shadow-purple-500/20'
    },
    {
      icon: '💊',
      title: 'Kapsamlı Hizmet',
      description: 'Teşhisten tedaviye tüm veteriner hizmetleri',
      gradient: 'from-green-500/10 to-emerald-500/10',
      shadow: 'shadow-green-500/20'
    },
    {
      icon: '🚑',
      title: 'Acil Müdahale',
      description: '7/24 acil veteriner hizmeti',
      gradient: 'from-orange-500/10 to-red-500/10',
      shadow: 'shadow-orange-500/20'
    },
  ];

  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [blogPosts, setBlogPosts] = useState([]);
  const [homePageData, setHomePageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [googleReviews, setGoogleReviews] = useState([]);

  // Default stats - will be overridden by API data
  const defaultStats = [
    { icon: FaUserMd, number: 15, suffix: '+', label: 'Uzman Veteriner', color: 'from-blue-500 to-cyan-500' },
    { icon: FaPaw, number: 5000, suffix: '+', label: 'Mutlu Dost', color: 'from-purple-500 to-pink-500' },
    { icon: FaAward, number: 10, suffix: '+', label: 'Yıllık Deneyim', color: 'from-green-500 to-teal-500' },
    { icon: FaClock, number: 24, suffix: '/7', label: 'Hizmet', color: 'from-orange-500 to-red-500' }
  ];

  // Helper function to parse stat number and suffix
  const parseStatNumber = (statNumber) => {
    if (!statNumber) return { number: 0, suffix: '' };

    const str = String(statNumber).trim();

    // Check for suffix at the end
    if (str.endsWith('+')) {
      return { number: parseInt(str.replace(/[+,]/g, '')), suffix: '+' };
    }
    if (str.includes('/')) {
      const parts = str.split('/');
      return { number: parseInt(parts[0]), suffix: `/${parts[1]}` };
    }

    // No suffix, just return the number
    return { number: parseInt(str.replace(/,/g, '')), suffix: '' };
  };

  // Build stats from API data or use defaults
  const stats = homePageData ? [
    { ...parseStatNumber(homePageData.stat1_number), label: homePageData.stat1_label || 'Uzman Veteriner', icon: FaUserMd, color: 'from-blue-500 to-cyan-500' },
    { ...parseStatNumber(homePageData.stat2_number), label: homePageData.stat2_label || 'Mutlu Dost', icon: FaPaw, color: 'from-purple-500 to-pink-500' },
    { ...parseStatNumber(homePageData.stat3_number), label: homePageData.stat3_label || 'Yıllık Deneyim', icon: FaAward, color: 'from-green-500 to-teal-500' },
    { ...parseStatNumber(homePageData.stat4_number), label: homePageData.stat4_label || 'Hizmet', icon: FaClock, color: 'from-orange-500 to-red-500' }
  ] : defaultStats;

  // Fetch homepage data and blog posts from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch homepage content
        const homeResponse = await fetch(import.meta.env.VITE_API_URL + '/api/homepage/content/');
        const homeData = await homeResponse.json();
        setHomePageData(homeData);

        // Fetch blog posts
        const postsData = await api.blog.getAll();
        const posts = postsData.results || postsData;
        const transformedPosts = posts.slice(0, 4).map(post => ({
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
        setBlogPosts(transformedPosts);

        // Fetch Google reviews
        const reviewsResponse = await fetch(import.meta.env.VITE_API_URL + '/api/google-reviews/?active_only=true');
        if (reviewsResponse.ok) {
          const reviewsData = await reviewsResponse.json();
          // Handle paginated response from Django REST framework
          const reviewsArray = reviewsData.results || reviewsData;
          // Transform API data to match component expectations
          const transformedReviews = reviewsArray.map(review => ({
            name: review.name,
            initial: review.initial,
            rating: review.rating,
            date: review.date,
            text: review.text,
            verified: review.verified,
            localGuide: review.local_guide
          }));
          setGoogleReviews(transformedReviews);
        }
      } catch (error) {
        console.error('Veri yüklenirken hata:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Intersection observers for scroll animations
  const [statsRef, statsInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [featuresRef, featuresInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [servicesRef, servicesInView] = useInView({ threshold: 0.05, triggerOnce: true });

  // Structured Data for Home Page
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "VeterinaryCare",
    "name": "Veteriner Kliniği",
    "description": "Modern ekipman ve deneyimli veteriner kadromuzla evcil hayvanlarınızın sağlığı için 7/24 hizmetinizdeyiz.",
    "url": "https://example.com",
    "telephone": "+90-212-123-45-67",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Veteriner Caddesi No:123",
      "addressLocality": "İstanbul",
      "addressCountry": "TR"
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      "opens": "00:00",
      "closes": "23:59"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "250"
    },
    "priceRange": "$$"
  };

  return (
    <div className="overflow-hidden bg-gradient-to-b from-gray-50 to-white">
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

      {/* Ultra-Modern Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background Gradients */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-1/2 -right-1/2 w-[800px] h-[800px] bg-gradient-to-br from-purple-400 to-pink-600 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              rotate: [0, -90, 0],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-1/2 -left-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-blue-400 to-cyan-600 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-orange-400 to-yellow-500 rounded-full blur-3xl"
          />
        </div>

        {/* Floating Pet Images */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-16 h-16 md:w-24 md:h-24 rounded-2xl overflow-hidden shadow-2xl opacity-20"
              style={{
                left: `${15 + i * 15}%`,
                top: `${20 + (i % 2) * 40}%`,
              }}
              animate={{
                y: [0, -30, 0],
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 5 + i,
                repeat: Infinity,
                delay: i * 0.5,
                ease: "easeInOut"
              }}
            >
              <img
                src={petImages.mixed[i % petImages.mixed.length]}
                alt=""
                className="w-full h-full object-cover"
              />
            </motion.div>
          ))}
        </div>

        {/* Hero Content */}
        <div className="container-custom relative z-10 text-center py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-xl px-6 py-3 rounded-full shadow-lg border border-gray-200/50 mb-8"
          >
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-sm font-semibold text-gray-900">7/24 Aktif Hizmet</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-6xl md:text-7xl lg:text-8xl font-extrabold mb-6 leading-tight"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900">
              {homePageData?.hero_title || 'Evcil Dostlarınız Güvenli Ellerde'}
            </span>
          </motion.h1>

          {/* Real Pet Photos Gallery */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex justify-center items-center gap-4 mb-8 flex-wrap max-w-5xl mx-auto"
          >
            {petImages.mixed.slice(0, 8).map((img, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.5 + idx * 0.1 }}
                whileHover={{ scale: 1.1, zIndex: 10 }}
                className="w-32 h-32 md:w-44 md:h-44 lg:w-52 lg:h-52 rounded-3xl overflow-hidden shadow-2xl border-4 border-white backdrop-blur-sm"
              >
                <img
                  src={img}
                  alt={`Happy pet ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            ))}
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-700 mb-10 md:mb-0 max-w-3xl mx-auto leading-relaxed"
          >
            {homePageData?.hero_subtitle || 'Modern ekipman ve deneyimli veteriner kadromuzla evcil hayvanlarınızın sağlığı için 7/24 hizmetinizdeyiz.'}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="md:hidden flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link
              to={homePageData?.hero_cta_link || "/randevu"}
              className="group relative px-10 py-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-full overflow-hidden shadow-2xl hover:shadow-purple-500/50 transition-all duration-300"
            >
              <span className="relative z-10 flex items-center gap-2">
                {homePageData?.hero_cta_text || 'Randevu Al'}
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <FaArrowRight />
                </motion.span>
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600"
                initial={{ x: '100%' }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
            </Link>

            {homePageData?.hero_secondary_cta_text && (
              <Link
                to={homePageData?.hero_secondary_cta_link || "/hizmetler"}
                className="group px-10 py-5 bg-white/90 backdrop-blur-sm text-gray-900 font-bold rounded-full border-2 border-gray-300 hover:border-purple-500 hover:bg-white transition-all duration-300 shadow-lg flex items-center gap-3"
              >
                {homePageData?.hero_secondary_cta_text}
              </Link>
            )}
          </motion.div>

        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 12, 0], opacity: [1, 0, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-3 bg-gray-600 rounded-full mt-2"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Sticky Stats Bar - Optimized Performance */}
      <section className="sticky top-0 md:top-[104px] z-40 backdrop-blur-xl bg-white/90 border-y border-gray-200 shadow-lg py-6 md:py-8">
        <div className="container-custom">
          <div
            ref={statsRef}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-7xl mx-auto"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={statsInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ scale: 1.03 }}
                className="relative group cursor-pointer"
              >
                {/* Simple Card */}
                <div className="relative bg-white rounded-2xl p-5 md:p-6 text-center shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                  {/* Icon */}
                  <div className={`inline-flex items-center justify-center bg-gradient-to-br ${stat.color} p-3 rounded-xl mb-3`}>
                    <stat.icon className="text-white text-2xl md:text-3xl" />
                  </div>

                  {/* Number with gradient text */}
                  <div className={`text-3xl md:text-4xl font-extrabold mb-2 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                    {statsInView && <CountUp end={stat.number} duration={2} />}
                    {stat.suffix}
                  </div>

                  {/* Label */}
                  <div className="text-xs md:text-sm font-semibold text-gray-600 uppercase tracking-wide">
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - Ultra Modern Cards */}
      <section ref={featuresRef} className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-purple-50/30 to-white" />

        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : {}}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
              {homePageData?.why_choose_title || 'Neden Biz?'}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {homePageData?.why_choose_subtitle || 'Modern teknoloji ve sevgi dolu yaklaşımımızla fark yaratıyoruz'}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {(homePageData?.why_choose_features || features).map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={featuresInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100" />

                <div className="relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100">
                  <motion.div
                    whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                    className="text-7xl mb-6"
                  >
                    {feature.icon}
                  </motion.div>

                  <h3 className="text-2xl font-bold mb-3 text-gray-900">
                    {feature.title}
                  </h3>

                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>

                  <motion.div
                    className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${feature.gradient} rounded-bl-3xl rounded-tr-3xl opacity-50`}
                    whileHover={{ scale: 1.5, opacity: 0.3 }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section - Modern Grid */}
      <section ref={servicesRef} className="py-32 bg-gradient-to-b from-white to-gray-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={servicesInView ? { opacity: 1, y: 0 } : {}}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-purple-900">
              {homePageData?.services_title || 'Hizmetlerimiz'}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {homePageData?.services_subtitle || 'Evcil dostlarınız için kapsamlı veteriner hizmetleri sunuyoruz'}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.slice(0, 6).map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 50 }}
                animate={servicesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <ServiceCard service={service} index={index} />
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={servicesInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.8 }}
            className="text-center mt-12"
          >
            <Link
              to="/hizmetler"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-full shadow-xl hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300"
            >
              Tüm Hizmetleri Gör
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <FaArrowRight />
              </motion.span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Google Reviews Section - Minimal & Clean */}
      <section className="py-20 md:py-32 bg-white">
        <div className="container-custom">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-3 mb-3">
              <FaGoogle className="text-3xl text-[#4285F4]" />
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                {homePageData?.reviews_title || 'Müşteri Yorumları'}
              </h2>
            </div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {homePageData?.reviews_subtitle || 'Google\'da aldığımız gerçek müşteri değerlendirmeleri'}
            </p>
          </motion.div>

          {/* Rating Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-md mx-auto mb-12"
          >
            <div className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-2xl p-6 border border-emerald-100">
              <div className="flex items-center justify-center gap-8">
                <div className="text-center">
                  <div className="text-5xl font-bold text-gray-900 mb-2">{homePageData?.reviews_rating || '4.9'}</div>
                  <div className="flex gap-1 justify-center mb-1">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className="text-yellow-400" size={20} />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600">{homePageData?.reviews_count || '250+'} değerlendirme</p>
                </div>
                <div className="h-16 w-px bg-gray-300"></div>
                <div className="text-center">
                  <FaGoogle className="text-4xl text-[#4285F4] mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-700">Google'da</p>
                  <p className="text-xs text-gray-500">Doğrulanmış</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Reviews Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {googleReviews.map((review, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:border-emerald-200 hover:shadow-md transition-all duration-300"
              >
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                    {review.initial}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <h4 className="font-semibold text-gray-900">{review.name}</h4>
                      {review.verified && (
                        <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">{review.date}</p>
                  </div>
                </div>

                {/* Stars */}
                <div className="flex gap-0.5 mb-3">
                  {[...Array(review.rating)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-400" size={16} />
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-gray-700 text-sm leading-relaxed mb-4">
                  {review.text}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                  {review.localGuide && (
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-md font-medium">
                      Yerel Rehber
                    </span>
                  )}
                  <FaGoogle className="text-[#4285F4] ml-auto" size={16} />
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <a
              href={homePageData?.reviews_cta_link || "https://www.google.com/maps"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-emerald-700 shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 transition-all duration-300"
            >
              <FaGoogle size={18} />
              {homePageData?.reviews_cta_text || 'Tüm Yorumları Google\'da Gör'}
              <FaArrowRight size={14} />
            </a>
          </motion.div>
        </div>
      </section>

      {/* Blog Section - Magazine Style 2025 */}
      <section className="py-20 md:py-32 relative overflow-hidden bg-gradient-to-b from-gray-50 via-white to-gray-50">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        </div>

        <div className="container-custom relative z-10">
          {/* Minimal Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-1 h-8 bg-gradient-to-b from-purple-600 to-pink-600 rounded-full"></div>
                  <span className="text-sm font-bold text-purple-600 uppercase tracking-wider">{homePageData?.blog_subtitle || 'Uzman Tavsiyeleri'}</span>
                </div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900">
                  {homePageData?.blog_title || 'Son Yazılar'}
                </h2>
              </div>
              <Link
                to="/blog"
                className="hidden md:flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-bold rounded-full hover:bg-purple-600 transition-all duration-300 group"
              >
                Tümünü Gör
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" size={14} />
              </Link>
            </div>
          </motion.div>

          {blogPosts.length > 0 && (
            <div className="grid lg:grid-cols-12 gap-6 mb-6">
              {/* Featured Post - Large */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="lg:col-span-7"
              >
                <Link to={`/blog/${blogPosts[0].slug}`} className="group block h-full">
                  <div className="relative h-full bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100">
                    {/* Image */}
                    <div className="relative h-80 lg:h-96 overflow-hidden">
                      <img
                        src={blogPosts[0].image}
                        alt={blogPosts[0].title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

                      {/* Floating Badge */}
                      <div className="absolute top-6 left-6">
                        <div className="px-4 py-2 bg-white rounded-full font-bold text-sm shadow-lg">
                          ⭐ Öne Çıkan
                        </div>
                      </div>

                      {/* Content Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-8">
                        <div className="inline-block px-3 py-1 bg-purple-500 text-white rounded-full text-xs font-bold mb-3">
                          {blogPosts[0].category}
                        </div>
                        <h3 className="text-2xl md:text-3xl font-black text-white mb-3 line-clamp-2">
                          {blogPosts[0].title}
                        </h3>
                        <p className="text-white/90 text-sm line-clamp-2 mb-4">
                          {blogPosts[0].excerpt}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-white/80">
                          <div className="flex items-center gap-1.5">
                            <FaCalendar size={12} />
                            <span>{blogPosts[0].date}</span>
                          </div>
                          <div className="w-1 h-1 rounded-full bg-white/50"></div>
                          <div className="flex items-center gap-1.5">
                            <FaUser size={12} />
                            <span>{blogPosts[0].author}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>

              {/* Side Posts - 2 Cards */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                {blogPosts.slice(1, 3).map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex-1"
                  >
                    <Link to={`/blog/${post.slug}`} className="group block h-full">
                      <div className="flex gap-4 h-full bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 p-4">
                        {/* Image - Smaller */}
                        <div className="w-32 h-32 flex-shrink-0 rounded-xl overflow-hidden">
                          <img
                            src={post.image}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>

                        {/* Content */}
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <div className="inline-block px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-bold mb-2">
                              {post.category}
                            </div>
                            <h3 className="text-base font-bold text-gray-900 line-clamp-2 mb-2 group-hover:text-purple-600 transition-colors">
                              {post.title}
                            </h3>
                            <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                              {post.excerpt}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <FaCalendar size={10} />
                            <span>{post.date}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Row - 3 Equal Cards */}
          {blogPosts.length > 3 && (
            <div className="grid md:grid-cols-3 gap-6">
              {blogPosts.slice(1, 4).map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link to={`/blog/${post.slug}`} className="group block h-full">
                    <div className="h-full bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
                      {/* Image */}
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3">
                          <div className="px-3 py-1 bg-white/95 backdrop-blur-sm rounded-full text-xs font-bold">
                            {post.category}
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5">
                        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                          {post.excerpt}
                        </p>

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <FaCalendar size={10} />
                            <span>{post.date}</span>
                          </div>
                          <div className="flex items-center gap-1 text-purple-600 text-xs font-bold group-hover:gap-2 transition-all">
                            <span>Oku</span>
                            <FaArrowRight size={10} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          {/* Mobile View All Button */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-10 md:hidden"
          >
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white font-bold rounded-full hover:bg-purple-600 transition-all duration-300"
            >
              Tüm Yazıları Gör
              <FaArrowRight size={14} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA Section - Premium Veterinary Design */}
      <section className="relative overflow-hidden py-20 md:py-32 bg-white">
        <div className="container-custom relative">
          {/* Main Card with Image Background */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-[3rem] overflow-hidden shadow-2xl"
          >
            {/* Background Image - Free License Veterinary Photo */}
            <div className="absolute inset-0">
              <img
                src="https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?q=80&w=2070"
                alt="Veterinary care"
                className="w-full h-full object-cover"
              />
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-gray-900/95 via-gray-900/85 to-gray-900/40"></div>
            </div>

            <div className="relative grid lg:grid-cols-5 gap-0 min-h-[600px]">
              {/* LEFT: Content - 3 columns */}
              <div className="lg:col-span-3 p-10 md:p-16 flex flex-col justify-center">
                {/* Badge */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-2 bg-emerald-500 px-4 py-2.5 rounded-full mb-6 self-start"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                  </span>
                  <span className="text-sm font-bold text-white">7/24 Acil Hizmet Aktif</span>
                </motion.div>

                {/* Heading */}
                <motion.h2
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight"
                >
                  {homePageData?.appointment_cta_title || 'Evcil Dostunuz İçin Randevu Alın'}
                </motion.h2>

                {/* Description */}
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="text-lg md:text-xl text-gray-200 mb-10 leading-relaxed max-w-xl"
                >
                  {homePageData?.appointment_cta_description || 'Uzman veteriner hekimlerimiz ve modern ekipmanımızla evcil dostlarınızın sağlığı için 7/24 hizmetinizdeyiz.'}
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-col sm:flex-row gap-4 mb-10"
                >
                  <Link
                    to="/randevu"
                    className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold rounded-full hover:shadow-2xl hover:shadow-emerald-500/50 transition-all duration-300"
                  >
                    <FaCalendar className="text-lg" />
                    <span>{homePageData?.appointment_cta_button || 'Online Randevu Al'}</span>
                    <FaArrowRight className="group-hover:translate-x-1 transition-transform" size={16} />
                  </Link>

                  <a
                    href={`tel:${homePageData?.appointment_cta_phone_link || '+902121234567'}`}
                    className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-md border-2 border-white/30 text-white font-bold rounded-full hover:bg-white/20 transition-all duration-300"
                  >
                    <FaPhone className="text-lg" />
                    <span>{homePageData?.appointment_cta_phone || '(0212) 123 45 67'}</span>
                  </a>
                </motion.div>

                {/* Features Grid */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 }}
                  className="grid grid-cols-2 gap-4"
                >
                  {(homePageData?.appointment_cta_features || [
                    { text: 'Hızlı Randevu' },
                    { text: 'Uzman Kadro' },
                    { text: 'Modern Ekipman' },
                    { text: '7/24 Hizmet' }
                  ]).map((feature, index) => {
                    const icons = [FaCheck, FaUserMd, FaAward, FaClock];
                    const colors = ['emerald', 'cyan', 'blue', 'purple'];
                    const Icon = icons[index];
                    const color = colors[index];

                    return (
                      <div key={index} className="flex items-center gap-3 bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                        <div className={`w-10 h-10 rounded-lg bg-${color}-500/20 flex items-center justify-center`}>
                          <Icon className={`text-${color}-400 text-lg`} />
                        </div>
                        <span className="text-sm font-bold text-white">{feature.text}</span>
                      </div>
                    );
                  })}
                </motion.div>
              </div>

              {/* RIGHT: Floating Stats - 2 columns */}
              <div className="lg:col-span-2 relative hidden lg:flex items-center justify-center p-8">
                <div className="grid grid-cols-1 gap-4 w-full max-w-xs">
                  {/* Stat Card 1 - Google Rating */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, x: 50 }}
                    whileInView={{ opacity: 1, scale: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    whileHover={{ scale: 1.03, y: -3 }}
                    className="group relative bg-white rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                  >
                    {/* Decorative Background */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>

                    <div className="relative flex items-center gap-3">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-xl blur opacity-40"></div>
                        <div className="relative w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                          <FaStar className="text-white text-xl" />
                        </div>
                      </div>
                      <div>
                        <div className="text-3xl font-black bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent mb-0.5">
                          {homePageData?.appointment_cta_stat1_number || '4.9'}
                        </div>
                        <div className="text-xs text-gray-600 font-bold">{homePageData?.appointment_cta_stat1_label || 'Google Puanı'}</div>
                        <div className="flex gap-0.5 mt-0.5">
                          {[...Array(5)].map((_, i) => (
                            <FaStar key={i} className="text-yellow-400" style={{ fontSize: '9px' }} />
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Stat Card 2 - Happy Animals */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, x: 50 }}
                    whileInView={{ opacity: 1, scale: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    whileHover={{ scale: 1.03, y: -3 }}
                    className="group relative bg-white rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                  >
                    {/* Decorative Background */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>

                    <div className="relative flex items-center gap-3">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl blur opacity-40"></div>
                        <div className="relative w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                          <FaHeart className="text-white text-xl" />
                        </div>
                      </div>
                      <div>
                        <div className="text-3xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-0.5">
                          {homePageData?.appointment_cta_stat2_number || '5,000+'}
                        </div>
                        <div className="text-xs text-gray-600 font-bold">{homePageData?.appointment_cta_stat2_label || 'Mutlu Hayvan'}</div>
                        <div className="text-[10px] text-gray-500 mt-0.5">Sağlıklı Dostlar</div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Stat Card 3 - Expert Vets */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, x: 50 }}
                    whileInView={{ opacity: 1, scale: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    whileHover={{ scale: 1.03, y: -3 }}
                    className="group relative bg-white rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                  >
                    {/* Decorative Background */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-orange-500/10 to-pink-500/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>

                    <div className="relative flex items-center gap-3">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-pink-500 rounded-xl blur opacity-40"></div>
                        <div className="relative w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                          <FaUserMd className="text-white text-xl" />
                        </div>
                      </div>
                      <div>
                        <div className="text-3xl font-black bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent mb-0.5">
                          {homePageData?.appointment_cta_stat3_number || '15+'}
                        </div>
                        <div className="text-xs text-gray-600 font-bold">{homePageData?.appointment_cta_stat3_label || 'Uzman Veteriner'}</div>
                        <div className="text-[10px] text-gray-500 mt-0.5">Deneyimli Ekip</div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Bottom Stats Bar - Mobile/Desktop */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-12 lg:hidden"
          >
            <div className="bg-white rounded-2xl p-6 shadow-lg text-center border border-gray-100">
              <div className="text-3xl font-black text-gray-900 mb-1">
                {homePageData?.appointment_cta_stat1_number || '4.9'}
              </div>
              <div className="text-sm text-gray-600 font-medium">
                {homePageData?.appointment_cta_stat1_label || 'Google Puanı'}
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg text-center border border-gray-100">
              <div className="text-3xl font-black text-gray-900 mb-1">
                {homePageData?.appointment_cta_stat2_number || '5,000+'}
              </div>
              <div className="text-sm text-gray-600 font-medium">
                {homePageData?.appointment_cta_stat2_label || 'Mutlu Hayvan'}
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg text-center border border-gray-100">
              <div className="text-3xl font-black text-gray-900 mb-1">
                {homePageData?.appointment_cta_stat3_number || '15+'}
              </div>
              <div className="text-sm text-gray-600 font-medium">
                {homePageData?.appointment_cta_stat3_label || 'Uzman Veteriner'}
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
