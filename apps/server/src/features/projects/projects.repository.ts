import type { Prisma, ProjectStatus } from '@prisma/client';
import { prisma } from '../../infrastructure/database/prisma.js';

export const projectsRepository = {
  create(input: Prisma.ProjectCreateInput) {
    return prisma.project.create({
      data: input,
    });
  },

  findById(id: string) {
    return prisma.project.findUnique({
      where: { id },
    });
  },

  findByName(name: string) {
    return prisma.project.findUnique({
      where: { name },
    });
  },

  findMany(input: { status?: ProjectStatus }) {
    return prisma.project.findMany({
      where: {
        status: input.status,
      },
      orderBy: [{ status: 'asc' }, { name: 'asc' }],
    });
  },

  update(id: string, input: Prisma.ProjectUpdateInput) {
    return prisma.project.update({
      where: { id },
      data: input,
    });
  },

  archive(id: string) {
    return prisma.project.update({
      where: { id },
      data: {
        status: 'ARCHIVED',
        archivedAt: new Date(),
      },
    });
  },
};
