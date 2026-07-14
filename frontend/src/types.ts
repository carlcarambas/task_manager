export type TaskStatus = 'pending' | 'in_progress' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedTasks {
  data: Task[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface TaskQuery {
  page: number;
  limit: number;
  status?: TaskStatus;
  priority?: TaskPriority;
  search?: string;
  sortBy: 'dueDate' | 'createdAt' | 'priority';
  sortOrder: 'asc' | 'desc';
}

export interface TaskFormValues {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
}
