/**
 * Central dark-theme design tokens.
 * Import from here instead of hard-coding hex strings in components.
 */
export const T = {
  // Surfaces
  bg:         '#0f1117',   // page background
  surface:    '#1a1d27',   // card / panel
  surfaceAlt: '#20243a',   // slightly lifted surface (table header, inputs)
  border:     '#2a2d3e',   // subtle border

  // Text
  textPrimary:   '#e8eaf0',
  textSecondary: '#7c82a0',
  textMuted:     '#4a4f68',

  // Brand / action
  accent:      '#6366f1',   // indigo – primary CTA
  accentHover: '#4f46e5',
  accentGlow:  'rgba(99, 102, 241, 0.25)',

  // Status colours  (background / text / border)
  pending:   { bg: 'rgba(234,179,8,0.12)',   text: '#fbbf24', border: 'rgba(234,179,8,0.3)'   },
  running:   { bg: 'rgba(99,102,241,0.12)',  text: '#818cf8', border: 'rgba(99,102,241,0.3)'  },
  completed: { bg: 'rgba(34,197,94,0.12)',   text: '#4ade80', border: 'rgba(34,197,94,0.3)'   },
  failed:    { bg: 'rgba(239,68,68,0.12)',   text: '#f87171', border: 'rgba(239,68,68,0.3)'   },

  // Danger
  danger:      '#f87171',
  dangerBg:    'rgba(239,68,68,0.1)',
  dangerBorder:'rgba(239,68,68,0.3)',

  // Radii
  radius:   '8px',
  radiusSm: '2px',
  radiusXs: '4px',
  radiusPill: '2px',

  // Shadows
  shadow:   '0 4px 24px rgba(0,0,0,0.4)',
  shadowSm: '0 2px 8px rgba(0,0,0,0.3)',
} as const;
