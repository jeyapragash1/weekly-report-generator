import type { Prisma, WeeklyReport } from '@prisma/client';

export type WeeklyReportDto = {
  id: string;
  userId: string;
  weekStartDate: Date;
  weekEndDate: Date;
  project: string;
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

export function toWeeklyReportDto(report: WeeklyReport): WeeklyReportDto {
  return {
    id: report.id,
    userId: report.userId,
    weekStartDate: report.weekStartDate,
    weekEndDate: report.weekEndDate,
    project: report.project,
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
