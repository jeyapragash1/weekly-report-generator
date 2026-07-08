import type {
  ManagerReportFilters,
  ManagerReportItem,
} from '@/features/reports/manager-reports-types';

export function filterManagerReports(reports: ManagerReportItem[], filters: ManagerReportFilters) {
  const normalizedSearch = filters.search.trim().toLowerCase();

  return reports.filter((report) => {
    const searchableText = [report.user.name, report.user.email, report.project.name]
      .join(' ')
      .toLowerCase();
    const matchesSearch = !normalizedSearch || searchableText.includes(normalizedSearch);
    const matchesMember = filters.memberId === 'ALL' || report.user.id === filters.memberId;
    const matchesProject = filters.projectId === 'ALL' || report.project.id === filters.projectId;
    const matchesStatus = filters.status === 'ALL' || report.status === filters.status;
    const weekStart = report.week.startDate.slice(0, 10);
    const matchesFrom = !filters.dateFrom || weekStart >= filters.dateFrom;
    const matchesTo = !filters.dateTo || weekStart <= filters.dateTo;

    return (
      matchesSearch && matchesMember && matchesProject && matchesStatus && matchesFrom && matchesTo
    );
  });
}

export function getManagerReportStats(reports: ManagerReportItem[]) {
  const submitted = reports.filter((report) => report.status === 'SUBMITTED').length;
  const draft = reports.length - submitted;
  const uniqueMembers = new Set(reports.map((report) => report.user.id)).size;
  const uniqueProjects = new Set(reports.map((report) => report.project.id)).size;

  return {
    totalReports: reports.length,
    submittedReports: submitted,
    draftReports: draft,
    uniqueMembers,
    uniqueProjects,
  };
}

export function paginateManagerReports(
  reports: ManagerReportItem[],
  page: number,
  pageSize: number,
) {
  const currentPage = Math.max(page, 1);
  const totalItems = reports.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * pageSize;

  return {
    page: safePage,
    totalPages,
    totalItems,
    items: reports.slice(startIndex, startIndex + pageSize),
  };
}
