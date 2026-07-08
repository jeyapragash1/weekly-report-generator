export type ApiSuccessResponse<TData> = {
  data: TData;
  meta?: Record<string, unknown>;
};

export type ApiErrorResponse = {
  error: {
    message: string;
    details?: Record<string, unknown>;
  };
};
