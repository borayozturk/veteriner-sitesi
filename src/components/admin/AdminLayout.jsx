import { useState } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaHome, FaCalendarAlt, FaBlog, FaEnvelope, FaImages, FaUserMd,
  FaBars, FaTimes, FaSignOutAlt, FaChartLine, FaCog, FaEdit, FaConciergeBell, FaSearch,
  FaChevronDown, FaChevronUp, FaFileAlt, FaInfoCircle, FaPhoneAlt, FaUsers
} from 'react-icons/fa';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [pagesMenuOpen, setPagesMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { path: '/admin', icon: FaHome, label: 'Dashboard', exact: true },
    { path: '/admin/randevular', icon: FaCalendarAlt, label: 'Randevular' },
    { path: '/admin/blog', icon: FaBlog, label: 'Blog Yazıları' },
    { path: '/admin/mesajlar', icon: FaEnvelope, label: 'Mesajlar' },
    { path: '/admin/galeri', icon: FaImages, label: 'Galeri' },
    { path: '/admin/veterinerler', icon: FaUserMd, label: 'Veterinerler' },
    { path: '/admin/kullanicilar', icon: FaUsers, label: 'Kullanıcı Yönetimi' },
    { path: '/admin/seo', icon: FaSearch, label: 'SEO Yönetimi' },
  ];

  const pagesMenuItems = [
    { path: '/admin/anasayfa-duzenle', icon: FaHome, label: 'Anasayfa Düzenle' },
    { path: '/admin/hakkimizda-duzenle', icon: FaInfoCircle, label: 'Hakkımızda Düzenle' },
    { path: '/admin/iletisim-duzenle', icon: FaPhoneAlt, label: 'İletişim Sayfası Düzenle' },
    { path: '/admin/hizmetler-sayfasi-duzenle', icon: FaEdit, label: 'Hizmetler Sayfası Düzenle' },
    { path: '/admin/hizmetler', icon: FaConciergeBell, label: 'Hizmetler Yönetimi' },
    { path: '/admin/sayfa-duzenle', icon: FaFileAlt, label: 'Sayfa İçerikleri' },
  ];

  const isActive = (path, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:8000/api/auth/logout/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear localStorage and redirect, regardless of API response
      localStorage.removeItem('user');
      navigate('/admin/login');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: 'spring', damping: 20 }}
            className="fixed lg:sticky top-0 left-0 h-screen w-64 bg-gradient-to-b from-purple-900 via-purple-800 to-purple-900 text-white shadow-2xl z-50 overflow-y-auto"
          >
            {/* Logo */}
            <div className="p-6 border-b border-purple-700">
              <Link to="/" className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🐾</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold">PetKey</h1>
                  <p className="text-xs text-purple-300">Admin Panel</p>
                </div>
              </Link>
            </div>

            {/* Navigation */}
            <nav className="p-4 space-y-2">
              {menuItems.map((item) => {
                const active = isActive(item.path, item.exact);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      active
                        ? 'bg-white text-purple-900 shadow-lg'
                        : 'text-purple-100 hover:bg-purple-800 hover:text-white'
                    }`}
                  >
                    <item.icon className="text-xl" />
                    <span className="font-semibold">{item.label}</span>
                  </Link>
                );
              })}

              {/* Pages Dropdown Menu */}
              <div>
                <button
                  onClick={() => setPagesMenuOpen(!pagesMenuOpen)}
                  className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl transition-all ${
                    pagesMenuItems.some(item => isActive(item.path))
                      ? 'bg-white text-purple-900 shadow-lg'
                      : 'text-purple-100 hover:bg-purple-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <FaFileAlt className="text-xl" />
                    <span className="font-semibold">Sayfaları Düzenle</span>
                  </div>
                  {pagesMenuOpen ? (
                    <FaChevronUp className="text-sm" />
                  ) : (
                    <FaChevronDown className="text-sm" />
                  )}
                </button>

                {/* Submenu Items */}
                <AnimatePresence>
                  {pagesMenuOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="ml-4 mt-2 space-y-2">
                        {pagesMenuItems.map((item) => {
                          const active = isActive(item.path);
                          return (
                            <Link
                              key={item.path}
                              to={item.path}
                              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all text-sm ${
                                active
                                  ? 'bg-purple-700 text-white shadow-md'
                                  : 'text-purple-200 hover:bg-purple-800 hover:text-white'
                              }`}
                            >
                              <item.icon className="text-lg" />
                              <span className="font-medium">{item.label}</span>
                            </Link>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </nav>

            {/* Bottom Actions */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-purple-700 bg-purple-900/50">
              <Link
                to="/admin/ayarlar"
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive('/admin/ayarlar')
                    ? 'bg-white text-purple-900 shadow-lg'
                    : 'text-purple-100 hover:bg-purple-800 hover:text-white'
                }`}
              >
                <FaCog className="text-xl" />
                <span className="font-semibold">Ayarlar</span>
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-300 hover:bg-red-900/30 hover:text-red-200 rounded-xl transition-all mt-2"
              >
                <FaSignOutAlt className="text-xl" />
                <span className="font-semibold">Çıkış Yap</span>
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
          <div className="px-4 lg:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {sidebarOpen ? (
                  <FaTimes className="text-xl text-gray-600" />
                ) : (
                  <FaBars className="text-xl text-gray-600" />
                )}
              </button>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {isActive('/admin/ayarlar') ? 'Ayarlar' : menuItems.find(item => isActive(item.path, item.exact))?.label || 'Dashboard'}
                </h2>
                <p className="text-sm text-gray-500">Veteriner Yönetim Paneli</p>
              </div>
            </div>

            {/* User Profile */}
            <div className="flex items-center gap-4">
              <div className="text-right hidden md:block">
                <p className="text-sm font-semibold text-gray-900">Dr. Veteriner</p>
                <p className="text-xs text-gray-500">Baş Veteriner</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold">
                V
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8">
          <Outlet />
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;
