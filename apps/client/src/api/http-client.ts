import axios from 'axios';
import { clientConfig } from '@/app/config';
import { authTokenStore } from '@/lib/auth-token-store';

export const httpClient = axios.create({
  baseURL: clientConfig.VITE_API_BASE_URL,
  timeout: 120_000,
  headers: {
    'Content-Type': 'application/json',
  },
});

httpClient.interceptors.request.use((config) => {
  const accessToken = authTokenStore.getAccessToken();

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});
