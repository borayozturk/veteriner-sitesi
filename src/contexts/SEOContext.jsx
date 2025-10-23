import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const SEOContext = createContext();

export const useSEO = () => {
  const context = useContext(SEOContext);
  if (!context) {
    throw new Error('useSEO must be used within SEOProvider');
  }
  return context;
};

export const SEOProvider = ({ children }) => {
  const [seoSettings, setSeoSettings] = useState({
    homepage: {
      title: 'İstanbul\'da 7/24 Profesyonel Veteriner Hizmeti',
      description: 'İstanbul\'un en güvenilir veteriner kliniği. Acil veteriner hizmeti, uzman kadro, modern ekipman ile evcil dostlarınıza 7/24 profesyonel sağlık hizmeti sunuyoruz.',
      keywords: 'veteriner, veteriner kliniği, acil veteriner, 7/24 veteriner, İstanbul veteriner',
      ogImage: '/og-image.jpg',
      canonical: 'https://example.com/'
    },
    services: {
      title: 'Veteriner Hizmetlerimiz',
      description: 'Veteriner hizmetlerimiz',
      keywords: 'veteriner hizmetleri',
      ogImage: '/og-services.jpg',
      canonical: 'https://example.com/hizmetler'
    },
    about: {
      title: 'Hakkımızda',
      description: 'Hakkımızda',
      keywords: 'veteriner hakkında',
      ogImage: '/og-about.jpg',
      canonical: 'https://example.com/hakkimizda'
    },
    contact: {
      title: 'İletişim',
      description: 'İletişim',
      keywords: 'veteriner iletişim',
      ogImage: '/og-contact.jpg',
      canonical: 'https://example.com/iletisim'
    },
    blog: {
      title: 'Blog Yazılarımız',
      description: 'Blog yazıları',
      keywords: 'veteriner blog',
      ogImage: '/og-blog.jpg',
      canonical: 'https://example.com/blog'
    },
    global: {
      siteName: 'Veteriner Kliniği',
      twitterHandle: '@veteriner'
    }
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSEOSettings();
  }, []);

  const loadSEOSettings = async () => {
    try {
      console.log('⏳ Loading SEO settings from API...');
      const response = await fetch('http://localhost:8000/api/seo-settings/all_settings/');
      if (response.ok) {
        const data = await response.json();
        console.log('✅ SEO Settings loaded successfully:', data);
        setSeoSettings(data);
      } else {
        console.error('❌ Failed to fetch SEO settings, status:', response.status);
      }
    } catch (error) {
      console.error('❌ Error loading SEO settings:', error);
    } finally {
      console.log('✅ SEO loading finished, setting loading to false');
      setLoading(false);
    }
  };

  const getSEOForPage = (pageName) => {
    return seoSettings[pageName] || seoSettings.homepage;
  };

  const refreshSEO = () => {
    loadSEOSettings();
  };

  return (
    <SEOContext.Provider value={{ seoSettings, getSEOForPage, loading, refreshSEO }}>
      {children}
    </SEOContext.Provider>
  );
};

SEOProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
