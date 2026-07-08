import { ReportStatus } from '@prisma/client';
import { z } from 'zod';

const isoDateSchema = z
  .string()
  .datetime({ offset: true })
  .or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/))
  .transform((value) => new Date(value));

const reportBaseSchema = z.object({
  weekStartDate: isoDateSchema,
  weekEndDate: isoDateSchema,
  projectId: z.string().min(1),
  tasksCompleted: z.string().trim().min(1).max(5000),
  tasksPlanned: z.string().trim().min(1).max(5000),
  blockers: z.string().trim().min(1).max(3000),
  hoursWorked: z.number().min(0).max(168).optional(),
  notes: z.string().trim().max(3000).optional(),
});

export const createReportSchema = reportBaseSchema.refine(
  (data) => data.weekEndDate > data.weekStartDate,
  {
    message: 'Week end date must be after week start date',
    path: ['weekEndDate'],
  },
);

export const updateDraftReportSchema = reportBaseSchema.partial().refine(
  (data) => {
    if (!data.weekStartDate || !data.weekEndDate) {
      return true;
    }

    return data.weekEndDate > data.weekStartDate;
  },
  {
    message: 'Week end date must be after week start date',
    path: ['weekEndDate'],
  },
);

export const reportParamsSchema = z.object({
  id: z.string().min(1),
});

export const getMyReportsQuerySchema = z.object({
  status: z.nativeEnum(ReportStatus).optional(),
});

export type CreateReportInput = z.infer<typeof createReportSchema>;
export type UpdateDraftReportInput = z.infer<typeof updateDraftReportSchema>;
export type ReportParams = z.infer<typeof reportParamsSchema>;
export type GetMyReportsQuery = z.infer<typeof getMyReportsQuerySchema>;
