import { httpClient } from '@/api/http-client';
import type {
  DashboardActivityItem,
  DashboardSubmissionStatusItem,
  DashboardSummary,
  DashboardTaskTrendItem,
  DashboardWorkloadItem,
} from '@/features/dashboard/dashboard-types';

type ApiResponse<TData> = {
  data: TData;
};

export async function getDashboardSummary() {
  const response = await httpClient.get<ApiResponse<DashboardSummary>>('/dashboard/summary');

  return response.data.data;
}

export async function getDashboardActivity(limit?: number) {
  const response = await httpClient.get<ApiResponse<DashboardActivityItem[]>>(
    '/dashboard/activity',
    {
      params: typeof limit === 'number' ? { limit } : undefined,
    },
  );

  return response.data.data;
}

export async function getDashboardSubmissionStatus() {
  const response = await httpClient.get<ApiResponse<DashboardSubmissionStatusItem[]>>(
    '/dashboard/submission-status',
  );

  return response.data.data;
}

export async function getDashboardWorkload() {
  const response =
    await httpClient.get<ApiResponse<DashboardWorkloadItem[]>>('/dashboard/workload');

  return response.data.data;
}

export async function getDashboardTaskTrends() {
  const response =
    await httpClient.get<ApiResponse<DashboardTaskTrendItem[]>>('/dashboard/task-trends');

  return response.data.data;
}
