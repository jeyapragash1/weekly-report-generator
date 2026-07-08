import { HttpStatus } from '../../constants/http.js';
import { serverConfig } from '../../config/env.js';
import { prisma } from '../../infrastructure/database/prisma.js';
import { AppError } from '../../shared/errors/app-error.js';

type AiContextReport = {
  userName: string;
  projectName: string;
  status: 'DRAFT' | 'SUBMITTED';
  weekStartDate: Date;
  weekEndDate: Date;
  blockers: string;
  tasksCompleted: string;
  tasksPlanned: string;
  hoursWorked: string | null;
  submittedAt: Date | null;
};

type OllamaTagsResponse = {
  models?: Array<{
    name?: string;
    model?: string;
  }>;
};

type OllamaChatResponse = {
  message?: {
    content?: string;
  };
};

function truncate(value: string, max = 160) {
  if (value.length <= max) {
    return value;
  }

  return `${value.slice(0, max - 1)}...`;
}

function formatDate(value: Date | null) {
  return value ? value.toISOString().slice(0, 10) : 'N/A';
}

function normalizeBaseUrl(value: string) {
  return value.replace(/\/+$/, '');
}

function matchesModelName(configuredModel: string, availableModel: string) {
  const normalizedConfigured = configuredModel.trim().toLowerCase();
  const normalizedAvailable = availableModel.trim().toLowerCase();

  return (
    normalizedAvailable === normalizedConfigured ||
    normalizedAvailable.startsWith(`${normalizedConfigured}:`) ||
    normalizedConfigured.startsWith(`${normalizedAvailable}:`)
  );
}

async function fetchOllamaJson<T>(url: string, init?: RequestInit) {
  try {
    const response = await fetch(url, init);
    const text = await response.text();

    let data: T | undefined;

    if (text) {
      try {
        data = JSON.parse(text) as T;
      } catch {
        data = undefined;
      }
    }

    return {
      ok: response.ok,
      status: response.status,
      data,
      text,
    };
  } catch {
    throw new AppError(
      `Ollama is not running at ${serverConfig.ai.baseUrl}`,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}

async function ensureModelExists(baseUrl: string, model: string) {
  const tagsResult = await fetchOllamaJson<OllamaTagsResponse>(`${baseUrl}/api/tags`);

  if (!tagsResult.ok) {
    throw new AppError(
      `Ollama is not running at ${baseUrl}`,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  const models = tagsResult.data?.models ?? [];
  const hasModel = models.some((entry) => {
    const availableModel = entry.name ?? entry.model ?? '';
    return availableModel.length > 0 && matchesModelName(model, availableModel);
  });

  if (!hasModel) {
    throw new AppError(
      `Ollama model "${model}" is not available at ${baseUrl}`,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}

function extractOllamaErrorMessage(status: number, text: string) {
  if (!text) {
    return `Ollama returned HTTP ${status}`;
  }

  try {
    const parsed = JSON.parse(text) as { error?: string; message?: string };
    return parsed.error ?? parsed.message ?? `Ollama returned HTTP ${status}`;
  } catch {
    return text;
  }
}

function buildPrompt(input: {
  question: string;
  users: Array<{ name: string; email: string; role: string; isActive: boolean }>;
  projects: Array<{ name: string; status: string; description: string | null }>;
  reports: AiContextReport[];
}) {
  const usersContext = input.users
    .map((user) => `${user.name} (${user.email}) role=${user.role} active=${user.isActive}`)
    .join('\n');

  const projectsContext = input.projects
    .map((project) => {
      const description = project.description
        ? truncate(project.description, 90)
        : 'No description';

      return `${project.name} status=${project.status} description=${description}`;
    })
    .join('\n');

  const reportsContext = input.reports
    .map((report) => {
      return [
        `${report.userName} | ${report.projectName} | ${report.status} | week ${formatDate(report.weekStartDate)} to ${formatDate(report.weekEndDate)} | submitted=${formatDate(report.submittedAt)}`,
        `completed: ${truncate(report.tasksCompleted, 120)}`,
        `planned: ${truncate(report.tasksPlanned, 120)}`,
        `blockers: ${truncate(report.blockers || 'None', 120)}`,
        `hours: ${report.hoursWorked ?? 'N/A'}`,
      ].join('\n');
    })
    .join('\n\n');

  return [
    'You are an internal reporting assistant for a weekly reporting SaaS application.',
    'Answer only from the provided data.',
    'Keep responses concise and useful for a manager: max 6 bullets or max 180 words.',
    'If data is missing, say what is missing clearly.',
    '',
    `Manager question: ${input.question}`,
    '',
    'Users:',
    usersContext || 'No users available.',
    '',
    'Projects:',
    projectsContext || 'No projects available.',
    '',
    'Weekly reports:',
    reportsContext || 'No reports available.',
  ].join('\n');
}

export const aiService = {
  async chat(message: string) {
    const baseUrl = normalizeBaseUrl(serverConfig.ai.baseUrl);
    const model = serverConfig.ai.model;

    await ensureModelExists(baseUrl, model);

    const [users, projects, reports] = await Promise.all([
      prisma.user.findMany({
        select: {
          name: true,
          email: true,
          isActive: true,
          role: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 40,
      }),
      prisma.project.findMany({
        select: {
          name: true,
          status: true,
          description: true,
        },
        orderBy: {
          updatedAt: 'desc',
        },
        take: 50,
      }),
      prisma.weeklyReport.findMany({
        select: {
          status: true,
          weekStartDate: true,
          weekEndDate: true,
          blockers: true,
          tasksCompleted: true,
          tasksPlanned: true,
          hoursWorked: true,
          submittedAt: true,
          user: {
            select: {
              name: true,
            },
          },
          project: {
            select: {
              name: true,
            },
          },
        },
        orderBy: [{ updatedAt: 'desc' }],
        take: 80,
      }),
    ]);

    const prompt = buildPrompt({
      question: message,
      users: users.map((user) => ({
        name: user.name,
        email: user.email,
        role: user.role.name,
        isActive: user.isActive,
      })),
      projects: projects.map((project) => ({
        name: project.name,
        status: project.status,
        description: project.description,
      })),
      reports: reports.map((report) => ({
        userName: report.user.name,
        projectName: report.project.name,
        status: report.status,
        weekStartDate: report.weekStartDate,
        weekEndDate: report.weekEndDate,
        blockers: report.blockers,
        tasksCompleted: report.tasksCompleted,
        tasksPlanned: report.tasksPlanned,
        hoursWorked: report.hoursWorked ? report.hoursWorked.toString() : null,
        submittedAt: report.submittedAt,
      })),
    });

    try {
      const completion = await fetchOllamaJson<OllamaChatResponse>(`${baseUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          stream: false,
          options: {
            temperature: 0.2,
          },
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
        }),
      });

      if (!completion.ok) {
        const message = extractOllamaErrorMessage(completion.status, completion.text);

        if (completion.status === 404 || /model/i.test(message)) {
          throw new AppError(
            `Ollama model "${model}" is not available at ${baseUrl}`,
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }

        throw new AppError(`Ollama returned HTTP ${completion.status}: ${message}`, HttpStatus.INTERNAL_SERVER_ERROR);
      }

      const answer = completion.data?.message?.content?.trim();

      if (!answer) {
        throw new AppError(
          'Ollama returned an empty response',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      return answer;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      const upstreamError = error as { message?: string };

      throw new AppError(
        upstreamError.message ?? 'AI request failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  },
};
