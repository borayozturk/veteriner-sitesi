import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    // First check localStorage
    const user = localStorage.getItem('user');
    if (!user) {
      setIsAuthenticated(false);
      return;
    }

    // Then verify with backend
    try {
      const response = await fetch(import.meta.env.VITE_API_URL + '/api/auth/check/', {
        credentials: 'include'
      });

      if (!response.ok) {
        localStorage.removeItem('user');
        setIsAuthenticated(false);
        return;
      }

      const data = await response.json();

      if (data.success && data.authenticated) {
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem('user');
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('user');
      setIsAuthenticated(false);
    }
  };

  // Loading state
  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-purple-600 via-pink-600 to-orange-600">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white font-semibold text-lg">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Authenticated - render children
  return children;
};

export default ProtectedRoute;
