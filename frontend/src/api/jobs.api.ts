import type { CreateJobPayload, Job, JobStatus } from '../types/job';

const BASE_URL = 'https://airth-cgqa.onrender.com';

async function request<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  // 204 No Content (DELETE) has no body.
  if (response.status === 204) {
    return undefined as T;
  }

  const json = await response.json();

  if (!response.ok) {
    // The GlobalHttpExceptionFilter always puts the human-readable reason in
    // `message`. Prefer an array join so validation errors stay readable.
    const msg = Array.isArray(json.message)
      ? json.message.join(', ')
      : (json.message ?? 'An unexpected error occurred');
    throw new Error(msg);
  }

  // Successful responses are wrapped: { success: true, data: T }
  return json.data as T;
}

export const jobsApi = {
  getAll(): Promise<Job[]> {
    return request<Job[]>('/jobs');
  },

  create(payload: CreateJobPayload): Promise<Job> {
    return request<Job>('/jobs', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  updateStatus(id: string, status: JobStatus): Promise<Job> {
    return request<Job>(`/jobs/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  delete(id: string): Promise<void> {
    return request<void>(`/jobs/${id}`, { method: 'DELETE' });
  },
};
