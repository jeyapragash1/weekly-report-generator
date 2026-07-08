import { RoleName } from '@prisma/client';
import { z } from 'zod';

const normalizedEmail = z.string().trim().email().max(255).toLowerCase();

export const registerSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: normalizedEmail,
  password: z
    .string()
    .min(8)
    .max(128)
    .regex(/[A-Za-z]/, 'Password must contain at least one letter')
    .regex(/\d/, 'Password must contain at least one number'),
  role: z.enum([RoleName.TEAM_MEMBER, RoleName.MANAGER]),
});

export const loginSchema = z.object({
  email: normalizedEmail,
  password: z.string().min(1).max(128),
});

export const logoutSchema = z.object({
  refreshToken: z.string().min(1),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type LogoutInput = z.infer<typeof logoutSchema>;
