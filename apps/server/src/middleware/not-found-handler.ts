import type { RequestHandler } from 'express';
import { HttpStatus } from '../constants/http.js';

export const notFoundHandler: RequestHandler = (request, response) => {
  response.status(HttpStatus.NOT_FOUND).json({
    error: {
      message: `Route not found: ${request.method} ${request.originalUrl}`,
    },
  });
};
