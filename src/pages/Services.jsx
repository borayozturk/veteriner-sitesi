import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { services as staticServices } from '../data/services';
import { FaArrowRight, FaPhone, FaChevronDown } from 'react-icons/fa';
import { petImages } from '../utils/petImages';
import SEO from '../components/common/SEO';
import { useSEO } from '../contexts/SEOContext';
import { ServiceCardSkeleton, HeroSkeleton } from '../components/common/LoadingSkeleton';

const Services = () => {
  const [whatWeOfferContent, setWhatWeOfferContent] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageSettings, setPageSettings] = useState(null);

  // Get SEO settings from context
  const { getSEOForPage, loading: seoLoading } = useSEO();
  const seoData = getSEOForPage('services');

  // Scroll to services section
  const scrollToServices = () => {
    const servicesSection = document.getElementById('services-section');
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Fetch services from database
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(import.meta.env.VITE_API_URL + '/api/services/active/');
        const data = await response.json();
        console.log('🔍 Services Page - Fetched services from API:', data.length, 'services');

        // Merge database services with static data
        const mergedServices = data.map(dbService => {
          const staticService = staticServices.find(s => s.slug === dbService.slug);
          return {
            ...staticService,
            ...dbService,
            id: dbService.id
          };
        });

        console.log('✅ Services Page - Merged services:', mergedServices.length, 'services');
        setServices(mergedServices);
        setLoading(false);
      } catch (error) {
        console.error('❌ Services Page - Hizmetler yüklenemedi:', error);
        // Fallback to static services
        setServices(staticServices);
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  // Fetch Services Page Settings from database
  useEffect(() => {
    const fetchPageSettings = async () => {
      try {
        const response = await fetch(import.meta.env.VITE_API_URL + '/api/services-page/');
        const data = await response.json();
        console.log('🔍 Services Page - Fetched page settings:', data);
        setPageSettings(data);
      } catch (error) {
        console.error('Services Page settings could not be loaded:', error);
      }
    };
    fetchPageSettings();
  }, []);
  // Color palette for services
  const gradients = [
    'from-blue-500 to-cyan-500',
    'from-purple-500 to-pink-500',
    'from-green-500 to-emerald-500',
    'from-orange-500 to-amber-500',
    'from-indigo-500 to-violet-500',
    'from-rose-500 to-pink-500',
  ];

  // Featured card images - curated pet photos
  const featuredImages = [
    petImages.dogs[2],  // Index 0 (Yurtdışı Çıkış)
    petImages.cats[1],  // Index 7 (Laboratuvar)
    petImages.dogs[4],  // Index 14 (if exists)
  ];

  // Structured data for Services page
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    "name": "PetKey Veteriner Hizmetleri",
    "description": "Evcil dostlarınız için kapsamlı veteriner hizmetleri: genel muayene, aşı, cerrahi operasyon, laboratuvar, ultrason, röntgen, bakım ve daha fazlası.",
    "url": "https://petkey.com/hizmetler",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Veteriner Hizmetleri",
      "itemListElement": services.map((service, index) => ({
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": service.title,
          "description": service.shortDescription
        }
      }))
    }
  };

  // Loading state
  if (loading) {
    return (
      <>
        <SEO
          title={seoData?.title || "Hizmetlerimiz"}
          description={seoData?.description || "Evcil dostlarınız için kapsamlı veteriner hizmetleri"}
        />
        <div className="min-h-screen bg-white">
          {/* Hero Skeleton */}
          <HeroSkeleton />

          {/* Services Grid Skeleton */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <ServiceCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="bg-white">
      {!seoLoading && (
        <SEO
          title={seoData.title}
          description={seoData.description}
          keywords={seoData.keywords}
          image={seoData.ogImage}
          canonical={seoData.canonical}
          structuredData={structuredData}
        />
      )}

      {/* HERO - Premium Veterinary Services */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-gradient-to-b from-gray-50 to-white">
        {/* Subtle Pattern Background */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        </div>

        <div className="container-custom relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* LEFT: Content */}
            <div>
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200 mb-6"
              >
                <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                <span className="text-sm font-bold text-emerald-700">{services.length} Profesyonel Hizmet</span>
              </motion.div>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 mb-6 leading-tight"
              >
                {pageSettings?.hero_title_line1 || 'Evcil Dostlarınız İçin'}
                <br />
                <span className="bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
                  {pageSettings?.hero_title_line2 || 'Kapsamlı Hizmetler'}
                </span>
              </motion.h1>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="text-lg md:text-xl text-gray-600 leading-relaxed mb-8 max-w-xl"
              >
                {pageSettings?.hero_description || 'Modern ekipmanlarımız ve uzman veteriner kadromuzla evcil hayvanlarınızın sağlığı için her türlü hizmeti sunuyoruz.'}
              </motion.p>

              {/* Feature Pills */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="flex flex-wrap gap-3 mb-10"
              >
                {(pageSettings?.feature_pills || [
                  { icon: '🏥', text: 'Modern Klinik' },
                  { icon: '⚡', text: '7/24 Acil Servis' },
                  { icon: '👨‍⚕️', text: 'Uzman Kadro' }
                ]).map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm"
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="text-sm font-semibold text-gray-700">{item.text}</span>
                  </div>
                ))}
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link
                  to="/randevu"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <span>Randevu Al</span>
                  <FaArrowRight size={16} />
                </Link>
                <a
                  href={`tel:${pageSettings?.hero_phone_link?.replace(/\s/g, '') || '+902121234567'}`}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-gray-200 text-gray-900 font-bold rounded-full hover:border-emerald-600 transition-all duration-300"
                >
                  <FaPhone size={16} />
                  <span>{pageSettings?.hero_phone || '(0212) 123 45 67'}</span>
                </a>
              </motion.div>
            </div>

            {/* RIGHT: Stats Cards */}
            <div className="relative hidden lg:block">
              <div className="grid grid-cols-2 gap-4">
                {(pageSettings?.stats || []).slice(0, 5).map((stat, index) => {
                  // Special layout for 3rd stat (index 2) - make it large
                  const isLarge = index === 2;
                  const delay = 0.2 + (index * 0.1);

                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay }}
                      className={`rounded-2xl p-${isLarge ? '8' : '6'} shadow-${isLarge ? 'xl' : 'lg'} ${
                        isLarge
                          ? `col-span-2 bg-gradient-to-br ${stat.gradient} text-white`
                          : 'bg-white border border-gray-100'
                      }`}
                    >
                      {isLarge ? (
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-4xl font-black mb-2">{stat.number}</div>
                            <div className="text-sm font-bold opacity-90">{stat.label}</div>
                          </div>
                          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                            <span className="text-4xl">{stat.icon}</span>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mb-4`}>
                            <span className="text-2xl">{stat.icon}</span>
                          </div>
                          <div className={`text-3xl font-black bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-1`}>
                            {stat.number}
                          </div>
                          <div className="text-sm font-semibold text-gray-600">{stat.label}</div>
                        </>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Mobile Stats - Bottom */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 lg:hidden"
          >
            {(pageSettings?.stats || []).slice(0, 4).map((stat, index) => (
              <div key={index} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center">
                <div className={`text-2xl font-black bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-1`}>
                  {stat.number}
                </div>
                <div className="text-xs font-semibold text-gray-600">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll Down Arrow */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.button
            onClick={scrollToServices}
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="group flex flex-col items-center gap-2 cursor-pointer bg-white/80 backdrop-blur-sm rounded-full p-4 hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl"
            aria-label="Hizmetleri görüntüle"
          >
            <FaChevronDown
              className="text-emerald-600 group-hover:text-emerald-700 transition-colors"
              size={24}
            />
          </motion.button>
        </motion.div>
      </section>


      {/* SERVICES GRID - Revolutionary Bento Box Layout */}
      <section id="services-section" className="py-20">
        <div className="container-custom">
          {/* Bento Grid - Asymmetric, Modern */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => {
              const gradient = gradients[index % gradients.length];

              // Create featured items (larger cards)
              const isFeatured = index % 7 === 0;
              const featuredImageIndex = Math.floor(index / 7);
              const featuredImage = isFeatured ? featuredImages[featuredImageIndex] : null;

              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05, duration: 0.5 }}
                  className={`group ${isFeatured ? 'md:col-span-2 md:row-span-2' : ''}`}
                >
                  <Link to={`/service/${service.slug}`} className="block h-full">
                    <motion.div
                      whileHover={{ y: -8, scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                      className={`relative h-full bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 ${
                        isFeatured ? 'p-12' : 'p-8'
                      }`}
                    >
                      {/* Background Pet Image for Featured Cards - Bottom Half */}
                      {isFeatured && featuredImage && (
                        <div className="absolute bottom-0 left-0 right-0 top-1/2 overflow-hidden rounded-b-3xl">
                          <img
                            src={featuredImage}
                            alt="Pet"
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-white/30 via-white/60 to-white/90" />
                        </div>
                      )}

                      {/* Gradient Accent - Top Border */}
                      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient}`} />

                      {/* Icon Container */}
                      <div className="relative z-10 mb-6">
                        <motion.div
                          whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                          transition={{ duration: 0.5 }}
                          className={`inline-flex items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} shadow-lg ${
                            isFeatured ? 'w-28 h-28 text-7xl' : 'w-20 h-20 text-5xl'
                          }`}
                        >
                          <span className="filter drop-shadow-sm">{service.icon}</span>
                        </motion.div>
                      </div>

                      {/* Content */}
                      <div className={`relative z-10 space-y-4 ${
                        isFeatured ? 'md:bg-transparent md:p-0 bg-white/95 backdrop-blur-sm p-6 rounded-2xl shadow-lg' : ''
                      }`}>
                        <h3 className={`font-bold text-gray-900 transition-all ${
                          isFeatured ? 'text-4xl' : 'text-2xl'
                        }`}>
                          {service.title}
                        </h3>

                        <p className={`text-gray-700 leading-relaxed ${
                          isFeatured ? 'text-lg' : 'text-base'
                        }`}>
                          {service.shortDescription}
                        </p>

                        {/* CTA */}
                        <div className="flex items-center gap-2 text-sm font-semibold text-gray-400 group-hover:text-gray-900 group-hover:gap-4 transition-all pt-4">
                          <span>Detaylı İncele</span>
                          <FaArrowRight size={14} />
                        </div>
                      </div>

                      {/* Hover Gradient Background */}
                      <div className={`absolute -bottom-12 -right-12 w-48 h-48 bg-gradient-to-br ${gradient} rounded-full opacity-0 group-hover:opacity-[0.06] blur-3xl transition-opacity duration-700`} />
                    </motion.div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA SECTION - Ultra Minimal White Design */}
      <section className="py-24 relative overflow-hidden">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative bg-white rounded-[3rem] p-12 md:p-16 border border-gray-200 shadow-xl"
            >
              {/* Floating Gradient Orb */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full blur-3xl opacity-20" />

              <div className="relative z-10 text-center space-y-8">
                {/* Icon */}
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 shadow-lg">
                  <FaPhone className="text-white" size={28} />
                </div>

                {/* Title */}
                <div className="space-y-4">
                  <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
                    {pageSettings?.cta_title || 'Daha Fazla Bilgi İçin'}
                    <br />
                    <span className="text-transparent bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text">
                      {pageSettings?.cta_subtitle || 'Bize Ulaşın'}
                    </span>
                  </h2>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    {pageSettings?.cta_description || 'Size en uygun hizmeti bulmak ve randevu oluşturmak için 7/24 hizmetinizdeyiz'}
                  </p>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <a
                    href={`tel:${pageSettings?.cta_phone?.replace(/\s/g, '') || '+902121234567'}`}
                    className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                  >
                    <FaPhone className="group-hover:rotate-12 transition-transform" />
                    <span>{pageSettings?.cta_phone || '(0212) 123 45 67'}</span>
                  </a>
                  <Link
                    to="/randevu"
                    className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white border-2 border-gray-200 text-gray-900 font-bold rounded-2xl hover:border-purple-600 hover:text-purple-600 transition-all duration-300"
                  >
                    <span>Online Randevu</span>
                    <FaArrowRight />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Background Blur Elements */}
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-100 rounded-full blur-3xl opacity-20" />
      </section>
    </div>
  );
};

export default Services;
