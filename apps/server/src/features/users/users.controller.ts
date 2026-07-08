import type { RequestHandler } from 'express';
import { HttpStatus } from '../../constants/http.js';
import { AppError } from '../../shared/errors/app-error.js';
import { asyncHandler } from '../../shared/utils/async-handler.js';
import { usersService } from './users.service.js';

export const getCurrentUser: RequestHandler = asyncHandler(async (request, response) => {
  if (!request.user) {
    throw new AppError('Authentication is required', HttpStatus.UNAUTHORIZED);
  }

  const user = await usersService.getCurrentUser(request.user.id);

  response.status(HttpStatus.OK).json({
    data: user,
  });
});
