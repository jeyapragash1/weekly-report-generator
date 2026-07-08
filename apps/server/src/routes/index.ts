import { Router } from 'express';
import { authRouter } from '../features/auth/auth.routes.js';
import { usersRouter } from '../features/users/users.routes.js';
import { healthRouter } from './health.routes.js';

export const apiRouter = Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/health', healthRouter);
apiRouter.use('/users', usersRouter);
