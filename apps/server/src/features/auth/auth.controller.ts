import type { RequestHandler } from 'express';
import { HttpStatus } from '../../constants/http.js';
import { AppError } from '../../shared/errors/app-error.js';
import { asyncHandler } from '../../shared/utils/async-handler.js';
import { authService } from './auth.service.js';
import type { LoginInput, LogoutInput, RegisterInput } from './auth.schemas.js';

function getSessionMetadata(request: Parameters<RequestHandler>[0]) {
  return {
    userAgent: request.headers['user-agent'],
    ipAddress: request.ip,
  };
}

export const register: RequestHandler = asyncHandler(async (request, response) => {
  const result = await authService.register(
    request.body as RegisterInput,
    getSessionMetadata(request),
  );

  response.status(HttpStatus.CREATED).json({
    data: result,
  });
});

export const login: RequestHandler = asyncHandler(async (request, response) => {
  const result = await authService.login(request.body as LoginInput, getSessionMetadata(request));

  response.status(HttpStatus.OK).json({
    data: result,
  });
});

export const logout: RequestHandler = asyncHandler(async (request, response) => {
  await authService.logout(request.body as LogoutInput);

  response.status(HttpStatus.OK).json({
    data: {
      message: 'Logged out successfully',
    },
  });
});

export const getCurrentUser: RequestHandler = asyncHandler(async (request, response) => {
  if (!request.user) {
    throw new AppError('Authentication is required', HttpStatus.UNAUTHORIZED);
  }

  const user = await authService.getCurrentUser(request.user.id);

  response.status(HttpStatus.OK).json({
    data: user,
  });
});
