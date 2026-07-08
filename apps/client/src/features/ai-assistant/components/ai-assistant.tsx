import { useMutation } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2, MessageCircle, Send, Sparkles, TriangleAlert, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { chatWithAssistant } from '@/features/ai-assistant/ai-assistant-api';
import { getApiErrorMessage } from '@/features/auth/api-error';
import { cn } from '@/lib/utils';

type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

const suggestedQuestions = [
  'Which projects have the most pending reports?',
  "Summarize this week's blockers.",
  'Who has the highest submission rate?',
  'Which team members need follow-up?',
];

function createMessage(role: ChatMessage['role'], content: string): ChatMessage {
  return {
    id: crypto.randomUUID(),
    role,
    content,
  };
}

export function AiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    createMessage(
      'assistant',
      'Hi, I can help you review project and reporting data. Ask a question to get started.',
    ),
  ]);
  const [requestError, setRequestError] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const mutation = useMutation({
    mutationFn: chatWithAssistant,
    onSuccess(answer) {
      setMessages((current) => [...current, createMessage('assistant', answer)]);
      setRequestError(null);
    },
    onError(error) {
      setRequestError(getApiErrorMessage(error));
    },
  });

  useEffect(() => {
    if (!scrollContainerRef.current) {
      return;
    }

    scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
  }, [messages, mutation.isPending, isOpen]);

  const canSend = useMemo(
    () => draft.trim().length > 0 && !mutation.isPending,
    [draft, mutation.isPending],
  );

  function submitQuestion(question: string) {
    const normalizedQuestion = question.trim();

    if (!normalizedQuestion || mutation.isPending) {
      return;
    }

    setMessages((current) => [...current, createMessage('user', normalizedQuestion)]);
    setDraft('');
    setRequestError(null);
    mutation.mutate(normalizedQuestion);
  }

  return (
    <>
      <Button
        aria-label="Open AI assistant"
        className="fixed bottom-4 right-4 z-40 h-12 w-12 rounded-full shadow-lg md:bottom-6 md:right-6"
        onClick={() => setIsOpen(true)}
        size="icon"
        type="button"
      >
        <Sparkles className="h-5 w-5" />
      </Button>

      <AnimatePresence>
        {isOpen ? (
          <>
            <motion.button
              aria-label="Close AI assistant"
              animate={{ opacity: 1 }}
              className="fixed inset-0 z-40 bg-background/70 backdrop-blur-sm"
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              type="button"
            />

            <motion.aside
              animate={{ opacity: 1, x: 0 }}
              className="fixed bottom-0 right-0 z-50 flex h-[78vh] w-[min(100vw,430px)] flex-col border border-border bg-card shadow-2xl md:bottom-6 md:right-6 md:h-[680px] md:rounded-xl"
              exit={{ opacity: 0, x: 24 }}
              initial={{ opacity: 0, x: 24 }}
              role="dialog"
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="rounded-md bg-primary/10 p-2 text-primary">
                    <MessageCircle className="h-4 w-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold">AI Assistant</h2>
                    <p className="text-xs text-muted-foreground">Project and reporting insights</p>
                  </div>
                </div>
                <Button
                  aria-label="Close AI assistant"
                  onClick={() => setIsOpen(false)}
                  size="icon"
                  type="button"
                  variant="ghost"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="border-b border-border px-4 py-3">
                <p className="mb-2 text-xs font-medium text-muted-foreground">
                  Suggested questions
                </p>
                <div className="flex flex-wrap gap-2">
                  {suggestedQuestions.map((question) => (
                    <button
                      className="rounded-full border border-border bg-background px-3 py-1 text-xs text-foreground transition-colors hover:bg-secondary"
                      key={question}
                      onClick={() => submitQuestion(question)}
                      type="button"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3" ref={scrollContainerRef}>
                <div className="space-y-3">
                  {messages.map((message) => (
                    <div
                      className={cn(
                        'max-w-[90%] rounded-lg border px-3 py-2 text-sm leading-6',
                        message.role === 'user'
                          ? 'ml-auto border-primary/30 bg-primary/10 text-foreground'
                          : 'border-border bg-background text-foreground',
                      )}
                      key={message.id}
                    >
                      {message.role === 'assistant' ? (
                        <ReactMarkdown
                          components={{
                            p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                            ul: ({ children }) => <ul className="list-disc pl-5">{children}</ul>,
                            ol: ({ children }) => <ol className="list-decimal pl-5">{children}</ol>,
                            li: ({ children }) => <li className="mb-1">{children}</li>,
                            strong: ({ children }) => (
                              <strong className="font-semibold">{children}</strong>
                            ),
                            code: ({ children }) => (
                              <code className="rounded bg-secondary px-1 py-0.5 text-xs">
                                {children}
                              </code>
                            ),
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      ) : (
                        <p>{message.content}</p>
                      )}
                    </div>
                  ))}

                  {mutation.isPending ? (
                    <div className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Generating answer...
                    </div>
                  ) : null}

                  {requestError ? (
                    <div className="inline-flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                      <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
                      <span>{requestError}</span>
                    </div>
                  ) : null}
                </div>
              </div>

              <form
                className="border-t border-border px-4 py-3"
                onSubmit={(event) => {
                  event.preventDefault();
                  submitQuestion(draft);
                }}
              >
                <div className="flex items-center gap-2">
                  <Input
                    aria-label="Ask AI assistant"
                    onChange={(event) => setDraft(event.target.value)}
                    placeholder="Ask about reports, projects, or team activity"
                    value={draft}
                  />
                  <Button disabled={!canSend} size="icon" type="submit">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}
