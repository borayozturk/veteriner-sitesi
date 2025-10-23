import { useParams, Link, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheck, FaPhone, FaArrowLeft, FaCalendar, FaClock, FaMapMarkerAlt } from 'react-icons/fa';
import { services as staticServices } from '../data/services';
import SEO from '../components/common/SEO';

const ServiceDetail = () => {
  const { slug } = useParams();
  const [service, setService] = useState(null);
  const [pageContent, setPageContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  // Fetch service and page content from database
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch service data from API
        const serviceResponse = await fetch(`http://localhost:8000/api/services/all/`);
        if (serviceResponse.ok) {
          const servicesData = await serviceResponse.json();
          const foundService = servicesData.find(s => s.slug === slug);

          if (foundService) {
            setService(foundService);
          } else {
            // Fallback to static data if not found in API
            const staticService = staticServices.find(s => s.slug === slug);
            setService(staticService);
          }
        } else {
          // Fallback to static data if API fails
          const staticService = staticServices.find(s => s.slug === slug);
          setService(staticService);
        }

        // Fetch page content
        const pageResponse = await fetch(`http://localhost:8000/api/pages/by-name/${slug}/`);
        if (pageResponse.ok) {
          const data = await pageResponse.json();
          setPageContent(data);
        }
      } catch (error) {
        console.error('Veri yüklenemedi:', error);
        // Fallback to static data on error
        const staticService = staticServices.find(s => s.slug === slug);
        setService(staticService);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchData();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!service) {
    return <Navigate to="/hizmetler" replace />;
  }

  // Get service gradient colors - using actual color values for dynamic styling
  const getGradientClasses = (id) => {
    const gradients = [
      { bg: 'bg-gradient-to-r from-blue-500 to-cyan-500', text: 'from-blue-500 to-cyan-500' },
      { bg: 'bg-gradient-to-r from-purple-500 to-pink-500', text: 'from-purple-500 to-pink-500' },
      { bg: 'bg-gradient-to-r from-green-500 to-emerald-500', text: 'from-green-500 to-emerald-500' },
      { bg: 'bg-gradient-to-r from-orange-500 to-amber-500', text: 'from-orange-500 to-amber-500' },
      { bg: 'bg-gradient-to-r from-indigo-500 to-violet-500', text: 'from-indigo-500 to-violet-500' },
      { bg: 'bg-gradient-to-r from-rose-500 to-pink-500', text: 'from-rose-500 to-pink-500' },
    ];
    return gradients[id % gradients.length];
  };

  const gradientClasses = getGradientClasses(service.id);

  return (
    <div className="bg-white">
      {/* SEO Meta Tags */}
      <SEO
        title={service.meta_title || service.title}
        description={service.meta_description || service.short_description || service.shortDescription}
        keywords={service.meta_keywords || ''}
        image={service.og_image || '/og-service.jpg'}
        type="website"
        useRawTitle={!!service.meta_title}
      />

      {/* REVOLUTIONARY HERO - Ultra Minimal White with Floating Icon */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="container-custom">
          {/* Back Button - Minimal */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-12"
          >
            <Link
              to="/hizmetler"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors group"
            >
              <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
              <span>Tüm Hizmetler</span>
            </Link>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* LEFT: Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-8"
            >
              {/* Category Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 border border-gray-200">
                <span className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600"></span>
                <span className="text-sm font-semibold text-gray-700">Veteriner Hizmeti</span>
              </div>

              {/* Title */}
              <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 leading-none tracking-tight">
                {pageContent?.title || service.title}
              </h1>

              {/* Description */}
              <p className="text-xl text-gray-600 leading-relaxed">
                {pageContent?.content || service.shortDescription}
              </p>

              {/* Quick Info Pills */}
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200">
                  <FaClock className="text-purple-600" />
                  <span className="text-sm font-medium text-gray-700">7/24 Hizmet</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200">
                  <FaMapMarkerAlt className="text-pink-600" />
                  <span className="text-sm font-medium text-gray-700">Klinikte</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link
                  to="/randevu"
                  className={`group inline-flex items-center justify-center gap-3 px-8 py-4 ${gradientClasses.bg} text-white font-bold rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300`}
                >
                  <FaCalendar className="group-hover:scale-110 transition-transform" />
                  <span>Randevu Al</span>
                </Link>
                <a
                  href="tel:+902121234567"
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white border-2 border-gray-900 text-gray-900 font-bold rounded-2xl hover:bg-gray-900 hover:text-white transition-all duration-300"
                >
                  <FaPhone />
                  <span>Hemen Ara</span>
                </a>
              </div>
            </motion.div>

            {/* RIGHT: Floating Icon Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="relative flex items-center justify-center"
            >
              {/* Floating Icon with Gradient Background */}
              <div className="relative">
                {/* Gradient Blur Backgrounds */}
                <div className={`absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full blur-3xl opacity-30 animate-pulse`}></div>
                <div className={`absolute inset-0 bg-gradient-to-tr from-purple-600 to-pink-600 rounded-full blur-2xl opacity-20 animate-pulse`} style={{ animationDelay: '1s' }}></div>

                {/* Icon Container */}
                <motion.div
                  whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                  className={`relative w-80 h-80 bg-gradient-to-br from-purple-600 to-pink-600 rounded-[4rem] flex items-center justify-center shadow-2xl`}
                >
                  <span className="text-[12rem] filter drop-shadow-2xl">{service.icon}</span>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Background Elements */}
        <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-purple-100 rounded-full blur-3xl opacity-20 -z-10" />
        <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-pink-100 rounded-full blur-3xl opacity-20 -z-10" />
      </section>

      {/* Main Content - Clean Two-Column Layout */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <div className="grid lg:grid-cols-12 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-8 space-y-16">
              {/* Render sections from PageContent if available */}
              {pageContent && pageContent.sections && pageContent.sections.length > 0 ? (
                pageContent.sections.map((section, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100"
                  >
                    {/* Section Title */}
                    {section.title && (
                      <div className="flex items-center gap-3 mb-6">
                        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg`}>
                          <span className="text-2xl">
                            {index === 0 ? '📋' : index === 1 ? '✨' : index === 2 ? '🔄' : '💡'}
                          </span>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900">{section.title}</h2>
                      </div>
                    )}

                    {/* Section Content (text) */}
                    {section.type !== 'list' && section.content && (
                      <div
                        className="text-gray-700 text-lg leading-relaxed prose prose-lg max-w-none"
                        dangerouslySetInnerHTML={{ __html: section.content }}
                      />
                    )}

                    {/* Section Items (list) */}
                    {(section.type === 'list' || section.type === 'both') && section.items && section.items.length > 0 && (
                      <div className={section.content ? 'mt-6' : ''}>
                        {section.type === 'both' && <div className="mb-6" />}
                        <div className="grid sm:grid-cols-2 gap-3">
                          {section.items.map((item, itemIndex) => (
                            <motion.div
                              key={itemIndex}
                              initial={{ opacity: 0, x: -20 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              viewport={{ once: true }}
                              transition={{ delay: itemIndex * 0.05 }}
                              className="flex items-start gap-3 p-4 rounded-2xl hover:bg-gray-50 transition-colors group"
                            >
                              <div className={`flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center mt-0.5 shadow-sm group-hover:scale-110 transition-transform`}>
                                <FaCheck className="text-white" size={12} />
                              </div>
                              <span className="text-gray-700 font-medium">{item}</span>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))
              ) : (
                /* Fallback to static service data if no PageContent */
                <>
                  {/* Description */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg`}>
                        <span className="text-2xl">📋</span>
                      </div>
                      <h2 className="text-3xl font-bold text-gray-900">Hizmet Hakkında</h2>
                    </div>
                    <p className="text-gray-700 text-lg leading-relaxed">{service.description}</p>
                  </motion.div>
                </>
              )}

              {/* Features - From PageContent or Static Service Data */}
              {((pageContent && pageContent.features && pageContent.features.length > 0) || service.features) && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100"
                >
                  <div className="flex items-center gap-3 mb-8">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg`}>
                      <span className="text-2xl">✨</span>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">Neler Sunuyoruz?</h2>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {(pageContent && pageContent.features && pageContent.features.length > 0 ? pageContent.features : service.features).map((feature, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-start gap-3 p-4 rounded-2xl hover:bg-gray-50 transition-colors group"
                      >
                        <div className={`flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center mt-0.5 shadow-sm group-hover:scale-110 transition-transform`}>
                          <FaCheck className="text-white" size={12} />
                        </div>
                        <span className="text-gray-700 font-medium">{feature}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Process - From PageContent or Static Service Data */}
              {((pageContent && pageContent.process_steps && pageContent.process_steps.length > 0) || service.process) && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100"
                >
                  <div className="flex items-center gap-3 mb-8">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg`}>
                      <span className="text-2xl">🔄</span>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">Süreç Nasıl İşler?</h2>
                  </div>
                  <div className="space-y-6">
                    {(pageContent && pageContent.process_steps && pageContent.process_steps.length > 0 ? pageContent.process_steps : service.process).map((step, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="group flex items-start gap-6 relative"
                      >
                        {/* Step Number */}
                        <div className={`flex-shrink-0 w-14 h-14 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-lg group-hover:scale-110 transition-transform`}>
                          {index + 1}
                        </div>

                        {/* Content */}
                        <div className="flex-1 pt-2">
                          <div className="bg-gray-50 p-6 rounded-2xl group-hover:bg-gray-100 transition-colors">
                            <p className="text-gray-700 text-lg leading-relaxed">{step}</p>
                          </div>
                        </div>

                        {/* Connecting Line (except last) */}
                        {index < (pageContent && pageContent.process_steps && pageContent.process_steps.length > 0 ? pageContent.process_steps : service.process).length - 1 && (
                          <div className="absolute left-7 top-20 w-0.5 h-6 bg-gradient-to-b from-gray-300 to-transparent"></div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Schedule (for vaccination) - From PageContent or Static Service Data */}
              {((pageContent && pageContent.vaccination_schedule &&
                (pageContent.vaccination_schedule.puppies || pageContent.vaccination_schedule.adult || pageContent.vaccination_schedule.rabies))
                || service.schedule) && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100"
                >
                  <div className="flex items-center gap-3 mb-8">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg`}>
                      <span className="text-2xl">📅</span>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">Aşı Takvimi</h2>
                  </div>
                  <div className="space-y-6">
                    {((pageContent && pageContent.vaccination_schedule && pageContent.vaccination_schedule.puppies) || service.schedule?.puppies) && (
                      <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100">
                        <h3 className="font-bold text-lg text-gray-900 mb-3 flex items-center gap-2">
                          <span>🐾</span> Yavru Hayvanlar
                        </h3>
                        <p className="text-gray-700 leading-relaxed">
                          {(pageContent && pageContent.vaccination_schedule && pageContent.vaccination_schedule.puppies)
                            ? pageContent.vaccination_schedule.puppies
                            : service.schedule.puppies}
                        </p>
                      </div>
                    )}
                    {((pageContent && pageContent.vaccination_schedule && pageContent.vaccination_schedule.adult) || service.schedule?.adult) && (
                      <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100">
                        <h3 className="font-bold text-lg text-gray-900 mb-3 flex items-center gap-2">
                          <span>🦴</span> Yetişkin Hayvanlar
                        </h3>
                        <p className="text-gray-700 leading-relaxed">
                          {(pageContent && pageContent.vaccination_schedule && pageContent.vaccination_schedule.adult)
                            ? pageContent.vaccination_schedule.adult
                            : service.schedule.adult}
                        </p>
                      </div>
                    )}
                    {((pageContent && pageContent.vaccination_schedule && pageContent.vaccination_schedule.rabies) || service.schedule?.rabies) && (
                      <div className="p-6 rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-100">
                        <h3 className="font-bold text-lg text-gray-900 mb-3 flex items-center gap-2">
                          <span>💉</span> Kuduz Aşısı
                        </h3>
                        <p className="text-gray-700 leading-relaxed">
                          {(pageContent && pageContent.vaccination_schedule && pageContent.vaccination_schedule.rabies)
                            ? pageContent.vaccination_schedule.rabies
                            : service.schedule.rabies}
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Services (for surgery) */}
              {service.services && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100"
                >
                  <div className="flex items-center gap-3 mb-8">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg`}>
                      <span className="text-2xl">➕</span>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">Ek Hizmetler</h2>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {service.services.map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors group"
                      >
                        <div className={`w-3 h-3 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 group-hover:scale-125 transition-transform`}></div>
                        <span className="text-gray-700 font-medium">{item}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Types (for parasite treatment) */}
              {service.types && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100"
                >
                  <div className="flex items-center gap-3 mb-8">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg`}>
                      <span className="text-2xl">💊</span>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">Tedavi Yöntemleri</h2>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {service.types.map((type, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.05 }}
                        className="p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:border-gray-300 transition-all text-center shadow-sm hover:shadow-md"
                      >
                        <span className="text-gray-700 font-semibold">{type}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* FAQs - REVOLUTIONARY ULTRA-MINIMAL DESIGN */}
              {pageContent && pageContent.faqs && pageContent.faqs.length > 0 && (
                <div className="relative">
                  {/* Ultra-Minimal Header */}
                  <div className="mb-12">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-1 h-8 bg-gradient-to-b from-purple-600 to-pink-600 rounded-full"></div>
                      <h2 className="text-4xl font-black text-gray-900">
                        Sıkça Sorulan Sorular
                      </h2>
                    </div>
                    <p className="text-gray-500 ml-8">Merak ettikleriniz</p>
                  </div>

                  {/* FAQ Grid - Clean & Fast */}
                  <div className="space-y-4">
                    {pageContent.faqs.map((faq, index) => (
                      <div
                        key={index}
                        className={`group relative overflow-hidden rounded-2xl border-2 transition-all duration-200 ${
                          openFaqIndex === index
                            ? 'bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 border-purple-200 shadow-lg shadow-purple-100/50'
                            : 'bg-white border-gray-200 hover:border-purple-200 hover:shadow-md'
                        }`}
                      >
                        {/* Active Indicator Bar */}
                        <div className={`absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-purple-600 to-pink-600 transition-all duration-200 ${
                          openFaqIndex === index ? 'opacity-100' : 'opacity-0'
                        }`} />

                        {/* Question Button */}
                        <button
                          onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                          className="w-full flex items-center justify-between gap-6 p-6 md:p-8 text-left"
                        >
                          <div className="flex items-center gap-4 flex-1">
                            {/* Number Badge */}
                            <span className={`flex-shrink-0 w-10 h-10 flex items-center justify-center text-sm font-bold rounded-xl transition-all duration-200 ${
                              openFaqIndex === index
                                ? 'bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-200'
                                : 'bg-gradient-to-br from-purple-100 to-pink-100 text-purple-700'
                            }`}>
                              {String(index + 1).padStart(2, '0')}
                            </span>

                            {/* Question */}
                            <h3 className={`text-lg md:text-xl font-bold transition-colors duration-200 ${
                              openFaqIndex === index ? 'text-gray-900' : 'text-gray-700 group-hover:text-gray-900'
                            }`}>
                              {faq.question}
                            </h3>
                          </div>

                          {/* Chevron Icon */}
                          <div className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-200 ${
                            openFaqIndex === index
                              ? 'bg-purple-100 rotate-180'
                              : 'bg-gray-100 group-hover:bg-purple-50'
                          }`}>
                            <svg className={`w-5 h-5 transition-colors ${
                              openFaqIndex === index ? 'text-purple-600' : 'text-gray-500'
                            }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </button>

                        {/* Answer */}
                        <div className={`overflow-hidden transition-all duration-200 ${
                          openFaqIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                        }`}>
                          <div className="px-6 md:px-8 pb-6 md:pb-8 pl-20 md:pl-24">
                            <div className={`p-4 rounded-xl transition-colors duration-200 ${
                              openFaqIndex === index ? 'bg-white/60' : ''
                            }`}>
                              <p className="text-gray-700 leading-relaxed">
                                {faq.answer}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Bottom CTA - Minimal */}
                  <div className="mt-12 p-8 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">Başka sorularınız mı var?</h3>
                        <p className="text-gray-600">Size yardımcı olmaktan mutluluk duyarız</p>
                      </div>
                      <Link
                        to="/iletisim"
                        className="group inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:shadow-lg transition-all duration-200"
                      >
                        <span>İletişime Geç</span>
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* STICKY SIDEBAR - Minimal Card Design */}
            <div className="lg:col-span-4">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="sticky top-24 space-y-6"
              >
                {/* CTA Card - Gradient with Floating Orb */}
                <div className="relative bg-white rounded-3xl p-8 shadow-lg border border-gray-100 overflow-hidden">
                  {/* Floating Gradient Orb */}
                  <div className={`absolute -top-12 -right-12 w-40 h-40 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full blur-3xl opacity-20`}></div>

                  <div className="relative z-10 space-y-6">
                    <div className="text-center">
                      <div className={`inline-flex w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 items-center justify-center mb-4 shadow-lg`}>
                        <FaCalendar className="text-white text-2xl" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">Randevu Alın</h3>
                      <p className="text-gray-600">
                        Hemen randevu oluşturun veya bizi arayın
                      </p>
                    </div>

                    <div className="space-y-3">
                      <Link
                        to="/randevu"
                        className={`w-full inline-flex items-center justify-center gap-2 py-4 px-6 ${gradientClasses.bg} text-white font-bold rounded-2xl hover:shadow-lg hover:scale-105 transition-all duration-300`}
                      >
                        <FaCalendar />
                        <span>Online Randevu</span>
                      </Link>
                      <a
                        href="tel:+902121234567"
                        className="w-full inline-flex items-center justify-center gap-2 py-4 px-6 bg-white border-2 border-gray-900 text-gray-900 font-bold rounded-2xl hover:bg-gray-900 hover:text-white transition-all duration-300"
                      >
                        <FaPhone />
                        <span>Hemen Ara</span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Contact Info - Clean List */}
                <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">İletişim</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0">
                        <FaPhone className="text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Telefon</p>
                        <p className="font-semibold text-gray-900">+90 (212) 123 45 67</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center flex-shrink-0">
                        <span className="text-pink-600">📧</span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">E-posta</p>
                        <p className="font-semibold text-gray-900 text-sm">info@petkeyveteriner.com</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0">
                        <FaClock className="text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Çalışma Saatleri</p>
                        <p className="font-semibold text-gray-900">7/24 Açık</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Info Badge */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100 rounded-3xl p-6">
                  <div className="flex gap-3">
                    <span className="text-2xl">⚡</span>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 mb-1">Acil Durum</p>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        7/24 acil veteriner hizmeti sunmaktayız. Acil durumlarda derhal arayın.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Services - Minimal Cards */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
              Diğer Hizmetlerimiz
            </h2>
            <p className="text-lg text-gray-600">
              İhtiyacınız olabilecek diğer veteriner hizmetlerimize göz atın
            </p>
          </motion.div>

          {/* Related Services Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {staticServices
              .filter(s => s.slug !== service.slug)
              .slice(0, 3)
              .map((relatedService, index) => {
                const relatedGradientClasses = getGradientClasses(relatedService.id);
                return (
                  <motion.div
                    key={relatedService.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link to={`/service/${relatedService.slug}`} className="group block h-full">
                      <motion.div
                        whileHover={{ y: -8, scale: 1.02 }}
                        transition={{ duration: 0.3 }}
                        className="relative h-full bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all overflow-hidden"
                      >
                        {/* Top Gradient Accent */}
                        <div className={`absolute top-0 left-0 right-0 h-1 ${relatedGradientClasses.bg}`} />

                        {/* Icon */}
                        <div className="mb-6">
                          <motion.div
                            whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                            transition={{ duration: 0.5 }}
                            className={`inline-flex w-20 h-20 rounded-2xl ${relatedGradientClasses.bg} items-center justify-center shadow-lg`}
                          >
                            <span className="text-5xl filter drop-shadow-sm">{relatedService.icon}</span>
                          </motion.div>
                        </div>

                        {/* Content */}
                        <div className="space-y-3">
                          <h3 className="text-2xl font-bold text-gray-900">
                            {relatedService.title}
                          </h3>
                          <p className="text-gray-600 leading-relaxed line-clamp-3">
                            {relatedService.shortDescription}
                          </p>

                          {/* CTA Arrow */}
                          <div className="flex items-center gap-2 text-sm font-semibold text-gray-400 group-hover:text-gray-900 group-hover:gap-4 transition-all pt-2">
                            <span>Detaylı İncele</span>
                            <FaArrowLeft className="rotate-180" size={14} />
                          </div>
                        </div>

                        {/* Hover Background Glow */}
                        <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-purple-200 rounded-full opacity-0 group-hover:opacity-[0.06] blur-3xl transition-opacity duration-700" />
                      </motion.div>
                    </Link>
                  </motion.div>
                );
              })}
          </div>

          {/* View All Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link
              to="/hizmetler"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              <span>Tüm Hizmetleri Görüntüle</span>
              <FaArrowLeft className="rotate-180" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ServiceDetail;
