import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaEnvelope, FaBlog, FaPaw, FaChartLine, FaUsers, FaClock, FaCheckCircle } from 'react-icons/fa';
import api from '../../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalAppointments: 0,
    pendingAppointments: 0,
    totalMessages: 0,
    totalBlogPosts: 0,
    recentAppointments: [],
    recentMessages: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // In real implementation, these would be authenticated API calls
      // For now, using placeholder data
      setStats({
        totalAppointments: 12,
        pendingAppointments: 5,
        totalMessages: 8,
        totalBlogPosts: 4,
        recentAppointments: [],
        recentMessages: [],
      });
      setLoading(false);
    } catch (error) {
      console.error('Dashboard veriler yüklenemedi:', error);
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Toplam Randevular',
      value: stats.totalAppointments,
      icon: FaCalendarAlt,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Bekleyen Randevular',
      value: stats.pendingAppointments,
      icon: FaClock,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Yeni Mesajlar',
      value: stats.totalMessages,
      icon: FaEnvelope,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Blog Yaz1lar1',
      value: stats.totalBlogPosts,
      icon: FaBlog,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                PetKey Veteriner Klinii Yönetim Paneli
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Ho_ Geldiniz</p>
                <p className="text-lg font-semibold text-gray-900">Admin</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                A
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-14 h-14 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                  <stat.icon className={`text-2xl bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`} />
                </div>
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-2">{stat.title}</h3>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-8 shadow-lg mb-8 border border-gray-100"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">H1zl1 0_lemler</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl hover:shadow-lg transition-all text-left border border-blue-200">
              <FaCalendarAlt className="text-3xl text-blue-600 mb-3" />
              <h3 className="font-bold text-lg text-gray-900 mb-1">Randevular</h3>
              <p className="text-sm text-gray-600">Randevular1 görüntüle ve yönet</p>
            </button>
            <button className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl hover:shadow-lg transition-all text-left border border-purple-200">
              <FaEnvelope className="text-3xl text-purple-600 mb-3" />
              <h3 className="font-bold text-lg text-gray-900 mb-1">Mesajlar</h3>
              <p className="text-sm text-gray-600">0leti_im mesajlar1n1 oku</p>
            </button>
            <button className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl hover:shadow-lg transition-all text-left border border-green-200">
              <FaBlog className="text-3xl text-green-600 mb-3" />
              <h3 className="font-bold text-lg text-gray-900 mb-1">Blog Yaz</h3>
              <p className="text-sm text-gray-600">Yeni blog yaz1s1 olu_tur</p>
            </button>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Appointments */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Son Randevular</h2>
              <button className="text-purple-600 text-sm font-semibold hover:text-purple-700">
                Tümünü Gör ’
              </button>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-900">Pamuk - Golden Retriever</span>
                  <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold">
                    Bekliyor
                  </span>
                </div>
                <p className="text-sm text-gray-600">Ali Y1lmaz " 15 Oca 2025, 10:00</p>
              </div>
              <div className="text-center py-8 text-gray-500">
                <FaCalendarAlt className="text-4xl mx-auto mb-2 opacity-50" />
                <p>Henüz randevu yok</p>
              </div>
            </div>
          </motion.div>

          {/* Recent Messages */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Son Mesajlar</h2>
              <button className="text-purple-600 text-sm font-semibold hover:text-purple-700">
                Tümünü Gör ’
              </button>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-900">Fatma ^ahin</span>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                    Yeni
                  </span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">Randevu Dei_iklii</p>
              </div>
              <div className="text-center py-8 text-gray-500">
                <FaEnvelope className="text-4xl mx-auto mb-2 opacity-50" />
                <p>Henüz mesaj yok</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
