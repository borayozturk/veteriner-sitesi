import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaPaperPlane, FaRobot, FaStar, FaPhone, FaCalendarAlt, FaSync } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { generateFaqData, findMatchingKeyword } from '../../data/faqData';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      message: 'Merhaba! 👋 Veteriner Asistanınızım.',
      text: 'Size nasıl yardımcı olabilirim?',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [siteSettings, setSiteSettings] = useState({});
  const [faqData, setFaqData] = useState(generateFaqData());
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  // Fetch site settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/site-settings/get_settings/');
        if (response.ok) {
          const data = await response.json();
          setSiteSettings(data);
          setFaqData(generateFaqData(data));
        }
      } catch (error) {
        console.error('Settings fetch error:', error);
      }
    };
    fetchSettings();
  }, []);

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Handle quick reply
  const handleQuickReply = (action) => {
    const response = faqData.keywords[action]?.response;
    if (response) {
      handleUserMessage(action, response);
    }
  };

  // Handle user message
  const handleUserMessage = (userText, forcedResponse = null) => {
    const userMessage = {
      id: Date.now(),
      type: 'user',
      message: userText,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const response = forcedResponse || findMatchingKeyword(userText, siteSettings);

      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        message: response.message,
        text: response.text,
        options: response.options,
        urgent: response.urgent,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
    }, 800);
  };

  // Handle send
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      handleUserMessage(inputMessage);
    }
  };

  // Handle option click
  const handleOptionClick = (option) => {
    if (option.type === 'link') {
      if (option.link.startsWith('http') || option.link.startsWith('tel:') || option.link.startsWith('https://wa.me')) {
        window.open(option.link, '_blank');
      } else {
        setIsOpen(false);
        navigate(option.link);
      }
    } else if (option.action) {
      handleQuickReply(option.action);
    }
  };

  // Reset conversation
  const handleReset = () => {
    setMessages([
      {
        id: 1,
        type: 'bot',
        message: 'Merhaba! 👋 Veteriner Asistanınızım.',
        text: 'Size nasıl yardımcı olabilirim?',
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <>
      {/* Floating Chat Button - Modern 2025 Design */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 group"
          >
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity animate-pulse" />

            {/* Main Button */}
            <div className="relative w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full shadow-2xl flex items-center justify-center">
              <FaRobot className="text-white text-2xl" />

              {/* Star Animation */}
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="absolute -top-1 -right-1"
              >
                <FaStar className="text-yellow-300 text-sm" />
              </motion.div>

              {/* Active Indicator */}
              <span className="absolute -top-1 -left-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse" />
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window - Modern Glassmorphism Design */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 right-0 md:bottom-6 md:right-6 z-50 w-full h-full md:w-[420px] md:h-[650px] bg-white/95 backdrop-blur-xl md:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-gray-200/50"
          >
            {/* Header - Gradient with Animated Background */}
            <div className="relative bg-gradient-to-br from-purple-600 via-pink-600 to-purple-700 p-5 text-white overflow-hidden">
              {/* Animated Background Shapes */}
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 90, 0],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"
              />
              <motion.div
                animate={{
                  scale: [1.2, 1, 1.2],
                  rotate: [90, 0, 90],
                }}
                transition={{
                  duration: 15,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24"
              />

              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Avatar with Animation */}
                    <div className="relative">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center ring-2 ring-white/30">
                        <FaRobot size={22} />
                      </div>
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">AI Asistan</h3>
                      <p className="text-xs text-white/80 flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        Aktif ve Hazır
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    {messages.length > 1 && (
                      <button
                        onClick={handleReset}
                        className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center transition-all"
                        title="Yeni Sohbet"
                      >
                        <FaSync size={14} />
                      </button>
                    )}
                    <button
                      onClick={() => setIsOpen(false)}
                      className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center transition-all"
                    >
                      <FaTimes size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Messages Area - Modern Styling */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-br from-gray-50 to-gray-100/50">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                  className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] ${
                      msg.type === 'user'
                        ? 'bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-3xl rounded-br-md shadow-lg shadow-purple-500/20'
                        : msg.urgent
                        ? 'bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-300 text-gray-800 rounded-3xl rounded-bl-md'
                        : 'bg-white text-gray-800 rounded-3xl rounded-bl-md shadow-lg border border-gray-100'
                    } px-5 py-3.5`}
                  >
                    <p className="text-sm font-medium leading-relaxed">{msg.message}</p>

                    {msg.text && (
                      <p className="text-sm mt-2 opacity-90">{msg.text}</p>
                    )}

                    {/* Options - Modern Button Style */}
                    {msg.options && (
                      <div className="mt-4 space-y-2">
                        {msg.options.map((option, index) => (
                          <motion.button
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.02, x: 4 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleOptionClick(option)}
                            className={`w-full text-left px-4 py-3 rounded-2xl text-sm font-semibold transition-all flex items-center gap-2 ${
                              msg.urgent
                                ? 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 shadow-lg shadow-red-500/30'
                                : 'bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 hover:from-purple-100 hover:to-pink-100 border border-purple-200'
                            }`}
                          >
                            {option.text.includes('Randevu') && <FaCalendarAlt size={14} />}
                            {option.text.includes('Ara') && <FaPhone size={14} />}
                            <span className="flex-1">{option.text}</span>
                            <span className="text-xs opacity-50">→</span>
                          </motion.button>
                        ))}
                      </div>
                    )}

                    <p className="text-xs opacity-50 mt-2">
                      {msg.timestamp.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </motion.div>
              ))}

              {/* Typing Indicator - Animated */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-white rounded-3xl rounded-bl-md px-5 py-3.5 shadow-lg border border-gray-100">
                    <div className="flex gap-1.5">
                      <motion.span
                        animate={{ y: [0, -6, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity }}
                        className="w-2.5 h-2.5 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full"
                      />
                      <motion.span
                        animate={{ y: [0, -6, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                        className="w-2.5 h-2.5 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full"
                      />
                      <motion.span
                        animate={{ y: [0, -6, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                        className="w-2.5 h-2.5 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies - Modern Pill Design */}
            {messages.length === 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="p-4 bg-white border-t border-gray-200"
              >
                <p className="text-xs text-gray-500 mb-3 font-semibold flex items-center gap-2">
                  <FaStar className="text-purple-500" />
                  Hızlı Seçenekler
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {faqData.quickReplies.map((reply, index) => (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 * index }}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleQuickReply(reply.action)}
                      className="px-4 py-3 bg-gradient-to-br from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 text-purple-700 rounded-2xl text-xs font-semibold transition-all shadow-sm border border-purple-200/50"
                    >
                      {reply.text}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Input Area - Modern Glassmorphism */}
            <div className="p-4 bg-white/80 backdrop-blur-xl border-t border-gray-200">
              <form onSubmit={handleSendMessage} className="flex gap-3">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Mesajınızı yazın..."
                  className="flex-1 px-5 py-3.5 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm font-medium placeholder:text-gray-400"
                />
                <motion.button
                  type="submit"
                  disabled={!inputMessage.trim()}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-full flex items-center justify-center hover:shadow-lg hover:shadow-purple-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <FaPaperPlane size={16} />
                </motion.button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot;
