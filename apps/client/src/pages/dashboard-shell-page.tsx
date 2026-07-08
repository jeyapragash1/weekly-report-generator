import { useQuery } from '@tanstack/react-query';
import {
  AlertCircle,
  Award,
  BarChart3,
  Clock3,
  FileText,
  ListChecks,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  TriangleAlert,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { PageContainer } from '@/components/layout/page-container';
import { StatePanel } from '@/components/states/state-panel';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import {
  getDashboardActivity,
  getDashboardSubmissionStatus,
  getDashboardSummary,
  getDashboardTaskTrends,
  getDashboardWorkload,
} from '@/features/dashboard/dashboard-api';
import { ActivityList } from '@/features/dashboard/components/activity-list';
import { AnalyticsCard } from '@/features/dashboard/components/analytics-card';
import { AnalyticsSection } from '@/features/dashboard/components/analytics-section';
import { DashboardChartSkeleton } from '@/features/dashboard/components/dashboard-chart-skeleton';
import { DashboardCard } from '@/features/dashboard/components/dashboard-card';
import { DashboardSkeleton } from '@/features/dashboard/components/dashboard-skeleton';
import { ProjectBarChart } from '@/features/dashboard/components/project-bar-chart';
import { SubmissionPieChart } from '@/features/dashboard/components/submission-pie-chart';
import { TrendLineChart } from '@/features/dashboard/components/trend-line-chart';
import type {
  DashboardSubmissionStatusItem,
  DashboardWorkloadItem,
} from '@/features/dashboard/dashboard-types';
import { getApiErrorMessage } from '@/features/auth/api-error';

function findMostActiveProject(items: DashboardWorkloadItem[]) {
  return items.reduce<DashboardWorkloadItem | null>(
    (current, project) =>
      project.totalReports > (current?.totalReports ?? -1) ? project : current,
    null,
  );
}

function findHighestSubmissionRate(items: DashboardSubmissionStatusItem[]) {
  return items.reduce<DashboardSubmissionStatusItem | null>(
    (current, item) => (item.complianceRate > (current?.complianceRate ?? -1) ? item : current),
    null,
  );
}

function findLowestSubmissionRate(items: DashboardSubmissionStatusItem[]) {
  return items.reduce<DashboardSubmissionStatusItem | null>(
    (current, item) => (item.complianceRate < (current?.complianceRate ?? 101) ? item : current),
    null,
  );
}

type ActivityStatusFilter = 'ALL' | 'SUBMITTED' | 'DRAFT';
type ActivityWindowFilter = 'ALL' | '30' | '90';

function isWithinActivityWindow(dateValue: string, window: ActivityWindowFilter) {
  if (window === 'ALL') {
    return true;
  }

  const days = Number(window);
  const now = new Date();
  const threshold = new Date(now);
  threshold.setDate(now.getDate() - days);

  return new Date(dateValue) >= threshold;
}

export function DashboardShellPage() {
  const [activitySearch, setActivitySearch] = useState('');
  const [activityStatus, setActivityStatus] = useState<ActivityStatusFilter>('ALL');
  const [activityProject, setActivityProject] = useState('ALL');
  const [activityWindow, setActivityWindow] = useState<ActivityWindowFilter>('ALL');

  const summaryQuery = useQuery({
    queryKey: ['dashboard', 'summary'],
    queryFn: getDashboardSummary,
  });

  const activityQuery = useQuery({
    queryKey: ['dashboard', 'activity'],
    queryFn: () => getDashboardActivity(50),
  });

  const submissionStatusQuery = useQuery({
    queryKey: ['dashboard', 'submission-status'],
    queryFn: getDashboardSubmissionStatus,
  });

  const workloadQuery = useQuery({
    queryKey: ['dashboard', 'workload'],
    queryFn: getDashboardWorkload,
  });

  const taskTrendsQuery = useQuery({
    queryKey: ['dashboard', 'task-trends'],
    queryFn: getDashboardTaskTrends,
  });

  const isLoading = summaryQuery.isLoading || activityQuery.isLoading;
  const error = summaryQuery.error ?? activityQuery.error;
  const analyticsLoading =
    submissionStatusQuery.isLoading || workloadQuery.isLoading || taskTrendsQuery.isLoading;
  const analyticsError =
    submissionStatusQuery.error ?? workloadQuery.error ?? taskTrendsQuery.error;

  const mostActiveProject = findMostActiveProject(workloadQuery.data ?? []);
  const submissionRates = (submissionStatusQuery.data ?? []).filter(
    (item) => item.totalReports > 0,
  );
  const highestSubmissionRate = findHighestSubmissionRate(submissionRates);
  const lowestSubmissionRate = findLowestSubmissionRate(submissionRates);

  const activityItems = activityQuery.data ?? [];
  const workloadItems = workloadQuery.data ?? [];
  const filteredActivity = useMemo(() => {
    const normalizedSearch = activitySearch.trim().toLowerCase();

    return activityItems.filter((item) => {
      const searchableText = [item.user.name, item.user.email, item.project.name]
        .join(' ')
        .toLowerCase();
      const matchesSearch = !normalizedSearch || searchableText.includes(normalizedSearch);
      const matchesStatus = activityStatus === 'ALL' || item.status === activityStatus;
      const matchesProject = activityProject === 'ALL' || item.project.id === activityProject;
      const dateSource = item.submittedAt ?? item.week.endDate;
      const matchesWindow = isWithinActivityWindow(dateSource, activityWindow);

      return matchesSearch && matchesStatus && matchesProject && matchesWindow;
    });
  }, [activityItems, activityProject, activitySearch, activityStatus, activityWindow]);

  const summary = summaryQuery.data;
  const submittedRatio = summary
    ? `${summary.submittedReports.toLocaleString()} / ${summary.totalReports.toLocaleString()} submitted`
    : undefined;
  const pendingRatio = summary
    ? `${summary.pendingReports.toLocaleString()} pending follow-up`
    : undefined;
  const blockerMeta = summary
    ? summary.openBlockers > 0
      ? `${summary.openBlockers.toLocaleString()} reports include blockers`
      : 'No blockers reported'
    : undefined;

  function refetchDashboard() {
    void summaryQuery.refetch();
    void activityQuery.refetch();
  }

  function refetchAnalytics() {
    void submissionStatusQuery.refetch();
    void workloadQuery.refetch();
    void taskTrendsQuery.refetch();
  }

  return (
    <PageContainer
      description="Track submission performance, team activity, and project reporting at a glance."
      title="Dashboard"
    >
      {isLoading ? <DashboardSkeleton /> : null}

      {!isLoading && error ? (
        <StatePanel
          actionLabel="Retry"
          description={getApiErrorMessage(error)}
          icon={AlertCircle}
          onAction={refetchDashboard}
          title="Unable to load dashboard"
          tone="danger"
        />
      ) : null}

      {!isLoading && !error && summary ? (
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="space-y-7"
          initial={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.2 }}
        >
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            <DashboardCard
              description="Total reports recorded in the system."
              icon={FileText}
              meta={submittedRatio}
              title="Total reports"
              value={summary.totalReports.toLocaleString()}
            />
            <DashboardCard
              description="Reports submitted by your team."
              icon={ShieldCheck}
              meta={`${summary.complianceRate}% compliance`}
              title="Submitted"
              tone="success"
              trend={summary.complianceRate >= 80 ? 'up' : 'neutral'}
              value={summary.submittedReports.toLocaleString()}
            />
            <DashboardCard
              description="Draft reports that still need submission."
              icon={Clock3}
              meta={pendingRatio}
              title="Pending"
              tone="warning"
              trend={summary.pendingReports > summary.submittedReports ? 'down' : 'neutral'}
              value={summary.pendingReports.toLocaleString()}
            />
            <DashboardCard
              description="Share of reports submitted on time."
              icon={ListChecks}
              meta={summary.complianceRate >= 90 ? 'Strong submission health' : 'Needs follow-up'}
              title="Compliance"
              trend={summary.complianceRate >= 90 ? 'up' : 'neutral'}
              value={`${summary.complianceRate}%`}
            />
            <DashboardCard
              description="Reports that mention blockers."
              icon={TriangleAlert}
              meta={blockerMeta}
              title="Open blockers"
              tone="danger"
              trend={summary.openBlockers === 0 ? 'up' : 'down'}
              value={summary.openBlockers.toLocaleString()}
            />
          </div>

          <AnalyticsSection
            description="Compare submission rates, project load, and weekly trends."
            title="Analytics"
          >
            {analyticsLoading ? <DashboardChartSkeleton /> : null}

            {!analyticsLoading && analyticsError ? (
              <StatePanel
                actionLabel="Retry"
                description={getApiErrorMessage(analyticsError)}
                icon={AlertCircle}
                onAction={refetchAnalytics}
                title="Unable to load analytics"
                tone="danger"
              />
            ) : null}

            {!analyticsLoading && !analyticsError ? (
              <div className="space-y-4">
                <div className="grid gap-4 lg:grid-cols-3">
                  <AnalyticsCard
                    description="Project with the highest report volume."
                    icon={Award}
                    title="Most active project"
                    value={mostActiveProject?.project.name ?? 'Unavailable'}
                  />
                  <AnalyticsCard
                    description="Highest submission rate across team members."
                    icon={TrendingUp}
                    title="Highest submission rate"
                    tone="success"
                    value={
                      highestSubmissionRate
                        ? `${highestSubmissionRate.user.name} · ${highestSubmissionRate.complianceRate}%`
                        : 'Unavailable'
                    }
                  />
                  <AnalyticsCard
                    description="Lowest submission rate requiring follow-up."
                    icon={TrendingDown}
                    title="Lowest submission rate"
                    tone="warning"
                    value={
                      lowestSubmissionRate
                        ? `${lowestSubmissionRate.user.name} · ${lowestSubmissionRate.complianceRate}%`
                        : 'Unavailable'
                    }
                  />
                </div>

                <div className="grid gap-4 xl:grid-cols-3">
                  <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
                    <div className="flex items-center gap-2">
                      <ListChecks className="h-5 w-5 text-primary" />
                      <h3 className="text-sm font-semibold">Submission Status</h3>
                    </div>
                    <div className="mt-5">
                      <SubmissionPieChart items={submissionStatusQuery.data ?? []} />
                    </div>
                  </div>

                  <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-primary" />
                      <h3 className="text-sm font-semibold">Project Workload</h3>
                    </div>
                    <div className="mt-5">
                      <ProjectBarChart items={workloadQuery.data ?? []} />
                    </div>
                  </div>

                  <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      <h3 className="text-sm font-semibold">Weekly Trend</h3>
                    </div>
                    <div className="mt-5">
                      <TrendLineChart items={taskTrendsQuery.data ?? []} />
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </AnalyticsSection>

          <section className="space-y-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold tracking-normal">Recent activity</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Filter the latest reporting activity.
                </p>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <div className="xl:col-span-2">
                  <Label htmlFor="dashboard-activity-search">Search activity</Label>
                  <Input
                    className="mt-2"
                    id="dashboard-activity-search"
                    onChange={(event) => setActivitySearch(event.target.value)}
                    placeholder="Search people or projects"
                    value={activitySearch}
                  />
                </div>
                <div>
                  <Label htmlFor="dashboard-activity-project">Project</Label>
                  <Select
                    className="mt-2"
                    id="dashboard-activity-project"
                    onChange={(event) => setActivityProject(event.target.value)}
                    value={activityProject}
                  >
                    <option value="ALL">All projects</option>
                    {workloadItems.map((item) => (
                      <option key={item.project.id} value={item.project.id}>
                        {item.project.name}
                      </option>
                    ))}
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="dashboard-activity-status">Status</Label>
                    <Select
                      className="mt-2"
                      id="dashboard-activity-status"
                      onChange={(event) =>
                        setActivityStatus(event.target.value as ActivityStatusFilter)
                      }
                      value={activityStatus}
                    >
                      <option value="ALL">All</option>
                      <option value="SUBMITTED">Submitted</option>
                      <option value="DRAFT">Draft</option>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="dashboard-activity-window">Window</Label>
                    <Select
                      className="mt-2"
                      id="dashboard-activity-window"
                      onChange={(event) =>
                        setActivityWindow(event.target.value as ActivityWindowFilter)
                      }
                      value={activityWindow}
                    >
                      <option value="ALL">All</option>
                      <option value="30">30 days</option>
                      <option value="90">90 days</option>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            <ActivityList items={filteredActivity} />
          </section>
        </motion.div>
      ) : null}
    </PageContainer>
  );
}
