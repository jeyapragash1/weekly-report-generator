import { Prisma, ProjectStatus } from '@prisma/client';
import { HttpStatus } from '../../constants/http.js';
import { AppError } from '../../shared/errors/app-error.js';
import { toProjectDto } from './projects.mapper.js';
import { projectsRepository } from './projects.repository.js';
import type {
  CreateProjectInput,
  GetProjectsQuery,
  UpdateProjectInput,
} from './projects.schemas.js';

function isUniqueConstraintError(error: unknown) {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002';
}

async function getProjectOrThrow(projectId: string) {
  const project = await projectsRepository.findById(projectId);

  if (!project) {
    throw new AppError('Project not found', HttpStatus.NOT_FOUND);
  }

  return project;
}

async function ensureProjectNameIsUnique(name: string, ignoreProjectId?: string) {
  const existingProject = await projectsRepository.findByName(name);

  if (existingProject && existingProject.id !== ignoreProjectId) {
    throw new AppError('Project name is already in use', HttpStatus.CONFLICT);
  }
}

export const projectsService = {
  async createProject(input: CreateProjectInput) {
    await ensureProjectNameIsUnique(input.name);

    try {
      const project = await projectsRepository.create({
        name: input.name,
        description: input.description,
        status: input.status,
        archivedAt: input.status === ProjectStatus.ARCHIVED ? new Date() : undefined,
      });

      return toProjectDto(project);
    } catch (error) {
      if (isUniqueConstraintError(error)) {
        throw new AppError('Project name is already in use', HttpStatus.CONFLICT);
      }

      throw error;
    }
  },

  async updateProject(projectId: string, input: UpdateProjectInput) {
    const project = await getProjectOrThrow(projectId);

    if (input.name) {
      await ensureProjectNameIsUnique(input.name, project.id);
    }

    try {
      const updatedProject = await projectsRepository.update(project.id, {
        ...input,
        archivedAt:
          input.status === ProjectStatus.ARCHIVED
            ? (project.archivedAt ?? new Date())
            : input.status
              ? null
              : undefined,
      });

      return toProjectDto(updatedProject);
    } catch (error) {
      if (isUniqueConstraintError(error)) {
        throw new AppError('Project name is already in use', HttpStatus.CONFLICT);
      }

      throw error;
    }
  },

  async archiveProject(projectId: string) {
    const project = await getProjectOrThrow(projectId);

    if (project.status === ProjectStatus.ARCHIVED) {
      return toProjectDto(project);
    }

    const archivedProject = await projectsRepository.archive(project.id);

    return toProjectDto(archivedProject);
  },

  async getProjects(query: GetProjectsQuery) {
    const projects = await projectsRepository.findMany({
      status: query.status,
    });

    return projects.map(toProjectDto);
  },

  async getProjectById(projectId: string) {
    const project = await getProjectOrThrow(projectId);

    return toProjectDto(project);
  },
};
