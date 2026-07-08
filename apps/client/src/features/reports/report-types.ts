import type { ProjectStatus } from '@/features/projects/project-types';

export type ReportStatus = 'DRAFT' | 'SUBMITTED';

export type WeeklyReport = {
  id: string;
  userId: string;
  weekStartDate: string;
  weekEndDate: string;
  project: {
    id: string;
    name: string;
    status: ProjectStatus;
  };
  tasksCompleted: string;
  tasksPlanned: string;
  blockers: string;
  hoursWorked: number | null;
  notes: string | null;
  status: ReportStatus;
  submittedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateReportPayload = {
  weekStartDate: string;
  weekEndDate: string;
  projectId: string;
  tasksCompleted: string;
  tasksPlanned: string;
  blockers: string;
  hoursWorked?: number;
  notes?: string;
};

export type UpdateReportPayload = Partial<CreateReportPayload>;

export type ReportStatusFilter = 'ALL' | ReportStatus;
export type ReportSortOption = 'newest' | 'oldest' | 'week';
