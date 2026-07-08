import axios from 'axios';
import { clientConfig } from '@/app/config';

export const httpClient = axios.create({
  baseURL: clientConfig.VITE_API_BASE_URL,
  timeout: 15_000,
  headers: {
    'Content-Type': 'application/json',
  },
});
