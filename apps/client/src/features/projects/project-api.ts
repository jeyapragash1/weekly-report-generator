import { httpClient } from '@/api/http-client';
import type {
  CreateProjectPayload,
  Project,
  ProjectStatus,
  UpdateProjectPayload,
} from '@/features/projects/project-types';

type ApiResponse<TData> = {
  data: TData;
};

export async function getProjects(status?: ProjectStatus) {
  const response = await httpClient.get<ApiResponse<Project[]>>('/projects', {
    params: status ? { status } : undefined,
  });

  return response.data.data;
}

export async function createProject(input: CreateProjectPayload) {
  const response = await httpClient.post<ApiResponse<Project>>('/projects', input);

  return response.data.data;
}

export async function updateProject(projectId: string, input: UpdateProjectPayload) {
  const response = await httpClient.put<ApiResponse<Project>>(`/projects/${projectId}`, input);

  return response.data.data;
}

export async function archiveProject(projectId: string) {
  const response = await httpClient.delete<ApiResponse<Project>>(`/projects/${projectId}`);

  return response.data.data;
}
