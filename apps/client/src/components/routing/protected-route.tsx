import { Navigate, useLocation } from 'react-router-dom';
import type { PropsWithChildren } from 'react';
import { RouteFallback } from '@/components/layout/route-fallback';
import { useAuth } from '@/features/auth/auth-context';

export function ProtectedRoute({ children }: PropsWithChildren) {
  const { isAuthLoading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (isAuthLoading) {
    return <RouteFallback />;
  }

  if (!isAuthenticated) {
    return <Navigate replace state={{ from: location }} to="/login" />;
  }

  return children;
}
