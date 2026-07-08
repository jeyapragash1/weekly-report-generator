import type { RequestHandler } from 'express';
import { HttpStatus } from '../../constants/http.js';
import { asyncHandler } from '../../shared/utils/async-handler.js';
import { projectsService } from './projects.service.js';
import type { CreateProjectInput, ProjectParams, UpdateProjectInput } from './projects.schemas.js';

export const createProject: RequestHandler = asyncHandler(async (request, response) => {
  const project = await projectsService.createProject(request.body as CreateProjectInput);

  response.status(HttpStatus.CREATED).json({
    data: project,
  });
});

export const updateProject: RequestHandler = asyncHandler(async (request, response) => {
  const { id } = request.params as ProjectParams;
  const project = await projectsService.updateProject(id, request.body as UpdateProjectInput);

  response.status(HttpStatus.OK).json({
    data: project,
  });
});

export const deleteProject: RequestHandler = asyncHandler(async (request, response) => {
  const { id } = request.params as ProjectParams;
  const project = await projectsService.archiveProject(id);

  response.status(HttpStatus.OK).json({
    data: project,
  });
});

export const getProjects: RequestHandler = asyncHandler(async (request, response) => {
  const projects = await projectsService.getProjects(request.query);

  response.status(HttpStatus.OK).json({
    data: projects,
  });
});

export const getProjectById: RequestHandler = asyncHandler(async (request, response) => {
  const { id } = request.params as ProjectParams;
  const project = await projectsService.getProjectById(id);

  response.status(HttpStatus.OK).json({
    data: project,
  });
});
