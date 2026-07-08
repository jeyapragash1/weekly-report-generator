import { httpClient } from '@/api/http-client';

type AiChatResponse = {
  data: {
    answer: string;
  };
};

export async function chatWithAssistant(message: string) {
  const response = await httpClient.post<AiChatResponse>('/ai/chat', {
    message,
  });

  return response.data.data.answer;
}
