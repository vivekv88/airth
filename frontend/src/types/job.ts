export type JobStatus = 'pending' | 'running' | 'completed' | 'failed';

export type JobType =
  | 'email'
  | 'report'
  | 'export'
  | 'import'
  | 'notification';

export interface Job {
  id: string;
  title: string;
  type: JobType;
  status: JobStatus;
  version: number;
  createdAt: string;
}

export interface CreateJobPayload {
  title: string;
  type: JobType;
}

/** Statuses a job may validly move to from a given status. */
export const ALLOWED_TRANSITIONS: Record<JobStatus, JobStatus[]> = {
  pending: ['running', 'failed'],
  running: ['completed', 'failed'],
  completed: [],
  failed: [],
};

export const ALL_STATUSES: JobStatus[] = [
  'pending',
  'running',
  'completed',
  'failed',
];

export const ALL_TYPES: JobType[] = [
  'email',
  'report',
  'export',
  'import',
  'notification',
];
