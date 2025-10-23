import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaHome, FaPhone, FaCalendarAlt, FaPaw } from 'react-icons/fa';
import SEO from '../components/common/SEO';

const NotFound = () => {
  return (
    <>
      <SEO
        title="404 - Sayfa Bulunamadı"
        description="Aradığınız sayfa bulunamadı. Ana sayfaya dönebilir veya hizmetlerimize göz atabilirsiniz."
        noindex={true}
      />

      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center px-4 py-16">
        <div className="max-w-4xl w-full">
          <div className="text-center">
            {/* Animated 404 with Paw Prints */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="relative mb-8"
            >
              {/* Main 404 Text */}
              <h1 className="text-[150px] md:text-[220px] font-black text-transparent bg-gradient-to-br from-purple-600 via-pink-600 to-orange-600 bg-clip-text leading-none select-none">
                404
              </h1>

              {/* Floating Paw Prints */}
              <motion.div
                animate={{
                  y: [0, -15, 0],
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute top-8 left-1/4 text-6xl opacity-30"
              >
                🐾
              </motion.div>
              <motion.div
                animate={{
                  y: [0, -20, 0],
                  rotate: [0, -10, 10, 0],
                }}
                transition={{
                  duration: 3.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5
                }}
                className="absolute bottom-12 right-1/4 text-5xl opacity-30"
              >
                🐾
              </motion.div>
              <motion.div
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 15, -15, 0],
                }}
                transition={{
                  duration: 2.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
                className="absolute top-24 right-1/3 text-4xl opacity-20"
              >
                🐾
              </motion.div>
            </motion.div>

            {/* Cute Pet Illustration */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8"
            >
              <div className="text-8xl md:text-9xl mb-6">
                <motion.span
                  animate={{
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="inline-block"
                >
                  🐕
                </motion.span>
                <motion.span
                  animate={{
                    rotate: [0, -10, 10, 0],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.3
                  }}
                  className="inline-block ml-4"
                >
                  🐈
                </motion.span>
              </div>
            </motion.div>

            {/* Message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mb-8"
            >
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
                Hoppala! Sayfa Bulunamadı
              </h2>
              <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Aradığınız sayfa kaybolmuş gibi görünüyor. Belki bir kedi çaldı? 🐱
                <br />
                Endişelenmeyin, size yardımcı olabiliriz!
              </p>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              {/* Home Button */}
              <Link to="/">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transition-all overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <FaHome />
                    Ana Sayfaya Dön
                  </span>
                  {/* Hover Effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.button>
              </Link>

              {/* Services Button */}
              <Link to="/hizmetler">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white text-purple-600 rounded-full font-bold text-lg shadow-lg hover:shadow-xl border-2 border-purple-200 transition-all flex items-center gap-2"
                >
                  <FaPaw />
                  Hizmetlerimiz
                </motion.button>
              </Link>

              {/* Contact Button */}
              <Link to="/randevu">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white text-green-600 rounded-full font-bold text-lg shadow-lg hover:shadow-xl border-2 border-green-200 transition-all flex items-center gap-2"
                >
                  <FaCalendarAlt />
                  Randevu Al
                </motion.button>
              </Link>
            </motion.div>

            {/* Helpful Links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-12 pt-8 border-t border-gray-200"
            >
              <p className="text-sm text-gray-500 mb-4">Popüler sayfalarımız:</p>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <Link to="/blog" className="text-purple-600 hover:text-purple-700 font-semibold hover:underline">
                  Blog Yazıları
                </Link>
                <span className="text-gray-300">•</span>
                <Link to="/veterinerler" className="text-purple-600 hover:text-purple-700 font-semibold hover:underline">
                  Veterinerlerimiz
                </Link>
                <span className="text-gray-300">•</span>
                <Link to="/hakkimizda" className="text-purple-600 hover:text-purple-700 font-semibold hover:underline">
                  Hakkımızda
                </Link>
                <span className="text-gray-300">•</span>
                <Link to="/iletisim" className="text-purple-600 hover:text-purple-700 font-semibold hover:underline">
                  İletişim
                </Link>
              </div>
            </motion.div>

            {/* Fun Message */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mt-8"
            >
              <p className="text-gray-400 text-sm italic">
                "Kayıp bir şey mi arıyorsunuz? Evcil dostlarınız gibi biz de buradayız!" 🐾
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFound;
