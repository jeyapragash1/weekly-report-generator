import type { ErrorRequestHandler } from 'express';
import { HttpStatus } from '../constants/http.js';

type HttpError = Error & {
  statusCode?: number;
};

export const errorHandler: ErrorRequestHandler = (error, _request, response, next) => {
  void next;
  const httpError = error as unknown as HttpError;
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
