import type { OpdVisitStatus } from '../types';

interface OpdStatusBadgeProps {
  status: OpdVisitStatus;
}

const STATUS_CONFIG: Record<
  OpdVisitStatus,
  { bg: string; color: string; border: string; dot: string; label: string; pulse?: boolean }
> = {
  waiting: {
    bg: '#fffbeb',
    color: '#b45309',
    border: '#fde68a',
    dot: '#f59e0b',
    label: 'Waiting for Vitals',
    pulse: true,
  },
  vitals_done: {
    bg: '#eff6ff',
    color: '#1d4ed8',
    border: '#bfdbfe',
    dot: '#3b82f6',
    label: 'Ready for Doctor',
  },
  in_consultation: {
    bg: '#faf5ff',
    color: '#6b21a8',
    border: '#e9d5ff',
    dot: '#9333ea',
    label: 'In Consultation',
    pulse: true,
  },
  completed: {
    bg: '#f0fdf4',
    color: '#15803d',
    border: '#bbf7d0',
    dot: '#16a34a',
    label: 'Completed',
  },
  cancelled: {
    bg: '#fef2f2',
    color: '#b91c1c',
    border: '#fecaca',
    dot: '#dc2626',
    label: 'Cancelled',
  },
};

export function OpdStatusBadge({ status }: OpdStatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? {
    bg: '#f1f5f9',
    color: '#475569',
    border: '#cbd5e1',
    dot: '#94a3b8',
    label: status,
  };

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '3px 9px',
        borderRadius: 999,
        fontSize: 11,
        fontWeight: 600,
        backgroundColor: config.bg,
        color: config.color,
        border: `1px solid ${config.border}`,
        whiteSpace: 'nowrap',
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          backgroundColor: config.dot,
          display: 'inline-block',
        }}
        className={config.pulse ? 'clinical-pulse-amber' : undefined}
      />
      {config.label}
    </span>
  );
}

