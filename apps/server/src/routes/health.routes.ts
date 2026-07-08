import { Router } from 'express';
import { HttpStatus } from '../constants/http.js';

export const healthRouter = Router();

healthRouter.get('/', (_request, response) => {
  response.status(HttpStatus.OK).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});
