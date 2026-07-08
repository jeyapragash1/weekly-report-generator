import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createReport,
  deleteReport,
  getReport,
  getReports,
  submitReport,
  updateReport,
} from '@/features/reports/report-api';
import type {
  CreateReportPayload,
  UpdateReportPayload,
  WeeklyReport,
} from '@/features/reports/report-types';

export const reportsQueryKey = ['reports'] as const;

export function useReports() {
  return useQuery({
    queryKey: reportsQueryKey,
    queryFn: getReports,
  });
}

export function useReport(reportId: string | null) {
  return useQuery({
    queryKey: [...reportsQueryKey, reportId],
    queryFn: () => getReport(reportId ?? ''),
    enabled: Boolean(reportId),
  });
}

export function useCreateReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateReportPayload) => createReport(input),
    onSuccess() {
      void queryClient.invalidateQueries({ queryKey: reportsQueryKey });
    },
  });
}

export function useUpdateReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: { reportId: string; data: UpdateReportPayload }) =>
      updateReport(input.reportId, input.data),
    onSuccess() {
      void queryClient.invalidateQueries({ queryKey: reportsQueryKey });
    },
  });
}

export function useSubmitReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitReport,
    async onMutate(reportId) {
      await queryClient.cancelQueries({ queryKey: reportsQueryKey });

      const previousReports = queryClient.getQueryData<WeeklyReport[]>(reportsQueryKey);

      queryClient.setQueryData<WeeklyReport[]>(reportsQueryKey, (currentReports) =>
        currentReports?.map((report) =>
          report.id === reportId
            ? { ...report, status: 'SUBMITTED', submittedAt: new Date().toISOString() }
            : report,
        ),
      );

      return { previousReports };
    },
    onError(_error, _reportId, context) {
      queryClient.setQueryData(reportsQueryKey, context?.previousReports);
    },
    onSettled() {
      void queryClient.invalidateQueries({ queryKey: reportsQueryKey });
    },
  });
}

export function useDeleteReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteReport,
    async onMutate(reportId) {
      await queryClient.cancelQueries({ queryKey: reportsQueryKey });

      const previousReports = queryClient.getQueryData<WeeklyReport[]>(reportsQueryKey);

      queryClient.setQueryData<WeeklyReport[]>(reportsQueryKey, (currentReports) =>
        currentReports?.filter((report) => report.id !== reportId),
      );

      return { previousReports };
    },
    onError(_error, _reportId, context) {
      queryClient.setQueryData(reportsQueryKey, context?.previousReports);
    },
    onSettled() {
      void queryClient.invalidateQueries({ queryKey: reportsQueryKey });
    },
  });
}
