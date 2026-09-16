import type { JobStatus } from '../../types/job';
import { ALL_STATUSES } from '../../types/job';
import { T } from '../../types/theme';

type FilterValue = JobStatus | 'all';

interface Props {
  value: FilterValue;
  onChange: (value: FilterValue) => void;
}

const FILTERS: { label: string; value: FilterValue }[] = [
  { label: 'All', value: 'all' },
  ...ALL_STATUSES.map((s) => ({
    label: s.charAt(0).toUpperCase() + s.slice(1),
    value: s as FilterValue,
  })),
];

export function StatusFilter({ value, onChange }: Props) {
  return (
    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
      {FILTERS.map((f) => {
        const active = value === f.value;
        return (
          <button
            key={f.value}
            onClick={() => onChange(f.value)}
            style={{
              padding: '5px 14px',
              borderRadius: T.radiusPill,
              border: `1px solid ${active ? T.accent : T.border}`,
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: active ? 600 : 400,
              transition: 'all 0.15s',
              background: active ? T.accent : 'transparent',
              color: active ? '#fff' : T.textSecondary,
              letterSpacing: '0.02em',
            }}
          >
            {f.label}
          </button>
        );
      })}
    </div>
  );
}
