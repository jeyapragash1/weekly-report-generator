import type {
  Project,
  ProjectSortOption,
  ProjectStatus,
  ProjectStatusFilter,
} from '@/features/projects/project-types';

export function formatProjectDate(value: string) {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value));
}

export function formatProjectStatus(status: ProjectStatus) {
  const labels = {
    ACTIVE: 'Active',
    ON_HOLD: 'On hold',
    ARCHIVED: 'Archived',
  } satisfies Record<ProjectStatus, string>;

  return labels[status];
}

export function filterAndSortProjects(
  projects: Project[],
  input: {
    search: string;
    status: ProjectStatusFilter;
    sort: ProjectSortOption;
  },
) {
  const normalizedSearch = input.search.trim().toLowerCase();

  return projects
    .filter((project) => {
      const matchesSearch = project.name.toLowerCase().includes(normalizedSearch);
      const matchesStatus = input.status === 'ALL' || project.status === input.status;

      return matchesSearch && matchesStatus;
    })
    .sort((firstProject, secondProject) => {
      if (input.sort === 'alphabetical') {
        return firstProject.name.localeCompare(secondProject.name);
      }

      const firstDate = new Date(firstProject.createdAt).getTime();
      const secondDate = new Date(secondProject.createdAt).getTime();

      return input.sort === 'newest' ? secondDate - firstDate : firstDate - secondDate;
    });
}
