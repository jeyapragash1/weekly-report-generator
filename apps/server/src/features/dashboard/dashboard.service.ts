import { ReportStatus } from '@prisma/client';
import type { DashboardActivityQuery } from './dashboard.schemas.js';
import { dashboardRepository } from './dashboard.repository.js';

type StatusCounts = {
  totalReports: number;
  submittedReports: number;
  pendingReports: number;
};

function calculateComplianceRate(totalReports: number, submittedReports: number) {
  if (totalReports === 0) {
    return 0;
  }

  return Number(((submittedReports / totalReports) * 100).toFixed(2));
}

function createEmptyStatusCounts(): StatusCounts {
  return {
    totalReports: 0,
    submittedReports: 0,
    pendingReports: 0,
  };
}

export const dashboardService = {
  async getSummary() {
    const [totalReports, submittedReports, pendingReports, openBlockers] = await Promise.all([
      dashboardRepository.countReports(),
      dashboardRepository.countReportsByStatus(ReportStatus.SUBMITTED),
      dashboardRepository.countReportsByStatus(ReportStatus.DRAFT),
      dashboardRepository.countReportsWithOpenBlockers(),
    ]);

    return {
      totalReports,
      submittedReports,
      pendingReports,
      complianceRate: calculateComplianceRate(totalReports, submittedReports),
      openBlockers,
    };
  },

  async getActivity(query: DashboardActivityQuery) {
    const reports = await dashboardRepository.findRecentSubmittedReports(query.limit);

    return reports.map((report) => ({
      id: report.id,
      user: report.user,
      project: report.project,
      week: {
        startDate: report.weekStartDate,
        endDate: report.weekEndDate,
      },
      status: report.status,
      submittedAt: report.submittedAt,
    }));
  },

  async getSubmissionStatus() {
    const groupedCounts = await dashboardRepository.groupReportCountsByUserAndStatus();
    const userIds = [...new Set(groupedCounts.map((item) => item.userId))];
    const users = await dashboardRepository.findUsersByIds(userIds);

    const countsByUserId = new Map<string, StatusCounts>();

    for (const item of groupedCounts) {
      const counts = countsByUserId.get(item.userId) ?? createEmptyStatusCounts();
      const count = item._count.id;

      counts.totalReports += count;

      if (item.status === ReportStatus.SUBMITTED) {
        counts.submittedReports += count;
      }

      if (item.status === ReportStatus.DRAFT) {
        counts.pendingReports += count;
      }

      countsByUserId.set(item.userId, counts);
    }

    return users.map((user) => {
      const counts = countsByUserId.get(user.id) ?? createEmptyStatusCounts();

      return {
        user,
        ...counts,
        complianceRate: calculateComplianceRate(counts.totalReports, counts.submittedReports),
      };
    });
  },

  async getWorkload() {
    const groupedCounts = await dashboardRepository.groupReportCountsByProjectAndStatus();
    const projectIds = [...new Set(groupedCounts.map((item) => item.projectId))];
    const projects = await dashboardRepository.findProjectsByIds(projectIds);

    const countsByProjectId = new Map<string, StatusCounts>();

    for (const item of groupedCounts) {
      const counts = countsByProjectId.get(item.projectId) ?? createEmptyStatusCounts();
      const count = item._count.id;

      counts.totalReports += count;

      if (item.status === ReportStatus.SUBMITTED) {
        counts.submittedReports += count;
      }

      if (item.status === ReportStatus.DRAFT) {
        counts.pendingReports += count;
      }

      countsByProjectId.set(item.projectId, counts);
    }

    return projects.map((project) => ({
      project,
      ...(countsByProjectId.get(project.id) ?? createEmptyStatusCounts()),
    }));
  },

  async getTaskTrends() {
    const groupedCounts = await dashboardRepository.groupSubmittedReportCountsByWeek();

    return groupedCounts.map((item) => ({
      weekStartDate: item.weekStartDate,
      completedReports: item._count.id,
    }));
  },
};
