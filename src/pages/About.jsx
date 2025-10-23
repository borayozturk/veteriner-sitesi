import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaAward, FaHeart, FaUserMd, FaPaw, FaStar, FaShieldAlt } from 'react-icons/fa';
import { petImages } from '../utils/petImages';
import api from '../services/api';
import SEO from '../components/common/SEO';
import { useSEO } from '../contexts/SEOContext';

const About = () => {
  const { getSEOForPage, loading: seoLoading } = useSEO();
  const seoSettings = getSEOForPage('about');
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aboutData, setAboutData] = useState({
    hero_subtitle: 'Evcil dostlarınızın sağlığı ve mutluluğu için 10+ yıldır hizmetinizdeyiz',
    stats: [
      { number: '10+', label: 'Yıllık Tecrübe' },
      { number: '25K+', label: 'Mutlu Hasta' },
      { number: '15+', label: 'Uzman Veteriner' },
      { number: '%99', label: 'Memnuniyet Oranı' }
    ],
    story_title: 'Hikayemiz',
    story_paragraph_1: 'PetKey Veteriner Kliniği, 2014 yılında evcil hayvan sevgisi ve veterinerlik tutkusuyla kuruldu. Küçük bir klinikten başlayan yolculuğumuz, bugün binlerce mutlu evcil hayvan ve sahiplerinin güvendiği bir merkez haline geldi.',
    story_paragraph_2: 'Modern teknoloji, deneyimli kadro ve sınırsız sevgi ile her gün daha fazla canına dokunuyoruz. Misyonumuz basit: Her evcil hayvana en iyi sağlık hizmetini sunmak ve onların mutlu, sağlıklı bir yaşam sürmelerini sağlamak.'
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch both team and about page data
      const [vetsData, aboutPageData] = await Promise.all([
        api.veterinarians.getActive(),
        api.aboutPage.get()
      ]);

      // Process vets data
      const vetList = Array.isArray(vetsData) ? vetsData : (vetsData.results || []);
      const formattedTeam = vetList.map(vet => ({
        id: vet.id,
        name: vet.name,
        title: vet.title || 'Veteriner Hekim',
        specialty: vet.specialty,
        experience: vet.experience_years ? `${vet.experience_years} Yıl` : '',
        image: vet.avatar
      }));

      setTeam(formattedTeam);

      // Set about page data if available
      if (aboutPageData) {
        setAboutData(aboutPageData);
      }

      setLoading(false);
    } catch (error) {
      console.error('Veri yüklenemedi:', error);
      setTeam([]);
      setLoading(false);
    }
  };

  // Icons for stats
  const statIcons = [FaAward, FaPaw, FaUserMd, FaStar];
  const stats = aboutData.stats.map((stat, index) => ({
    ...stat,
    icon: statIcons[index % statIcons.length]
  }));

  // Icon mapping
  const iconMap = {
    'FaHeart': FaHeart,
    'FaAward': FaAward,
    'FaUserMd': FaUserMd,
    'FaPaw': FaPaw,
    'FaStar': FaStar,
    'FaShieldAlt': FaShieldAlt
  };

  // Map values from API data with icons
  const values = (aboutData.values || []).map(value => ({
    ...value,
    icon: iconMap[value.icon] || FaHeart // Fallback to FaHeart if icon not found
  }));

  // Structured data for About page
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "Hakkımızda - PetKey Veteriner",
    "description": aboutData.hero_subtitle,
    "url": "https://petkey.com/hakkimizda",
    "mainEntity": {
      "@type": "VeterinaryCare",
      "name": "PetKey Veteriner Kliniği",
      "foundingDate": "2014",
      "numberOfEmployees": team.length,
      "slogan": "Evcil dostlarınızın sağlığı ve mutluluğu için"
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

      {/* Hero Section - Clean & Simple */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl md:text-7xl font-black mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent"
            >
              Hakkımızda
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-2xl text-gray-700 mb-8 leading-relaxed"
            >
              {aboutData.hero_subtitle}
            </motion.p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="bg-white rounded-2xl p-6 shadow-lg"
                >
                  <stat.icon className="w-8 h-8 mx-auto mb-3 text-purple-600" />
                  <div className="text-3xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-1">
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-600 font-semibold">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <h2 className="text-4xl md:text-5xl font-black mb-12 text-gray-900 text-center">
                {aboutData.story_title}
              </h2>

              <div className="grid md:grid-cols-2 gap-12 items-center">
                {/* Story Text */}
                <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
                  <p>{aboutData.story_paragraph_1}</p>
                  <p>{aboutData.story_paragraph_2}</p>
                </div>

                {/* Pet Photos Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    whileHover={{ scale: 1.05, rotate: -2 }}
                    className="rounded-3xl overflow-hidden shadow-xl"
                  >
                    <img
                      src={petImages.dogs[0]}
                      alt="Mutlu köpek"
                      className="w-full h-48 object-cover"
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    whileHover={{ scale: 1.05, rotate: 2 }}
                    className="rounded-3xl overflow-hidden shadow-xl mt-8"
                  >
                    <img
                      src={petImages.cats[0]}
                      alt="Sevimli kedi"
                      className="w-full h-48 object-cover"
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    whileHover={{ scale: 1.05, rotate: 2 }}
                    className="rounded-3xl overflow-hidden shadow-xl -mt-4"
                  >
                    <img
                      src={petImages.puppies[0]}
                      alt="Yavru köpek"
                      className="w-full h-48 object-cover"
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    whileHover={{ scale: 1.05, rotate: -2 }}
                    className="rounded-3xl overflow-hidden shadow-xl"
                  >
                    <img
                      src={petImages.kittens[0]}
                      alt="Yavru kedi"
                      className="w-full h-48 object-cover"
                    />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-4 text-gray-900">
              Değerlerimiz
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {values.map((value, index) => {
              const gradients = [
                { bg: 'from-purple-500 to-pink-500', light: 'from-purple-100 to-pink-100', iconColor: 'text-purple-600' },
                { bg: 'from-orange-500 to-amber-500', light: 'from-orange-100 to-amber-100', iconColor: 'text-orange-600' },
                { bg: 'from-blue-500 to-cyan-500', light: 'from-blue-100 to-cyan-100', iconColor: 'text-blue-600' },
                { bg: 'from-green-500 to-emerald-500', light: 'from-green-100 to-emerald-100', iconColor: 'text-green-600' }
              ];
              const gradient = gradients[index % 4];

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.03 }}
                  className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden"
                >
                  {/* Gradient background that appears on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${gradient.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                  {/* Content */}
                  <div className="relative z-10">
                    <motion.div
                      whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                      className={`w-16 h-16 bg-gradient-to-br ${gradient.light} group-hover:bg-white/20 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300`}
                    >
                      <value.icon className={`${gradient.iconColor} group-hover:text-white text-3xl transition-colors duration-300`} />
                    </motion.div>
                    <h3 className="text-2xl font-bold mb-3 text-gray-900 group-hover:text-white transition-colors duration-300">
                      {value.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed group-hover:text-white/90 transition-colors duration-300">
                      {value.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-4 text-gray-900">
              Uzman Kadromuz
            </h2>
            <p className="text-xl text-gray-600">
              Alanında deneyimli, evcil hayvan sever veteriner hekimlerimiz
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {loading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-3xl overflow-hidden shadow-xl animate-pulse">
                  <div className="aspect-square bg-gray-200"></div>
                  <div className="p-6">
                    <div className="h-6 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              ))
            ) : (
              team.map((member, index) => (
                <motion.div
                  key={member.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group cursor-pointer"
                  onClick={() => navigate(`/veteriner/${member.id}`)}
                >
                  <div className="bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300">
                    <div className="relative aspect-square overflow-hidden">
                      <img
                        src={member.image || petImages.team[index]}
                        alt={member.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      {member.experience && (
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-purple-600">
                          {member.experience}
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                      <p className="text-purple-600 font-semibold text-sm mb-1">{member.title}</p>
                      <p className="text-gray-600 text-sm">{member.specialty}</p>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              Evcil Dostunuz İçin Hemen İletişime Geçin
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Uzman veteriner hekimlerimizle 7/24 hizmetinizdeyiz
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href="/iletisim"
                className="px-8 py-4 bg-white text-purple-600 rounded-2xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all"
              >
                İletişim Formu
              </a>
              <a
                href="tel:+902121234567"
                className="px-8 py-4 bg-white/20 backdrop-blur-md border-2 border-white/30 text-white rounded-2xl font-bold text-lg hover:bg-white/30 transition-all"
              >
                Hemen Ara
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;
