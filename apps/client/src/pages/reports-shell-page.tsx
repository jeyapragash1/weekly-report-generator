import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PageContainer } from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import { getApiErrorMessage } from '@/features/auth/api-error';
import { useProjects } from '@/features/projects/hooks/use-projects';
import { DeleteDialog } from '@/features/reports/components/delete-dialog';
import { EmptyReports } from '@/features/reports/components/empty-reports';
import { ReportDetailsDialog } from '@/features/reports/components/report-details-dialog';
import { ReportDialog } from '@/features/reports/components/report-dialog';
import { ReportTable } from '@/features/reports/components/report-table';
import { ReportsSkeleton } from '@/features/reports/components/reports-skeleton';
import { ReportsToolbar } from '@/features/reports/components/reports-toolbar';
import { SubmitDialog } from '@/features/reports/components/submit-dialog';
import {
  useCreateReport,
  useDeleteReport,
  useReports,
  useSubmitReport,
  useUpdateReport,
} from '@/features/reports/hooks/use-reports';
import type { ReportFormValues } from '@/features/reports/report-schemas';
import type {
  ReportSortOption,
  ReportStatusFilter,
  WeeklyReport,
} from '@/features/reports/report-types';
import { filterAndSortReports } from '@/features/reports/report-utils';
import { useToast } from '@/providers/toast-provider';

function normalizeReportPayload(values: ReportFormValues) {
  return {
    ...values,
    notes: values.notes?.trim() || undefined,
  };
}

