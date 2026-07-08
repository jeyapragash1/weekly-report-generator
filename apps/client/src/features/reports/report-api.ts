import { httpClient } from '@/api/http-client';
import type {
  CreateReportPayload,
  UpdateReportPayload,
  WeeklyReport,
} from '@/features/reports/report-types';

type ApiResponse<TData> = {
  data: TData;
};

export async function getReports() {
  const response = await httpClient.get<ApiResponse<WeeklyReport[]>>('/reports');

  return response.data.data;
}

export async function getReport(reportId: string) {
  const response = await httpClient.get<ApiResponse<WeeklyReport>>(`/reports/${reportId}`);

  return response.data.data;
}

export async function createReport(input: CreateReportPayload) {
  const response = await httpClient.post<ApiResponse<WeeklyReport>>('/reports', input);

  return response.data.data;
}

export async function updateReport(reportId: string, input: UpdateReportPayload) {
  const response = await httpClient.put<ApiResponse<WeeklyReport>>(`/reports/${reportId}`, input);

  return response.data.data;
}

export async function submitReport(reportId: string) {
  const response = await httpClient.post<ApiResponse<WeeklyReport>>(`/reports/${reportId}/submit`);

  return response.data.data;
}

export async function deleteReport(reportId: string) {
  const response = await httpClient.delete<ApiResponse<{ message: string }>>(
    `/reports/${reportId}`,
  );

  return response.data.data;
}
