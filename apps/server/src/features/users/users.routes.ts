import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate.js';
import { getCurrentUser } from './users.controller.js';

export const usersRouter = Router();

usersRouter.get('/me', authenticate, getCurrentUser);
