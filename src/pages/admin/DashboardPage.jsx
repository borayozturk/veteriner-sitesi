import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FaCalendarAlt, FaEnvelope, FaBlog, FaPaw, FaChartLine, FaUsers,
  FaClock, FaCheckCircle, FaTimes, FaEye, FaArrowRight
} from 'react-icons/fa';
import api from '../../services/api';

const DashboardPage = () => {
  const [stats, setStats] = useState({
    totalAppointments: 0,
    pendingAppointments: 0,
    confirmedAppointments: 0,
    completedAppointments: 0,
    totalMessages: 0,
    unreadMessages: 0,
    totalBlogPosts: 0,
    totalViews: 0,
  });
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [recentMessages, setRecentMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch blog posts
      const blogData = await api.blog.getAll();
      const blogPosts = blogData.results || blogData;
      const totalViews = blogPosts.reduce((sum, post) => sum + (post.views || 0), 0);

      setStats({
        totalAppointments: 156,
        pendingAppointments: 12,
        confirmedAppointments: 8,
        completedAppointments: 136,
        totalMessages: 45,
        unreadMessages: 8,
        totalBlogPosts: blogPosts.length,
        totalViews: totalViews,
      });

      // Mock recent data - in real app, fetch from API
      setRecentAppointments([
        {
          id: 1,
          petName: 'Pamuk',
          petType: 'Golden Retriever',
          ownerName: 'Ali Yılmaz',
          date: '2025-01-15',
          time: '10:00',
          status: 'pending',
          service: 'Genel Muayene'
        },
        {
          id: 2,
          petName: 'Minnoş',
          petType: 'Kedi',
          ownerName: 'Ayşe Demir',
          date: '2025-01-15',
          time: '11:30',
          status: 'confirmed',
          service: 'Aşı'
        },
        {
          id: 3,
          petName: 'Karabaş',
          petType: 'Kangal',
          ownerName: 'Mehmet Kaya',
          date: '2025-01-16',
          time: '14:00',
          status: 'pending',
          service: 'Cerrahi'
        },
      ]);

      setRecentMessages([
        {
          id: 1,
          name: 'Fatma Şahin',
          email: 'fatma@example.com',
          subject: 'Randevu Değişikliği',
          message: 'Merhaba, randevumu değiştirmek istiyorum...',
          status: 'new',
          createdAt: '2025-01-14T10:30:00'
        },
        {
          id: 2,
          name: 'Can Öztürk',
          email: 'can@example.com',
          subject: 'Fiyat Bilgisi',
          message: 'Kedi kısırlaştırma fiyatlarını öğrenebilir miyim?',
          status: 'new',
          createdAt: '2025-01-14T09:15:00'
        },
      ]);

      setLoading(false);
    } catch (error) {
      console.error('Dashboard verileri yüklenemedi:', error);
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
      change: '+12%',
      changePositive: true
    },
    {
      title: 'Bekleyen Randevular',
      value: stats.pendingAppointments,
      icon: FaClock,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      badge: 'Acil'
    },
    {
      title: 'Okunmamış Mesajlar',
      value: stats.unreadMessages,
      icon: FaEnvelope,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      total: stats.totalMessages
    },
    {
      title: 'Blog Görüntülenmeleri',
      value: stats.totalViews,
      icon: FaEye,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      subtext: `${stats.totalBlogPosts} yazı`
    },
  ];

  const statusColors = {
    pending: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Bekliyor' },
    confirmed: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Onaylandı' },
    completed: { bg: 'bg-green-100', text: 'text-green-700', label: 'Tamamlandı' },
    cancelled: { bg: 'bg-red-100', text: 'text-red-700', label: 'İptal' },
  };

  const messageStatusColors = {
    new: { bg: 'bg-green-100', text: 'text-green-700', label: 'Yeni' },
    read: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Okundu' },
    replied: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Yanıtlandı' },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100 relative overflow-hidden group"
          >
            {/* Background Gradient */}
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500`} />

            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-14 h-14 ${stat.bgColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <stat.icon className={`text-2xl bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`} />
                </div>
                {stat.badge && (
                  <span className={`px-3 py-1 bg-gradient-to-r ${stat.color} text-white text-xs font-bold rounded-full`}>
                    {stat.badge}
                  </span>
                )}
              </div>

              <h3 className="text-gray-600 text-sm font-medium mb-2">{stat.title}</h3>
              <div className="flex items-end justify-between">
                <p className={`text-3xl font-bold bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`}>
                  {stat.value}
                </p>
                {stat.change && (
                  <span className={`text-xs font-semibold ${stat.changePositive ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change}
                  </span>
                )}
                {stat.total && (
                  <span className="text-xs text-gray-500">/ {stat.total}</span>
                )}
                {stat.subtext && (
                  <span className="text-xs text-gray-500">{stat.subtext}</span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm mb-1">Onaylanan</p>
              <p className="text-3xl font-bold">{stats.confirmedAppointments}</p>
            </div>
            <FaCheckCircle className="text-5xl text-white/20" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm mb-1">Tamamlanan</p>
              <p className="text-3xl font-bold">{stats.completedAppointments}</p>
            </div>
            <FaPaw className="text-5xl text-white/20" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm mb-1">Blog Yazıları</p>
              <p className="text-3xl font-bold">{stats.totalBlogPosts}</p>
            </div>
            <FaBlog className="text-5xl text-white/20" />
          </div>
        </div>
      </motion.div>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Appointments */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100"
        >
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <FaCalendarAlt className="text-purple-600" />
                Son Randevular
              </h2>
              <Link
                to="/admin/randevular"
                className="text-purple-600 text-sm font-semibold hover:text-purple-700 flex items-center gap-1"
              >
                Tümünü Gör
                <FaArrowRight size={12} />
              </Link>
            </div>
          </div>

          <div className="p-6 space-y-4">
            {recentAppointments.length > 0 ? (
              recentAppointments.map((appointment) => (
                <div key={appointment.id} className="p-4 bg-gray-50 rounded-xl hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-gray-900">{appointment.petName}</h4>
                        <span className={`px-2 py-0.5 ${statusColors[appointment.status].bg} ${statusColors[appointment.status].text} rounded-full text-xs font-bold`}>
                          {statusColors[appointment.status].label}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{appointment.petType}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        👤 {appointment.ownerName}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600 mt-3 pt-3 border-t border-gray-200">
                    <span className="flex items-center gap-1">
                      <FaCalendarAlt size={12} />
                      {new Date(appointment.date).toLocaleDateString('tr-TR')} • {appointment.time}
                    </span>
                    <span className="font-medium text-purple-600">{appointment.service}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-gray-500">
                <FaCalendarAlt className="text-5xl mx-auto mb-3 opacity-30" />
                <p className="font-medium">Henüz randevu yok</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Recent Messages */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100"
        >
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <FaEnvelope className="text-purple-600" />
                Son Mesajlar
              </h2>
              <Link
                to="/admin/mesajlar"
                className="text-purple-600 text-sm font-semibold hover:text-purple-700 flex items-center gap-1"
              >
                Tümünü Gör
                <FaArrowRight size={12} />
              </Link>
            </div>
          </div>

          <div className="p-6 space-y-4">
            {recentMessages.length > 0 ? (
              recentMessages.map((message) => (
                <div key={message.id} className="p-4 bg-gray-50 rounded-xl hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-gray-900">{message.name}</h4>
                        <span className={`px-2 py-0.5 ${messageStatusColors[message.status].bg} ${messageStatusColors[message.status].text} rounded-full text-xs font-bold`}>
                          {messageStatusColors[message.status].label}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 font-medium">{message.subject}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-2 mt-2">
                    {message.message}
                  </p>
                  <div className="flex items-center text-xs text-gray-400 mt-3 pt-3 border-t border-gray-200">
                    📧 {message.email} • {new Date(message.createdAt).toLocaleDateString('tr-TR')}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-gray-500">
                <FaEnvelope className="text-5xl mx-auto mb-3 opacity-30" />
                <p className="font-medium">Henüz mesaj yok</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPage;
