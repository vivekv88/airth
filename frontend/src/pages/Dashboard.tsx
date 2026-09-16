import { useState } from 'react';
import { useJobs } from '../hooks/useJobs';
import { JobForm } from '../components/JobForm/JobForm';
import { JobTable } from '../components/JobTable/JobTable';
import { StatusCounts } from '../components/StatusCounts/StatusCounts';
import { StatusFilter } from '../components/StatusFilter/StatusFilter';
import { T } from '../types/theme';
import type { JobStatus } from '../types/job';

type FilterValue = JobStatus | 'all';

// Shared card style
const CARD: React.CSSProperties = {
  background: T.surface,
  border: `1px solid ${T.border}`,
  borderRadius: T.radius,
  padding: '24px',
};

const CARD_TITLE: React.CSSProperties = {
  fontSize: '13px',
  fontWeight: 700,
  color: T.textSecondary,
  textTransform: 'uppercase',
  letterSpacing: '0.07em',
  marginBottom: '18px',
};

export function Dashboard() {
  const {
    jobs,
    isLoading,
    fetchError,
    mutationError,
    createJob,
    updateStatus,
    deleteJob,
    clearMutationError,
    fetchJobs,
  } = useJobs();

  const [filter, setFilter] = useState<FilterValue>('all');
  const visibleJobs = filter === 'all' ? jobs : jobs.filter((j) => j.status === filter);

  return (
    <>
      {/* ── Keyframes injected once ─────────────────────────────── */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.35; }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <main
        style={{
          maxWidth: '980px',
          margin: '0 auto',
          padding: '36px 20px 60px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        {/* ── Header ──────────────────────────────────────────────── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            marginBottom: '8px',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
              <span style={{ fontSize: '22px' }}>⚙️</span>
              <h1 style={{ fontSize: '22px', fontWeight: 800, color: T.textPrimary, margin: 0 }}>
                Job Queue Dashboard
              </h1>
            </div>
            <p style={{ fontSize: '13px', color: T.textSecondary, marginLeft: '32px' }}>
              Monitor and manage your background jobs in real time
            </p>
          </div>

          <button
            onClick={() => void fetchJobs()}
            disabled={isLoading}
            style={{
              padding: '8px 18px',
              fontSize: '12px',
              fontWeight: 600,
              borderRadius: T.radiusSm,
              border: `1px solid ${T.border}`,
              background: T.surfaceAlt,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              color: T.textSecondary,
              transition: 'all 0.15s',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontFamily: 'inherit',
              opacity: isLoading ? 0.6 : 1,
            }}
          >
            <span
              style={{
                display: 'inline-block',
                animation: isLoading ? 'spin 0.8s linear infinite' : undefined,
              }}
            >
              ↻
            </span>
            {isLoading ? 'Refreshing…' : 'Refresh'}
          </button>
        </div>

        {/* ── Error banners ────────────────────────────────────────── */}
        {fetchError && (
          <div
            style={{
              padding: '12px 16px',
              background: T.dangerBg,
              border: `1px solid ${T.dangerBorder}`,
              borderRadius: T.radiusSm,
              color: T.danger,
              fontSize: '13px',
              animation: 'slideDown 0.2s ease',
            }}
          >
            <strong>Could not load jobs:</strong> {fetchError}
          </div>
        )}

        {mutationError && (
          <div
            style={{
              padding: '12px 16px',
              background: T.dangerBg,
              border: `1px solid ${T.dangerBorder}`,
              borderRadius: T.radiusSm,
              color: T.danger,
              fontSize: '13px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '12px',
              animation: 'slideDown 0.2s ease',
            }}
          >
            <span><strong>Error:</strong> {mutationError}</span>
            <button
              onClick={clearMutationError}
              aria-label="Dismiss"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '17px',
                lineHeight: 1,
                color: T.danger,
                padding: '0 2px',
              }}
            >
              ×
            </button>
          </div>
        )}

        {/* ── Overview cards ──────────────────────────────────────── */}
        <section>
          <p style={CARD_TITLE}>Overview</p>
          <StatusCounts jobs={jobs} />
        </section>

        {/* ── Create job ──────────────────────────────────────────── */}
        <section style={CARD}>
          <p style={CARD_TITLE}>Create New Job</p>
          <JobForm onSubmit={createJob} isLoading={isLoading} />
        </section>

        {/* ── Job list ────────────────────────────────────────────── */}
        <section style={CARD}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
              marginBottom: '18px',
            }}
          >
            <p style={{ ...CARD_TITLE, marginBottom: 0 }}>
              Jobs&nbsp;
              <span
                style={{
                  background: T.surfaceAlt,
                  border: `1px solid ${T.border}`,
                  borderRadius: T.radiusPill,
                  padding: '1px 8px',
                  fontSize: '11px',
                  color: T.textMuted,
                  fontWeight: 500,
                  letterSpacing: 0,
                  textTransform: 'none',
                }}
              >
                {visibleJobs.length}
              </span>
            </p>
            <StatusFilter value={filter} onChange={setFilter} />
          </div>

          {isLoading && jobs.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '56px',
                color: T.textMuted,
                fontSize: '14px',
              }}
            >
              Loading jobs…
            </div>
          ) : (
            <JobTable
              jobs={visibleJobs}
              isLoading={isLoading}
              onUpdateStatus={updateStatus}
              onDelete={deleteJob}
            />
          )}
        </section>
      </main>
    </>
  );
}
