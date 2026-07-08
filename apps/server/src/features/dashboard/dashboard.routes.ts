import { RoleName } from '@prisma/client';
import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';
import { validateRequest } from '../../middleware/validate-request.js';
import {
  getDashboardActivity,
  getDashboardSubmissionStatus,
  getDashboardSummary,
  getDashboardTaskTrends,
  getDashboardWorkload,
} from './dashboard.controller.js';
import { dashboardActivityQuerySchema } from './dashboard.schemas.js';

export const dashboardRouter = Router();

dashboardRouter.use(authenticate);
dashboardRouter.use(authorize(RoleName.MANAGER, RoleName.ADMIN));

dashboardRouter.get('/summary', getDashboardSummary);
dashboardRouter.get(
  '/activity',
  validateRequest({ query: dashboardActivityQuerySchema }),
  getDashboardActivity,
);
dashboardRouter.get('/submission-status', getDashboardSubmissionStatus);
dashboardRouter.get('/workload', getDashboardWorkload);
dashboardRouter.get('/task-trends', getDashboardTaskTrends);
