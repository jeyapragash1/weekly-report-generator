import { useQuery } from '@tanstack/react-query';
import { AlertCircle, FileSearch } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { PageContainer } from '@/components/layout/page-container';
import { StatePanel } from '@/components/states/state-panel';
import {
  getDashboardActivity,
  getDashboardSubmissionStatus,
  getDashboardWorkload,
} from '@/features/dashboard/dashboard-api';
import { getApiErrorMessage } from '@/features/auth/api-error';
import { ManagerReportViewDialog } from '@/features/reports/components/manager-report-view-dialog';
import { ManagerReportsPagination } from '@/features/reports/components/manager-reports-pagination';
import { ManagerReportsSkeleton } from '@/features/reports/components/manager-reports-skeleton';
import { ManagerReportsStatsBar } from '@/features/reports/components/manager-reports-stats-bar';
import { ManagerReportsTable } from '@/features/reports/components/manager-reports-table';
import { ManagerReportsToolbar } from '@/features/reports/components/manager-reports-toolbar';
import type {
  ManagerReportFilters,
  ManagerReportItem,
} from '@/features/reports/manager-reports-types';
import {
  filterManagerReports,
  getManagerReportStats,
  paginateManagerReports,
} from '@/features/reports/manager-reports-utils';

const PAGE_SIZE = 10;

const initialFilters: ManagerReportFilters = {
  search: '',
  memberId: 'ALL',
  projectId: 'ALL',
  status: 'ALL',
  dateFrom: '',
  dateTo: '',
};

export function ManagerReportsShellPage() {
  const [filters, setFilters] = useState<ManagerReportFilters>(initialFilters);
  const [page, setPage] = useState(1);
  const [viewingReport, setViewingReport] = useState<ManagerReportItem | null>(null);

  const activityQuery = useQuery({
    queryKey: ['dashboard', 'activity', 'manager'],
    queryFn: () => getDashboardActivity(50),
  });
  const submissionStatusQuery = useQuery({
    queryKey: ['dashboard', 'submission-status', 'manager'],
    queryFn: getDashboardSubmissionStatus,
  });
  const workloadQuery = useQuery({
    queryKey: ['dashboard', 'workload', 'manager'],
    queryFn: getDashboardWorkload,
  });

  useEffect(() => {
    setPage(1);
  }, [filters]);

  const isLoading =
    activityQuery.isLoading || submissionStatusQuery.isLoading || workloadQuery.isLoading;
  const error = activityQuery.error ?? submissionStatusQuery.error ?? workloadQuery.error;
  const reports = activityQuery.data ?? [];
  const members = submissionStatusQuery.data ?? [];
  const projects = workloadQuery.data ?? [];

  const filteredReports = useMemo(() => filterManagerReports(reports, filters), [filters, reports]);
  const stats = useMemo(() => getManagerReportStats(filteredReports), [filteredReports]);
  const pagination = useMemo(
    () => paginateManagerReports(filteredReports, page, PAGE_SIZE),
    [filteredReports, page],
  );

  useEffect(() => {
    if (pagination.page !== page) {
      setPage(pagination.page);
    }
  }, [page, pagination.page]);

  function retryAll() {
    void activityQuery.refetch();
    void submissionStatusQuery.refetch();
    void workloadQuery.refetch();
  }

  return (
    <PageContainer
      description="Review team reporting activity with filters for member, project, status, and date."
      title="Manager Reports"
    >
      {isLoading ? <ManagerReportsSkeleton /> : null}

      {!isLoading && error ? (
        <StatePanel
          actionLabel="Retry"
          description={getApiErrorMessage(error)}
          icon={AlertCircle}
          onAction={retryAll}
          title="Unable to load manager reports"
          tone="danger"
        />
      ) : null}

      {!isLoading && !error ? (
        <div className="space-y-4">
          <ManagerReportsToolbar
            filters={filters}
            members={members}
            onChange={setFilters}
            projects={projects}
          />

          <ManagerReportsStatsBar
            draftReports={stats.draftReports}
            submittedReports={stats.submittedReports}
            totalReports={stats.totalReports}
            uniqueMembers={stats.uniqueMembers}
            uniqueProjects={stats.uniqueProjects}
          />

          {pagination.items.length > 0 ? (
            <>
              <ManagerReportsTable onView={setViewingReport} reports={pagination.items} />
              <ManagerReportsPagination
                onPageChange={setPage}
                page={pagination.page}
                pageSize={PAGE_SIZE}
                totalItems={pagination.totalItems}
                totalPages={pagination.totalPages}
              />
            </>
          ) : (
            <StatePanel
              description="No reports match the selected filters."
              icon={FileSearch}
              title="No reports found"
            />
          )}
        </div>
      ) : null}

      <ManagerReportViewDialog
        onClose={() => setViewingReport(null)}
        open={Boolean(viewingReport)}
        report={viewingReport}
      />
    </PageContainer>
  );
}
