import { Navigate, useLocation } from 'react-router-dom';
import type { PropsWithChildren } from 'react';
import { useAuth } from '@/features/auth/auth-context';

export function ProtectedRoute({ children }: PropsWithChildren) {
  const { isAuthLoading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (isAuthLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate replace state={{ from: location }} to="/login" />;
  }

  return children;
}
