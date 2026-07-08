import type { RequestHandler } from 'express';
import { HttpStatus } from '../../constants/http.js';
import { asyncHandler } from '../../shared/utils/async-handler.js';
import { aiService } from './ai.service.js';
import type { AiChatRequest } from './ai.schemas.js';

export const chatWithAssistant: RequestHandler = asyncHandler(async (request, response) => {
  const body = request.body as AiChatRequest;
  const answer = await aiService.chat(body.message);

  response.status(HttpStatus.OK).json({
    data: {
      answer,
    },
  });
});
