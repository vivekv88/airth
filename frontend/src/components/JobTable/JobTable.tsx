import type { Job, JobStatus } from '../../types/job';
import { ALLOWED_TRANSITIONS } from '../../types/job';
import { T } from '../../types/theme';
import { JobStatusBadge } from '../JobStatusBadge/JobStatusBadge';

interface Props {
  jobs: Job[];
  isLoading: boolean;
  onUpdateStatus: (id: string, status: JobStatus) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
}

const TH: React.CSSProperties = {
  padding: '11px 16px',
  textAlign: 'left',
  fontSize: '11px',
  fontWeight: 700,
  color: T.textMuted,
  textTransform: 'uppercase',
  letterSpacing: '0.07em',
  borderBottom: `1px solid ${T.border}`,
  background: T.surfaceAlt,
  whiteSpace: 'nowrap',
};

const TD: React.CSSProperties = {
  padding: '13px 16px',
  fontSize: '13px',
  color: T.textPrimary,
  borderBottom: `1px solid ${T.border}`,
  verticalAlign: 'middle',
};

export function JobTable({ jobs, isLoading, onUpdateStatus, onDelete }: Props) {
  if (!isLoading && jobs.length === 0) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '56px 24px',
          color: T.textMuted,
          fontSize: '14px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <span style={{ fontSize: '36px' }}>📭</span>
        <span>No jobs found. Create one above.</span>
      </div>
    );
  }

  return (
    <div style={{ overflowX: 'auto', borderRadius: T.radius }}>
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          background: T.surface,
          borderRadius: T.radius,
          overflow: 'hidden',
        }}
      >
        <thead>
          <tr>
            <th style={TH}>Title</th>
            <th style={TH}>Type</th>
            <th style={TH}>Status</th>
            <th style={TH}>Created</th>
            <th style={{ ...TH, textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job, i) => (
            <JobRow
              key={job.id}
              job={job}
              isLoading={isLoading}
              onUpdateStatus={onUpdateStatus}
              onDelete={onDelete}
              isLast={i === jobs.length - 1}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ---------------------------------------------------------------------------

interface RowProps {
  job: Job;
  isLoading: boolean;
  isLast: boolean;
  onUpdateStatus: (id: string, status: JobStatus) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
}

function JobRow({ job, isLoading, isLast, onUpdateStatus, onDelete }: RowProps) {
  const nextStatuses = ALLOWED_TRANSITIONS[job.status];

  const rowTD: React.CSSProperties = {
    ...TD,
    borderBottom: isLast ? 'none' : TD.borderBottom,
  };

  // colour-coded transition buttons per target status
  const TRANSITION_COLORS: Record<JobStatus, { bg: string; text: string; border: string }> = {
    pending:   { bg: T.pending.bg,   text: T.pending.text,   border: T.pending.border   },
    running:   { bg: T.running.bg,   text: T.running.text,   border: T.running.border   },
    completed: { bg: T.completed.bg, text: T.completed.text, border: T.completed.border },
    failed:    { bg: T.failed.bg,    text: T.failed.text,    border: T.failed.border    },
  };

  return (
    <tr
      style={{
        transition: 'background 0.1s',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLTableRowElement).style.background = T.surfaceAlt;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLTableRowElement).style.background = 'transparent';
      }}
    >
      <td style={{ ...rowTD, fontWeight: 600, maxWidth: '220px' }}>
        <span
          style={{
            display: 'block',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
          title={job.title}
        >
          {job.title}
        </span>
      </td>

      <td style={{ ...rowTD }}>
        <span
          style={{
            display: 'inline-block',
            padding: '2px 9px',
            borderRadius: T.radiusSm,
            background: T.surfaceAlt,
            border: `1px solid ${T.border}`,
            color: T.textSecondary,
            fontSize: '11px',
            fontWeight: 500,
            textTransform: 'capitalize',
          }}
        >
          {job.type}
        </span>
      </td>

      <td style={rowTD}>
        <JobStatusBadge status={job.status} />
      </td>

      <td style={{ ...rowTD, color: T.textMuted, fontSize: '12px', whiteSpace: 'nowrap' }}>
        {new Date(job.createdAt).toLocaleString(undefined, {
          month: 'short', day: 'numeric',
          hour: '2-digit', minute: '2-digit',
        })}
      </td>

      <td style={{ ...rowTD, textAlign: 'right' }}>
        <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
          {nextStatuses.map((status) => {
            const c = TRANSITION_COLORS[status];
            return (
              <button
                key={status}
                disabled={isLoading}
                onClick={() => onUpdateStatus(job.id, status)}
                style={{
                  padding: '4px 11px',
                  fontSize: '11px',
                  fontWeight: 600,
                  borderRadius: T.radiusSm,
                  border: `1px solid ${c.border}`,
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  background: c.bg,
                  color: c.text,
                  opacity: isLoading ? 0.5 : 1,
                  textTransform: 'capitalize',
                  transition: 'opacity 0.15s, transform 0.1s',
                  whiteSpace: 'nowrap',
                  fontFamily: 'inherit',
                }}
              >
                → {status}
              </button>
            );
          })}

          <button
            disabled={isLoading}
            onClick={() => onDelete(job.id)}
            style={{
              padding: '4px 11px',
              fontSize: '11px',
              fontWeight: 600,
              borderRadius: T.radiusSm,
              border: `1px solid ${T.dangerBorder}`,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              background: T.dangerBg,
              color: T.danger,
              opacity: isLoading ? 0.5 : 1,
              transition: 'opacity 0.15s',
              fontFamily: 'inherit',
            }}
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}
