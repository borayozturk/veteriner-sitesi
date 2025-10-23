import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaWhatsapp, FaClock, FaPaperPlane, FaCheckCircle, FaComments, FaHeadset } from 'react-icons/fa';
import api from '../services/api';
import SEO from '../components/common/SEO';
import { useSEO } from '../contexts/SEOContext';

const ContactPage = () => {
  const { getSEOForPage, loading: seoLoading } = useSEO();
  const seoSettings = getSEOForPage('contact');

  console.log('🔍 ContactPage - seoLoading:', seoLoading);
  console.log('🔍 ContactPage - seoSettings:', seoSettings);

  // Page content state
  const [pageContent, setPageContent] = useState(null);
  const [loading, setLoading] = useState(true);

  // Contact form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  // Fetch contact page content
  useEffect(() => {
    const fetchPageContent = async () => {
      try {
        const response = await api.contactPage.get();

        if (Array.isArray(response) && response.length > 0) {
          setPageContent(response[0]);
        } else if (response && !Array.isArray(response)) {
          setPageContent(response);
        }
      } catch (error) {
        console.error('Failed to fetch contact page content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPageContent();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await api.contact.create(formData);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });

      // Reset status after 3 seconds
      setTimeout(() => setSubmitStatus(null), 3000);
    } catch (error) {
      console.error('Mesaj gönderilemedi:', error);
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus(null), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };


  // Show loading screen only while actually loading, not when data is missing
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl text-gray-700 font-semibold">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  // If no pageContent after loading, create default data
  const content = pageContent || {
    hero_title: 'Bizimle İletişime Geçin',
    hero_subtitle: 'Sevimli dostlarınızın sağlığı için her zaman yanınızdayız. 7/24 hizmetinizdeyiz!',
    phone_number: '(0212) 123 45 67',
    phone_label: 'Telefon',
    whatsapp_number: '0555 123 45 67',
    whatsapp_label: 'WhatsApp',
    email_primary: 'info@petkey.com',
    email_secondary: 'destek@petkey.com',
    address_line1: 'Kadıköy, İstanbul',
    address_line2: 'Türkiye',
    google_maps_url: 'https://www.google.com/maps/place/Kad%C4%B1k%C3%B6y,+Istanbul/@40.9887328,29.0242891,13z',
    google_maps_embed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d48377.833789145195!2d29.00782952167968!3d40.98876200000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab9bdf0702a83%3A0xe9e46e5fdbf96af!2zS2FkxLFrw7Z5LCDEsHN0YW5idWw!5e0!3m2!1str!2str!4v1647000000000!5m2!1str!2str',
    emergency_title: 'Acil Durumlar İçin',
    emergency_subtitle: 'Evcil dostunuzun acil bir durumu mu var? Hemen bizi arayın, yanınızdayız!',
    emergency_phone: '(0212) 123 45 67',
    emergency_whatsapp: '905551234567',
    working_hours: [],
    why_contact_us: []
  };

  // Build contactInfo from content
  const contactInfo = [
    {
      icon: FaPhone,
      title: content.phone_label || 'Telefon',
      subtitle: 'Hemen Arayın',
      details: [content.phone_number || '(0212) 123 45 67', '7/24 Acil Hat'],
      link: `tel:${content.phone_number?.replace(/\s/g, '') || '+902121234567'}`,
      gradient: 'from-blue-500 via-blue-600 to-cyan-600',
      bgGradient: 'from-blue-50 to-cyan-50',
      shadow: 'hover:shadow-blue-500/25',
    },
    {
      icon: FaWhatsapp,
      title: content.whatsapp_label || 'WhatsApp',
      subtitle: 'Mesaj Gönderin',
      details: [content.whatsapp_number || '0555 123 45 67', 'Hızlı İletişim'],
      link: content.whatsapp_number ? `https://wa.me/${content.whatsapp_number.replace(/\s/g, '')}` : 'https://wa.me/905551234567',
      gradient: 'from-green-500 via-green-600 to-emerald-600',
      bgGradient: 'from-green-50 to-emerald-50',
      shadow: 'hover:shadow-green-500/25',
    },
    {
      icon: FaEnvelope,
      title: 'E-posta',
      subtitle: 'Mail Gönderin',
      details: [content.email_primary || 'info@petkey.com', content.email_secondary || 'destek@petkey.com'].filter(Boolean),
      link: `mailto:${content.email_primary || 'info@petkey.com'}`,
      gradient: 'from-purple-500 via-purple-600 to-pink-600',
      bgGradient: 'from-purple-50 to-pink-50',
      shadow: 'hover:shadow-purple-500/25',
    },
    {
      icon: FaMapMarkerAlt,
      title: 'Adres',
      subtitle: 'Ziyaret Edin',
      details: [content.address_line1 || 'Kadıköy, İstanbul', content.address_line2 || 'Türkiye'].filter(Boolean),
      link: content.google_maps_url || 'https://www.google.com/maps/place/Kad%C4%B1k%C3%B6y,+Istanbul/@40.9887328,29.0242891,13z',
      gradient: 'from-orange-500 via-orange-600 to-red-600',
      bgGradient: 'from-orange-50 to-red-50',
      shadow: 'hover:shadow-orange-500/25',
    },
  ];

  // Build workingHours from content
  const workingHours = content.working_hours && content.working_hours.length > 0
    ? content.working_hours.map(item => ({
        day: item.day || '',
        hours: item.hours || '',
        available: true,
        highlight: item.highlight || false
      }))
    : [
        { day: 'Pazartesi - Cuma', hours: '09:00 - 19:00', available: true },
        { day: 'Cumartesi', hours: '10:00 - 17:00', available: true },
        { day: 'Pazar', hours: '10:00 - 15:00', available: true },
        { day: 'Acil Servis', hours: '7/24 Hizmet', available: true, highlight: true },
      ];

  // Build reasons from content
  const reasons = content.why_contact_us && content.why_contact_us.length > 0
    ? content.why_contact_us.map(item => ({
        icon: item.icon || '🏥',
        title: item.title || '',
        description: item.description || ''
      }))
    : [
        { icon: '🏥', title: 'Acil Durumlar', description: '7/24 kesintisiz acil veteriner hizmeti' },
        { icon: '💉', title: 'Aşılama', description: 'Düzenli aşı takvimine uygun hizmet' },
        { icon: '🔬', title: 'Teşhis & Tedavi', description: 'Modern ekipmanlarla tam teşhis' },
        { icon: '❤️', title: 'Genel Sağlık', description: 'Rutin kontrol ve danışmanlık' },
      ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {!seoLoading && (
        <SEO
          title={seoSettings.title}
          description={seoSettings.description}
          keywords={seoSettings.keywords}
          image={seoSettings.ogImage}
          canonical={seoSettings.canonical}
        />
      )}

      {/* Hero Section - Ultra Modern */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-300/30 rounded-full blur-3xl animate-pulse delay-700" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-orange-200/20 to-purple-200/20 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            {/* Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-block mb-6"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur-2xl opacity-50" />
                <div className="relative w-24 h-24 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-600 rounded-3xl flex items-center justify-center shadow-2xl">
                  <FaComments className="text-white text-4xl" />
                </div>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent leading-tight"
            >
              {content.hero_title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl md:text-2xl text-gray-700 mb-8 leading-relaxed"
            >
              {content.hero_subtitle}
            </motion.p>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap justify-center gap-8 mt-12"
            >
              <div className="text-center">
                <div className="text-4xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  &lt; 1 saat
                </div>
                <div className="text-sm text-gray-600 font-semibold mt-1">Ortalama Yanıt Süresi</div>
              </div>
              <div className="w-px bg-gray-300" />
              <div className="text-center">
                <div className="text-4xl font-black bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent">
                  7/24
                </div>
                <div className="text-sm text-gray-600 font-semibold mt-1">Acil Destek</div>
              </div>
              <div className="w-px bg-gray-300" />
              <div className="text-center">
                <div className="text-4xl font-black bg-gradient-to-r from-orange-600 to-purple-600 bg-clip-text text-transparent">
                  %98
                </div>
                <div className="text-sm text-gray-600 font-semibold mt-1">Memnuniyet Oranı</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Contact Methods - Premium Cards */}
      <section className="py-12 relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactInfo.map((info, index) => (
              <motion.a
                key={index}
                href={info.link}
                target={info.link.startsWith('http') ? '_blank' : '_self'}
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className={`group relative bg-white rounded-3xl p-6 shadow-xl ${info.shadow} transition-all duration-300 overflow-hidden`}
              >
                {/* Background Gradient on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${info.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                {/* Content */}
                <div className="relative z-10">
                  {/* Icon */}
                  <div className={`w-16 h-16 bg-gradient-to-br ${info.gradient} rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                    <info.icon size={28} />
                  </div>

                  {/* Title */}
                  <h3 className="font-black text-xl text-gray-900 mb-1 group-hover:text-purple-600 transition-colors">
                    {info.title}
                  </h3>
                  <p className="text-sm text-gray-500 font-semibold mb-3">{info.subtitle}</p>

                  {/* Details */}
                  <div className="space-y-1">
                    {info.details.map((detail, idx) => (
                      <p key={idx} className="text-gray-700 font-semibold text-sm">
                        {detail}
                      </p>
                    ))}
                  </div>

                  {/* Arrow */}
                  <div className="mt-4 flex items-center text-purple-600 font-bold text-sm group-hover:translate-x-2 transition-transform">
                    İletişime Geç
                    <span className="ml-2">→</span>
                  </div>
                </div>

                {/* Decorative Element */}
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br from-purple-600/10 to-pink-600/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Reasons to Contact */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Neden Bize Ulaşmalısınız?
            </h2>
            <p className="text-lg text-gray-600">
              Her türlü veteriner hizmeti ve danışmanlık için yanınızdayız
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {reasons.map((reason, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 text-center"
              >
                <div className="text-5xl mb-4">{reason.icon}</div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">{reason.title}</h3>
                <p className="text-sm text-gray-600">{reason.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content - Form & Sidebar */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="py-12"
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Contact Form - 2 columns */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 relative overflow-hidden">
                {/* Decorative Background */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full blur-3xl opacity-30 -translate-y-1/2 translate-x-1/2" />

                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                      <FaPaperPlane size={24} />
                    </div>
                    <div>
                      <h2 className="text-3xl md:text-4xl font-black text-gray-900">Mesaj Gönderin</h2>
                      <p className="text-gray-600 text-sm">En kısa sürede size geri dönüş yapacağız</p>
                    </div>
                  </div>

                  {submitStatus === 'success' && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="mb-6 p-5 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-2xl flex items-center gap-4"
                    >
                      <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <FaCheckCircle className="text-white text-2xl" />
                      </div>
                      <div>
                        <p className="font-bold text-green-800 text-lg">Mesajınız Gönderildi!</p>
                        <p className="text-green-700 text-sm">En kısa sürede size dönüş yapacağız.</p>
                      </div>
                    </motion.div>
                  )}

                  {submitStatus === 'error' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-6 p-4 bg-red-50 border-2 border-red-300 text-red-800 rounded-2xl text-center font-semibold"
                    >
                      ❌ Mesaj gönderilemedi. Lütfen tekrar deneyin.
                    </motion.div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          Adınız Soyadınız *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all text-gray-900 font-medium"
                          placeholder="Adınız Soyadınız"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          E-posta *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all text-gray-900 font-medium"
                          placeholder="ornek@email.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          Telefon
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all text-gray-900 font-medium"
                          placeholder="0555 123 45 67"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          Konu *
                        </label>
                        <select
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all text-gray-900 font-medium"
                        >
                          <option value="">Konu Seçin</option>
                          <option value="genel-bilgi">Genel Bilgi</option>
                          <option value="randevu">Randevu Talebi</option>
                          <option value="acil">Acil Durum</option>
                          <option value="fiyat">Fiyat Bilgisi</option>
                          <option value="sikayet">Şikayet & Öneri</option>
                          <option value="diger">Diğer</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Mesajınız *
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows="6"
                        className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all resize-none text-gray-900 font-medium"
                        placeholder="Mesajınızı buraya yazın..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="group w-full bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 text-white py-5 rounded-2xl font-bold text-lg hover:shadow-2xl hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-600 via-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <span className="relative z-10 flex items-center gap-3">
                        {isSubmitting ? (
                          <>
                            <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                            Gönderiliyor...
                          </>
                        ) : (
                          <>
                            <FaPaperPlane />
                            Mesajı Gönder
                          </>
                        )}
                      </span>
                    </button>
                  </form>
                </div>
              </div>
            </div>

            {/* Sidebar - 1 column */}
            <div className="space-y-6">
              {/* Working Hours Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-white rounded-3xl shadow-2xl p-8 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full blur-3xl opacity-40" />

                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                      <FaClock size={20} />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900">Çalışma Saatleri</h3>
                  </div>

                  <div className="space-y-3">
                    {workingHours.map((item, index) => (
                      <div
                        key={index}
                        className={`flex justify-between items-center py-3 px-4 rounded-xl transition-all ${
                          item.highlight
                            ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300'
                            : 'border-b border-gray-100'
                        }`}
                      >
                        <span className={`font-bold ${item.highlight ? 'text-green-700' : 'text-gray-700'}`}>
                          {item.highlight && '🚨 '}
                          {item.day}
                        </span>
                        <span className={`font-black ${item.highlight ? 'text-green-600' : 'text-purple-600'}`}>
                          {item.hours}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 via-pink-50 to-orange-50 rounded-2xl border border-purple-200">
                    <p className="text-sm text-gray-700 text-center font-semibold">
                      <FaHeadset className="inline mr-2" />
                      <strong>Acil durumlar</strong> için 7/24 hizmetinizdeyiz!
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Map Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
                className="bg-white rounded-3xl shadow-2xl p-8 relative overflow-hidden"
              >
                <h3 className="text-2xl font-black text-gray-900 mb-4 flex items-center gap-2">
                  <span>📍</span> Konumumuz
                </h3>
                <div className="aspect-square bg-gray-200 rounded-2xl overflow-hidden shadow-lg mb-4">
                  <iframe
                    src={content.google_maps_embed}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="PetKey Veteriner Kliniği Konumu"
                  />
                </div>
                <a
                  href={content.google_maps_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-4 rounded-xl font-bold hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2"
                >
                  <FaMapMarkerAlt />
                  Google Maps'te Aç
                </a>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Emergency Banner - Dramatic */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative bg-gradient-to-r from-red-600 via-pink-600 to-orange-600 rounded-3xl p-8 md:p-16 text-white text-center overflow-hidden shadow-2xl"
          >
            {/* Animated Background */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse delay-700" />
            </div>

            <div className="relative z-10">
              <div className="text-6xl mb-4">🚨</div>
              <h2 className="text-4xl md:text-5xl font-black mb-4">
                {content.emergency_title}
              </h2>
              <p className="text-xl mb-8 opacity-95 max-w-2xl mx-auto">
                {content.emergency_subtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto">
                <a
                  href={`tel:${content.emergency_phone?.replace(/\s/g, '')}`}
                  className="flex-1 bg-white text-red-600 px-8 py-5 rounded-2xl font-black text-lg hover:shadow-2xl hover:scale-105 transition-all inline-flex items-center justify-center gap-3"
                >
                  <FaPhone className="text-xl" />
                  Acil Hat: {content.emergency_phone}
                </a>
                <a
                  href={`https://wa.me/${content.emergency_whatsapp.replace(/\s/g, '')}`}
                  className="flex-1 bg-green-500 text-white px-8 py-5 rounded-2xl font-black text-lg hover:shadow-2xl hover:scale-105 transition-all inline-flex items-center justify-center gap-3"
                >
                  <FaWhatsapp className="text-xl" />
                  WhatsApp ile Ulaşın
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
