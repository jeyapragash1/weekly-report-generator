import { Prisma, ReportStatus } from '@prisma/client';
import { HttpStatus } from '../../constants/http.js';
import { AppError } from '../../shared/errors/app-error.js';
import { projectsRepository } from '../projects/projects.repository.js';
import { toWeeklyReportDto } from './reports.mapper.js';
import { reportsRepository } from './reports.repository.js';
import type {
  CreateReportInput,
  GetMyReportsQuery,
  UpdateDraftReportInput,
} from './reports.schemas.js';

function assertPrismaUniqueConstraint(error: unknown) {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002';
}

async function getOwnedReport(reportId: string, userId: string) {
  const report = await reportsRepository.findById(reportId);

  if (!report || report.userId !== userId) {
    throw new AppError('Weekly report not found', HttpStatus.NOT_FOUND);
  }

  return report;
}

async function ensureUniqueWeeklyReport(input: {
  userId: string;
  weekStartDate: Date;
  projectId: string;
  ignoreReportId?: string;
}) {
  const existingReport = await reportsRepository.findByUserWeekAndProject({
    userId: input.userId,
    weekStartDate: input.weekStartDate,
    projectId: input.projectId,
  });

  if (existingReport && existingReport.id !== input.ignoreReportId) {
    throw new AppError(
      'A report already exists for this user, week, and project',
      HttpStatus.CONFLICT,
    );
  }
}

async function ensureProjectCanReceiveReports(projectId: string) {
  const project = await projectsRepository.findById(projectId);

  if (!project) {
    throw new AppError('Project not found', HttpStatus.NOT_FOUND);
  }

  if (project.status === 'ARCHIVED') {
    throw new AppError('Archived projects cannot receive new reports', HttpStatus.CONFLICT);
  }
}

export const reportsService = {
  async createDraft(userId: string, input: CreateReportInput) {
    await ensureProjectCanReceiveReports(input.projectId);
    await ensureUniqueWeeklyReport({
      userId,
      weekStartDate: input.weekStartDate,
      projectId: input.projectId,
    });

    try {
      const report = await reportsRepository.createDraft({
        ...input,
        userId,
        status: ReportStatus.DRAFT,
      });

      return toWeeklyReportDto(report);
    } catch (error) {
      if (assertPrismaUniqueConstraint(error)) {
        throw new AppError(
          'A report already exists for this user, week, and project',
          HttpStatus.CONFLICT,
        );
      }

      throw error;
    }
  },

  async updateDraft(userId: string, reportId: string, input: UpdateDraftReportInput) {
    const report = await getOwnedReport(reportId, userId);

    if (report.status !== ReportStatus.DRAFT) {
      throw new AppError('Submitted reports cannot be edited', HttpStatus.CONFLICT);
    }

    const nextWeekStartDate = input.weekStartDate ?? report.weekStartDate;
    const nextWeekEndDate = input.weekEndDate ?? report.weekEndDate;
    const nextProjectId = input.projectId ?? report.projectId;

    if (nextWeekEndDate <= nextWeekStartDate) {
      throw new AppError('Week end date must be after week start date', HttpStatus.BAD_REQUEST);
    }

    if (input.projectId) {
      await ensureProjectCanReceiveReports(input.projectId);
    }

    await ensureUniqueWeeklyReport({
      userId,
      weekStartDate: nextWeekStartDate,
      projectId: nextProjectId,
      ignoreReportId: report.id,
    });

    try {
      const updatedReport = await reportsRepository.update(report.id, input);

      return toWeeklyReportDto(updatedReport);
    } catch (error) {
      if (assertPrismaUniqueConstraint(error)) {
        throw new AppError(
          'A report already exists for this user, week, and project',
          HttpStatus.CONFLICT,
        );
      }

      throw error;
    }
  },

  async submitReport(userId: string, reportId: string) {
    const report = await getOwnedReport(reportId, userId);

    if (report.status !== ReportStatus.DRAFT) {
      throw new AppError('Only draft reports can be submitted', HttpStatus.CONFLICT);
    }

    const submittedReport = await reportsRepository.update(report.id, {
      status: ReportStatus.SUBMITTED,
      submittedAt: new Date(),
    });

    return toWeeklyReportDto(submittedReport);
  },

  async getMyReports(userId: string, query: GetMyReportsQuery) {
    const reports = await reportsRepository.findManyByUser({
      userId,
      status: query.status,
    });

    return reports.map(toWeeklyReportDto);
  },

  async getReportById(userId: string, reportId: string) {
    const report = await getOwnedReport(reportId, userId);

    return toWeeklyReportDto(report);
  },

  async deleteDraft(userId: string, reportId: string) {
    const report = await getOwnedReport(reportId, userId);

    if (report.status !== ReportStatus.DRAFT) {
      throw new AppError('Only draft reports can be deleted', HttpStatus.CONFLICT);
    }

    await reportsRepository.delete(report.id);
  },
};
