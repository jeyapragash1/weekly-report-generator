import type { Project } from '@prisma/client';

export type ProjectDto = {
  id: string;
  name: string;
  description: string | null;
  status: Project['status'];
  createdAt: Date;
  updatedAt: Date;
  archivedAt: Date | null;
};

export function toProjectDto(project: Project): ProjectDto {
  return {
    id: project.id,
    name: project.name,
    description: project.description,
    status: project.status,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
    archivedAt: project.archivedAt,
  };
}
