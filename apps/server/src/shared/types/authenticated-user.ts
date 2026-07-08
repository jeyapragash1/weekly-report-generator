import type { RoleName } from '@prisma/client';

export type AuthenticatedUser = {
  id: string;
  email: string;
  role: RoleName;
};
