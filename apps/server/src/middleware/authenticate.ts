import type { RequestHandler } from 'express';
import { HttpStatus } from '../constants/http.js';
import { verifyAccessToken } from '../infrastructure/token/jwt.js';
import { AppError } from '../shared/errors/app-error.js';

export const authenticate: RequestHandler = (request, _response, next) => {
  const authorizationHeader = request.headers.authorization;

  if (!authorizationHeader?.startsWith('Bearer ')) {
    throw new AppError('Authentication token is required', HttpStatus.UNAUTHORIZED);
  }

  const token = authorizationHeader.slice('Bearer '.length);
  request.user = verifyAccessToken(token);

  next();
};
