import type { Prisma, Project, WeeklyReport } from '@prisma/client';

type WeeklyReportWithProject = WeeklyReport & {
  project: Project;
};

export type WeeklyReportDto = {
  id: string;
  userId: string;
  weekStartDate: Date;
  weekEndDate: Date;
  project: {
    id: string;
    name: string;
    status: Project['status'];
  };
  tasksCompleted: string;
  tasksPlanned: string;
  blockers: string;
  hoursWorked: number | null;
  notes: string | null;
  status: WeeklyReport['status'];
  submittedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

function decimalToNumber(value: Prisma.Decimal | null) {
  return value === null ? null : value.toNumber();
}

export function toWeeklyReportDto(report: WeeklyReportWithProject): WeeklyReportDto {
  return {
    id: report.id,
    userId: report.userId,
    weekStartDate: report.weekStartDate,
    weekEndDate: report.weekEndDate,
    project: {
      id: report.project.id,
      name: report.project.name,
      status: report.project.status,
    },
    tasksCompleted: report.tasksCompleted,
    tasksPlanned: report.tasksPlanned,
    blockers: report.blockers,
    hoursWorked: decimalToNumber(report.hoursWorked),
    notes: report.notes,
    status: report.status,
    submittedAt: report.submittedAt,
    createdAt: report.createdAt,
    updatedAt: report.updatedAt,
  };
}