export function ReportsShellPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<ReportStatusFilter>(
    searchParams.get('status') === 'SUBMITTED' ? 'SUBMITTED' : 'ALL',
  );
  const [projectId, setProjectId] = useState('ALL');
  const [week, setWeek] = useState('');
  const [sort, setSort] = useState<ReportSortOption>('newest');
  const [createOpen, setCreateOpen] = useState(false);
  const [editingReport, setEditingReport] = useState<WeeklyReport | null>(null);
  const [viewingReport, setViewingReport] = useState<WeeklyReport | null>(null);
  const [submittingReport, setSubmittingReport] = useState<WeeklyReport | null>(null);
  const [deletingReport, setDeletingReport] = useState<WeeklyReport | null>(null);
  const [dialogError, setDialogError] = useState<string | null>(null);
  const { showToast } = useToast();

  const reportsQuery = useReports();
  const projectsQuery = useProjects();
  const createMutation = useCreateReport();
  const updateMutation = useUpdateReport();
  const submitMutation = useSubmitReport();
  const deleteMutation = useDeleteReport();

  useEffect(() => {
    setStatus(searchParams.get('status') === 'SUBMITTED' ? 'SUBMITTED' : 'ALL');
  }, [searchParams]);

  useEffect(() => {
    if (searchParams.get('intent') === 'create') {
      setDialogError(null);
      setCreateOpen(true);
      setSearchParams((currentParams) => {
        const nextParams = new URLSearchParams(currentParams);
        nextParams.delete('intent');
        return nextParams;
      });
    }
  }, [searchParams, setSearchParams]);

  const reports = reportsQuery.data ?? [];
  const projects = projectsQuery.data ?? [];
  const visibleReports = useMemo(
    () => filterAndSortReports(reports, { search, status, projectId, week, sort }),
    [projectId, reports, search, sort, status, week],
  );
  const hasFilters =
    search.trim().length > 0 || status !== 'ALL' || projectId !== 'ALL' || week !== '';
  const isLoading = reportsQuery.isLoading || projectsQuery.isLoading;
  const error = reportsQuery.error ?? projectsQuery.error;

  function openCreateDialog() {
    setDialogError(null);
    setCreateOpen(true);
  }

  function openEditDialog(report: WeeklyReport) {
    setDialogError(null);
    setEditingReport(report);
  }

  function handleCreate(values: ReportFormValues) {
    setDialogError(null);
    createMutation.mutate(normalizeReportPayload(values), {
      onSuccess(report) {
        setCreateOpen(false);
        showToast({
          title: 'Draft saved',
          description: `${report.project.name} draft created.`,
          variant: 'success',
        });
      },
      onError(error) {
        setDialogError(getApiErrorMessage(error));
      },
    });
  }

  function handleUpdate(values: ReportFormValues) {
    if (!editingReport) {
      return;
    }

    setDialogError(null);
    updateMutation.mutate(
      {
        reportId: editingReport.id,
        data: normalizeReportPayload(values),
      },
      {
        onSuccess(report) {
          setEditingReport(null);
          showToast({
            title: 'Report updated',
            description: `${report.project.name} report updated.`,
            variant: 'success',
          });
        },
        onError(error) {
          setDialogError(getApiErrorMessage(error));
        },
      },
    );
  }

  function handleSubmitReport() {
    if (!submittingReport) {
      return;
    }

    submitMutation.mutate(submittingReport.id, {
      onSuccess(report) {
        setSubmittingReport(null);
        showToast({
          title: 'Report submitted',
          description: `${report.project.name} report submitted.`,
          variant: 'success',
        });
      },
      onError(error) {
        showToast({
          title: 'Submit failed',
          description: getApiErrorMessage(error),
          variant: 'error',
        });
      },
    });
  }

  function handleDeleteReport() {
    if (!deletingReport) {
      return;
    }

    deleteMutation.mutate(deletingReport.id, {
      onSuccess() {
        setDeletingReport(null);
        showToast({
          title: 'Draft deleted',
          description: 'Draft report deleted.',
          variant: 'success',
        });
      },
      onError(error) {
        showToast({
          title: 'Delete failed',
          description: getApiErrorMessage(error),
          variant: 'error',
        });
      },
    });
  }

  return (
    <PageContainer
      description="Create, review, and submit weekly reports."
      title="Weekly Reports"
    >
      {isLoading ? <ReportsSkeleton /> : null}

      {!isLoading && error ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-6 text-destructive">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
              <div>
                <h2 className="text-sm font-semibold">Unable to load reports</h2>
                <p className="mt-1 text-sm leading-6">{getApiErrorMessage(error)}</p>
              </div>
            </div>
            <Button
              onClick={() => {
                void reportsQuery.refetch();
                void projectsQuery.refetch();
              }}
              type="button"
              variant="outline"
            >
              Retry
            </Button>
          </div>
        </div>
      ) : null}

      {!isLoading && !error ? (
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
          initial={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.2 }}
        >
          <ReportsToolbar
            onCreate={openCreateDialog}
            onProjectChange={setProjectId}
            onSearchChange={setSearch}
            onSortChange={setSort}
            onStatusChange={setStatus}
            onWeekChange={setWeek}
            projectId={projectId}
            projects={projects}
            search={search}
            sort={sort}
            status={status}
            week={week}
          />

          {visibleReports.length > 0 ? (
            <ReportTable
              onDelete={setDeletingReport}
              onEdit={openEditDialog}
              onSubmit={setSubmittingReport}
              onView={setViewingReport}
              reports={visibleReports}
            />
          ) : (
            <EmptyReports hasFilters={hasFilters} onCreate={openCreateDialog} />
          )}
        </motion.div>
      ) : null}

      <ReportDialog
        errorMessage={dialogError}
        isSubmitting={createMutation.isPending}
        mode="create"
        onClose={() => setCreateOpen(false)}
        onSubmit={handleCreate}
        open={createOpen}
        projects={projects}
      />
      <ReportDialog
        errorMessage={dialogError}
        isSubmitting={updateMutation.isPending}
        mode="edit"
        onClose={() => setEditingReport(null)}
        onSubmit={handleUpdate}
        open={Boolean(editingReport)}
        projects={projects}
        report={editingReport ?? undefined}
      />
      <ReportDetailsDialog
        onClose={() => setViewingReport(null)}
        open={Boolean(viewingReport)}
        report={viewingReport}
      />
      <SubmitDialog
        isSubmitting={submitMutation.isPending}
        onClose={() => setSubmittingReport(null)}
        onConfirm={handleSubmitReport}
        open={Boolean(submittingReport)}
        report={submittingReport}
      />
      <DeleteDialog
        isSubmitting={deleteMutation.isPending}
        onClose={() => setDeletingReport(null)}
        onConfirm={handleDeleteReport}
        open={Boolean(deletingReport)}
        report={deletingReport}
      />
    </PageContainer>
  );
}
