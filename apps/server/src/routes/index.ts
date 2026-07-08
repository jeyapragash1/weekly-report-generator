import { Router } from 'express';
import { aiRouter } from '../features/ai/ai.routes.js';
import { authRouter } from '../features/auth/auth.routes.js';
import { dashboardRouter } from '../features/dashboard/dashboard.routes.js';
import { projectsRouter } from '../features/projects/projects.routes.js';
import { reportsRouter } from '../features/reports/reports.routes.js';
import { usersRouter } from '../features/users/users.routes.js';
import { healthRouter } from './health.routes.js';

export const apiRouter = Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/ai', aiRouter);
apiRouter.use('/dashboard', dashboardRouter);
apiRouter.use('/health', healthRouter);
apiRouter.use('/projects', projectsRouter);
apiRouter.use('/reports', reportsRouter);
apiRouter.use('/users', usersRouter);
