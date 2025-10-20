// Shared types across the monorepo

// ==================== User Types ====================

export interface User {
  id: number;
  email: string;
  username: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface CreateUserDto {
  email: string;
  username: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenDto {
  refreshToken: string;
}

// ==================== Task Types ====================

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  REVIEW = 'REVIEW',
  DONE = 'DONE',
}

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export interface Task {
  id: number;
  title: string;
  description: string;
  deadline: Date;
  priority: TaskPriority;
  status: TaskStatus;
  authorId: number;
  author?: User;
  assignedUsers?: User[];
  comments?: Comment[];
  createdAt: Date;
  updatedAt?: Date;
}

export interface CreateTaskDto {
  title: string;
  description: string;
  deadline: Date;
  priority: TaskPriority;
  assignedUserIds?: number[];
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  deadline?: Date;
  priority?: TaskPriority;
  status?: TaskStatus;
  assignedUserIds?: number[];
}

// ==================== Comment Types ====================

export interface Comment {
  id: number;
  content: string;
  taskId: number;
  userId: number;
  user?: User;
  createdAt: Date;
  updatedAt?: Date;
}

export interface CreateCommentDto {
  content: string;
}

// ==================== Notification Types ====================

export enum NotificationType {
  TASK_ASSIGNED = 'TASK_ASSIGNED',
  TASK_STATUS_CHANGED = 'TASK_STATUS_CHANGED',
  NEW_COMMENT = 'NEW_COMMENT',
}

export interface Notification {
  id: number;
  userId: number;
  type: NotificationType;
  message: string;
  read: boolean;
  taskId?: number;
  createdAt: Date;
}

// ==================== Task History Types ====================

export interface TaskHistory {
  id: number;
  taskId: number;
  field: string;
  oldValue: string;
  newValue: string;
  changedBy: number;
  changedAt: Date;
}

// ==================== Event Types (RabbitMQ) ====================

export interface TaskCreatedEvent {
  taskId: number;
  title: string;
  authorId: number;
  assignedUserIds: number[];
  timestamp: Date;
}

export interface TaskUpdatedEvent {
  taskId: number;
  title: string;
  changes: {
    field: string;
    oldValue: any;
    newValue: any;
  }[];
  updatedBy: number;
  assignedUserIds: number[];
  timestamp: Date;
}

export interface CommentCreatedEvent {
  commentId: number;
  taskId: number;
  taskTitle: string;
  content: string;
  userId: number;
  username: string;
  assignedUserIds: number[];
  timestamp: Date;
}

// ==================== WebSocket Events ====================

export interface TaskCreatedWsEvent {
  event: 'task:created';
  data: {
    task: Task;
    notification: Notification;
  };
}

export interface TaskUpdatedWsEvent {
  event: 'task:updated';
  data: {
    task: Task;
    notification: Notification;
  };
}

export interface CommentNewWsEvent {
  event: 'comment:new';
  data: {
    comment: Comment;
    task: Task;
    notification: Notification;
  };
}

// ==================== Pagination ====================

export interface PaginationQuery {
  page?: number;
  size?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    size: number;
    totalPages: number;
  };
}

// ==================== API Response ====================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

