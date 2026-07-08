import { RoleName } from '@prisma/client';
import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';
import { validateRequest } from '../../middleware/validate-request.js';
import {
  createProject,
  deleteProject,
  getProjectById,
  getProjects,
  updateProject,
} from './projects.controller.js';
import {
  createProjectSchema,
  getProjectsQuerySchema,
  projectParamsSchema,
  updateProjectSchema,
} from './projects.schemas.js';

export const projectsRouter = Router();

projectsRouter.use(authenticate);

projectsRouter.get('/', validateRequest({ query: getProjectsQuerySchema }), getProjects);
projectsRouter.post(
  '/',
  authorize(RoleName.MANAGER, RoleName.ADMIN),
  validateRequest({ body: createProjectSchema }),
  createProject,
);
projectsRouter.get('/:id', validateRequest({ params: projectParamsSchema }), getProjectById);
projectsRouter.put(
  '/:id',
  authorize(RoleName.MANAGER, RoleName.ADMIN),
  validateRequest({ params: projectParamsSchema, body: updateProjectSchema }),
  updateProject,
);
projectsRouter.delete(
  '/:id',
  authorize(RoleName.MANAGER, RoleName.ADMIN),
  validateRequest({ params: projectParamsSchema }),
  deleteProject,
);
