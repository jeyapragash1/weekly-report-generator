import type { Prisma, ReportStatus } from '@prisma/client';
import { prisma } from '../../infrastructure/database/prisma.js';

export const reportsRepository = {
  createDraft(input: Prisma.WeeklyReportUncheckedCreateInput) {
    return prisma.weeklyReport.create({
      data: input,
    });
  },

  findById(id: string) {
    return prisma.weeklyReport.findUnique({
      where: { id },
    });
  },

  findByUserWeekAndProject(input: { userId: string; weekStartDate: Date; project: string }) {
    return prisma.weeklyReport.findUnique({
      where: {
        userId_project_weekStartDate: input,
      },
    });
  },

  findManyByUser(input: { userId: string; status?: ReportStatus }) {
    return prisma.weeklyReport.findMany({
      where: {
        userId: input.userId,
        status: input.status,
      },
      orderBy: [{ weekStartDate: 'desc' }, { createdAt: 'desc' }],
    });
  },

  update(id: string, input: Prisma.WeeklyReportUncheckedUpdateInput) {
    return prisma.weeklyReport.update({
      where: { id },
      data: input,
    });
  },

  delete(id: string) {
    return prisma.weeklyReport.delete({
      where: { id },
    });
  },
};
