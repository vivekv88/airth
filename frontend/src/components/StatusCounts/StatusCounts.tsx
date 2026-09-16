import type { Job, JobStatus } from '../../types/job';
import { ALL_STATUSES } from '../../types/job';
import { T } from '../../types/theme';

interface Props {
  jobs: Job[];
}

const ICONS: Record<JobStatus, string> = {
  pending:   '⏳',
  running:   '⚡',
  completed: '✓',
  failed:    '✕',
};

export function StatusCounts({ jobs }: Props) {
  const counts = ALL_STATUSES.reduce<Record<JobStatus, number>>(
    (acc, s) => { acc[s] = jobs.filter((j) => j.status === s).length; return acc; },
    { pending: 0, running: 0, completed: 0, failed: 0 },
  );

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
      {ALL_STATUSES.map((status) => {
        const palette = T[status];
        return (
          <div
            key={status}
            style={{
              background: T.surfaceAlt,
              border: `1px solid ${T.border}`,
              borderRadius: T.radius,
              padding: '18px 16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* coloured left accent bar */}
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: '3px',
                background: palette.text,
                borderRadius: '3px 0 0 3px',
              }}
            />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '12px', color: T.textSecondary, textTransform: 'capitalize', fontWeight: 500 }}>
                {status}
              </span>
              <span
                style={{
                  fontSize: '14px',
                  background: palette.bg,
                  borderRadius: T.radiusSm,
                  padding: '2px 6px',
                  lineHeight: 1.4,
                }}
              >
                {ICONS[status]}
              </span>
            </div>

            <div style={{ fontSize: '32px', fontWeight: 800, color: palette.text, lineHeight: 1 }}>
              {counts[status]}
            </div>
          </div>
        );
      })}
    </div>
  );
}
