import type {
  ReportSortOption,
  ReportStatus,
  ReportStatusFilter,
  WeeklyReport,
} from '@/features/reports/report-types';

export function formatReportDate(value: string) {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value));
}

export function formatReportWeek(report: WeeklyReport) {
  return `${formatReportDate(report.weekStartDate)} - ${formatReportDate(report.weekEndDate)}`;
}

export function formatReportStatus(status: ReportStatus) {
  return status === 'SUBMITTED' ? 'Submitted' : 'Draft';
}

export function filterAndSortReports(
  reports: WeeklyReport[],
  input: {
    search: string;
    status: ReportStatusFilter;
    projectId: string;
    week: string;
    sort: ReportSortOption;
  },
) {
  const normalizedSearch = input.search.trim().toLowerCase();

  return reports
    .filter((report) => {
      const matchesSearch = report.project.name.toLowerCase().includes(normalizedSearch);
      const matchesStatus = input.status === 'ALL' || report.status === input.status;
      const matchesProject = input.projectId === 'ALL' || report.project.id === input.projectId;
      const matchesWeek = !input.week || report.weekStartDate.slice(0, 10) === input.week;

      return matchesSearch && matchesStatus && matchesProject && matchesWeek;
    })
    .sort((firstReport, secondReport) => {
      if (input.sort === 'week') {
        return (
          new Date(secondReport.weekStartDate).getTime() -
          new Date(firstReport.weekStartDate).getTime()
        );
      }

      const firstDate = new Date(firstReport.createdAt).getTime();
      const secondDate = new Date(secondReport.createdAt).getTime();

      return input.sort === 'newest' ? secondDate - firstDate : firstDate - secondDate;
    });
}

export function toDateInputValue(value: string) {
  return value.slice(0, 10);
}
