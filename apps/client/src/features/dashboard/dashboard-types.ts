export type DashboardSummary = {
  totalReports: number;
  submittedReports: number;
  pendingReports: number;
  complianceRate: number;
  openBlockers: number;
};

export type DashboardActivityItem = {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  project: {
    id: string;
    name: string;
    status: 'ACTIVE' | 'ON_HOLD' | 'ARCHIVED';
  };
  week: {
    startDate: string;
    endDate: string;
  };
  status: 'DRAFT' | 'SUBMITTED';
  submittedAt: string | null;
};

export type DashboardSubmissionStatusItem = {
  user: {
    id: string;
    name: string;
    email: string;
  };
  totalReports: number;
  submittedReports: number;
  pendingReports: number;
  complianceRate: number;
  lateReports?: number;
};

export type DashboardWorkloadItem = {
  project: {
    id: string;
    name: string;
    status: 'ACTIVE' | 'ON_HOLD' | 'ARCHIVED';
  };
  totalReports: number;
  submittedReports: number;
  pendingReports: number;
};

export type DashboardTaskTrendItem = {
  weekStartDate: string;
  completedReports: number;
};
