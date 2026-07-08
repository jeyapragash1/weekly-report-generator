import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';
import { validateRequest } from '../../middleware/validate-request.js';
import { chatWithAssistant } from './ai.controller.js';
import { aiChatRequestSchema } from './ai.schemas.js';

export const aiRouter = Router();

aiRouter.post(
  '/chat',
  authenticate,
  authorize('MANAGER', 'ADMIN'),
  validateRequest({ body: aiChatRequestSchema }),
  chatWithAssistant,
);
