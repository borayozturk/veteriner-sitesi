import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaWhatsapp, FaTimes } from 'react-icons/fa';

const WhatsAppButton = () => {
  const [whatsappNumber, setWhatsappNumber] = useState('+905001234567');
  const [isVisible, setIsVisible] = useState(true);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    // Fetch WhatsApp number from site settings
    const fetchSettings = async () => {
      try {
        const response = await fetch(import.meta.env.VITE_API_URL + '/api/site-settings/get_settings/');
        if (response.ok) {
          const data = await response.json();
          if (data.contact_whatsapp) {
            setWhatsappNumber(data.contact_whatsapp);
          }
        }
      } catch (error) {
        console.error('WhatsApp settings fetch error:', error);
      }
    };
    fetchSettings();

    // Show tooltip after 2 seconds for first-time users
    const timer = setTimeout(() => {
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 5000);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleWhatsAppClick = () => {
    // Clean the number (remove spaces, dashes, parentheses)
    const cleanNumber = whatsappNumber.replace(/[\s\-\(\)]/g, '');
    // Open WhatsApp with pre-filled message
    const message = encodeURIComponent('Merhaba! Web sitenizden ulaşıyorum. Bilgi almak istiyorum.');
    window.open(`https://wa.me/${cleanNumber}?text=${message}`, '_blank');
  };

  if (!isVisible) return null;

  return (
    <>
      {/* WhatsApp Floating Button */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: 'spring', stiffness: 260, damping: 20 }}
        className="fixed bottom-6 left-6 z-50"
      >
        {/* Tooltip */}
        <AnimatePresence>
          {showTooltip && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="absolute bottom-full left-0 mb-3 ml-2"
            >
              <div className="bg-white rounded-2xl shadow-2xl px-4 py-3 max-w-xs border border-gray-200">
                <button
                  onClick={() => setShowTooltip(false)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-gray-800 text-white rounded-full flex items-center justify-center hover:bg-gray-900 transition-colors"
                >
                  <FaTimes size={12} />
                </button>
                <p className="text-sm font-semibold text-gray-900 mb-1">
                  💬 Sorularınız mı var?
                </p>
                <p className="text-xs text-gray-600">
                  WhatsApp'tan bize ulaşın!
                </p>
              </div>
              {/* Arrow */}
              <div className="absolute bottom-0 left-6 transform translate-y-1/2 rotate-45 w-3 h-3 bg-white border-r border-b border-gray-200"></div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main WhatsApp Button */}
        <motion.button
          onClick={handleWhatsAppClick}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="group relative w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full shadow-2xl hover:shadow-green-500/50 transition-all duration-300 flex items-center justify-center overflow-hidden"
        >
          {/* Animated Background Pulse */}
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.5, 0, 0.5]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute inset-0 bg-green-400 rounded-full"
          />

          {/* Icon */}
          <FaWhatsapp className="relative z-10 text-white text-3xl group-hover:scale-110 transition-transform" />

          {/* Notification Badge (optional - you can add unread count here) */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center border-2 border-white"
          >
            <span className="text-white text-xs font-bold">!</span>
          </motion.div>
        </motion.button>

        {/* Hover Text */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileHover={{ opacity: 1, scale: 1 }}
          className="absolute bottom-full right-0 mb-2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <div className="bg-gray-900 text-white text-xs font-semibold px-3 py-2 rounded-lg whitespace-nowrap">
            WhatsApp ile İletişime Geç
          </div>
          <div className="absolute top-full right-4 transform -translate-y-1 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </motion.div>
      </motion.div>
    </>
  );
};

export default WhatsAppButton;
