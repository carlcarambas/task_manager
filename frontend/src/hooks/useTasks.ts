import { useCallback, useEffect, useState } from 'react';
import { ApiError, tasksApi } from '../api/tasks';
import type { PaginatedTasks, TaskQuery } from '../types';

interface UseTasksResult {
  result: PaginatedTasks | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useTasks(query: TaskQuery): UseTasksResult {
  const [result, setResult] = useState<PaginatedTasks | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refetchToken, setRefetchToken] = useState(0);

  const refetch = useCallback(() => setRefetchToken((t) => t + 1), []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    tasksApi
      .list(query)
      .then((data) => {
        if (!cancelled) setResult(data);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof ApiError ? err.message : 'Failed to load tasks.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    query.page,
    query.limit,
    query.status,
    query.priority,
    query.search,
    query.sortBy,
    query.sortOrder,
    refetchToken,
  ]);

  return { result, loading, error, refetch };
}
