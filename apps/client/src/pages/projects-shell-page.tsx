import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import { useMemo, useState } from 'react';
import { PageContainer } from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import { getApiErrorMessage } from '@/features/auth/api-error';
import { ArchiveDialog } from '@/features/projects/components/archive-dialog';
import { EmptyProjects } from '@/features/projects/components/empty-projects';
import { ProjectDetailsDialog } from '@/features/projects/components/project-details-dialog';
import { ProjectDialog } from '@/features/projects/components/project-dialog';
import { ProjectTable } from '@/features/projects/components/project-table';
import { ProjectsSkeleton } from '@/features/projects/components/projects-skeleton';
import { ProjectsToolbar } from '@/features/projects/components/projects-toolbar';
import {
  useArchiveProject,
  useCreateProject,
  useProjects,
  useUpdateProject,
} from '@/features/projects/hooks/use-projects';
import type { ProjectFormValues } from '@/features/projects/project-schemas';
import type {
  Project,
  ProjectSortOption,
  ProjectStatusFilter,
} from '@/features/projects/project-types';
import { filterAndSortProjects } from '@/features/projects/project-utils';
import { useToast } from '@/providers/toast-provider';

function normalizeProjectPayload(values: ProjectFormValues) {
  return {
    ...values,
    description: values.description?.trim() || undefined,
  };
}

export function ProjectsShellPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<ProjectStatusFilter>('ALL');
  const [sort, setSort] = useState<ProjectSortOption>('newest');
  const [createOpen, setCreateOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [viewingProject, setViewingProject] = useState<Project | null>(null);
  const [archivingProject, setArchivingProject] = useState<Project | null>(null);
  const [dialogError, setDialogError] = useState<string | null>(null);
  const { showToast } = useToast();

  const projectsQuery = useProjects();
  const createMutation = useCreateProject();
  const updateMutation = useUpdateProject();
  const archiveMutation = useArchiveProject();

  const projects = projectsQuery.data ?? [];
  const visibleProjects = useMemo(
    () => filterAndSortProjects(projects, { search, status, sort }),
    [projects, search, sort, status],
  );
  const hasFilters = search.trim().length > 0 || status !== 'ALL';

  function openCreateDialog() {
    setDialogError(null);
    setCreateOpen(true);
  }

  function openEditDialog(project: Project) {
    setDialogError(null);
    setEditingProject(project);
  }

  function handleCreate(values: ProjectFormValues) {
    setDialogError(null);
    createMutation.mutate(normalizeProjectPayload(values), {
      onSuccess(project) {
        setCreateOpen(false);
        showToast({
          title: 'Project created',
          description: `${project.name} has been added.`,
          variant: 'success',
        });
      },
      onError(error) {
        setDialogError(getApiErrorMessage(error));
      },
    });
  }

  function handleUpdate(values: ProjectFormValues) {
    if (!editingProject) {
      return;
    }

    setDialogError(null);
    updateMutation.mutate(
      {
        projectId: editingProject.id,
        data: normalizeProjectPayload(values),
      },
      {
        onSuccess(project) {
          setEditingProject(null);
          showToast({
            title: 'Project updated',
            description: `${project.name} was updated successfully.`,
            variant: 'success',
          });
        },
        onError(error) {
          setDialogError(getApiErrorMessage(error));
        },
      },
    );
  }

  function handleArchive() {
    if (!archivingProject) {
      return;
    }

    archiveMutation.mutate(archivingProject.id, {
      onSuccess(project) {
        setArchivingProject(null);
        showToast({
          title: 'Project archived',
          description: `${project.name} was archived.`,
          variant: 'success',
        });
      },
      onError(error) {
        showToast({
          title: 'Archive failed',
          description: getApiErrorMessage(error),
          variant: 'error',
        });
      },
    });
  }

  return (
    <PageContainer
      description="Create and manage the projects used in weekly reporting."
      title="Projects"
    >
      {projectsQuery.isLoading ? <ProjectsSkeleton /> : null}

      {!projectsQuery.isLoading && projectsQuery.error ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-6 text-destructive">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
              <div>
                <h2 className="text-sm font-semibold">Unable to load projects</h2>
                <p className="mt-1 text-sm leading-6">{getApiErrorMessage(projectsQuery.error)}</p>
              </div>
            </div>
            <Button onClick={() => void projectsQuery.refetch()} type="button" variant="outline">
              Retry
            </Button>
          </div>
        </div>
      ) : null}

      {!projectsQuery.isLoading && !projectsQuery.error ? (
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
          initial={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.2 }}
        >
          <ProjectsToolbar
            onCreate={openCreateDialog}
            onSearchChange={setSearch}
            onSortChange={setSort}
            onStatusChange={setStatus}
            search={search}
            sort={sort}
            status={status}
          />

          {visibleProjects.length > 0 ? (
            <ProjectTable
              onArchive={setArchivingProject}
              onEdit={openEditDialog}
              onView={setViewingProject}
              projects={visibleProjects}
            />
          ) : (
            <EmptyProjects hasFilters={hasFilters} onCreate={openCreateDialog} />
          )}
        </motion.div>
      ) : null}

      <ProjectDialog
        errorMessage={dialogError}
        isSubmitting={createMutation.isPending}
        mode="create"
        onClose={() => setCreateOpen(false)}
        onSubmit={handleCreate}
        open={createOpen}
      />
      <ProjectDialog
        errorMessage={dialogError}
        isSubmitting={updateMutation.isPending}
        mode="edit"
        onClose={() => setEditingProject(null)}
        onSubmit={handleUpdate}
        open={Boolean(editingProject)}
        project={editingProject ?? undefined}
      />
      <ArchiveDialog
        isSubmitting={archiveMutation.isPending}
        onClose={() => setArchivingProject(null)}
        onConfirm={handleArchive}
        open={Boolean(archivingProject)}
        project={archivingProject}
      />
      <ProjectDetailsDialog
        onClose={() => setViewingProject(null)}
        open={Boolean(viewingProject)}
        project={viewingProject}
      />
    </PageContainer>
  );
}
