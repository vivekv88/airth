import { useState } from 'react';
import type { CreateJobPayload, JobType } from '../../types/job';
import { ALL_TYPES } from '../../types/job';
import './JobForm.css';

interface Props {
  onSubmit: (payload: CreateJobPayload) => Promise<boolean>;
  isLoading: boolean;
}

interface FormErrors {
  title?: string;
  type?: string;
}

export function JobForm({ onSubmit, isLoading }: Props) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<JobType | ''>('');
  const [errors, setErrors] = useState<FormErrors>({});

  function validate(): boolean {
    const next: FormErrors = {};
    if (!title.trim()) {
      next.title = 'Title is required';
    } else if (title.trim().length > 100) {
      next.title = 'Title must be at most 100 characters';
    }
    if (!type) {
      next.type = 'Type is required';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    const ok = await onSubmit({ title: title.trim(), type: type as JobType });
    if (ok) {
      setTitle('');
      setType('');
      setErrors({});
    }
  }

  return (
    <form className="job-form" onSubmit={handleSubmit} noValidate>
      <div className="job-form__row">
        <div className="job-form__field">
          <label className="job-form__label" htmlFor="job-title">
            Job Title
          </label>
          <input
            id="job-title"
            className={`job-form__input${errors.title ? ' error' : ''}`}
            type="text"
            placeholder="e.g. Weekly sales report"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (errors.title) setErrors((p) => ({ ...p, title: undefined }));
            }}
            disabled={isLoading}
          />
          {errors.title && (
            <span className="job-form__error">{errors.title}</span>
          )}
        </div>

        <div className="job-form__field">
          <label className="job-form__label" htmlFor="job-type">
            Job Type
          </label>
          <select
            id="job-type"
            className={`job-form__select${errors.type ? ' error' : ''}`}
            value={type}
            onChange={(e) => {
              setType(e.target.value as JobType);
              if (errors.type) setErrors((p) => ({ ...p, type: undefined }));
            }}
            disabled={isLoading}
          >
            <option value="">Select a type…</option>
            {ALL_TYPES.map((t) => (
              <option key={t} value={t}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </option>
            ))}
          </select>
          {errors.type && (
            <span className="job-form__error">{errors.type}</span>
          )}
        </div>
      </div>

      <button className="job-form__submit" type="submit" disabled={isLoading}>
        {isLoading ? 'Creating…' : 'Create Job'}
      </button>
    </form>
  );
}
