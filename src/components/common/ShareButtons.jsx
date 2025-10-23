import { motion } from 'framer-motion';
import { FaFacebook, FaTwitter, FaWhatsapp, FaLinkedin, FaLink, FaEnvelope } from 'react-icons/fa';
import { useState } from 'react';

const ShareButtons = ({ url, title, description }) => {
  const [copied, setCopied] = useState(false);

  // Encode for URLs
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description || title);

  // Share URLs
  const shareUrls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`,
  };

  // Copy link to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Handle share click
  const handleShare = (platform) => {
    window.open(shareUrls[platform], '_blank', 'width=600,height=400');
  };

  const shareButtons = [
    {
      name: 'Facebook',
      icon: FaFacebook,
      color: 'from-blue-600 to-blue-700',
      hoverColor: 'hover:from-blue-700 hover:to-blue-800',
      action: () => handleShare('facebook'),
    },
    {
      name: 'Twitter',
      icon: FaTwitter,
      color: 'from-sky-500 to-sky-600',
      hoverColor: 'hover:from-sky-600 hover:to-sky-700',
      action: () => handleShare('twitter'),
    },
    {
      name: 'WhatsApp',
      icon: FaWhatsapp,
      color: 'from-green-500 to-green-600',
      hoverColor: 'hover:from-green-600 hover:to-green-700',
      action: () => handleShare('whatsapp'),
    },
    {
      name: 'LinkedIn',
      icon: FaLinkedin,
      color: 'from-blue-700 to-blue-800',
      hoverColor: 'hover:from-blue-800 hover:to-blue-900',
      action: () => handleShare('linkedin'),
    },
    {
      name: 'E-posta',
      icon: FaEnvelope,
      color: 'from-gray-600 to-gray-700',
      hoverColor: 'hover:from-gray-700 hover:to-gray-800',
      action: () => handleShare('email'),
    },
    {
      name: copied ? 'Kopyalandı!' : 'Linki Kopyala',
      icon: FaLink,
      color: copied ? 'from-green-500 to-green-600' : 'from-purple-600 to-pink-600',
      hoverColor: copied ? 'hover:from-green-600 hover:to-green-700' : 'hover:from-purple-700 hover:to-pink-700',
      action: copyToClipboard,
    },
  ];

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
          <span className="text-white text-lg">🔗</span>
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">Paylaş</h3>
          <p className="text-xs text-gray-500">Bu yazıyı arkadaşlarınla paylaş</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {shareButtons.map((button, index) => (
          <motion.button
            key={button.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={button.action}
            className={`
              flex items-center justify-center gap-2 px-4 py-3
              bg-gradient-to-r ${button.color} ${button.hoverColor}
              text-white rounded-xl font-semibold text-sm
              shadow-lg hover:shadow-xl transition-all
              ${copied && button.name === 'Kopyalandı!' ? 'ring-2 ring-green-300' : ''}
            `}
          >
            <button.icon className="text-lg" />
            <span className="hidden sm:inline">{button.name}</span>
          </motion.button>
        ))}
      </div>

      {/* Statistics (Optional) */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          💡 Bu yazıyı paylaşarak bilgiyi yayın!
        </p>
      </div>
    </div>
  );
};

export default ShareButtons;
