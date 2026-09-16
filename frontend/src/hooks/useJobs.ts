import { useCallback, useEffect, useReducer } from 'react';
import { jobsApi } from '../api/jobs.api';
import type { CreateJobPayload, Job, JobStatus } from '../types/job';

// ---------------------------------------------------------------------------
// State shape
// ---------------------------------------------------------------------------

interface JobsState {
  jobs: Job[];
  isLoading: boolean;
  /** Error from the last fetch */
  fetchError: string | null;
  /** Error from the last mutation (create / update / delete) */
  mutationError: string | null;
}

const initialState: JobsState = {
  jobs: [],
  isLoading: false,
  fetchError: null,
  mutationError: null,
};

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------

type Action =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: Job[] }
  | { type: 'FETCH_ERROR'; payload: string }
  | { type: 'MUTATION_SUCCESS'; payload: Job[] }
  | { type: 'MUTATION_ERROR'; payload: string }
  | { type: 'CLEAR_MUTATION_ERROR' };

function reducer(state: JobsState, action: Action): JobsState {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, isLoading: true, fetchError: null };

    case 'FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        jobs: action.payload,
        fetchError: null,
      };

    case 'FETCH_ERROR':
      return { ...state, isLoading: false, fetchError: action.payload };

    case 'MUTATION_SUCCESS':
      return {
        ...state,
        isLoading: false,
        jobs: action.payload,
        mutationError: null,
      };

    case 'MUTATION_ERROR':
      return { ...state, isLoading: false, mutationError: action.payload };

    case 'CLEAR_MUTATION_ERROR':
      return { ...state, mutationError: null };

    default:
      return state;
  }
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useJobs() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const fetchJobs = useCallback(async () => {
    dispatch({ type: 'FETCH_START' });
    try {
      const jobs = await jobsApi.getAll();
      dispatch({ type: 'FETCH_SUCCESS', payload: jobs });
    } catch (err) {
      dispatch({
        type: 'FETCH_ERROR',
        payload: err instanceof Error ? err.message : 'Failed to load jobs',
      });
    }
  }, []);

  // Initial load.
  useEffect(() => {
    void fetchJobs();
  }, [fetchJobs]);

  const createJob = useCallback(
    async (payload: CreateJobPayload): Promise<boolean> => {
      dispatch({ type: 'FETCH_START' });
      try {
        await jobsApi.create(payload);
        const jobs = await jobsApi.getAll();
        dispatch({ type: 'MUTATION_SUCCESS', payload: jobs });
        return true;
      } catch (err) {
        dispatch({
          type: 'MUTATION_ERROR',
          payload: err instanceof Error ? err.message : 'Failed to create job',
        });
        return false;
      }
    },
    [],
  );

  const updateStatus = useCallback(
    async (id: string, status: JobStatus): Promise<boolean> => {
      dispatch({ type: 'FETCH_START' });
      try {
        await jobsApi.updateStatus(id, status);
        const jobs = await jobsApi.getAll();
        dispatch({ type: 'MUTATION_SUCCESS', payload: jobs });
        return true;
      } catch (err) {
        dispatch({
          type: 'MUTATION_ERROR',
          payload:
            err instanceof Error ? err.message : 'Failed to update status',
        });
        return false;
      }
    },
    [],
  );

  const deleteJob = useCallback(async (id: string): Promise<boolean> => {
    dispatch({ type: 'FETCH_START' });
    try {
      await jobsApi.delete(id);
      const jobs = await jobsApi.getAll();
      dispatch({ type: 'MUTATION_SUCCESS', payload: jobs });
      return true;
    } catch (err) {
      dispatch({
        type: 'MUTATION_ERROR',
        payload: err instanceof Error ? err.message : 'Failed to delete job',
      });
      return false;
    }
  }, []);

  const clearMutationError = useCallback(() => {
    dispatch({ type: 'CLEAR_MUTATION_ERROR' });
  }, []);

  return {
    ...state,
    fetchJobs,
    createJob,
    updateStatus,
    deleteJob,
    clearMutationError,
  };
}
