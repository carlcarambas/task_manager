import type { PaginatedTasks, Task, TaskQuery } from '../types';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const message =
      (Array.isArray(body?.message) ? body.message.join(', ') : body?.message) ??
      res.statusText;
    throw new ApiError(message, res.status);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

function toQueryString(query: TaskQuery): string {
  const params = new URLSearchParams();
  params.set('page', String(query.page));
  params.set('limit', String(query.limit));
  params.set('sortBy', query.sortBy);
  params.set('sortOrder', query.sortOrder);
  if (query.status) params.set('status', query.status);
  if (query.priority) params.set('priority', query.priority);
  if (query.search) params.set('search', query.search);
  return params.toString();
}

export const tasksApi = {
  list: (query: TaskQuery) =>
    request<PaginatedTasks>(`/tasks?${toQueryString(query)}`),

  create: (payload: Partial<Task>) =>
    request<Task>('/tasks', { method: 'POST', body: JSON.stringify(payload) }),

  update: (id: string, payload: Partial<Task>) =>
    request<Task>(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),

  remove: (id: string) => request<void>(`/tasks/${id}`, { method: 'DELETE' }),
};
