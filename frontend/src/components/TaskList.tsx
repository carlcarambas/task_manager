import type { Task } from '../types';

interface Props {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onToggleComplete: (task: Task) => void;
}

const STATUS_LABEL: Record<Task['status'], string> = {
  pending: 'Pending',
  in_progress: 'In progress',
  completed: 'Completed',
};

function formatDate(value?: string) {
  if (!value) return '—';
  return new Date(value).toLocaleDateString();
}

export function TaskList({ tasks, onEdit, onDelete, onToggleComplete }: Props) {
  if (tasks.length === 0) {
    return <p className="empty-state">No tasks match the current filters.</p>;
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <li key={task.id} className={`task-card status-${task.status}`}>
          <div className="task-card-main">
            <label className="task-complete-toggle">
              <input
                type="checkbox"
                checked={task.status === 'completed'}
                onChange={() => onToggleComplete(task)}
                aria-label={`Mark "${task.title}" as ${
                  task.status === 'completed' ? 'incomplete' : 'complete'
                }`}
              />
              <span className={task.status === 'completed' ? 'title-done' : undefined}>
                {task.title}
              </span>
            </label>
            {task.description && <p className="task-description">{task.description}</p>}
            <div className="task-meta">
              <span className={`badge status-${task.status}`}>{STATUS_LABEL[task.status]}</span>
              <span className={`badge priority-badge-${task.priority}`}>{task.priority}</span>
              <span className="due-date">Due {formatDate(task.dueDate)}</span>
            </div>
          </div>
          <div className="task-actions">
            <button onClick={() => onEdit(task)}>Edit</button>
            <button className="danger" onClick={() => onDelete(task)}>
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
