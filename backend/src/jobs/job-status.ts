
export enum JobStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export enum JobType {
  EMAIL = 'email',
  REPORT = 'report',
  EXPORT = 'export',
  IMPORT = 'import',
  NOTIFICATION = 'notification',
}

export const ALLOWED_TRANSITIONS: Record<JobStatus, JobStatus[]> = {
  [JobStatus.PENDING]: [JobStatus.RUNNING, JobStatus.FAILED],
  [JobStatus.RUNNING]: [JobStatus.COMPLETED, JobStatus.FAILED],
  [JobStatus.COMPLETED]: [],
  [JobStatus.FAILED]: [],
};

export function isValidTransition(
  current: JobStatus,
  next: JobStatus,
): boolean {
  return ALLOWED_TRANSITIONS[current].includes(next);
}
