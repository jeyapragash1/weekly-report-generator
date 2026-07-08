import type { UserRole } from '@/features/auth/auth-types';

const MANAGER_ROLES: UserRole[] = ['MANAGER', 'ADMIN'];

export function hasManagerAccess(role: UserRole | undefined) {
  return role ? MANAGER_ROLES.includes(role) : false;
}

export function getDefaultAuthenticatedPath(role: UserRole | undefined) {
  return hasManagerAccess(role) ? '/dashboard' : '/reports';
}
