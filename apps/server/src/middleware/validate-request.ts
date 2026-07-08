import type { RequestHandler } from 'express';
import type { ZodSchema } from 'zod';

type ValidatedRequestData = {
  body?: unknown;
  params?: unknown;
  query?: unknown;
};

type RequestSchemas = {
  body?: ZodSchema<unknown>;
  params?: ZodSchema<unknown>;
  query?: ZodSchema<unknown>;
};

export function validateRequest(schemas: RequestSchemas): RequestHandler {
  return (request, _response, next) => {
    const requestWithValidated = request as typeof request & {
      validated?: ValidatedRequestData;
    };

    requestWithValidated.validated = requestWithValidated.validated ?? {};

    if (schemas.body) {
      const body = schemas.body.parse(request.body);
      request.body = body;
      requestWithValidated.validated.body = body;
    }

    if (schemas.params) {
      const params = schemas.params.parse(request.params);
      request.params = params as typeof request.params;
      requestWithValidated.validated.params = params;
    }

    if (schemas.query) {
      requestWithValidated.validated.query = schemas.query.parse(request.query);
    }

    next();
  };
}
