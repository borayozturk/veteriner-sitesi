import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaChevronRight } from 'react-icons/fa';
import { generateBreadcrumbSchema } from '../../utils/seoUtils';
import { Helmet } from 'react-helmet-async';

const Breadcrumbs = ({ customCrumbs = null }) => {
  const location = useLocation();

  // Route name mapping
  const routeNames = {
    '': 'Ana Sayfa',
    'hizmetler': 'Hizmetler',
    'hakkimizda': 'Hakkımızda',
    'veterinerler': 'Veterinerler',
    'veteriner': 'Veteriner',
    'galeri': 'Galeri',
    'blog': 'Blog',
    'iletisim': 'İletişim',
    'randevu': 'Randevu',
    'service': 'Hizmet Detay',
    'etiket': 'Etiket'
  };

  // Generate breadcrumbs from URL or use custom
  const generateBreadcrumbs = () => {
    if (customCrumbs) return customCrumbs;

    const paths = location.pathname.split('/').filter(Boolean);
    const breadcrumbs = [{ name: 'Ana Sayfa', path: '/' }];

    let currentPath = '';
    paths.forEach((path, index) => {
      currentPath += `/${path}`;
      const name = routeNames[path] || path.charAt(0).toUpperCase() + path.slice(1);
      breadcrumbs.push({
        name,
        path: currentPath
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  // Don't show breadcrumbs on home page
  if (breadcrumbs.length <= 1) return null;

  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs);

  return (
    <>
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      </Helmet>

      <nav
        className="bg-gray-50 border-b border-gray-200 py-3"
        aria-label="Breadcrumb"
      >
        <div className="container-custom">
          <ol className="flex items-center gap-2 text-sm flex-wrap">
            {breadcrumbs.map((crumb, index) => (
              <li key={crumb.path} className="flex items-center gap-2">
                {index > 0 && (
                  <FaChevronRight className="text-gray-400 text-xs" />
                )}
                {index === breadcrumbs.length - 1 ? (
                  <span className="text-gray-900 font-semibold flex items-center gap-1">
                    {index === 0 && <FaHome className="text-purple-600" />}
                    {crumb.name}
                  </span>
                ) : (
                  <Link
                    to={crumb.path}
                    className="text-gray-600 hover:text-purple-600 transition-colors flex items-center gap-1"
                  >
                    {index === 0 && <FaHome className="text-purple-600" />}
                    {crumb.name}
                  </Link>
                )}
              </li>
            ))}
          </ol>
        </div>
      </nav>
    </>
  );
};

export default Breadcrumbs;
