import { z } from 'zod';

export const projectFormSchema = z.object({
  name: z.string().trim().min(1, 'Project name is required').max(120),
  description: z.string().trim().max(1000).optional(),
  status: z.enum(['ACTIVE', 'ON_HOLD', 'ARCHIVED']).optional(),
});

export type ProjectFormValues = z.infer<typeof projectFormSchema>;
