import type { RequestHandler } from 'express';
import { HttpStatus } from '../../constants/http.js';
import { asyncHandler } from '../../shared/utils/async-handler.js';
import { dashboardService } from './dashboard.service.js';
import type { DashboardActivityQuery } from './dashboard.schemas.js';

export const getDashboardSummary: RequestHandler = asyncHandler(async (_request, response) => {
  const summary = await dashboardService.getSummary();

  response.status(HttpStatus.OK).json({
    data: summary,
  });
});

export const getDashboardActivity: RequestHandler = asyncHandler(async (request, response) => {
  const query: DashboardActivityQuery = {
    limit: Number(request.query.limit ?? 10),
  };
  const activity = await dashboardService.getActivity(query);

  response.status(HttpStatus.OK).json({
    data: activity,
  });
});

export const getDashboardSubmissionStatus: RequestHandler = asyncHandler(
  async (_request, response) => {
    const submissionStatus = await dashboardService.getSubmissionStatus();

    response.status(HttpStatus.OK).json({
      data: submissionStatus,
    });
  },
);

export const getDashboardWorkload: RequestHandler = asyncHandler(async (_request, response) => {
  const workload = await dashboardService.getWorkload();

  response.status(HttpStatus.OK).json({
    data: workload,
  });
});

export const getDashboardTaskTrends: RequestHandler = asyncHandler(async (_request, response) => {
  const taskTrends = await dashboardService.getTaskTrends();

  response.status(HttpStatus.OK).json({
    data: taskTrends,
  });
});
