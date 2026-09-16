import type { JobStatus } from '../../types/job';
import { T } from '../../types/theme';

interface Props {
  status: JobStatus;
}

const STYLES: Record<JobStatus, React.CSSProperties> = {
  pending:   { color: T.pending.text },
  running:   { color: T.running.text },
  completed: { color: T.completed.text },
  failed:    { color: T.failed.text    },
};

const BASE: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '5px',
  padding: '3px 10px',
  borderRadius: T.radiusPill,
  fontSize: '11px',
  fontWeight: 600,
  textTransform: 'capitalize',
  letterSpacing: '0.04em',
};

const DOTS: Record<JobStatus, string> = {
  pending:   T.pending.text,
  running:   T.running.text,
  completed: T.completed.text,
  failed:    T.failed.text,
};

export function JobStatusBadge({ status }: Props) {
  return (
    <span style={{ ...BASE, ...STYLES[status] }}>
      <span
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: DOTS[status],
          flexShrink: 0,
          // pulse only for running
          animation: status === 'running' ? 'pulse 1.6s ease-in-out infinite' : undefined,
        }}
      />
      {status}
    </span>
  );
}
