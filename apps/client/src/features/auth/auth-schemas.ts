import { z } from 'zod';

export const loginFormSchema = z.object({
  email: z.string().trim().email('Enter a valid email address').max(255).toLowerCase(),
  password: z.string().min(1, 'Password is required').max(128),
});

export const registerFormSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().trim().email('Enter a valid email address').max(255).toLowerCase(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128)
    .regex(/[A-Za-z]/, 'Password must contain at least one letter')
    .regex(/\d/, 'Password must contain at least one number'),
  role: z.enum(['TEAM_MEMBER', 'MANAGER']),
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;
export type RegisterFormValues = z.infer<typeof registerFormSchema>;
