import type { ChangeEvent } from 'react';
import type { TaskQuery } from '../types';

interface Props {
  query: TaskQuery;
  onChange: (patch: Partial<TaskQuery>) => void;
}

export function TaskFilters({ query, onChange }: Props) {
  const handleSelect =
    (key: keyof TaskQuery) => (e: ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value;
      onChange({ [key]: value === '' ? undefined : value } as Partial<TaskQuery>);
    };

  return (
    <div className="filters">
      <input
        type="search"
        placeholder="Search title or description..."
        value={query.search ?? ''}
        onChange={(e) => onChange({ search: e.target.value || undefined })}
        aria-label="Search tasks"
      />

      <select
        value={query.status ?? ''}
        onChange={handleSelect('status')}
        aria-label="Filter by status"
      >
        <option value="">All statuses</option>
        <option value="pending">Pending</option>
        <option value="in_progress">In progress</option>
        <option value="completed">Completed</option>
      </select>

      <select
        value={query.priority ?? ''}
        onChange={handleSelect('priority')}
        aria-label="Filter by priority"
      >
        <option value="">All priorities</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>

      <select
        value={query.sortBy}
        onChange={handleSelect('sortBy')}
        aria-label="Sort by"
      >
        <option value="createdAt">Sort: created date</option>
        <option value="dueDate">Sort: due date</option>
        <option value="priority">Sort: priority</option>
      </select>

      <select
        value={query.sortOrder}
        onChange={handleSelect('sortOrder')}
        aria-label="Sort order"
      >
        <option value="desc">Descending</option>
        <option value="asc">Ascending</option>
      </select>
    </div>
  );
}
