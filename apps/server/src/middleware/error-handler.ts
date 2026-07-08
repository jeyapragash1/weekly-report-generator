import type { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { HttpStatus } from '../constants/http.js';
import { AppError } from '../shared/errors/app-error.js';

type HttpError = Error & {
  statusCode?: number;
};

export const errorHandler: ErrorRequestHandler = (error, _request, response, next) => {
  void next;
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
