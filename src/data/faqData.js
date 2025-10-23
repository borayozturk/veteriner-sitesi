// Generate FAQ data with dynamic settings
export const generateFaqData = (settings = {}) => {
  const phone = settings.contact_phone || '(0212) 123 45 67';
  const phoneLink = settings.contact_phone_link || '+902121234567';
  const whatsapp = settings.contact_whatsapp || '+905001234567';
  const email = settings.contact_email || 'info@veteriner.com';

  return {
    // Quick replies - First suggestions
    quickReplies: [
      { text: '📅 Randevu Al', action: 'randevu' },
      { text: '💉 Aşı Bilgisi', action: 'asi' },
      { text: '🚑 Acil Durum', action: 'acil' },
      { text: '💰 Fiyat Bilgisi', action: 'fiyat' },
      { text: '📞 İletişim', action: 'iletisim' },
      { text: '🏥 Hizmetlerimiz', action: 'hizmet' },
    ],

  // Smart suggestions based on context
  smartSuggestions: {
    firstMessage: [
      { text: 'Randevu almak istiyorum', action: 'randevu' },
      { text: 'Acil durumum var', action: 'acil' },
      { text: 'Fiyat öğrenmek istiyorum', action: 'fiyat' },
    ],
    afterService: [
      { text: 'Başka hizmet var mı?', action: 'hizmet' },
      { text: 'Randevu almak istiyorum', action: 'randevu' },
      { text: 'Fiyat bilgisi alabilir miyim?', action: 'fiyat' },
    ],
    afterPrice: [
      { text: 'Randevu alalım', action: 'randevu' },
      { text: 'Başka ne hizmetiniz var?', action: 'hizmet' },
      { text: 'İletişime geçmek istiyorum', action: 'iletisim' },
    ],
  },

  // Keywords and responses
  keywords: {
    // Randevu
    randevu: {
      keywords: ['randevu', 'appointment', 'ziyaret', 'görüşme', 'muayene'],
      response: {
        message: 'Randevu almak için aşağıdaki seçeneklerden birini kullanabilirsiniz:',
        options: [
          { text: '📅 Online Randevu Al', link: '/randevu', type: 'link' },
          { text: `📞 Telefon: ${phone}`, link: `tel:${phoneLink}`, type: 'link' },
        ],
      },
    },

    // Aşı
    asi: {
      keywords: ['aşı', 'vaccine', 'aşılama', 'karma', 'kuduz'],
      response: {
        message: 'Aşılama hizmetlerimiz hakkında bilgi:',
        options: [
          { text: '💉 Aşılama Hizmeti Detayları', link: '/service/asilar-ve-asilamalar', type: 'link' },
          { text: '📅 Aşı Randevusu Al', link: '/randevu', type: 'link' },
          { text: '📚 Aşılama Hakkında Blog', link: '/blog/kopeklerde-asilama-ne-zaman-hangi-asilar', type: 'link' },
        ],
      },
    },

    // Acil
    acil: {
      keywords: ['acil', 'emergency', 'hasta', 'kötü', 'yardım', 'ölüyor', 'ağrı'],
      response: {
        message: '🚨 Acil durumlar için hemen bizimle iletişime geçin:',
        options: [
          { text: `📞 Acil Hat: ${phone}`, link: `tel:${phoneLink}`, type: 'link' },
          { text: '🏥 7/24 Acil Servis', link: '/hizmetler', type: 'link' },
        ],
        urgent: true,
      },
    },

    // Kısırlaştırma
    kisir: {
      keywords: ['kısır', 'kısırlaştırma', 'sterilizasyon', 'kastrasyon'],
      response: {
        message: 'Kısırlaştırma işlemi hakkında:',
        options: [
          { text: '✂️ Kısırlaştırma Hizmeti', link: '/service/kisirlaştirma-cerrahi-operasyonlar', type: 'link' },
          { text: '📅 Randevu Al', link: '/randevu', type: 'link' },
        ],
      },
    },

    // Diş
    dis: {
      keywords: ['diş', 'dental', 'ağız', 'diş taşı', 'koku'],
      response: {
        message: 'Diş sağlığı hizmetlerimiz:',
        options: [
          { text: '🦷 Diş Bakım Hizmeti', link: '/service/dis-bakim-ve-temizligi', type: 'link' },
          { text: '📚 Diş Sağlığı Blog', link: '/blog/evcil-hayvanlarda-dis-sagligi', type: 'link' },
        ],
      },
    },

    // Fiyat
    fiyat: {
      keywords: ['fiyat', 'ücret', 'price', 'ne kadar', 'kaça'],
      response: {
        message: 'Fiyat bilgisi için:',
        options: [
          { text: `📞 Fiyat Bilgisi: ${phone}`, link: `tel:${phoneLink}`, type: 'link' },
          { text: '💬 WhatsApp İletişim', link: `https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`, type: 'link' },
          { text: '🏥 Hizmetlerimiz', link: '/hizmetler', type: 'link' },
        ],
      },
    },

    // Beslenme
    beslenme: {
      keywords: ['mama', 'yemek', 'beslenme', 'diet', 'kilo'],
      response: {
        message: 'Beslenme ve diyet hakkında:',
        options: [
          { text: '🍖 Beslenme Danışmanlığı', link: '/service/beslenme-danismanligi', type: 'link' },
          { text: '📚 Yavru Beslenmesi Blog', link: '/blog/yavru-kopek-beslenmesi-ilk-adimlar', type: 'link' },
        ],
      },
    },

    // Tüy bakımı
    tuy: {
      keywords: ['tüy', 'tıraş', 'grooming', 'bakım', 'banyo'],
      response: {
        message: 'Tüy bakımı hizmetlerimiz:',
        options: [
          { text: '✂️ Tüy Bakımı Hizmeti', link: '/service/tuy-ve-tirnak-bakimi', type: 'link' },
          { text: '📚 Tüy Bakımı Blog', link: '/blog/kedilerde-tuy-bakimi-ve-onemi', type: 'link' },
        ],
      },
    },

    // Laboratuvar
    lab: {
      keywords: ['test', 'tahlil', 'laboratuvar', 'kan', 'analiz'],
      response: {
        message: 'Laboratuvar hizmetlerimiz:',
        options: [
          { text: '🔬 Laboratuvar Hizmetleri', link: '/service/laboratuvar-hizmetleri', type: 'link' },
          { text: '📅 Test Randevusu', link: '/randevu', type: 'link' },
        ],
      },
    },

    // Parazit
    parazit: {
      keywords: ['pire', 'kene', 'kurt', 'parazit', 'iç parazit'],
      response: {
        message: 'Parazit koruması hakkında:',
        options: [
          { text: '🛡️ Parazit Koruması', link: '/service/parazit-kontrolu-ilaclama', type: 'link' },
          { text: '📚 Parazit Koruması Blog', link: '/blog/kedi-kopeklerde-parazit-korumasi', type: 'link' },
        ],
      },
    },

    // Yaşlı hayvan
    yasli: {
      keywords: ['yaşlı', 'ihtiyar', 'senior', 'geriatri'],
      response: {
        message: 'Yaşlı hayvan bakımı:',
        options: [
          { text: '👴 Geriatri Bakım', link: '/service/geriatri-yasli-hayvan-bakimi', type: 'link' },
          { text: '📚 Yaşlı Hayvan Bakımı Blog', link: '/blog/yasli-kedi-kopek-bakimi', type: 'link' },
        ],
      },
    },

    // Saat / Çalışma saatleri
    saat: {
      keywords: ['saat', 'çalışma', 'açık', 'kapalı', 'mesai'],
      response: {
        message: '🕐 Çalışma Saatlerimiz:',
        text: '7/24 hizmet veriyoruz! Acil durumlar dahil her zaman bizimle iletişime geçebilirsiniz.',
        options: [
          { text: '📞 Şimdi Ara', link: 'tel:+902121234567', type: 'link' },
          { text: '🏥 Hakkımızda', link: '/hakkimizda', type: 'link' },
        ],
      },
    },

    // Adres / Konum
    adres: {
      keywords: ['adres', 'konum', 'nerede', 'location', 'yol'],
      response: {
        message: '📍 Klinik Adresimiz:',
        text: 'İstanbul, Türkiye',
        options: [
          { text: '🗺️ Haritada Göster', link: 'https://maps.google.com', type: 'link' },
          { text: '📞 Yol Tarifi İçin Ara', link: 'tel:+902121234567', type: 'link' },
        ],
      },
    },

    // Blog
    blog: {
      keywords: ['blog', 'makale', 'yazı', 'bilgi', 'öğren'],
      response: {
        message: '📚 Blog yazılarımız:',
        options: [
          { text: '📖 Tüm Blog Yazıları', link: '/blog', type: 'link' },
          { text: '🏷️ Konulara Göre Gözat', link: '/blog', type: 'link' },
        ],
      },
    },

    // Hizmetler
    hizmet: {
      keywords: ['hizmet', 'service', 'ne yapıyor', 'neler var'],
      response: {
        message: '🏥 Hizmetlerimiz:',
        options: [
          { text: '📋 Tüm Hizmetler', link: '/hizmetler', type: 'link' },
          { text: '📅 Randevu Al', link: '/randevu', type: 'link' },
        ],
      },
    },

    // İletişim
    iletisim: {
      keywords: ['iletişim', 'contact', 'ulaş', 'telefon'],
      response: {
        message: 'Bizimle iletişime geçmek için:',
        options: [
          { text: `📞 Telefon: ${phone}`, link: `tel:${phoneLink}`, type: 'link' },
          { text: '💬 WhatsApp', link: `https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`, type: 'link' },
          { text: `📧 E-posta: ${email}`, link: `mailto:${email}`, type: 'link' },
          { text: '📧 İletişim Formu', link: '/iletisim', type: 'link' },
        ],
      },
    },

    // Merhaba / Selam
    selam: {
      keywords: ['merhaba', 'selam', 'hey', 'hi', 'hello'],
      response: {
        message: '👋 Merhaba! Veteriner Kliniğine hoş geldiniz. Size nasıl yardımcı olabilirim?',
        options: [
          { text: '📅 Randevu Al', action: 'randevu' },
          { text: '💉 Aşı Bilgisi', action: 'asi' },
          { text: '🏥 Hizmetler', link: '/hizmetler', type: 'link' },
        ],
      },
    },

    // Default / Anlaşılmadı
    default: {
      keywords: [],
      response: {
        message: '🤔 Aradığınızı bulamadım. Size şu konularda yardımcı olabilirim:',
        options: [
          { text: '📅 Randevu Alma', action: 'randevu' },
          { text: '💉 Aşı Bilgileri', action: 'asi' },
          { text: '🏥 Tüm Hizmetler', link: '/hizmetler', type: 'link' },
          { text: '📞 İletişim', link: 'tel:+902121234567', type: 'link' },
        ],
      },
    },
  },
  };
};

// Default export with static data for backwards compatibility
export const faqData = generateFaqData();

// Helper function to find matching keyword
export const findMatchingKeyword = (userMessage, settings = {}) => {
  const faqData = generateFaqData(settings);
  const message = userMessage.toLowerCase().trim();

  // Check each keyword category
  for (const [key, data] of Object.entries(faqData.keywords)) {
    if (key === 'default') continue;

    const matched = data.keywords.some(keyword =>
      message.includes(keyword.toLowerCase())
    );

    if (matched) {
      return data.response;
    }
  }

  // Return default response
  return faqData.keywords.default.response;
};
