import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FaFacebook, FaInstagram, FaTwitter, FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaHeart } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [siteSettings, setSiteSettings] = useState({
    site_logo_text: 'Veteriner',
    site_logo_subtitle: 'Veteriner Kliniği',
    site_logo_emoji: '🐾',
    contact_phone: '(0212) 123 45 67',
    contact_phone_link: '+902121234567',
    contact_email: 'info@veteriner.com',
    contact_address: 'Kadıköy, İstanbul',
    footer_about_text: 'Sevimli dostlarınızın sağlığı için modern ekipman ve deneyimli kadromuzla 7/24 hizmetinizdeyiz.',
    footer_facebook_url: 'https://facebook.com/veteriner',
    footer_instagram_url: 'https://instagram.com/veteriner',
    footer_twitter_url: 'https://twitter.com/veteriner',
    working_hours_weekday: '09:00 - 18:00',
    working_hours_weekend: '10:00 - 16:00',
    working_hours_info: '7/24 Acil Servis',
  });
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch(import.meta.env.VITE_API_URL + '/api/site-settings/get_settings/');
        if (response.ok) {
          const data = await response.json();
          setSiteSettings(data);
        }
      } catch (error) {
        console.error('❌ Footer - Site settings yüklenemedi:', error);
      }
    };
    fetchSettings();
  }, []);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(import.meta.env.VITE_API_URL + '/api/services/active/');
        if (response.ok) {
          const data = await response.json();
          setServices(data);
        }
      } catch (error) {
        console.error('❌ Footer - Hizmetler yüklenemedi:', error);
      }
    };
    fetchServices();
  }, []);

  const quickLinks = [
    { name: 'Ana Sayfa', path: '/' },
    { name: 'Hizmetler', path: '/hizmetler' },
    { name: 'Hakkımızda', path: '/hakkimizda' },
    { name: 'Galeri', path: '/galeri' },
    { name: 'Blog', path: '/blog' },
    { name: 'İletişim', path: '/iletisim' },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-8">
          {/* About Section */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-3">
              {siteSettings.site_logo_image ? (
                // Show uploaded logo image
                <img
                  src={siteSettings.site_logo_image}
                  alt={siteSettings.site_logo_text}
                  className="h-14 w-auto max-w-[180px] object-contain"
                />
              ) : (
                // Show emoji logo
                <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  {siteSettings.site_logo_emoji}
                </div>
              )}
              {(siteSettings.site_logo_text || siteSettings.site_logo_subtitle) && (
                <div>
                  {siteSettings.site_logo_text && (
                    <h3 className="text-2xl font-extrabold text-white">{siteSettings.site_logo_text}</h3>
                  )}
                  {siteSettings.site_logo_subtitle && (
                    <p className="text-sm text-gray-300">{siteSettings.site_logo_subtitle}</p>
                  )}
                </div>
              )}
            </Link>
            <p className="text-gray-100 leading-relaxed">
              {siteSettings.footer_about_text}
            </p>
            <div className="flex gap-4">
              <a
                href={siteSettings.footer_facebook_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 hover:bg-secondary rounded-full flex items-center justify-center transition-all hover:scale-110"
              >
                <FaFacebook size={20} />
              </a>
              <a
                href={siteSettings.footer_instagram_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 hover:bg-secondary rounded-full flex items-center justify-center transition-all hover:scale-110"
              >
                <FaInstagram size={20} />
              </a>
              <a
                href={siteSettings.footer_twitter_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 hover:bg-secondary rounded-full flex items-center justify-center transition-all hover:scale-110"
              >
                <FaTwitter size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-extrabold mb-6 text-white">Hızlı Linkler</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-100 hover:text-secondary transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-secondary rounded-full group-hover:scale-150 transition-transform" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="lg:col-span-2">
            <h3 className="text-lg font-extrabold mb-6 pb-3 text-white border-b-2 border-secondary/30">Hizmetlerimiz</h3>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-3">
              {services.length > 0 ? (
                services.map((service) => (
                  <li key={service.id}>
                    <Link
                      to={`/service/${service.slug}`}
                      className="text-gray-100 hover:text-secondary transition-colors flex items-center gap-2 group text-sm"
                    >
                      <span className="w-1.5 h-1.5 bg-secondary rounded-full group-hover:scale-150 transition-transform flex-shrink-0" />
                      <span className="truncate">{service.title}</span>
                    </Link>
                  </li>
                ))
              ) : (
                <li className="text-gray-400 text-sm">Yükleniyor...</li>
              )}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-extrabold mb-6 text-white">İletişim</h3>
            <ul className="space-y-4">
              <li>
                <a
                  href={`tel:${siteSettings.contact_phone_link}`}
                  className="flex items-start gap-3 text-gray-100 hover:text-secondary transition-colors group"
                >
                  <FaPhone className="mt-1 group-hover:rotate-12 transition-transform" size={18} />
                  <div>
                    <p className="font-medium">Telefon</p>
                    <p className="text-sm">{siteSettings.contact_phone}</p>
                  </div>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${siteSettings.contact_email}`}
                  className="flex items-start gap-3 text-gray-100 hover:text-secondary transition-colors group"
                >
                  <FaEnvelope className="mt-1 group-hover:scale-110 transition-transform" size={18} />
                  <div>
                    <p className="font-medium">E-posta</p>
                    <p className="text-sm">{siteSettings.contact_email}</p>
                  </div>
                </a>
              </li>
              <li className="flex items-start gap-3 text-gray-100">
                <FaMapMarkerAlt className="mt-1" size={18} />
                <div>
                  <p className="font-medium">Adres</p>
                  <p className="text-sm">{siteSettings.contact_address}</p>
                </div>
              </li>
              <li className="flex items-start gap-3 text-gray-100">
                <FaClock className="mt-1" size={18} />
                <div>
                  <p className="font-medium">Çalışma Saatleri</p>
                  <p className="text-sm">{siteSettings.working_hours_info}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-white/10">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-100">
            <p className="flex items-center gap-2">
              © {currentYear} {siteSettings.site_logo_subtitle}. Tüm hakları saklıdır.
            </p>
            <p className="flex items-center gap-2">
              Sevgiyle yapıldı <FaHeart className="text-secondary animate-pulse" />
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
