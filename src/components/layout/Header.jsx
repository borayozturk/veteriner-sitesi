import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes, FaPhone, FaChevronDown } from 'react-icons/fa';
import { services as staticServices } from '../../data/services';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [services, setServices] = useState([]);
  const [siteSettings, setSiteSettings] = useState({
    site_logo_text: 'Veteriner',
    site_logo_subtitle: 'Veteriner Kliniği',
    site_logo_emoji: '🐾'
  });
  const location = useLocation();

  // Fetch site settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/site-settings/get_settings/');
        if (response.ok) {
          const data = await response.json();
          setSiteSettings(data);
        }
      } catch (error) {
        console.error('❌ Header - Site settings yüklenemedi:', error);
      }
    };
    fetchSettings();
  }, []);

  // Fetch active services from database
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/services/active/');
        const data = await response.json();
        console.log('🔍 Header - Fetched services from API:', data.length, 'services');

        // Merge database services with static data
        const mergedServices = data.map(dbService => {
          const staticService = staticServices.find(s => s.slug === dbService.slug);
          return {
            ...staticService,
            ...dbService,
            id: dbService.id
          };
        });

        console.log('✅ Header - Merged services:', mergedServices.length, 'services');
        setServices(mergedServices);
      } catch (error) {
        console.error('❌ Header - Hizmetler yüklenemedi:', error);
        // Fallback to static services
        setServices(staticServices);
      }
    };
    fetchServices();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setServicesOpen(false);
  }, [location]);

  const navLinks = [
    { name: 'Ana Sayfa', path: '/' },
    { name: 'Hizmetler', path: '/hizmetler', hasSubmenu: true },
    { name: 'Veterinerler', path: '/veterinerler' },
    { name: 'Hakkımızda', path: '/hakkimizda' },
    { name: 'Galeri', path: '/galeri' },
    { name: 'Blog', path: '/blog' },
    { name: 'İletişim', path: '/iletisim' },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/80 backdrop-blur-2xl shadow-lg border-b border-gray-100'
          : 'bg-white/95 backdrop-blur-xl shadow-sm'
      }`}
    >
      <div className="container-custom">
        <div className="flex justify-between items-center h-20">

          {/* LOGO - Minimal & Bold */}
          <Link to="/" className="flex items-center gap-3 group relative z-50">
            {siteSettings.site_logo_image ? (
              // Show uploaded logo image
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                className="relative"
              >
                <img
                  src={siteSettings.site_logo_image}
                  alt={siteSettings.site_logo_text}
                  className="h-16 w-auto max-w-[200px] object-contain"
                />
              </motion.div>
            ) : (
              // Show emoji logo
              <motion.div
                whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
                className="relative"
              >
                {/* Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-2xl blur-md opacity-40 group-hover:opacity-60 transition-opacity" />
                {/* Icon Container */}
                <div className="relative w-14 h-14 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center text-white shadow-xl">
                  <span className="text-3xl">{siteSettings.site_logo_emoji}</span>
                </div>
              </motion.div>
            )}

            {(siteSettings.site_logo_text || siteSettings.site_logo_subtitle) && (
              <div className="hidden sm:block">
                {siteSettings.site_logo_text && (
                  <h1 className="text-2xl font-extrabold text-gray-900 leading-none">
                    {siteSettings.site_logo_text}
                  </h1>
                )}
                {siteSettings.site_logo_subtitle && (
                  <p className="text-xs text-gray-500 font-medium">{siteSettings.site_logo_subtitle}</p>
                )}
              </div>
            )}
          </Link>

          {/* DESKTOP NAVIGATION - Ultra Modern */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <div
                key={link.path}
                className="relative"
                onMouseEnter={() => link.hasSubmenu && setServicesOpen(true)}
                onMouseLeave={() => link.hasSubmenu && setServicesOpen(false)}
              >
                <Link
                  to={link.path}
                  className={`
                    group relative px-4 py-2 rounded-xl font-semibold text-sm
                    transition-all duration-300 flex items-center gap-1.5
                    ${location.pathname === link.path
                      ? 'text-purple-600 bg-purple-50'
                      : 'text-gray-700 hover:text-purple-600 hover:bg-gray-50'
                    }
                  `}
                >
                  {link.name}
                  {link.hasSubmenu && (
                    <FaChevronDown
                      className={`text-xs transition-transform duration-300 ${
                        servicesOpen ? 'rotate-180' : ''
                      }`}
                    />
                  )}

                  {/* Active Indicator */}
                  {location.pathname === link.path && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>

                {/* MEGA MENU DROPDOWN - Revolutionary Design */}
                {link.hasSubmenu && (
                  <AnimatePresence>
                    {servicesOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-[95vw] lg:w-[90vw] xl:w-[85vw] max-w-5xl"
                      >
                        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 lg:p-5 backdrop-blur-xl">
                          {/* Header - Kompakt */}
                          <div className="mb-3 pb-3 border-b border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900 mb-1">
                              Tüm Hizmetlerimiz
                            </h3>
                            <p className="text-xs text-gray-600">
                              Evcil dostlarınız için kapsamlı veteriner hizmetleri
                            </p>
                          </div>

                          {/* Services Grid - Kompakt */}
                          <div className="grid grid-cols-3 xl:grid-cols-4 gap-2 max-h-[50vh] overflow-y-auto custom-scrollbar pr-2">
                            {services.map((service, index) => (
                              <Link
                                key={service.id}
                                to={`/service/${service.slug}`}
                                className="group p-3 rounded-xl hover:bg-gradient-to-br hover:from-purple-50 hover:to-pink-50 transition-all duration-300 border border-transparent hover:border-purple-200"
                              >
                                <motion.div
                                  whileHover={{ scale: 1.05 }}
                                  className="flex flex-col items-center text-center gap-1.5"
                                >
                                  <div className="text-2xl group-hover:scale-110 transition-transform">
                                    {service.icon}
                                  </div>
                                  <h4 className="font-bold text-xs text-gray-900 group-hover:text-purple-600 transition-colors leading-tight">
                                    {service.title}
                                  </h4>
                                  <p className="text-[10px] text-gray-500 line-clamp-2 group-hover:text-gray-700">
                                    {service.shortDescription}
                                  </p>
                                </motion.div>
                              </Link>
                            ))}
                          </div>

                          {/* Footer CTA - Kompakt */}
                          <div className="mt-3 pt-3 border-t border-gray-100 flex justify-center">
                            <Link
                              to="/hizmetler"
                              className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-bold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300"
                            >
                              Tüm Hizmetleri Görüntüle →
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            ))}
          </nav>

          {/* CTA BUTTONS - Creative Split */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href={`tel:${siteSettings?.contact_phone_link || '+902121234567'}`}
              className="group flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-gray-200 hover:border-purple-600 transition-all duration-300"
            >
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                <FaPhone size={14} />
              </div>
              <div className="text-left">
                <div className="text-xs text-gray-500 leading-none mb-0.5">Hemen Ara</div>
                <div className="text-sm font-bold text-gray-900">{siteSettings?.contact_phone || '(0212) 123 45 67'}</div>
              </div>
            </a>

            <Link
              to="/randevu"
              className="px-6 py-3 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 text-white font-bold rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-300 relative overflow-hidden group"
            >
              <span className="relative z-10">Randevu Al</span>
              <div className="absolute inset-0 bg-gradient-to-r from-orange-600 via-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden relative w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center z-50"
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <FaTimes size={20} className="text-gray-900" />
            ) : (
              <FaBars size={20} className="text-gray-900" />
            )}
          </button>
        </div>
      </div>

      {/* MOBILE NAVIGATION - Full Screen */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-white border-t border-gray-100 max-h-[calc(100vh-5rem)] overflow-y-auto"
          >
            <div className="container-custom py-8">
              <nav className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <div key={link.path}>
                    <div
                      className={`
                        flex items-center justify-between px-4 py-4 rounded-xl font-semibold transition-all cursor-pointer
                        ${location.pathname === link.path
                          ? 'bg-gradient-to-r from-purple-50 to-pink-50 text-purple-600'
                          : 'text-gray-700 hover:bg-gray-50'
                        }
                      `}
                      onClick={(e) => {
                        if (link.hasSubmenu) {
                          e.preventDefault();
                          setServicesOpen(!servicesOpen);
                        } else {
                          setIsOpen(false);
                        }
                      }}
                    >
                      <Link to={link.path} onClick={(e) => link.hasSubmenu && e.preventDefault()}>
                        {link.name}
                      </Link>
                      {link.hasSubmenu && (
                        <FaChevronDown
                          className={`transition-transform ${servicesOpen ? 'rotate-180' : ''}`}
                        />
                      )}
                    </div>

                    {/* Mobile Services Dropdown */}
                    {link.hasSubmenu && servicesOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="mt-2 ml-4 space-y-1 overflow-hidden"
                      >
                        {services.slice(0, 10).map((service) => (
                          <Link
                            key={service.id}
                            to={`/service/${service.slug}`}
                            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-purple-50 transition-colors"
                            onClick={() => setIsOpen(false)}
                          >
                            <span className="text-2xl">{service.icon}</span>
                            <span className="text-sm text-gray-700">{service.title}</span>
                          </Link>
                        ))}
                        <Link
                          to="/hizmetler"
                          className="block px-4 py-3 text-center text-sm text-purple-600 font-semibold hover:bg-purple-50 rounded-lg"
                          onClick={() => setIsOpen(false)}
                        >
                          Tümünü Gör →
                        </Link>
                      </motion.div>
                    )}
                  </div>
                ))}
              </nav>

              {/* Mobile CTA */}
              <div className="mt-8 space-y-3">
                <a
                  href="tel:+902121234567"
                  className="flex items-center justify-center gap-2 w-full px-6 py-4 rounded-xl border-2 border-purple-600 text-purple-600 font-bold"
                >
                  <FaPhone />
                  (0212) 123 45 67
                </a>
                <Link
                  to="/randevu"
                  className="block w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-center font-bold rounded-xl"
                  onClick={() => setIsOpen(false)}
                >
                  Randevu Al
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
