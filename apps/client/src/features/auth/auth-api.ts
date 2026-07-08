import { httpClient } from '@/api/http-client';
import type { AuthResponse, AuthUser } from '@/features/auth/auth-types';
import type { LoginFormValues, RegisterFormValues } from '@/features/auth/auth-schemas';

type ApiResponse<TData> = {
  data: TData;
};

export async function loginRequest(input: LoginFormValues) {
  const response = await httpClient.post<ApiResponse<AuthResponse>>('/auth/login', input);

  return response.data.data;
}

export async function registerRequest(input: RegisterFormValues) {
  const response = await httpClient.post<ApiResponse<AuthResponse>>('/auth/register', input);

  return response.data.data;
}

export async function getCurrentUserRequest() {
  const response = await httpClient.get<ApiResponse<AuthUser>>('/auth/me');

  return response.data.data;
}
