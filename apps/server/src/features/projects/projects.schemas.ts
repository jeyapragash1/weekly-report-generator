import { ProjectStatus } from '@prisma/client';
import { z } from 'zod';

export const createProjectSchema = z.object({
  name: z.string().trim().min(1).max(120),
  description: z.string().trim().max(1000).optional(),
  status: z.nativeEnum(ProjectStatus).default(ProjectStatus.ACTIVE),
});

export const updateProjectSchema = createProjectSchema.partial();

export const projectParamsSchema = z.object({
  id: z.string().min(1),
});

export const getProjectsQuerySchema = z.object({
  status: z.nativeEnum(ProjectStatus).optional(),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type ProjectParams = z.infer<typeof projectParamsSchema>;
export type GetProjectsQuery = z.infer<typeof getProjectsQuerySchema>;
