import type { Prisma, ReportStatus } from '@prisma/client';
import { prisma } from '../../infrastructure/database/prisma.js';

export const reportsRepository = {
  createDraft(input: Prisma.WeeklyReportUncheckedCreateInput) {
    return prisma.weeklyReport.create({
      data: input,
      include: {
        project: true,
      },
    });
  },

  findById(id: string) {
    return prisma.weeklyReport.findUnique({
      where: { id },
      include: {
        project: true,
      },
    });
  },

  findByUserWeekAndProject(input: { userId: string; weekStartDate: Date; projectId: string }) {
    return prisma.weeklyReport.findUnique({
      where: {
        userId_projectId_weekStartDate: input,
      },
      include: {
        project: true,
      },
    });
  },

  findManyByUser(input: { userId: string; status?: ReportStatus }) {
    return prisma.weeklyReport.findMany({
      where: {
        userId: input.userId,
        ...(input.status ? { status: input.status } : {}),
      },
      include: {
        project: true,
      },
      orderBy: [{ weekStartDate: 'desc' }, { createdAt: 'desc' }],
    });
  },

  update(id: string, input: Prisma.WeeklyReportUncheckedUpdateInput) {
    return prisma.weeklyReport.update({
      where: { id },
      data: input,
      include: {
        project: true,
      },
    });
  },

  delete(id: string) {
    return prisma.weeklyReport.delete({
      where: { id },
    });
  },
};
