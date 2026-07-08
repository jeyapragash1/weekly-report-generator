import { Navigate, useLocation } from 'react-router-dom';
import type { PropsWithChildren } from 'react';
import { RouteFallback } from '@/components/layout/route-fallback';
import { getDefaultAuthenticatedPath } from '@/features/auth/auth-routes';
import { useAuth } from '@/features/auth/auth-context';
import type { UserRole } from '@/features/auth/auth-types';

type RoleRouteProps = PropsWithChildren<{
  allow: UserRole[];
}>;

export function RoleRoute({ allow, children }: RoleRouteProps) {
  const { isAuthLoading, user } = useAuth();
  const location = useLocation();

  if (isAuthLoading) {
    return <RouteFallback />;
  }

  if (!user) {
    return <Navigate replace state={{ from: location }} to="/login" />;
  }

  if (!allow.includes(user.role)) {
    return <Navigate replace to={getDefaultAuthenticatedPath(user.role)} />;
  }

  return children;
}

export function ManagerRoute({ children }: PropsWithChildren) {
  const managerRoles: UserRole[] = ['MANAGER', 'ADMIN'];

  return <RoleRoute allow={managerRoles}>{children}</RoleRoute>;
}

export function RoleLandingRoute() {
  const { isAuthLoading, user } = useAuth();

  if (isAuthLoading) {
    return <RouteFallback />;
  }

  return <Navigate replace to={getDefaultAuthenticatedPath(user?.role)} />;
}
