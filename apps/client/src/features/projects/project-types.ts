export type ProjectStatus = 'ACTIVE' | 'ON_HOLD' | 'ARCHIVED';

export type Project = {
  id: string;
  name: string;
  description: string | null;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
  archivedAt: string | null;
};

export type CreateProjectPayload = {
  name: string;
  description?: string;
};

export type UpdateProjectPayload = {
  name?: string;
  description?: string;
  status?: ProjectStatus;
};

export type ProjectStatusFilter = 'ALL' | 'ACTIVE' | 'ARCHIVED';
export type ProjectSortOption = 'newest' | 'oldest' | 'alphabetical';
