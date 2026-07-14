import { useState } from 'react';
import { ApiError, tasksApi } from './api/tasks';
import { Pagination } from './components/Pagination';
import { TaskFilters } from './components/TaskFilters';
import { TaskForm } from './components/TaskForm';
import { TaskList } from './components/TaskList';
import { useTasks } from './hooks/useTasks';
import type { Task, TaskFormValues, TaskQuery } from './types';
import './App.css';

const DEFAULT_QUERY: TaskQuery = {
  page: 1,
  limit: 10,
  sortBy: 'createdAt',
  sortOrder: 'desc',
};

function toPayload(values: TaskFormValues) {
  return {
    title: values.title.trim(),
    description: values.description.trim() || undefined,
    status: values.status,
    priority: values.priority,
    dueDate: values.dueDate || undefined,
  };
}

export default function App() {
  const [query, setQuery] = useState<TaskQuery>(DEFAULT_QUERY);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [submitting, setSubmitting] = useState(false);
  const [mutationError, setMutationError] = useState<string | null>(null);

  const { result, loading, error, refetch } = useTasks(query);

  const updateQuery = (patch: Partial<TaskQuery>) =>
    setQuery((q) => ({ ...q, ...patch, page: 'page' in patch ? patch.page! : 1 }));

  const openCreateForm = () => {
    setEditingTask(undefined);
    setMutationError(null);
    setShowForm(true);
  };

  const openEditForm = (task: Task) => {
    setEditingTask(task);
    setMutationError(null);
    setShowForm(true);
  };

  const handleSubmit = async (values: TaskFormValues) => {
    setSubmitting(true);
    setMutationError(null);
    try {
      if (editingTask) {
        await tasksApi.update(editingTask.id, toPayload(values));
      } else {
        await tasksApi.create(toPayload(values));
      }
      setShowForm(false);
      refetch();
    } catch (err) {
      setMutationError(err instanceof ApiError ? err.message : 'Failed to save task.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (task: Task) => {
    if (!window.confirm(`Delete "${task.title}"? This cannot be undone.`)) return;
    try {
      await tasksApi.remove(task.id);
      refetch();
    } catch (err) {
      setMutationError(err instanceof ApiError ? err.message : 'Failed to delete task.');
    }
  };

  const handleToggleComplete = async (task: Task) => {
    try {
      await tasksApi.update(task.id, {
        status: task.status === 'completed' ? 'pending' : 'completed',
      });
      refetch();
    } catch (err) {
      setMutationError(err instanceof ApiError ? err.message : 'Failed to update task.');
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Task Manager</h1>
        <button onClick={openCreateForm}>+ New task</button>
      </header>

      <TaskFilters query={query} onChange={updateQuery} />

      {mutationError && <p className="banner error-banner">{mutationError}</p>}

      {loading && <p className="loading-state">Loading tasks...</p>}
      {error && !loading && <p className="banner error-banner">{error}</p>}

      {!loading && !error && result && (
        <>
          <TaskList
            tasks={result.data}
            onEdit={openEditForm}
            onDelete={handleDelete}
            onToggleComplete={handleToggleComplete}
          />
          <Pagination
            page={result.page}
            totalPages={result.totalPages}
            total={result.total}
            onPageChange={(page) => updateQuery({ page })}
          />
        </>
      )}

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <TaskForm
              task={editingTask}
              submitting={submitting}
              onSubmit={handleSubmit}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
