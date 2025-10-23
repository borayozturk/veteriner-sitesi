import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaWhatsapp, FaClock, FaPaperPlane, FaCheckCircle, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import api from '../services/api';

const Contact = () => {
  // Page content from API
  const [pageContent, setPageContent] = useState(null);
  const [loading, setLoading] = useState(true);

  // Active tab state
  const [activeTab, setActiveTab] = useState('contact');

  // Contact form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  // Appointment form state
  const [appointmentData, setAppointmentData] = useState({
    veterinarian: '',
    date: '',
    time: '',
    petName: '',
    petType: '',
    petBreed: '',
    petAge: '',
    service: '',
    notes: '',
    ownerName: '',
    ownerEmail: '',
    ownerPhone: '',
  });

  const [appointmentStep, setAppointmentStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  // Veterinarian data
  const [veterinarians, setVeterinarians] = useState([]);

  // Fetch page content and veterinarians on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [contentData, vetsData] = await Promise.all([
          api.contactPage.get(),
          api.veterinarians.getActive()
        ]);

        setPageContent(contentData);

        const vets = vetsData.results || vetsData;
        setVeterinarians(vets.map(v => ({
          id: v.id,
          name: v.name,
          specialty: v.specialty,
          avatar: v.avatar
        })));
      } catch (error) {
        console.error('Veri yüklenemedi:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Available time slots
  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30', '18:00'
  ];

  // Services
  const services = [
    'Genel Muayene',
    'Aşılama',
    'Kısırlaştırma',
    'Diş Bakımı',
    'Kan Tahlili',
    'Ultrason',
    'Röntgen',
    'Cerrahi Operasyon',
    'Acil Müdahale',
    'Diğer'
  ];

  // Generate calendar days (next 30 days)
  const generateCalendarDays = () => {
    const days = [];
    const today = new Date();
    for (let i = 1; i <= 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const calendarDays = generateCalendarDays();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAppointmentChange = (field, value) => {
    setAppointmentData({
      ...appointmentData,
      [field]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await api.contact.create(formData);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setTimeout(() => setSubmitStatus(null), 3000);
    } catch (error) {
      console.error('Mesaj gönderilemedi:', error);
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus(null), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAppointmentSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const apiData = {
        veterinarian: appointmentData.veterinarian,
        pet_name: appointmentData.petName,
        pet_type: appointmentData.petType,
        pet_breed: appointmentData.petBreed,
        pet_age: appointmentData.petAge,
        owner_name: appointmentData.ownerName,
        owner_email: appointmentData.ownerEmail,
        owner_phone: appointmentData.ownerPhone,
        date: appointmentData.date,
        time: appointmentData.time,
        service: appointmentData.service,
        notes: appointmentData.notes,
      };

      await api.appointments.create(apiData);
      setSubmitStatus('appointment-success');

      setAppointmentData({
        veterinarian: '',
        date: '',
        time: '',
        petName: '',
        petType: '',
        petBreed: '',
        petAge: '',
        service: '',
        notes: '',
        ownerName: '',
        ownerEmail: '',
        ownerPhone: '',
      });
      setAppointmentStep(1);
      setSelectedDate(null);

      setTimeout(() => setSubmitStatus(null), 5000);
    } catch (error) {
      console.error('Randevu oluşturulamadı:', error);
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus(null), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (appointmentStep < 4) setAppointmentStep(appointmentStep + 1);
  };

  const prevStep = () => {
    if (appointmentStep > 1) setAppointmentStep(appointmentStep - 1);
  };

  const formatDate = (date) => {
    const days = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
    const months = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
    return {
      day: days[date.getDay()],
      date: date.getDate(),
      month: months[date.getMonth()],
      full: date.toISOString().split('T')[0]
    };
  };

  if (loading || !pageContent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  const contactInfo = [
    {
      icon: FaPhone,
      title: 'Telefon',
      details: [pageContent.phone_number, pageContent.phone_label],
      link: `tel:${pageContent.phone_number.replace(/[^0-9+]/g, '')}`,
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: FaWhatsapp,
      title: 'WhatsApp',
      details: [pageContent.whatsapp_number, pageContent.whatsapp_label],
      link: `https://wa.me/${pageContent.whatsapp_number.replace(/[^0-9]/g, '')}`,
      color: 'from-green-500 to-green-600',
    },
    {
      icon: FaEnvelope,
      title: 'E-posta',
      details: [pageContent.email_primary, pageContent.email_secondary].filter(Boolean),
      link: `mailto:${pageContent.email_primary}`,
      color: 'from-purple-500 to-purple-600',
    },
    {
      icon: FaMapMarkerAlt,
      title: 'Adres',
      details: [pageContent.address_line1, pageContent.address_line2].filter(Boolean),
      link: pageContent.google_maps_url,
      color: 'from-pink-500 to-pink-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {pageContent.hero_title}
            </h1>
            <p className="text-lg text-gray-600">
              {pageContent.hero_subtitle}
            </p>
          </motion.div>

          {/* Tab Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center mt-10"
          >
            <div className="bg-white rounded-full p-2 shadow-lg inline-flex gap-2">
              <button
                onClick={() => setActiveTab('contact')}
                className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 ${
                  activeTab === 'contact'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                📧 İletişim Formu
              </button>
              <button
                onClick={() => setActiveTab('appointment')}
                className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 ${
                  activeTab === 'appointment'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                📅 Randevu Al
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Contact Us Section */}
      {pageContent.why_contact_us && pageContent.why_contact_us.length > 0 && (
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {pageContent.why_contact_us.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-6 shadow-lg text-center"
                >
                  <div className="text-5xl mb-3">{item.icon}</div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact Info Cards */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactInfo.map((info, index) => (
              <motion.a
                key={index}
                href={info.link}
                target={info.link.startsWith('http') ? '_blank' : '_self'}
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all"
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${info.color} rounded-xl flex items-center justify-center text-white mb-4`}>
                  <info.icon size={24} />
                </div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">{info.title}</h3>
                {info.details.map((detail, idx) => (
                  <p key={idx} className="text-gray-600 text-sm">
                    {detail}
                  </p>
                ))}
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'contact' ? (
          // CONTACT FORM TAB
          <motion.section
            key="contact"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="py-12"
          >
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Contact Form */}
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-3xl shadow-xl p-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Mesaj Gönderin</h2>

                    {submitStatus === 'success' && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 p-4 bg-green-100 border border-green-300 text-green-800 rounded-xl"
                      >
                        ✅ Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.
                      </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Adınız Soyadınız
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                            placeholder="Adınız Soyadınız"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            E-posta
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                            placeholder="ornek@email.com"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Telefon
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                            placeholder="0555 123 45 67"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Konu
                          </label>
                          <select
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                          >
                            <option value="">Konu Seçin</option>
                            <option value="bilgi">Genel Bilgi</option>
                            <option value="fiyat">Fiyat Bilgisi</option>
                            <option value="sikayet">Şikayet & Öneri</option>
                            <option value="diger">Diğer</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Mesajınız
                        </label>
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          required
                          rows="6"
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                          placeholder="Mesajınızı buraya yazın..."
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Gönderiliyor...
                          </>
                        ) : (
                          <>
                            <FaPaperPlane />
                            Mesaj Gönder
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Working Hours Card */}
                  <div className="bg-white rounded-3xl shadow-xl p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center text-white">
                        <FaClock size={24} />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900">Çalışma Saatleri</h3>
                    </div>
                    <div className="space-y-4">
                      {pageContent.working_hours.map((item, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0"
                        >
                          <span className="text-gray-700 font-medium">{item.day}</span>
                          <span className="text-purple-600 font-semibold">{item.hours}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                      <p className="text-sm text-gray-700 text-center">
                        🚨 <strong>Acil durumlar</strong> için 7/24 hizmetinizdeyiz!
                      </p>
                    </div>
                  </div>

                  {/* Map Card with Google Maps */}
                  <div className="bg-white rounded-3xl shadow-xl p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">📍 Konumumuz</h3>
                    <div className="aspect-video bg-gray-200 rounded-xl overflow-hidden shadow-lg">
                      <iframe
                        src={pageContent.google_maps_embed}
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
                      href={pageContent.google_maps_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      <FaMapMarkerAlt />
                      Google Maps'te Aç
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        ) : (
          // APPOINTMENT FORM TAB - keeping existing appointment form
          <motion.section
            key="appointment"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="py-12"
          >
            {/* Appointment form implementation remains the same as before */}
            <div className="container mx-auto px-4">
              <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Randevu Formu</h2>
                <p className="text-gray-600 text-center mb-8">
                  Randevu almak için lütfen{' '}
                  <a href="/randevu" className="text-purple-600 font-semibold hover:underline">
                    randevu sayfasını
                  </a>{' '}
                  ziyaret edin.
                </p>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Emergency Banner */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-r from-red-600 to-pink-600 rounded-3xl p-8 md:p-12 text-white text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{pageContent.emergency_title}</h2>
            <p className="text-lg mb-6 opacity-90">
              {pageContent.emergency_subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={`tel:${pageContent.emergency_phone.replace(/[^0-9+]/g, '')}`}
                className="bg-white text-red-600 px-8 py-4 rounded-xl font-bold hover:shadow-2xl transition-all inline-flex items-center justify-center gap-2"
              >
                <FaPhone />
                Acil Hat: {pageContent.emergency_phone}
              </a>
              <a
                href={`https://wa.me/${pageContent.emergency_whatsapp.replace(/[^0-9]/g, '')}`}
                className="bg-green-500 text-white px-8 py-4 rounded-xl font-bold hover:shadow-2xl transition-all inline-flex items-center justify-center gap-2"
              >
                <FaWhatsapp />
                WhatsApp ile İletişim
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
