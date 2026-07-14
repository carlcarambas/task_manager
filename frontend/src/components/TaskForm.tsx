import { useState, type FormEvent } from 'react';
import type { Task, TaskFormValues } from '../types';

interface Props {
  task?: Task;
  submitting: boolean;
  onSubmit: (values: TaskFormValues) => void;
  onCancel: () => void;
}

const EMPTY_VALUES: TaskFormValues = {
  title: '',
  description: '',
  status: 'pending',
  priority: 'medium',
  dueDate: '',
};

function toFormValues(task?: Task): TaskFormValues {
  if (!task) return EMPTY_VALUES;
  return {
    title: task.title,
    description: task.description ?? '',
    status: task.status,
    priority: task.priority,
    dueDate: task.dueDate ? task.dueDate.slice(0, 10) : '',
  };
}

function validate(values: TaskFormValues): Partial<Record<keyof TaskFormValues, string>> {
  const errors: Partial<Record<keyof TaskFormValues, string>> = {};
  if (!values.title.trim()) errors.title = 'Title is required.';
  else if (values.title.length > 100) errors.title = 'Title must be 100 characters or fewer.';
  if (values.description.length > 500)
    errors.description = 'Description must be 500 characters or fewer.';
  return errors;
}

export function TaskForm({ task, submitting, onSubmit, onCancel }: Props) {
  const [values, setValues] = useState<TaskFormValues>(() => toFormValues(task));
  const [errors, setErrors] = useState<Partial<Record<keyof TaskFormValues, string>>>({});

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const validationErrors = validate(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) onSubmit(values);
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <h2>{task ? 'Edit task' : 'New task'}</h2>

      <label>
        Title
        <input
          value={values.title}
          maxLength={100}
          onChange={(e) => setValues({ ...values, title: e.target.value })}
          aria-invalid={Boolean(errors.title)}
        />
        {errors.title && <span className="field-error">{errors.title}</span>}
      </label>

      <label>
        Description
        <textarea
          value={values.description}
          maxLength={500}
          rows={3}
          onChange={(e) => setValues({ ...values, description: e.target.value })}
        />
        {errors.description && <span className="field-error">{errors.description}</span>}
      </label>

      <div className="form-row">
        <label>
          Status
          <select
            value={values.status}
            onChange={(e) =>
              setValues({ ...values, status: e.target.value as TaskFormValues['status'] })
            }
          >
            <option value="pending">Pending</option>
            <option value="in_progress">In progress</option>
            <option value="completed">Completed</option>
          </select>
        </label>

        <label>
          Priority
          <select
            value={values.priority}
            onChange={(e) =>
              setValues({ ...values, priority: e.target.value as TaskFormValues['priority'] })
            }
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </label>

        <label>
          Due date
          <input
            type="date"
            value={values.dueDate}
            onChange={(e) => setValues({ ...values, dueDate: e.target.value })}
          />
        </label>
      </div>

      <div className="form-actions">
        <button type="button" onClick={onCancel} disabled={submitting}>
          Cancel
        </button>
        <button type="submit" disabled={submitting}>
          {submitting ? 'Saving...' : task ? 'Save changes' : 'Create task'}
        </button>
      </div>
    </form>
  );
}
