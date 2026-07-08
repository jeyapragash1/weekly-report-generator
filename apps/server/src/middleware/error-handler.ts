import type { ErrorRequestHandler, Request } from 'express';
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';
import { logger } from '../config/logger.js';
import { serverConfig } from '../config/env.js';
import { HttpStatus } from '../constants/http.js';
import { AppError } from '../shared/errors/app-error.js';

type HttpError = Error & {
  statusCode?: number;
};

function getRouteName(request: Request) {
  return request.baseUrl ? `${request.baseUrl}${request.path}` : request.path;
}

function getDevelopmentErrorDetails(error: unknown) {
  if (error instanceof ZodError) {
    return {
      type: 'ZodError',
      issues: error.issues,
      flattened: error.flatten(),
    };
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return {
      type: 'PrismaClientKnownRequestError',
      code: error.code,
      clientVersion: error.clientVersion,
      meta: error.meta,
    };
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    return {
      type: 'PrismaClientValidationError',
      message: error.message,
    };
  }

  if (error instanceof Prisma.PrismaClientUnknownRequestError) {
    return {
      type: 'PrismaClientUnknownRequestError',
      message: error.message,
      clientVersion: error.clientVersion,
    };
  }

  if (error instanceof Error) {
    return {
      type: error.name,
      message: error.message,
      stack: error.stack,
    };
  }

  return {
    type: 'UnknownError',
    value: error,
  };
}

function logDevelopmentError(error: unknown, request: Request) {
  if (serverConfig.nodeEnv !== 'development') {
    return;
  }

  logger.error('Request failed', {
    routeName: getRouteName(request),
    method: request.method,
    url: request.originalUrl,
    error: getDevelopmentErrorDetails(error),
    stack: error instanceof Error ? error.stack : undefined,
  });
}

export const errorHandler: ErrorRequestHandler = (error, request, response, next) => {
  void next;
  logDevelopmentError(error, request);
  const httpError = error as unknown as HttpError;

  if (error instanceof ZodError) {
    response.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
      error: {
        message: 'Validation failed',
        details: error.flatten(),
      },
    });
    return;
  }

  if (error instanceof AppError) {
    response.status(error.statusCode).json({
      error: {
        message: error.message,
      },
    });
    return;
  }

  const statusCode =
    typeof httpError.statusCode === 'number'
      ? httpError.statusCode
      : HttpStatus.INTERNAL_SERVER_ERROR;

  response.status(statusCode).json({
    error: {
      message:
        statusCode === HttpStatus.INTERNAL_SERVER_ERROR
          ? 'Internal server error'
          : httpError instanceof Error
            ? httpError.message
            : 'Request failed',
    },
  });
};
