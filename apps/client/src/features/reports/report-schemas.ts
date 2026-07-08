import { z } from 'zod';

export const reportFormSchema = z
  .object({
    weekStartDate: z.string().min(1, 'Week start date is required'),
    weekEndDate: z.string().min(1, 'Week end date is required'),
    projectId: z.string().min(1, 'Project is required'),
    tasksCompleted: z.string().trim().min(1, 'Tasks completed is required').max(5000),
    tasksPlanned: z.string().trim().min(1, 'Tasks planned is required').max(5000),
    blockers: z.string().trim().min(1, 'Blockers is required').max(3000),
    hoursWorked: z
      .number()
      .min(0, 'Hours worked cannot be negative')
      .max(168, 'Hours worked cannot exceed 168')
      .optional(),
    notes: z.string().trim().max(3000).optional(),
  })
  .refine((values) => new Date(values.weekEndDate) > new Date(values.weekStartDate), {
    message: 'Week end date must be after week start date',
    path: ['weekEndDate'],
  });

export type ReportFormValues = z.infer<typeof reportFormSchema>;
