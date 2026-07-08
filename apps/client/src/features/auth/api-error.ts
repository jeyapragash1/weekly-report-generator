import axios from 'axios';

type ApiErrorResponse = {
  error?: {
    message?: string;
    details?: {
      fieldErrors?: Record<string, string[] | undefined>;
      formErrors?: string[];
    };
  };
};

export function getApiErrorMessage(error: unknown) {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    return error.response?.data.error?.message ?? error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Something went wrong. Please try again.';
}

export function getApiFieldErrors(error: unknown) {
  if (!axios.isAxiosError<ApiErrorResponse>(error)) {
    return {};
  }

  return error.response?.data.error?.details?.fieldErrors ?? {};
}
