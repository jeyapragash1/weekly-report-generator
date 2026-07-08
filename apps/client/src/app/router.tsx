import { createBrowserRouter } from 'react-router-dom';
import { ProtectedRoute } from '@/components/routing/protected-route';
import { ProtectedLayout } from '@/layouts/protected-layout';
import { PublicLayout } from '@/layouts/public-layout';
import { DashboardShellPage } from '@/pages/dashboard-shell-page';
import { LoginPage } from '@/pages/login-page';
import { NotFoundPage } from '@/pages/not-found-page';
import { ProjectsShellPage } from '@/pages/projects-shell-page';
import { ReportsShellPage } from '@/pages/reports-shell-page';
import { SettingsShellPage } from '@/pages/settings-shell-page';

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
        element: <DashboardShellPage />,
      },
      {
        path: 'reports',
        element: <ReportsShellPage />,
      },
      {
        path: 'projects',
        element: <ProjectsShellPage />,
      },
      {
        path: 'settings',
        element: <SettingsShellPage />,
      },
    ],
  },
  {
    element: <PublicLayout />,
    children: [
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);
