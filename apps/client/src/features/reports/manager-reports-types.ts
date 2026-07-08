import type { DashboardActivityItem } from '@/features/dashboard/dashboard-types';

export type ManagerReportItem = DashboardActivityItem;

export type ManagerReportStatusFilter = 'ALL' | ManagerReportItem['status'];

export type ManagerReportFilters = {
  search: string;
  memberId: string;
  projectId: string;
  status: ManagerReportStatusFilter;
  dateFrom: string;
  dateTo: string;
};
