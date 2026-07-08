import type { PublicUserDto, UserWithRole } from './users.types.js';

export function toPublicUserDto(user: UserWithRole): PublicUserDto {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role.name,
    isActive: user.isActive,
    lastLoginAt: user.lastLoginAt,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
