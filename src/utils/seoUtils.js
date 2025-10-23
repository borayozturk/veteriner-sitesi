// SEO Utility Functions

/**
 * Generate dynamic sitemap based on blog posts and services
 */
export const generateDynamicSitemap = (blogPosts = [], services = [], veterinarians = []) => {
  const baseUrl = 'https://example.com';
  const today = new Date().toISOString().split('T')[0];

  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">

  <!-- Ana Sayfa -->
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>

  <!-- Hizmetler Ana -->
  <url>
    <loc>${baseUrl}/hizmetler</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>

  <!-- Blog Ana -->
  <url>
    <loc>${baseUrl}/blog</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>

  <!-- Hakkımızda -->
  <url>
    <loc>${baseUrl}/hakkimizda</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>

  <!-- Veterinerler -->
  <url>
    <loc>${baseUrl}/veterinerler</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>

  <!-- Galeri -->
  <url>
    <loc>${baseUrl}/galeri</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>

  <!-- İletişim -->
  <url>
    <loc>${baseUrl}/iletisim</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>

  <!-- Randevu -->
  <url>
    <loc>${baseUrl}/randevu</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
`;

  // Add blog posts
  blogPosts.forEach(post => {
    const postDate = new Date(post.published_at || post.created_at).toISOString().split('T')[0];
    sitemap += `
  <!-- Blog: ${post.title} -->
  <url>
    <loc>${baseUrl}/blog/${post.slug}</loc>
    <lastmod>${postDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
    ${post.featured_image ? `<image:image>
      <image:loc>${post.featured_image}</image:loc>
      <image:title>${post.title}</image:title>
    </image:image>` : ''}
  </url>`;
  });

  // Add services
  services.forEach(service => {
    sitemap += `
  <!-- Hizmet: ${service.title} -->
  <url>
    <loc>${baseUrl}/service/${service.slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
  });

  // Add veterinarians
  veterinarians.forEach(vet => {
    sitemap += `
  <!-- Veteriner: ${vet.name} -->
  <url>
    <loc>${baseUrl}/veteriner/${vet.id}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`;
  });

  sitemap += `
</urlset>`;

  return sitemap;
};

/**
 * Generate FAQ schema for rich snippets
 */
export const generateFAQSchema = (faqs) => {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
};

/**
 * Generate LocalBusiness schema
 */
export const generateLocalBusinessSchema = (businessData = {}) => {
  return {
    "@context": "https://schema.org",
    "@type": "VeterinaryCare",
    "@id": "https://example.com/#veterinary",
    "name": businessData.name || "Veteriner Kliniği",
    "image": businessData.image || "https://example.com/logo.png",
    "url": "https://example.com",
    "telephone": businessData.phone || "+90-212-123-45-67",
    "email": businessData.email || "info@veteriner.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": businessData.address || "Veteriner Caddesi No:123",
      "addressLocality": businessData.city || "İstanbul",
      "addressRegion": "İstanbul",
      "postalCode": businessData.postalCode || "34000",
      "addressCountry": "TR"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": businessData.latitude || 41.0082,
      "longitude": businessData.longitude || 28.9784
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        "opens": "00:00",
        "closes": "23:59"
      }
    ],
    "priceRange": "$$",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "250",
      "bestRating": "5",
      "worstRating": "1"
    },
    "hasMap": businessData.mapUrl || "https://www.google.com/maps",
    "sameAs": [
      businessData.facebook || "https://facebook.com/veteriner",
      businessData.instagram || "https://instagram.com/veteriner",
      businessData.twitter || "https://twitter.com/veteriner"
    ]
  };
};

/**
 * Generate BreadcrumbList schema
 */
export const generateBreadcrumbSchema = (breadcrumbs) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": `https://example.com${crumb.path}`
    }))
  };
};

/**
 * Generate Article schema for blog posts
 */
export const generateArticleSchema = (article) => {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": article.excerpt,
    "image": article.image,
    "datePublished": article.published_at,
    "dateModified": article.updated_at || article.published_at,
    "author": {
      "@type": "Person",
      "name": article.author || "Veteriner Hekim"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Veteriner Kliniği",
      "logo": {
        "@type": "ImageObject",
        "url": "https://example.com/logo.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://example.com/blog/${article.slug}`
    }
  };
};

/**
 * Generate Person schema for veterinarians
 */
export const generatePersonSchema = (person) => {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": person.name,
    "jobTitle": person.title || "Veteriner Hekim",
    "description": person.bio,
    "image": person.avatar,
    "worksFor": {
      "@type": "Organization",
      "name": "Veteriner Kliniği"
    },
    "knowsAbout": person.specialty,
    "alumniOf": person.education,
    "award": person.awards
  };
};

/**
 * Optimize meta description length
 */
export const optimizeMetaDescription = (text, maxLength = 160) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
};

/**
 * Generate slug from Turkish text
 */
export const generateSlug = (text) => {
  const trMap = {
    'ç': 'c', 'Ç': 'C',
    'ğ': 'g', 'Ğ': 'G',
    'ş': 's', 'Ş': 'S',
    'ü': 'u', 'Ü': 'U',
    'ö': 'o', 'Ö': 'O',
    'ı': 'i', 'İ': 'I'
  };

  return text
    .split('')
    .map(char => trMap[char] || char)
    .join('')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Extract keywords from text
 */
export const extractKeywords = (text, count = 10) => {
  const stopWords = ['ve', 'veya', 'için', 'ile', 'bir', 'bu', 'da', 'de', 'mi', 'mı', 'mu', 'mü'];
  const words = text.toLowerCase()
    .replace(/[^a-zçğıöşü\s]/gi, '')
    .split(/\s+/)
    .filter(word => word.length > 3 && !stopWords.includes(word));

  const frequency = {};
  words.forEach(word => {
    frequency[word] = (frequency[word] || 0) + 1;
  });

  return Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, count)
    .map(([word]) => word);
};

export default {
  generateDynamicSitemap,
  generateFAQSchema,
  generateLocalBusinessSchema,
  generateBreadcrumbSchema,
  generateArticleSchema,
  generatePersonSchema,
  optimizeMetaDescription,
  generateSlug,
  extractKeywords
};
