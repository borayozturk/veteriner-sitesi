import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaGraduationCap, FaAward, FaArrowRight, FaUserMd } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import api from '../services/api';
import { petImages } from '../utils/petImages';

const Veterinarians = () => {
  const [veterinarians, setVeterinarians] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVets = async () => {
      try {
        setLoading(true);
        const vetsData = await api.veterinarians.getAll();
        const veterinarians = vetsData.results || vetsData;
        if (Array.isArray(veterinarians)) {
          setVeterinarians(veterinarians);
        } else {
          console.error('API did not return an array for veterinarians:', vetsData);
          setVeterinarians([]);
        }
      } catch (error) {
        console.error('Veterinerler yüklenemedi:', error);
        setVeterinarians([]);
      } finally {
        setLoading(false);
      }
    };
    fetchVets();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Minimal */}
      <section className="relative bg-gradient-to-b from-gray-50 to-white py-20 md:py-32">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full mb-6">
              <FaUserMd className="text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Uzman Kadromuz</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Deneyimli Veteriner
              <br />
              <span className="text-gray-600">Hekimlerimiz</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
              Evcil dostlarınızın sağlığı için alanında uzman, deneyimli ve sevgi dolu veteriner hekimlerimizle tanışın.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Veterinarians Grid - Minimal & Elegant */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container-custom">
          {veterinarians.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaUserMd className="text-3xl text-gray-400" />
              </div>
              <p className="text-xl text-gray-600">Henüz veteriner hekim eklenmemiş.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {veterinarians.map((vet, index) => (
                <motion.div
                  key={vet.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link to={`/veteriner/${vet.slug}`} className="group block">
                    <div className="relative overflow-hidden rounded-2xl bg-white border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-xl">
                      {/* Image Container */}
                      <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
                        <img
                          src={vet.avatar || petImages.team[index % petImages.team.length]}
                          alt={vet.name}
                          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        {/* Floating Badge */}
                        {vet.experience_years > 0 && (
                          <div className="absolute top-4 right-4 px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-full">
                            <p className="text-xs font-semibold text-gray-900">
                              {vet.experience_years} Yıl Deneyim
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-gray-600 transition-colors">
                          {vet.name}
                        </h3>
                        <p className="text-gray-600 text-sm mb-4">
                          {vet.specialty}
                        </p>

                        {/* Info Tags */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {vet.education && (
                            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-lg">
                              <FaGraduationCap className="text-xs text-gray-500" />
                              <span className="text-xs font-medium text-gray-700">
                                {vet.education.split('\n')[0].substring(0, 30)}
                                {vet.education.length > 30 ? '...' : ''}
                              </span>
                            </div>
                          )}
                          {vet.certifications && (
                            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-lg">
                              <FaAward className="text-xs text-gray-500" />
                              <span className="text-xs font-medium text-gray-700">Sertifikalı</span>
                            </div>
                          )}
                        </div>

                        {/* CTA */}
                        <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 group-hover:gap-3 transition-all">
                          <span>Profili Görüntüle</span>
                          <FaArrowRight className="text-xs" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Bottom CTA - Minimal */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Randevu Almak İster misiniz?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Evcil dostunuzun sağlığı için hemen randevu oluşturun.
            </p>
            <Link
              to="/randevu"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white font-semibold rounded-full hover:bg-gray-800 transition-colors duration-300"
            >
              <span>Randevu Al</span>
              <FaArrowRight className="text-sm" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Veterinarians;
