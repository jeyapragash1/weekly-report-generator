import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  archiveProject,
  createProject,
  getProjects,
  updateProject,
} from '@/features/projects/project-api';
import type {
  CreateProjectPayload,
  Project,
  UpdateProjectPayload,
} from '@/features/projects/project-types';

export const projectsQueryKey = ['projects'] as const;

export function useProjects() {
  return useQuery({
    queryKey: projectsQueryKey,
    queryFn: () => getProjects(),
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateProjectPayload) => createProject(input),
    onSuccess() {
      void queryClient.invalidateQueries({ queryKey: projectsQueryKey });
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: { projectId: string; data: UpdateProjectPayload }) =>
      updateProject(input.projectId, input.data),
    onSuccess() {
      void queryClient.invalidateQueries({ queryKey: projectsQueryKey });
    },
  });
}

export function useArchiveProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: archiveProject,
    async onMutate(projectId) {
      await queryClient.cancelQueries({ queryKey: projectsQueryKey });

      const previousProjects = queryClient.getQueryData<Project[]>(projectsQueryKey);

      queryClient.setQueryData<Project[]>(projectsQueryKey, (currentProjects) =>
        currentProjects?.map((project) =>
          project.id === projectId
            ? {
                ...project,
                status: 'ARCHIVED',
                archivedAt: new Date().toISOString(),
              }
            : project,
        ),
      );

      return { previousProjects };
    },
    onError(_error, _projectId, context) {
      queryClient.setQueryData(projectsQueryKey, context?.previousProjects);
    },
    onSettled() {
      void queryClient.invalidateQueries({ queryKey: projectsQueryKey });
    },
  });
}
