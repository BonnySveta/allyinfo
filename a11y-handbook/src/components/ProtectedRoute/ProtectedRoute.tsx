import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ForbiddenError } from '../ForbiddenError/ForbiddenError';

interface ProtectedRouteProps {
  children: React.ReactNode;
  showError?: boolean;
}

export function ProtectedRoute({ children, showError = false }: ProtectedRouteProps) {
  const { isAdmin, isLoading } = useAuth();
  const location = useLocation();
  
  if (isLoading) {
    return <div>Загрузка...</div>;
  }
  
  if (!isAdmin && location.pathname.startsWith('/admin')) {
    return showError ? <ForbiddenError /> : <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
} 