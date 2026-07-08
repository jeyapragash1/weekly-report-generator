import { ReportStatus } from '@prisma/client';
import { prisma } from '../../infrastructure/database/prisma.js';

export const dashboardRepository = {
  countReports() {
    return prisma.weeklyReport.count();
  },

  countReportsByStatus(status: ReportStatus) {
    return prisma.weeklyReport.count({
      where: {
        status,
      },
    });
  },

  countReportsWithOpenBlockers() {
    return prisma.weeklyReport.count({
      where: {
        blockers: {
          not: '',
        },
      },
    });
  },

  findRecentSubmittedReports(limit: number) {
    return prisma.weeklyReport.findMany({
      where: {
        status: ReportStatus.SUBMITTED,
      },
      select: {
        id: true,
        weekStartDate: true,
        weekEndDate: true,
        status: true,
        submittedAt: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
            status: true,
          },
        },
      },
      orderBy: [{ submittedAt: 'desc' }, { updatedAt: 'desc' }],
      take: limit,
    });
  },

  groupReportCountsByUserAndStatus() {
    return prisma.weeklyReport.groupBy({
      by: ['userId', 'status'],
      _count: {
        id: true,
      },
    });
  },

  findUsersByIds(userIds: string[]) {
    return prisma.user.findMany({
      where: {
        id: {
          in: userIds,
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
  },

  groupReportCountsByProjectAndStatus() {
    return prisma.weeklyReport.groupBy({
      by: ['projectId', 'status'],
      _count: {
        id: true,
      },
    });
  },

  findProjectsByIds(projectIds: string[]) {
    return prisma.project.findMany({
      where: {
        id: {
          in: projectIds,
        },
      },
      select: {
        id: true,
        name: true,
        status: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
  },

  groupSubmittedReportCountsByWeek() {
    return prisma.weeklyReport.groupBy({
      by: ['weekStartDate'],
      where: {
        status: ReportStatus.SUBMITTED,
      },
      _count: {
        id: true,
      },
      orderBy: {
        weekStartDate: 'asc',
      },
    });
  },
};
