import type { RoleName, User } from '@prisma/client';

export type UserWithRole = User & {
  role: {
    name: RoleName;
  };
};

export type PublicUserDto = {
  id: string;
  name: string;
  email: string;
  role: RoleName;
  isActive: boolean;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};
