import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowUp } from 'react-icons/fa';

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled down
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  // Scroll to top smoothly
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.8 }}
          whileHover={{ scale: 1.1, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={scrollToTop}
          className="fixed bottom-24 right-6 z-40 group"
          aria-label="Yukarı çık"
        >
          {/* Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />

          {/* Main Button */}
          <div className="relative w-14 h-14 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full shadow-2xl flex items-center justify-center">
            {/* Icon */}
            <FaArrowUp className="text-white text-xl group-hover:scale-110 transition-transform" />

            {/* Progress Ring (optional - shows scroll progress) */}
            <svg
              className="absolute inset-0 w-full h-full -rotate-90"
              viewBox="0 0 56 56"
            >
              <circle
                cx="28"
                cy="28"
                r="26"
                stroke="rgba(255, 255, 255, 0.2)"
                strokeWidth="2"
                fill="none"
              />
              <motion.circle
                cx="28"
                cy="28"
                r="26"
                stroke="rgba(255, 255, 255, 0.8)"
                strokeWidth="2"
                fill="none"
                strokeDasharray={2 * Math.PI * 26}
                strokeDashoffset={
                  2 * Math.PI * 26 * (1 - window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight))
                }
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <div className="bg-gray-900 text-white text-xs font-semibold px-3 py-2 rounded-lg whitespace-nowrap">
              Yukarı Çık
            </div>
            <div className="absolute top-full right-4 transform -translate-y-1 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTopButton;
