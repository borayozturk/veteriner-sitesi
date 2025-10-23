import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FaArrowLeft, FaGraduationCap, FaCertificate, FaAward, FaStar, FaCalendar, FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaHeart, FaStethoscope, FaUserMd, FaQuoteLeft } from 'react-icons/fa';
import { petImages } from '../utils/petImages';
import api from '../services/api';

const VetProfile = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [vet, setVet] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVet();
  }, [slug]);

  const fetchVet = async () => {
    try {
      setLoading(true);
      const vetData = await api.veterinarians.getById(slug);

      // Format API data to match component structure
      // Handle avatar URL - prepend backend URL if it's a relative path
      let avatarUrl = petImages.team[0]; // Default fallback
      if (vetData.avatar) {
        if (vetData.avatar.startsWith('http')) {
          // Full URL provided
          avatarUrl = vetData.avatar;
        } else if (vetData.avatar.startsWith('/media')) {
          // Relative path from backend - prepend backend URL
          avatarUrl = `http://localhost:8000${vetData.avatar}`;
        } else {
          // Assume it's a relative path without leading slash
          avatarUrl = `http://localhost:8000/media/${vetData.avatar}`;
        }
      }

      const formattedVet = {
        id: vetData.id,
        name: vetData.name,
        title: vetData.title || 'Veteriner Hekim',
        specialty: vetData.specialty,
        experience: vetData.experience_years ? `${vetData.experience_years} Yıl` : 'Deneyimli',
        education: vetData.education || '',
        graduationYear: vetData.graduation_year || (vetData.education ? extractYear(vetData.education) : '2020'),
        image: avatarUrl,
        rating: 4.8,
        reviewCount: 0,
        bio: vetData.bio || '',
        certifications: vetData.certifications ? vetData.certifications.split('\n').filter(Boolean) : [],
        expertise: vetData.expertise_areas ? parseExpertiseAreas(vetData.expertise_areas) : [],
        achievements: vetData.achievements ? vetData.achievements.split('\n').filter(Boolean) : [],
        weeklySchedule: {
          'Pazartesi': vetData.monday_hours || '',
          'Salı': vetData.tuesday_hours || '',
          'Çarşamba': vetData.wednesday_hours || '',
          'Perşembe': vetData.thursday_hours || '',
          'Cuma': vetData.friday_hours || '',
          'Cumartesi': vetData.saturday_hours || '',
          'Pazar': vetData.sunday_hours || ''
        },
        phone: vetData.phone || '',
        email: vetData.email || '',
        address: vetData.address || '',
        languages: ['Türkçe'],
        testimonials: [],
      };

      setVet(formattedVet);
      setLoading(false);
    } catch (error) {
      console.error('Veteriner yüklenemedi:', error);
      // Fallback to static data only on error
      const fallbackVet = staticVets.find(v => v.id === id);
      if (fallbackVet) {
        setVet(fallbackVet);
      }
      setLoading(false);
    }
  };

  // Helper function to extract year from education string
  const extractYear = (education) => {
    const match = education.match(/\d{4}/);
    return match ? match[0] : '2020';
  };

  // Helper function to parse expertise areas
  const parseExpertiseAreas = (expertiseString) => {
    if (!expertiseString) return [];

    const lines = expertiseString.split('\n').filter(Boolean);
    return lines.map((line, index) => {
      const parts = line.split(' - ');
      const icons = [FaStethoscope, FaHeart, FaAward];
      return {
        icon: icons[index % icons.length],
        title: parts[0] ? parts[0].trim() : 'Uzmanlık',
        description: parts[1] ? parts[1].trim() : ''
      };
    });
  };

  // Fallback static data for demo purposes
  const staticVets = [
    {
      id: 'ayse-yilmaz',
      name: 'Dr. Ayşe Yılmaz',
      title: 'Baş Veteriner Hekim',
      specialty: 'Cerrahi & İç Hastalıklar',
      experience: '15 Yıl',
      education: 'İstanbul Üniversitesi Veteriner Fakültesi',
      graduationYear: '2009',
      image: petImages.team[0],
      rating: 4.9,
      reviewCount: 347,
      bio: 'Dr. Ayşe Yılmaz, 15 yıllık tecrübesiyle evcil hayvanların cerrahi müdahaleleri ve iç hastalıkları konusunda uzmanlaşmıştır. İstanbul Üniversitesi Veteriner Fakültesi\'nden mezun olduktan sonra, çeşitli klinikte ve üniversite hastanesinde çalışmıştır. Uzmanlık alanında sürekli eğitim alarak kendini geliştirmeye devam etmektedir.',
      certifications: [
        'Sertifikalı Cerrah - ECVS (2012)',
        'İç Hastalıklar Uzmanı - ACVIM (2014)',
        'Laparoskopik Cerrahi Sertifikası (2016)',
        'Acil Tıp Eğitimi (2018)',
      ],
      expertise: [
        { icon: FaStethoscope, title: 'Cerrahi', description: 'Yumuşak doku ve ortopedik cerrahi' },
        { icon: FaHeart, title: 'İç Hastalıklar', description: 'Kardiyoloji, gastroenteroloji' },
        { icon: FaAward, title: 'Acil Tıp', description: '7/24 acil müdahale uzmanlığı' },
      ],
      achievements: [
        'En İyi Veteriner Ödülü 2022',
        '500+ Başarılı Cerrahi Operasyon',
        'Ulusal Konferans Konuşmacısı',
      ],
      weeklySchedule: {
        'Pazartesi': '09:00-18:00',
        'Salı': '09:00-18:00',
        'Çarşamba': '09:00-18:00',
        'Perşembe': '09:00-18:00',
        'Cuma': '09:00-18:00',
        'Cumartesi': '',
        'Pazar': ''
      },
      phone: '+90 555 123 45 67',
      email: 'ayse.yilmaz@petkey.com',
      address: 'Kadıköy, İstanbul, Türkiye',
      languages: ['Türkçe', 'İngilizce'],
      testimonials: [
        {
          name: 'Elif Demir',
          pet: 'Minnoş (Kedi)',
          rating: 5,
          text: 'Dr. Ayşe Hanım sayesinde kedim ameliyattan sonra çok hızlı iyileşti. Çok teşekkür ederiz.',
          date: '2 hafta önce'
        },
        {
          name: 'Ahmet Kaya',
          pet: 'Max (Köpek)',
          rating: 5,
          text: 'Profesyonel ve sevecen yaklaşımı harika. Max\'ı güvenle emanet ediyoruz.',
          date: '1 ay önce'
        },
      ],
    },
    {
      id: 'mehmet-demir',
      name: 'Dr. Mehmet Demir',
      title: 'Veteriner Hekim',
      specialty: 'Deri Hastalıkları',
      experience: '12 Yıl',
      education: 'Ankara Üniversitesi Veteriner Fakültesi',
      graduationYear: '2012',
      image: petImages.team[1],
      rating: 4.8,
      reviewCount: 289,
      bio: 'Dr. Mehmet Demir, dermatoloji alanında uzmanlaşmış bir veteriner hekimdir. Alerjik reaksiyonlar, deri enfeksiyonları ve paraziter hastalıklar konusunda geniş deneyime sahiptir.',
      certifications: [
        'Dermatoloji Uzmanı - ESVD (2015)',
        'Allerji Tedavisi Sertifikası (2017)',
        'Dermatopatologi Eğitimi (2019)',
      ],
      expertise: [
        { icon: FaStethoscope, title: 'Dermatoloji', description: 'Deri hastalıkları teşhis ve tedavi' },
        { icon: FaHeart, title: 'Allerji', description: 'Alerji testleri ve immünoterapi' },
        { icon: FaAward, title: 'Kozmetik', description: 'Deri bakımı ve estetik' },
      ],
      achievements: [
        'Dermatoloji Araştırma Ödülü 2021',
        '1000+ Deri Hastalığı Tedavisi',
        'Uluslararası Yayınlar',
      ],
      weeklySchedule: {
        'Pazartesi': '10:00-19:00',
        'Salı': '',
        'Çarşamba': '10:00-19:00',
        'Perşembe': '',
        'Cuma': '10:00-19:00',
        'Cumartesi': '10:00-16:00',
        'Pazar': ''
      },
      phone: '+90 555 234 56 78',
      email: 'mehmet.demir@petkey.com',
      address: 'Çankaya, Ankara, Türkiye',
      languages: ['Türkçe', 'İngilizce', 'Almanca'],
      testimonials: [
        {
          name: 'Zeynep Ak',
          pet: 'Luna (Kedi)',
          rating: 5,
          text: 'Luna\'nın deri sorununu çok kısa sürede çözdü. Gerçekten uzman!',
          date: '3 hafta önce'
        },
      ],
    },
    {
      id: 'zeynep-kaya',
      name: 'Dr. Zeynep Kaya',
      title: 'Veteriner Hekim',
      specialty: 'Radyoloji & Görüntüleme',
      experience: '10 Yıl',
      education: 'Ege Üniversitesi Veteriner Fakültesi',
      graduationYear: '2014',
      image: petImages.team[2],
      rating: 4.9,
      reviewCount: 256,
      bio: 'Dr. Zeynep Kaya, modern görüntüleme teknikleri konusunda uzman bir veteriner hekimdir. Röntgen, ultrasonografi ve diğer ileri görüntüleme yöntemleriyle teşhis süreçlerini yönetir.',
      certifications: [
        'Radyoloji Sertifikası - ECVDI (2016)',
        'Ultrasonografi Uzmanı (2017)',
        'CT ve MRI Eğitimi (2020)',
      ],
      expertise: [
        { icon: FaStethoscope, title: 'Radyoloji', description: 'Dijital röntgen ve görüntüleme' },
        { icon: FaHeart, title: 'Ultrasonografi', description: 'Abdominal ve kardiyak USG' },
        { icon: FaAward, title: 'İleri Görüntüleme', description: 'CT ve MRI yorumlama' },
      ],
      achievements: [
        'En İyi Radyolog Ödülü 2023',
        '5000+ Görüntüleme Analizi',
        'Eğitim Konferansları',
      ],
      weeklySchedule: {
        'Pazartesi': '',
        'Salı': '08:00-17:00',
        'Çarşamba': '08:00-17:00',
        'Perşembe': '08:00-17:00',
        'Cuma': '08:00-17:00',
        'Cumartesi': '09:00-14:00',
        'Pazar': ''
      },
      phone: '+90 555 345 67 89',
      email: 'zeynep.kaya@petkey.com',
      address: 'Bornova, İzmir, Türkiye',
      languages: ['Türkçe', 'İngilizce'],
      testimonials: [
        {
          name: 'Can Öztürk',
          pet: 'Charlie (Köpek)',
          rating: 5,
          text: 'Teşhis sürecinde çok yardımcı oldu. Detaylı açıklamaları çok faydalıydı.',
          date: '1 hafta önce'
        },
      ],
    },
    {
      id: 'can-ozturk',
      name: 'Dr. Can Öztürk',
      title: 'Veteriner Hekim',
      specialty: 'Ortopedi & Travmatoloji',
      experience: '8 Yıl',
      education: 'Ankara Üniversitesi Veteriner Fakültesi',
      graduationYear: '2016',
      image: petImages.team[3],
      rating: 4.7,
      reviewCount: 198,
      bio: 'Dr. Can Öztürk, ortopedik cerrahi ve travma vakalarında uzmanlaşmıştır. Kırık tedavileri, eklem hastalıkları ve hareket sistemi rahatsızlıklarında geniş deneyime sahiptir.',
      certifications: [
        'Ortopedi Uzmanı - ECVS (2018)',
        'Kırık Tedavisi Sertifikası (2019)',
        'Artoskopi Eğitimi (2021)',
      ],
      expertise: [
        { icon: FaStethoscope, title: 'Ortopedi', description: 'Kemik ve eklem cerrahisi' },
        { icon: FaHeart, title: 'Travmatoloji', description: 'Acil travma müdahaleleri' },
        { icon: FaAward, title: 'Rehabilitasyon', description: 'Fizik tedavi programları' },
      ],
      achievements: [
        'Genç Cerrah Ödülü 2022',
        '300+ Ortopedik Operasyon',
        'Yenilikçi Tedavi Teknikleri',
      ],
      weeklySchedule: {
        'Pazartesi': '10:00-19:00',
        'Salı': '10:00-19:00',
        'Çarşamba': '10:00-19:00',
        'Perşembe': '10:00-19:00',
        'Cuma': '',
        'Cumartesi': '',
        'Pazar': ''
      },
      phone: '+90 555 456 78 90',
      email: 'can.ozturk@petkey.com',
      address: 'Yenimahalle, Ankara, Türkiye',
      languages: ['Türkçe', 'İngilizce'],
      testimonials: [
        {
          name: 'Ayşe Yıldız',
          pet: 'Rocky (Köpek)',
          rating: 5,
          text: 'Rocky\'nin bacak ameliyatı çok başarılı geçti. Şimdi koşup oynuyor!',
          date: '2 ay önce'
        },
      ],
    },
  ];

  // Use API data - no automatic fallback
  const displayVet = vet;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!displayVet) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Veteriner bulunamadı</h2>
          <button onClick={() => navigate('/hakkimizda')} className="btn-primary">
            Geri Dön
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-10 left-10 w-72 h-72 bg-purple-200 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-pink-200 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate('/veterinerler')}
            className="mb-8 flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
          >
            <FaArrowLeft />
            <span>Ekibe Geri Dön</span>
          </motion.button>

          <div className="grid lg:grid-cols-12 gap-8 items-center">
            {/* Left - Image */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-5"
            >
              <div className="relative">
                {/* Glow Effect */}
                <div className="absolute -inset-4 bg-gradient-to-r from-purple-300 to-pink-300 rounded-3xl blur-2xl opacity-20" />

                {/* Image Card */}
                <div className="relative bg-white border-2 border-gray-200 rounded-3xl overflow-hidden shadow-2xl">
                  <img
                    src={displayVet.image}
                    alt={displayVet.name}
                    className="w-full aspect-square object-cover"
                  />

                  {/* Experience Badge */}
                  <div className="absolute top-6 right-6 bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2 rounded-full text-white font-bold shadow-lg">
                    {displayVet.experience} Tecrübe
                  </div>

                  {/* Rating Badge */}
                  <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
                    <FaStar className="text-yellow-400" />
                    <span className="font-bold text-gray-900">{displayVet.rating}</span>
                    <span className="text-gray-600 text-sm">({displayVet.reviewCount} değerlendirme)</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right - Info */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-7"
            >
              <div className="bg-white border-2 border-gray-200 rounded-3xl p-8 shadow-xl">
                <h1 className="text-5xl font-black text-gray-900 mb-2">{displayVet.name}</h1>
                <p className="text-2xl text-purple-600 font-semibold mb-4">{displayVet.title}</p>
                <p className="text-xl text-gray-700 mb-6">{displayVet.specialty}</p>

                {/* Quick Info */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4">
                    <FaGraduationCap className="text-2xl text-purple-600 mb-2" />
                    <p className="text-sm text-gray-600">Mezuniyet</p>
                    <p className="text-gray-900 font-semibold">{displayVet.graduationYear}</p>
                  </div>
                  <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl p-4">
                    <FaClock className="text-2xl text-orange-600 mb-2" />
                    <p className="text-sm text-gray-600">Çalışma Günleri</p>
                    <p className="text-gray-900 font-semibold">Hafta İçi & Hafta Sonu</p>
                  </div>
                </div>

                {/* Languages */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {displayVet.languages.map((lang, i) => (
                    <span key={i} className="px-3 py-1 bg-gray-100 border border-gray-200 rounded-full text-gray-700 text-sm font-medium">
                      {lang}
                    </span>
                  ))}
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-wrap gap-4">
                  <motion.a
                    href="/iletisim"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
                  >
                    <FaCalendar />
                    Randevu Al
                  </motion.a>
                  <motion.a
                    href={`tel:${displayVet.phone}`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all"
                  >
                    <FaPhone />
                    Ara
                  </motion.a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-12 gap-8">
            {/* Left Column - Main Info */}
            <div className="lg:col-span-8 space-y-8">
              {/* Biography */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-3xl p-8 shadow-xl"
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                  <FaUserMd className="text-purple-600" />
                  Hakkında
                </h2>
                <p className="text-gray-700 leading-relaxed text-lg">{displayVet.bio}</p>
              </motion.div>

              {/* Education */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-3xl p-8 shadow-xl"
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <FaGraduationCap className="text-purple-600" />
                  Eğitim
                </h2>
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6">
                  <p className="text-xl font-bold text-gray-900">{displayVet.education}</p>
                  <p className="text-purple-600 font-semibold">Mezuniyet: {displayVet.graduationYear}</p>
                </div>
              </motion.div>

              {/* Certifications */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-3xl p-8 shadow-xl"
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <FaCertificate className="text-purple-600" />
                  Sertifikalar & Uzmanlıklar
                </h2>
                <div className="grid gap-4">
                  {displayVet.certifications.map((cert, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center gap-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4"
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center text-white flex-shrink-0">
                        ✓
                      </div>
                      <p className="text-gray-800 font-semibold">{cert}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Expertise */}
              {displayVet.expertise && displayVet.expertise.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-3xl p-8 shadow-xl"
                >
                  <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <FaStethoscope className="text-purple-600" />
                    Uzmanlık Alanları
                  </h2>
                  <div className="grid md:grid-cols-3 gap-6">
                    {displayVet.expertise.map((exp, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        whileHover={{ y: -5 }}
                        className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 text-center"
                      >
                        <exp.icon className="text-4xl text-purple-600 mx-auto mb-3" />
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{exp.title}</h3>
                        <p className="text-gray-600 text-sm">{exp.description}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Achievements */}
              {displayVet.achievements && displayVet.achievements.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl p-8 shadow-xl text-white"
                >
                  <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                    <FaAward />
                    Başarılar & Ödüller
                  </h2>
                  <div className="grid gap-4">
                    {displayVet.achievements.map((achievement, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-xl p-4"
                      >
                        <FaStar className="text-2xl text-yellow-300 flex-shrink-0" />
                        <p className="font-semibold">{achievement}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Testimonials */}
              {displayVet.testimonials && displayVet.testimonials.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-3xl p-8 shadow-xl"
                >
                  <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <FaQuoteLeft className="text-purple-600" />
                    Hasta Yorumları
                  </h2>
                  <div className="space-y-6">
                    {displayVet.testimonials.map((testimonial, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6"
                      >
                        <div className="flex gap-2 mb-3">
                          {[...Array(testimonial.rating)].map((_, j) => (
                            <FaStar key={j} className="text-yellow-400" />
                          ))}
                        </div>
                        <p className="text-gray-700 italic mb-4">"{testimonial.text}"</p>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-bold text-gray-900">{testimonial.name}</p>
                            <p className="text-sm text-purple-600">{testimonial.pet}</p>
                          </div>
                          <p className="text-sm text-gray-500">{testimonial.date}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Right Column - Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              {/* Working Days */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-3xl p-6 shadow-xl sticky top-24"
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FaClock className="text-purple-600" />
                  Çalışma Programı
                </h3>
                <div className="space-y-3 mb-6">
                  {['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'].map((day) => {
                    const dayHours = displayVet.weeklySchedule ? displayVet.weeklySchedule[day] : '';
                    const isWorking = dayHours && dayHours.trim() !== '';

                    return (
                      <div
                        key={day}
                        className={`flex justify-between items-center p-3 rounded-xl ${
                          isWorking
                            ? 'bg-gradient-to-r from-emerald-50 to-teal-50 text-gray-900'
                            : 'bg-gray-50 text-gray-400'
                        }`}
                      >
                        <span className="font-semibold">{day}</span>
                        <span className="text-sm">
                          {isWorking ? dayHours : 'Kapalı'}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Contact Info */}
                <div className="space-y-3 pt-6 border-t border-gray-200">
                  {displayVet.phone && (
                    <a
                      href={`tel:${displayVet.phone}`}
                      className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl hover:from-purple-100 hover:to-pink-100 transition-colors"
                    >
                      <FaPhone className="text-purple-600" />
                      <div>
                        <p className="text-xs text-gray-600">Telefon</p>
                        <p className="font-semibold text-gray-900">{displayVet.phone}</p>
                      </div>
                    </a>
                  )}

                  {displayVet.email && (
                    <a
                      href={`mailto:${displayVet.email}`}
                      className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl hover:from-purple-100 hover:to-pink-100 transition-colors"
                    >
                      <FaEnvelope className="text-purple-600" />
                      <div>
                        <p className="text-xs text-gray-600">E-posta</p>
                        <p className="font-semibold text-gray-900">{displayVet.email}</p>
                      </div>
                    </a>
                  )}

                  {displayVet.address && (
                    <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                      <FaMapMarkerAlt className="text-purple-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-600">Adres</p>
                        <p className="font-semibold text-gray-900">{displayVet.address}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Appointment Button */}
                <motion.a
                  href="/iletisim"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-6 w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all"
                >
                  <FaCalendar />
                  Randevu Talebi Oluştur
                </motion.a>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default VetProfile;
