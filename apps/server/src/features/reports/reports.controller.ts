import type { RequestHandler } from 'express';
import { HttpStatus } from '../../constants/http.js';
import { AppError } from '../../shared/errors/app-error.js';
import { asyncHandler } from '../../shared/utils/async-handler.js';
import { reportsService } from './reports.service.js';
import type { CreateReportInput, ReportParams, UpdateDraftReportInput } from './reports.schemas.js';

function getAuthenticatedUserId(request: Parameters<RequestHandler>[0]) {
  if (!request.user) {
    throw new AppError('Authentication is required', HttpStatus.UNAUTHORIZED);
  }

  return request.user.id;
}

export const createDraftReport: RequestHandler = asyncHandler(async (request, response) => {
  const userId = getAuthenticatedUserId(request);
  const report = await reportsService.createDraft(userId, request.body as CreateReportInput);

  response.status(HttpStatus.CREATED).json({
    data: report,
  });
});

export const updateDraftReport: RequestHandler = asyncHandler(async (request, response) => {
  const userId = getAuthenticatedUserId(request);
  const { id } = request.params as ReportParams;
  const report = await reportsService.updateDraft(
    userId,
    id,
    request.body as UpdateDraftReportInput,
  );

  response.status(HttpStatus.OK).json({
    data: report,
  });
});

export const submitReport: RequestHandler = asyncHandler(async (request, response) => {
  const userId = getAuthenticatedUserId(request);
  const { id } = request.params as ReportParams;
  const report = await reportsService.submitReport(userId, id);

  response.status(HttpStatus.OK).json({
    data: report,
  });
});

export const getMyReports: RequestHandler = asyncHandler(async (request, response) => {
  const userId = getAuthenticatedUserId(request);
  const reports = await reportsService.getMyReports(userId, request.query);

  response.status(HttpStatus.OK).json({
    data: reports,
  });
});

export const getReportById: RequestHandler = asyncHandler(async (request, response) => {
  const userId = getAuthenticatedUserId(request);
  const { id } = request.params as ReportParams;
  const report = await reportsService.getReportById(userId, id);

  response.status(HttpStatus.OK).json({
    data: report,
  });
});

export const deleteDraftReport: RequestHandler = asyncHandler(async (request, response) => {
  const userId = getAuthenticatedUserId(request);
  const { id } = request.params as ReportParams;

  await reportsService.deleteDraft(userId, id);

  response.status(HttpStatus.OK).json({
    data: {
      message: 'Draft report deleted successfully',
    },
  });
});
