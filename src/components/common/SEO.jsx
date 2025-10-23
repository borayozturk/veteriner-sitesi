import { Helmet } from 'react-helmet-async';
import PropTypes from 'prop-types';
import { useEffect } from 'react';

const SEO = ({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  author = 'Veteriner Kliniği',
  siteName = 'Veteriner Kliniği',
  twitterHandle = '@veteriner',
  structuredData,
  canonical,
  useRawTitle = false,
}) => {
  const siteUrl = 'https://example.com';
  const fullUrl = url || window.location.href;
  const fullImageUrl = image ? (image.startsWith('http') ? image : `${siteUrl}${image}`) : `${siteUrl}/og-image.jpg`;
  const canonicalUrl = canonical || fullUrl;

  // Always use the raw title from admin panel without adding suffix
  const pageTitle = title || 'Veteriner Kliniği - Sevimli Dostlarınız İçin Profesyonel Veteriner Hizmeti';

  const defaultDescription = 'Veteriner Kliniği, evcil hayvanlarınızın sağlığı için 7/24 profesyonel veteriner hizmeti sunmaktadır. Deneyimli kadromuz ile yanınızdayız.';

  // Force update document title and meta tags (fallback for React Helmet)
  useEffect(() => {
    document.title = pageTitle;

    // Update or create description meta tag
    let descriptionMeta = document.querySelector('meta[name="description"]');
    if (!descriptionMeta) {
      descriptionMeta = document.createElement('meta');
      descriptionMeta.name = 'description';
      document.head.appendChild(descriptionMeta);
    }
    descriptionMeta.content = description || defaultDescription;

    // Update or create keywords meta tag
    if (keywords) {
      let keywordsMeta = document.querySelector('meta[name="keywords"]');
      if (!keywordsMeta) {
        keywordsMeta = document.createElement('meta');
        keywordsMeta.name = 'keywords';
        document.head.appendChild(keywordsMeta);
      }
      keywordsMeta.content = keywords;
    }

    console.log('📝 SEO: Title updated to:', pageTitle);
    console.log('📝 SEO: Description:', description || defaultDescription);
    console.log('📝 SEO: Keywords:', keywords);
  }, [pageTitle, description, keywords, defaultDescription]);

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{pageTitle}</title>
      <meta name="description" content={description || defaultDescription} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="author" content={author} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph Meta Tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={description || defaultDescription} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="tr_TR" />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={twitterHandle} />
      <meta name="twitter:creator" content={twitterHandle} />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={description || defaultDescription} />
      <meta name="twitter:image" content={fullImageUrl} />

      {/* Additional SEO Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
      <meta name="language" content="Turkish" />
      <meta name="revisit-after" content="7 days" />
      <meta name="distribution" content="global" />
      <meta name="rating" content="general" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#9333ea" />

      {/* Structured Data (JSON-LD) */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

SEO.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  keywords: PropTypes.string,
  image: PropTypes.string,
  url: PropTypes.string,
  type: PropTypes.string,
  author: PropTypes.string,
  siteName: PropTypes.string,
  twitterHandle: PropTypes.string,
  structuredData: PropTypes.object,
  canonical: PropTypes.string,
  useRawTitle: PropTypes.bool,
};

export default SEO;
