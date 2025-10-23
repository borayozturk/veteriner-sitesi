import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

/**
 * Lazy loading image component with loading placeholder
 * Improves SEO and performance by only loading images when they're in viewport
 */
const ImageWithLoading = ({
  src,
  alt,
  className = '',
  placeholderClassName = '',
  width,
  height,
  loading = 'lazy',
  decoding = 'async',
  onLoad,
  onError,
  fallbackSrc = '/images/placeholder.jpg',
  threshold = 0.1,
  rootMargin = '50px',
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef(null);
  const observerRef = useRef(null);

  useEffect(() => {
    // Use Intersection Observer for better lazy loading control
    if (!imgRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            // Disconnect observer after image is in view
            if (observerRef.current) {
              observerRef.current.disconnect();
            }
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    observerRef.current.observe(imgRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [threshold, rootMargin]);

  const handleLoad = (e) => {
    setIsLoaded(true);
    if (onLoad) {
      onLoad(e);
    }
  };

  const handleError = (e) => {
    setHasError(true);
    if (onError) {
      onError(e);
    }
  };

  // Use data-src pattern for better SEO
  const imgSrc = isInView ? (hasError ? fallbackSrc : src) : '';

  return (
    <div
      ref={imgRef}
      className={`relative overflow-hidden ${placeholderClassName}`}
      style={{ width, height }}
    >
      {/* Loading placeholder */}
      {!isLoaded && isInView && (
        <div
          className="absolute inset-0 bg-gray-200 animate-pulse"
          aria-hidden="true"
        />
      )}

      {/* Actual image */}
      {isInView && (
        <img
          src={imgSrc}
          alt={alt}
          className={`${className} ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } transition-opacity duration-300`}
          width={width}
          height={height}
          loading={loading}
          decoding={decoding}
          onLoad={handleLoad}
          onError={handleError}
          // SEO-friendly attributes
          itemProp="image"
        />
      )}

      {/* Noscript fallback for SEO */}
      <noscript>
        <img src={src} alt={alt} className={className} width={width} height={height} />
      </noscript>
    </div>
  );
};

ImageWithLoading.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  className: PropTypes.string,
  placeholderClassName: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  loading: PropTypes.oneOf(['lazy', 'eager']),
  decoding: PropTypes.oneOf(['async', 'sync', 'auto']),
  onLoad: PropTypes.func,
  onError: PropTypes.func,
  fallbackSrc: PropTypes.string,
  threshold: PropTypes.number,
  rootMargin: PropTypes.string,
};

export default ImageWithLoading;
