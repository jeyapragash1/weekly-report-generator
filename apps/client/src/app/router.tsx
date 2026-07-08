import { lazy, Suspense, type ReactNode } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { RouteFallback } from '@/components/layout/route-fallback';
import { ProtectedRoute } from '@/components/routing/protected-route';
import { ManagerRoute, RoleLandingRoute } from '@/components/routing/role-route';
import { ProtectedLayout } from '@/layouts/protected-layout';
import { PublicLayout } from '@/layouts/public-layout';

const DashboardShellPage = lazy(async () => {
  const module = await import('@/pages/dashboard-shell-page');

  return { default: module.DashboardShellPage };
});

const LoginPage = lazy(async () => {
  const module = await import('@/pages/login-page');

  return { default: module.LoginPage };
});

const ManagerReportsShellPage = lazy(async () => {
  const module = await import('@/pages/manager-reports-shell-page');

  return { default: module.ManagerReportsShellPage };
});

const NotFoundPage = lazy(async () => {
  const module = await import('@/pages/not-found-page');

  return { default: module.NotFoundPage };
});

const ProjectsShellPage = lazy(async () => {
  const module = await import('@/pages/projects-shell-page');

  return { default: module.ProjectsShellPage };
});

const ProfileShellPage = lazy(async () => {
  const module = await import('@/pages/profile-shell-page');

  return { default: module.ProfileShellPage };
});

const RegisterPage = lazy(async () => {
  const module = await import('@/pages/register-page');

  return { default: module.RegisterPage };
});

const ReportsShellPage = lazy(async () => {
  const module = await import('@/pages/reports-shell-page');

  return { default: module.ReportsShellPage };
});

const SettingsShellPage = lazy(async () => {
  const module = await import('@/pages/settings-shell-page');

  return { default: module.SettingsShellPage };
});

function withSuspense(element: ReactNode) {
  return <Suspense fallback={<RouteFallback />}>{element}</Suspense>;
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <ProtectedLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <RoleLandingRoute />,
      },
      {
        path: 'dashboard',
        element: <ManagerRoute>{withSuspense(<DashboardShellPage />)}</ManagerRoute>,
      },
      {
        path: 'reports',
        element: withSuspense(<ReportsShellPage />),
      },
      {
        path: 'manager-reports',
        element: <ManagerRoute>{withSuspense(<ManagerReportsShellPage />)}</ManagerRoute>,
      },
      {
        path: 'projects',
        element: <ManagerRoute>{withSuspense(<ProjectsShellPage />)}</ManagerRoute>,
      },
      {
        path: 'analytics',
        element: <ManagerRoute>{withSuspense(<DashboardShellPage />)}</ManagerRoute>,
      },
      {
        path: 'settings',
        element: <ManagerRoute>{withSuspense(<SettingsShellPage />)}</ManagerRoute>,
      },
      {
        path: 'profile',
        element: withSuspense(<ProfileShellPage />),
      },
    ],
  },
  {
    element: <PublicLayout />,
    children: [
      {
        path: '/login',
        element: withSuspense(<LoginPage />),
      },
      {
        path: '/register',
        element: withSuspense(<RegisterPage />),
      },
      {
        path: '*',
        element: withSuspense(<NotFoundPage />),
      },
    ],
  },
]);
