import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate.js';
import { validateRequest } from '../../middleware/validate-request.js';
import {
  createDraftReport,
  deleteDraftReport,
  getMyReports,
  getReportById,
  submitReport,
  updateDraftReport,
} from './reports.controller.js';
import {
  createReportSchema,
  getMyReportsQuerySchema,
  reportParamsSchema,
  updateDraftReportSchema,
} from './reports.schemas.js';

export const reportsRouter = Router();

reportsRouter.use(authenticate);

reportsRouter.get('/', validateRequest({ query: getMyReportsQuerySchema }), getMyReports);
reportsRouter.post('/', validateRequest({ body: createReportSchema }), createDraftReport);
reportsRouter.get('/:id', validateRequest({ params: reportParamsSchema }), getReportById);
reportsRouter.put(
  '/:id',
  validateRequest({ params: reportParamsSchema, body: updateDraftReportSchema }),
  updateDraftReport,
);
reportsRouter.post('/:id/submit', validateRequest({ params: reportParamsSchema }), submitReport);
reportsRouter.delete('/:id', validateRequest({ params: reportParamsSchema }), deleteDraftReport);
