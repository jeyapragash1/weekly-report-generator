import { z } from 'zod';

export const aiChatRequestSchema = z.object({
  message: z.string().trim().min(1).max(1000),
});

export type AiChatRequest = z.infer<typeof aiChatRequestSchema>;
