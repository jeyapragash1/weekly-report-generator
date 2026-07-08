import {
  BarChart3,
  FileClock,
  FilePlus2,
  FileText,
  FolderKanban,
  LayoutDashboard,
  ListTree,
  Settings,
  UserCircle,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { hasManagerAccess } from '@/features/auth/auth-routes';
import type { UserRole } from '@/features/auth/auth-types';

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  end?: boolean;
};

const managerNavItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Projects',
    href: '/projects',
    icon: FolderKanban,
  },
  {
    label: 'Reports',
    href: '/reports',
    icon: FileText,
  },
  {
    label: 'Manager Reports',
    href: '/manager-reports',
    icon: ListTree,
  },
  {
    label: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: Settings,
  },
];

const teamMemberNavItems: NavItem[] = [
  {
    label: 'My Reports',
    href: '/reports',
    icon: FileText,
    end: true,
  },
  {
    label: 'Create Report',
    href: '/reports?intent=create',
    icon: FilePlus2,
  },
  {
    label: 'Report History',
    href: '/reports?status=SUBMITTED',
    icon: FileClock,
  },
  {
    label: 'Profile',
    href: '/profile',
    icon: UserCircle,
  },
];

export function getMainNavItems(role: UserRole | undefined) {
  return hasManagerAccess(role) ? managerNavItems : teamMemberNavItems;
}
