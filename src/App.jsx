import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, lazy, Suspense } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { SEOProvider } from './contexts/SEOContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ChatBot from './components/common/ChatBot';
import WhatsAppButton from './components/common/WhatsAppButton';
import ScrollToTopButton from './components/common/ScrollToTop';
import GoogleAnalytics from './components/common/GoogleAnalytics';
import Loading from './components/common/Loading';

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home'));
const Services = lazy(() => import('./pages/Services'));
const ServiceDetail = lazy(() => import('./pages/ServiceDetail'));
const About = lazy(() => import('./pages/About'));
const Veterinarians = lazy(() => import('./pages/Veterinarians'));
const Gallery = lazy(() => import('./pages/Gallery'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogDetail = lazy(() => import('./pages/BlogDetail'));
const BlogTag = lazy(() => import('./pages/BlogTag'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const AppointmentPage = lazy(() => import('./pages/AppointmentPage'));
const VetProfile = lazy(() => import('./pages/VetProfile'));
const AdminLayout = lazy(() => import('./components/admin/AdminLayout'));
const ProtectedRoute = lazy(() => import('./components/admin/ProtectedRoute'));
const LoginPage = lazy(() => import('./pages/admin/LoginPage'));
const DashboardPage = lazy(() => import('./pages/admin/DashboardPage'));
const AppointmentsPage = lazy(() => import('./pages/admin/AppointmentsPage'));
const BlogManagementPage = lazy(() => import('./pages/admin/BlogManagementPage'));
const MessagesPage = lazy(() => import('./pages/admin/MessagesPage'));
const GalleryPage = lazy(() => import('./pages/admin/GalleryPage'));
const VeterinariansPage = lazy(() => import('./pages/admin/VeterinariansPage'));
const PageEditorPage = lazy(() => import('./pages/admin/PageEditorPage'));
const ServicesManagePage = lazy(() => import('./pages/admin/ServicesManagePage'));
const ServicesPageEditor = lazy(() => import('./pages/admin/ServicesPageEditor'));
const AboutPageEditor = lazy(() => import('./pages/admin/AboutPageEditor'));
const ContactPageEditor = lazy(() => import('./pages/admin/ContactPageEditor'));
const HomePageEditor = lazy(() => import('./pages/admin/HomePageEditor'));
const SettingsPage = lazy(() => import('./pages/admin/SettingsPage'));
const SEOManagementPage = lazy(() => import('./pages/admin/SEOManagementPage'));
const UserManagementPage = lazy(() => import('./pages/admin/UserManagementPage'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location?.pathname?.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      <GoogleAnalytics />

      {/* Show Header/Footer only for non-admin routes */}
      {!isAdminRoute && <Header />}

      <main className={!isAdminRoute ? "flex-grow" : ""}>
        <Suspense fallback={<Loading fullScreen={true} message="Sayfa yükleniyor..." />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
          <Route path="/hizmetler" element={<Services />} />
          <Route path="/service/:slug" element={<ServiceDetail />} />
          <Route path="/hakkimizda" element={<About />} />
          <Route path="/veterinerler" element={<Veterinarians />} />
          <Route path="/veteriner/:slug" element={<VetProfile />} />
          <Route path="/galeri" element={<Gallery />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/etiket/:tag" element={<BlogTag />} />
          <Route path="/blog/:slug" element={<BlogDetail />} />
          <Route path="/iletisim" element={<ContactPage />} />
          <Route path="/randevu" element={<AppointmentPage />} />

          {/* Admin Login */}
          <Route path="/admin/login" element={<LoginPage />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
            <Route index element={<DashboardPage />} />
            <Route path="randevular" element={<AppointmentsPage />} />
            <Route path="blog" element={<BlogManagementPage />} />
            <Route path="mesajlar" element={<MessagesPage />} />
            <Route path="galeri" element={<GalleryPage />} />
            <Route path="veterinerler" element={<VeterinariansPage />} />
            <Route path="hizmetler" element={<ServicesManagePage />} />
            <Route path="anasayfa-duzenle" element={<HomePageEditor />} />
            <Route path="hizmetler-sayfasi-duzenle" element={<ServicesPageEditor />} />
            <Route path="seo" element={<SEOManagementPage />} />
            <Route path="sayfa-duzenle" element={<PageEditorPage />} />
            <Route path="hakkimizda-duzenle" element={<AboutPageEditor />} />
            <Route path="iletisim-duzenle" element={<ContactPageEditor />} />
            <Route path="ayarlar" element={<SettingsPage />} />
            <Route path="kullanicilar" element={<UserManagementPage />} />
          </Route>

            {/* Catch-all route - 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>

      {!isAdminRoute && (
        <>
          <Footer />
          <ChatBot />
          <WhatsAppButton />
          <ScrollToTopButton />
        </>
      )}
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <SEOProvider>
          <Router>
            <AppContent />
          </Router>
        </SEOProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;
