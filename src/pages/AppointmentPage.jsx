import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPhone, FaWhatsapp, FaCalendarAlt, FaCheckCircle, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import api from '../services/api';
import SEO from '../components/common/SEO';
import { useSEO } from '../contexts/SEOContext';

const AppointmentPage = () => {
  const { getSEOForPage } = useSEO();
  const appointmentSEO = getSEOForPage('appointment') || {
    title: 'Randevu Al - Veteriner Kliniği',
    description: 'Online randevu oluşturun',
    keywords: 'veteriner randevu',
    ogImage: '/og-appointment.jpg',
    canonical: 'https://example.com/randevu'
  };

  // Appointment form state
  const [appointmentData, setAppointmentData] = useState({
    // Step 1: Veteriner Selection
    veterinarian: '',
    // Step 2: Date & Time
    date: '',
    time: '',
    // Step 3: Pet Information
    petName: '',
    petType: '',
    petBreed: '',
    petAge: '',
    // Step 4: Service & Notes
    service: '',
    notes: '',
    // Owner Information
    ownerName: '',
    ownerEmail: '',
    ownerPhone: '',
  });

  const [appointmentStep, setAppointmentStep] = useState(1); // 1-4 steps
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  // Veterinarian data (loaded from API)
  const [veterinarians, setVeterinarians] = useState([]);

  // Fetch veterinarians on mount
  useEffect(() => {
    const fetchVeterinarians = async () => {
      try {
        const data = await api.veterinarians.getActive();
        const vets = data.results || data;
        setVeterinarians(vets.map(v => ({
          id: v.id,
          name: v.name,
          specialty: v.specialty,
          avatar: v.avatar // Keep the avatar as is (can be URL or emoji)
        })));
      } catch (error) {
        console.error('Veterinerler yüklenemedi:', error);
      }
    };
    fetchVeterinarians();
  }, []);

  // Available time slots - 24 hours
  const timeSlots = [
    '00:00', '00:30', '01:00', '01:30', '02:00', '02:30',
    '03:00', '03:30', '04:00', '04:30', '05:00', '05:30',
    '06:00', '06:30', '07:00', '07:30', '08:00', '08:30',
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
    '18:00', '18:30', '19:00', '19:30', '20:00', '20:30',
    '21:00', '21:30', '22:00', '22:30', '23:00', '23:30'
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

  // Generate calendar days for current month
  const generateCalendarDays = () => {
    const days = [];
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    // Get first day of month
    const firstDay = new Date(year, month, 1);
    // Get last day of month
    const lastDay = new Date(year, month + 1, 0);

    // Add empty slots for days before month starts
    const startDayOfWeek = firstDay.getDay();
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days of the month
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, month, day);
      // Only allow dates from today onwards
      if (date >= today) {
        days.push(date);
      } else {
        days.push(null);
      }
    }

    return days;
  };

  const calendarDays = generateCalendarDays();

  const prevMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() - 1);
    // Don't allow going before current month
    const today = new Date();
    if (newMonth.getMonth() >= today.getMonth() || newMonth.getFullYear() > today.getFullYear()) {
      setCurrentMonth(newMonth);
    }
  };

  const nextMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + 1);
    setCurrentMonth(newMonth);
  };

  const handleAppointmentChange = (field, value) => {
    setAppointmentData({
      ...appointmentData,
      [field]: value,
    });
  };

  const handleAppointmentSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Transform data for API
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
      setSubmitStatus('success');

      // Reset appointment form
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

      // Reset status after 5 seconds
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

  // Structured data for Appointment page
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    "name": "PetKey Veteriner Randevu Sistemi",
    "description": "Online veteriner randevu sistemi ile hızlı ve kolay randevu alın.",
    "url": "https://petkey.com/randevu",
    "potentialAction": {
      "@type": "ReserveAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://petkey.com/randevu",
        "actionPlatform": [
          "http://schema.org/DesktopWebPlatform",
          "http://schema.org/MobileWebPlatform"
        ]
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <SEO
        title={appointmentSEO.title || "Randevu Al"}
        description={appointmentSEO.description || "PetKey Veteriner Kliniği online randevu sistemi. Hızlı ve kolay şekilde veteriner randevusu alın. 7/24 acil veteriner hizmeti."}
        keywords={appointmentSEO.keywords || "veteriner randevu, online randevu, veteriner randevu al, acil veteriner, kedi veterineri randevu, köpek veterineri randevu"}
        image={appointmentSEO.ogImage || "/og-appointment.jpg"}
        canonical={appointmentSEO.canonical}
        structuredData={structuredData}
      />

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
            <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaCalendarAlt className="text-white text-3xl" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Randevu Alın
            </h1>
            <p className="text-lg text-gray-600">
              Sevimli dostlarınız için hemen online randevu oluşturun. 4 basit adımda randevunuzu tamamlayın!
            </p>
          </motion.div>
        </div>
      </section>

      {/* Appointment Form Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="py-12"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            {/* Success Message */}
            {submitStatus === 'success' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-8 bg-white rounded-3xl shadow-xl p-8 border-2 border-green-500"
              >
                <div className="text-center">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaCheckCircle className="text-green-500 text-4xl" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Randevunuz Oluşturuldu!</h3>
                  <p className="text-gray-600 mb-4">
                    Randevu talebiniz başarıyla alındı. En kısa sürede sizinle iletişime geçeceğiz.
                  </p>
                  <div className="bg-purple-50 rounded-xl p-4">
                    <p className="text-sm text-gray-700">
                      📧 Email ve SMS ile onay bildirimi gönderilecektir.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {submitStatus === 'error' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-100 border border-red-300 text-red-800 rounded-xl text-center"
              >
                ❌ Randevu oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.
              </motion.div>
            )}

            {/* Appointment Form Card */}
            <div className="bg-white rounded-3xl shadow-xl p-8">
              {/* Progress Steps */}
              <div className="mb-8">
                <div className="flex items-center justify-between">
                  {[1, 2, 3, 4].map((step) => (
                    <div key={step} className="flex items-center flex-1">
                      <div className="flex flex-col items-center flex-1">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                            step <= appointmentStep
                              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                              : 'bg-gray-200 text-gray-500'
                          }`}
                        >
                          {step}
                        </div>
                        <span className={`text-xs mt-2 font-medium ${step <= appointmentStep ? 'text-purple-600' : 'text-gray-500'}`}>
                          {step === 1 && 'Veteriner'}
                          {step === 2 && 'Tarih & Saat'}
                          {step === 3 && 'Pet Bilgisi'}
                          {step === 4 && 'Bilgileriniz'}
                        </span>
                      </div>
                      {step < 4 && (
                        <div
                          className={`h-1 flex-1 transition-all ${
                            step < appointmentStep
                              ? 'bg-gradient-to-r from-purple-600 to-pink-600'
                              : 'bg-gray-200'
                          }`}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <form onSubmit={handleAppointmentSubmit}>
                <AnimatePresence mode="wait">
                  {/* STEP 1: Veterinarian Selection */}
                  {appointmentStep === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h2 className="text-2xl font-bold text-gray-900 mb-6">Veteriner Hekim Seçin</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {veterinarians.map((vet) => (
                          <motion.button
                            key={vet.id}
                            type="button"
                            onClick={() => handleAppointmentChange('veterinarian', vet.id)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`p-6 rounded-2xl border-2 transition-all text-left ${
                              appointmentData.veterinarian === vet.id
                                ? 'border-purple-600 bg-purple-50'
                                : 'border-gray-200 hover:border-purple-300'
                            }`}
                          >
                            <div className="flex items-center gap-4">
                              {vet.avatar && typeof vet.avatar === 'string' && vet.avatar.startsWith('http') ? (
                                <img
                                  src={vet.avatar}
                                  alt={vet.name}
                                  className="w-16 h-16 rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center text-3xl">
                                  {vet.avatar || '👨‍⚕️'}
                                </div>
                              )}
                              <div className="flex-1">
                                <h3 className="font-bold text-lg text-gray-900">{vet.name}</h3>
                                <p className="text-sm text-gray-600">{vet.specialty}</p>
                              </div>
                              {appointmentData.veterinarian === vet.id && (
                                <FaCheckCircle className="text-purple-600 text-2xl" />
                              )}
                            </div>
                          </motion.button>
                        ))}
                      </div>
                      <div className="mt-8 flex justify-end">
                        <button
                          type="button"
                          onClick={nextStep}
                          disabled={!appointmentData.veterinarian}
                          className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          Devam Et
                          <FaChevronRight />
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 2: Date & Time Selection */}
                  {appointmentStep === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h2 className="text-2xl font-bold text-gray-900 mb-6">Tarih ve Saat Seçin</h2>

                      {/* Calendar */}
                      <div className="mb-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-semibold text-gray-900">Tarih Seçin</h3>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={prevMonth}
                              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                              <FaChevronLeft className="text-gray-600" />
                            </button>
                            <span className="font-bold text-gray-900 min-w-[140px] text-center">
                              {currentMonth.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })}
                            </span>
                            <button
                              type="button"
                              onClick={nextMonth}
                              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                              <FaChevronRight className="text-gray-600" />
                            </button>
                          </div>
                        </div>

                        {/* Calendar header - days of week */}
                        <div className="grid grid-cols-7 gap-2 mb-2">
                          {['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'].map((day) => (
                            <div key={day} className="text-center text-xs font-bold text-gray-600 py-2">
                              {day}
                            </div>
                          ))}
                        </div>

                        {/* Calendar days */}
                        <div className="grid grid-cols-7 gap-2">
                          {calendarDays.map((date, index) => {
                            if (!date) {
                              return <div key={index} className="p-3" />;
                            }
                            const formatted = formatDate(date);
                            const isSelected = appointmentData.date === formatted.full;
                            return (
                              <motion.button
                                key={index}
                                type="button"
                                onClick={() => {
                                  handleAppointmentChange('date', formatted.full);
                                  setSelectedDate(date);
                                }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`p-3 rounded-xl border-2 transition-all ${
                                  isSelected
                                    ? 'border-purple-600 bg-purple-50'
                                    : 'border-gray-200 hover:border-purple-300'
                                }`}
                              >
                                <div className="text-xs text-gray-600 font-medium">{formatted.day}</div>
                                <div className="text-lg font-bold text-gray-900">{formatted.date}</div>
                                <div className="text-xs text-gray-500">{formatted.month}</div>
                              </motion.button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Time Slots */}
                      {appointmentData.date && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <h3 className="font-semibold text-gray-900 mb-4">Saat Seçin</h3>
                          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 max-h-96 overflow-y-auto p-2">
                            {timeSlots.map((time) => (
                              <motion.button
                                key={time}
                                type="button"
                                onClick={() => handleAppointmentChange('time', time)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`px-3 py-2 rounded-xl border-2 font-semibold text-sm transition-all ${
                                  appointmentData.time === time
                                    ? 'border-purple-600 bg-purple-50 text-purple-600'
                                    : 'border-gray-200 hover:border-purple-300 text-gray-700'
                                }`}
                              >
                                {time}
                              </motion.button>
                            ))}
                          </div>
                        </motion.div>
                      )}

                      <div className="mt-8 flex justify-between">
                        <button
                          type="button"
                          onClick={prevStep}
                          className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all flex items-center gap-2"
                        >
                          <FaChevronLeft />
                          Geri
                        </button>
                        <button
                          type="button"
                          onClick={nextStep}
                          disabled={!appointmentData.date || !appointmentData.time}
                          className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          Devam Et
                          <FaChevronRight />
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 3: Pet Information */}
                  {appointmentStep === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h2 className="text-2xl font-bold text-gray-900 mb-6">Evcil Hayvan Bilgileri</h2>
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Evcil Hayvan Adı *
                            </label>
                            <input
                              type="text"
                              value={appointmentData.petName}
                              onChange={(e) => handleAppointmentChange('petName', e.target.value)}
                              required
                              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                              placeholder="Örn: Minnoş"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Hayvan Türü *
                            </label>
                            <select
                              value={appointmentData.petType}
                              onChange={(e) => handleAppointmentChange('petType', e.target.value)}
                              required
                              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                            >
                              <option value="">Seçiniz</option>
                              <option value="kedi">Kedi</option>
                              <option value="kopek">Köpek</option>
                              <option value="kus">Kuş</option>
                              <option value="tavsan">Tavşan</option>
                              <option value="diger">Diğer</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Irk
                            </label>
                            <input
                              type="text"
                              value={appointmentData.petBreed}
                              onChange={(e) => handleAppointmentChange('petBreed', e.target.value)}
                              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                              placeholder="Örn: Tekir, Golden Retriever"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Yaş *
                            </label>
                            <input
                              type="text"
                              value={appointmentData.petAge}
                              onChange={(e) => handleAppointmentChange('petAge', e.target.value)}
                              required
                              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                              placeholder="Örn: 3 yaş, 6 aylık"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Randevu Sebebi *
                          </label>
                          <select
                            value={appointmentData.service}
                            onChange={(e) => handleAppointmentChange('service', e.target.value)}
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                          >
                            <option value="">Seçiniz</option>
                            {services.map((service) => (
                              <option key={service} value={service}>
                                {service}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Ek Notlar
                          </label>
                          <textarea
                            value={appointmentData.notes}
                            onChange={(e) => handleAppointmentChange('notes', e.target.value)}
                            rows="4"
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                            placeholder="Belirtmek istediğiniz özel durumlar veya semptomlar..."
                          />
                        </div>
                      </div>

                      <div className="mt-8 flex justify-between">
                        <button
                          type="button"
                          onClick={prevStep}
                          className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all flex items-center gap-2"
                        >
                          <FaChevronLeft />
                          Geri
                        </button>
                        <button
                          type="button"
                          onClick={nextStep}
                          disabled={!appointmentData.petName || !appointmentData.petType || !appointmentData.petAge || !appointmentData.service}
                          className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          Devam Et
                          <FaChevronRight />
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 4: Owner Information */}
                  {appointmentStep === 4 && (
                    <motion.div
                      key="step4"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h2 className="text-2xl font-bold text-gray-900 mb-6">İletişim Bilgileriniz</h2>
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Adınız Soyadınız *
                          </label>
                          <input
                            type="text"
                            value={appointmentData.ownerName}
                            onChange={(e) => handleAppointmentChange('ownerName', e.target.value)}
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                            placeholder="Adınız Soyadınız"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              E-posta *
                            </label>
                            <input
                              type="email"
                              value={appointmentData.ownerEmail}
                              onChange={(e) => handleAppointmentChange('ownerEmail', e.target.value)}
                              required
                              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                              placeholder="ornek@email.com"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Telefon *
                            </label>
                            <input
                              type="tel"
                              value={appointmentData.ownerPhone}
                              onChange={(e) => handleAppointmentChange('ownerPhone', e.target.value)}
                              required
                              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                              placeholder="0555 123 45 67"
                            />
                          </div>
                        </div>

                        {/* Summary */}
                        <div className="bg-purple-50 rounded-2xl p-6 border border-purple-200">
                          <h3 className="font-bold text-lg text-gray-900 mb-4">📋 Randevu Özeti</h3>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Veteriner:</span>
                              <span className="font-semibold text-gray-900">
                                {veterinarians.find(v => v.id === appointmentData.veterinarian)?.name}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Tarih:</span>
                              <span className="font-semibold text-gray-900">{appointmentData.date}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Saat:</span>
                              <span className="font-semibold text-gray-900">{appointmentData.time}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Evcil Hayvan:</span>
                              <span className="font-semibold text-gray-900">{appointmentData.petName}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Randevu Sebebi:</span>
                              <span className="font-semibold text-gray-900">{appointmentData.service}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-8 flex justify-between">
                        <button
                          type="button"
                          onClick={prevStep}
                          className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all flex items-center gap-2"
                        >
                          <FaChevronLeft />
                          Geri
                        </button>
                        <button
                          type="submit"
                          disabled={isSubmitting || !appointmentData.ownerName || !appointmentData.ownerEmail || !appointmentData.ownerPhone}
                          className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          {isSubmitting ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              Oluşturuluyor...
                            </>
                          ) : (
                            <>
                              <FaCheckCircle />
                              Randevu Oluştur
                            </>
                          )}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default AppointmentPage;
