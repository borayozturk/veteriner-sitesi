import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FaEnvelope, FaSearch, FaFilter, FaEye, FaReply, FaTrash,
  FaPhone, FaClock, FaCheckCircle, FaEnvelopeOpen, FaTimes,
  FaTrashRestore, FaTrashAlt
} from 'react-icons/fa';
import api from '../../services/api';

const MessagesPage = () => {
  const [messages, setMessages] = useState([]);
  const [trashedMessages, setTrashedMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [activeTab, setActiveTab] = useState('messages'); // 'messages' or 'trash'

  useEffect(() => {
    fetchMessages();
    fetchTrashedMessages();
  }, []);

  useEffect(() => {
    filterMessages();
  }, [searchTerm, statusFilter, messages, trashedMessages, activeTab]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/api/contact/?deleted=false');
      const data = await response.json();

      // Handle both array and paginated response
      const dataArray = Array.isArray(data) ? data : (data.results || []);

      // Transform backend data to frontend format
      const transformedMessages = dataArray.map(msg => ({
        id: msg.id,
        name: msg.name,
        email: msg.email,
        phone: msg.phone || 'Belirtilmemiş',
        subject: msg.subject,
        message: msg.message,
        status: msg.status || 'new',
        createdAt: msg.created_at,
        type: 'genel' // Default type, can be enhanced based on subject/message analysis
      }));

      setMessages(transformedMessages);
      setLoading(false);
    } catch (error) {
      console.error('Mesajlar yüklenemedi:', error);
      setLoading(false);
    }
  };

  const fetchTrashedMessages = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/contact/?deleted=true');
      const data = await response.json();

      // Handle both array and paginated response
      const dataArray = Array.isArray(data) ? data : (data.results || []);

      // Transform backend data to frontend format
      const transformedMessages = dataArray.map(msg => ({
        id: msg.id,
        name: msg.name,
        email: msg.email,
        phone: msg.phone || 'Belirtilmemiş',
        subject: msg.subject,
        message: msg.message,
        status: msg.status || 'new',
        createdAt: msg.created_at,
        deletedAt: msg.deleted_at,
        type: 'genel'
      }));

      setTrashedMessages(transformedMessages);
    } catch (error) {
      console.error('Çöp kutusu yüklenemedi:', error);
    }
  };

  const filterMessages = () => {
    const sourceMessages = activeTab === 'trash' ? trashedMessages : messages;
    let filtered = sourceMessages;

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(msg => msg.status === statusFilter);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(msg =>
        msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredMessages(filtered);
  };

  const updateMessageStatus = async (id, newStatus) => {
    try {
      // Update in backend if marking as read
      if (newStatus === 'read') {
        await api.contact.markRead(id);
      }

      // Update in frontend
      setMessages(prev =>
        prev.map(msg => msg.id === id ? { ...msg, status: newStatus } : msg)
      );
      if (selectedMessage?.id === id) {
        setSelectedMessage(prev => ({ ...prev, status: newStatus }));
      }
    } catch (error) {
      console.error('Mesaj durumu güncellenemedi:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bu mesaj çöp kutusuna taşınacak. Emin misiniz?')) {
      try {
        // Soft delete - move to trash
        await fetch(`http://localhost:8000/api/contact/${id}/`, {
          method: 'DELETE',
        });

        // Remove from messages and refresh
        setMessages(prev => prev.filter(msg => msg.id !== id));
        fetchTrashedMessages();

        if (selectedMessage?.id === id) {
          setSelectedMessage(null);
        }
      } catch (error) {
        console.error('Mesaj silinemedi:', error);
        alert('Mesaj silinirken bir hata oluştu.');
      }
    }
  };

  const handleRestore = async (id) => {
    try {
      await fetch(`http://localhost:8000/api/contact/${id}/restore/`, {
        method: 'PATCH',
      });

      // Remove from trash and refresh messages
      setTrashedMessages(prev => prev.filter(msg => msg.id !== id));
      fetchMessages();

      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }
    } catch (error) {
      console.error('Mesaj geri yüklenemedi:', error);
      alert('Mesaj geri yüklenirken bir hata oluştu.');
    }
  };

  const handlePermanentDelete = async (id) => {
    if (window.confirm('Bu mesaj kalıcı olarak silinecek ve geri alınamayacak. Emin misiniz?')) {
      try {
        await fetch(`http://localhost:8000/api/contact/${id}/permanent_delete/`, {
          method: 'DELETE',
        });

        setTrashedMessages(prev => prev.filter(msg => msg.id !== id));

        if (selectedMessage?.id === id) {
          setSelectedMessage(null);
        }
      } catch (error) {
        console.error('Mesaj kalıcı olarak silinemedi:', error);
        alert('Mesaj silinirken bir hata oluştu.');
      }
    }
  };

  const handleViewMessage = (message) => {
    setSelectedMessage(message);
    if (message.status === 'new') {
      updateMessageStatus(message.id, 'read');
    }
  };

  const statusColors = {
    new: { bg: 'bg-green-100', text: 'text-green-700', label: 'Yeni', icon: FaEnvelope },
    read: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Okundu', icon: FaEnvelopeOpen },
    replied: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Yanıtlandı', icon: FaCheckCircle },
  };

  const typeColors = {
    randevu: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Randevu' },
    genel: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Genel' },
    acil: { bg: 'bg-red-100', text: 'text-red-700', label: 'Acil' },
  };

  const stats = {
    total: messages.length,
    new: messages.filter(m => m.status === 'new').length,
    read: messages.filter(m => m.status === 'read').length,
    replied: messages.filter(m => m.status === 'replied').length,
    trashed: trashedMessages.length,
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
      {/* Tab Navigation */}
      <div className="flex gap-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('messages')}
          className={`px-6 py-3 font-bold text-lg border-b-2 transition-colors ${
            activeTab === 'messages'
              ? 'border-purple-600 text-purple-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <FaEnvelope className="inline mr-2" />
          Mesajlar
        </button>
        <button
          onClick={() => setActiveTab('trash')}
          className={`px-6 py-3 font-bold text-lg border-b-2 transition-colors ${
            activeTab === 'trash'
              ? 'border-red-600 text-red-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <FaTrashAlt className="inline mr-2" />
          Çöp Kutusu ({stats.trashed})
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm mb-1">Toplam</p>
              <p className="text-3xl font-bold">{stats.total}</p>
            </div>
            <FaEnvelope className="text-5xl text-white/20" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm mb-1">Yeni</p>
              <p className="text-3xl font-bold">{stats.new}</p>
            </div>
            <FaEnvelope className="text-5xl text-white/20" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-gray-500 to-gray-600 rounded-2xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-100 text-sm mb-1">Okundu</p>
              <p className="text-3xl font-bold">{stats.read}</p>
            </div>
            <FaEnvelopeOpen className="text-5xl text-white/20" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm mb-1">Yanıtlandı</p>
              <p className="text-3xl font-bold">{stats.replied}</p>
            </div>
            <FaCheckCircle className="text-5xl text-white/20" />
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
      >
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="İsim, e-posta, konu veya mesaj ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <FaFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-12 pr-8 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none appearance-none bg-white cursor-pointer min-w-[200px]"
            >
              <option value="all">Tüm Durumlar</option>
              <option value="new">Yeni</option>
              <option value="read">Okundu</option>
              <option value="replied">Yanıtlandı</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Messages List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-100"
      >
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <FaEnvelope className="text-purple-600" />
            Mesajlar ({filteredMessages.length})
          </h2>
        </div>

        <div className="divide-y divide-gray-100">
          {filteredMessages.length > 0 ? (
            filteredMessages.map((message) => {
              const StatusIcon = statusColors[message.status].icon;
              return (
                <div
                  key={message.id}
                  className={`p-6 hover:bg-gray-50 transition-colors cursor-pointer ${
                    message.status === 'new' ? 'bg-green-50/30' : ''
                  }`}
                  onClick={() => handleViewMessage(message)}
                >
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                      {message.name.charAt(0).toUpperCase()}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-gray-900">{message.name}</h3>
                            <span className={`px-2 py-0.5 ${statusColors[message.status].bg} ${statusColors[message.status].text} rounded-full text-xs font-bold flex items-center gap-1`}>
                              <StatusIcon size={10} />
                              {statusColors[message.status].label}
                            </span>
                            <span className={`px-2 py-0.5 ${typeColors[message.type].bg} ${typeColors[message.type].text} rounded-full text-xs font-bold`}>
                              {typeColors[message.type].label}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{message.email}</p>
                        </div>
                        <div className="text-xs text-gray-500 flex items-center gap-1 ml-4">
                          <FaClock size={10} />
                          {new Date(message.createdAt).toLocaleDateString('tr-TR')} {new Date(message.createdAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>

                      <h4 className="font-bold text-gray-900 mb-2">{message.subject}</h4>
                      <p className="text-gray-600 line-clamp-2 text-sm">{message.message}</p>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 mt-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewMessage(message);
                          }}
                          className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 font-semibold rounded-lg hover:bg-purple-200 transition-colors text-sm"
                        >
                          <FaEye size={12} />
                          Görüntüle
                        </button>
                        {activeTab === 'messages' ? (
                          <>
                            <a
                              href={`mailto:${message.email}?subject=Re: ${message.subject}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                updateMessageStatus(message.id, 'replied');
                              }}
                              className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 font-semibold rounded-lg hover:bg-blue-200 transition-colors text-sm"
                            >
                              <FaReply size={12} />
                              Yanıtla
                            </a>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(message.id);
                              }}
                              className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 font-semibold rounded-lg hover:bg-red-200 transition-colors text-sm"
                            >
                              <FaTrash size={12} />
                              Çöp Kutusuna Taşı
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRestore(message.id);
                              }}
                              className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 font-semibold rounded-lg hover:bg-green-200 transition-colors text-sm"
                            >
                              <FaTrashRestore size={12} />
                              Geri Yükle
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePermanentDelete(message.id);
                              }}
                              className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 font-semibold rounded-lg hover:bg-red-200 transition-colors text-sm"
                            >
                              <FaTrash size={12} />
                              Kalıcı Sil
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 text-gray-500">
              <FaEnvelope className="text-5xl mx-auto mb-3 opacity-30" />
              <p className="font-medium">Mesaj bulunamadı</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Message Detail Modal */}
      {selectedMessage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedMessage(null)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {selectedMessage.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{selectedMessage.name}</h3>
                  <p className="text-sm text-gray-600">{selectedMessage.email}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedMessage(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaTimes className="text-gray-600" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status and Type Badges */}
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 ${statusColors[selectedMessage.status].bg} ${statusColors[selectedMessage.status].text} rounded-full text-sm font-bold`}>
                  {statusColors[selectedMessage.status].label}
                </span>
                <span className={`px-3 py-1 ${typeColors[selectedMessage.type].bg} ${typeColors[selectedMessage.type].text} rounded-full text-sm font-bold`}>
                  {typeColors[selectedMessage.type].label}
                </span>
                <span className="text-sm text-gray-500 ml-auto">
                  {new Date(selectedMessage.createdAt).toLocaleDateString('tr-TR')} {new Date(selectedMessage.createdAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              {/* Subject */}
              <div>
                <p className="text-sm text-gray-600 mb-1">Konu</p>
                <h4 className="text-xl font-bold text-gray-900">{selectedMessage.subject}</h4>
              </div>

              {/* Message */}
              <div className="bg-gray-50 rounded-xl p-6">
                <p className="text-gray-700 whitespace-pre-wrap">{selectedMessage.message}</p>
              </div>

              {/* Contact Info */}
              <div className="bg-blue-50 rounded-xl p-6">
                <h4 className="font-bold text-gray-900 mb-3">İletişim Bilgileri</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-700">
                    <FaEnvelope className="text-blue-600" />
                    <a href={`mailto:${selectedMessage.email}`} className="hover:text-blue-600">
                      {selectedMessage.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <FaPhone className="text-blue-600" />
                    <a href={`tel:${selectedMessage.phone}`} className="hover:text-blue-600">
                      {selectedMessage.phone}
                    </a>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                {activeTab === 'messages' ? (
                  <>
                    <a
                      href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                      onClick={() => {
                        updateMessageStatus(selectedMessage.id, 'replied');
                        setSelectedMessage(null);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-xl hover:shadow-lg transition-all"
                    >
                      <FaReply />
                      E-posta ile Yanıtla
                    </a>
                    <button
                      onClick={() => {
                        handleDelete(selectedMessage.id);
                      }}
                      className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
                    >
                      <FaTrash />
                      Çöp Kutusu
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        handleRestore(selectedMessage.id);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-bold rounded-xl hover:shadow-lg transition-all"
                    >
                      <FaTrashRestore />
                      Geri Yükle
                    </button>
                    <button
                      onClick={() => {
                        handlePermanentDelete(selectedMessage.id);
                      }}
                      className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
                    >
                      <FaTrash />
                      Kalıcı Sil
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default MessagesPage;
