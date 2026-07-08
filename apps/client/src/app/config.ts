import { z } from 'zod';

const clientEnvSchema = z.object({
  VITE_API_BASE_URL: z.string().url(),
});

const clientEnvInput: z.input<typeof clientEnvSchema> = {
  VITE_API_BASE_URL: String(import.meta.env.VITE_API_BASE_URL ?? ''),
};

export const clientConfig = clientEnvSchema.parse({
  VITE_API_BASE_URL: clientEnvInput.VITE_API_BASE_URL,
});
