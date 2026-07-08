import type { RoleName } from '@prisma/client';
import type { RequestHandler } from 'express';
import { HttpStatus } from '../constants/http.js';
import { AppError } from '../shared/errors/app-error.js';

export function authorize(...allowedRoles: RoleName[]): RequestHandler {
  return (request, _response, next) => {
    if (!request.user) {
      throw new AppError('Authentication is required', HttpStatus.UNAUTHORIZED);
    }

    if (!allowedRoles.includes(request.user.role)) {
      throw new AppError(
        'You do not have permission to access this resource',
        HttpStatus.FORBIDDEN,
      );
    }

    next();
  };
}
