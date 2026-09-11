import type { AppointmentStatus } from '../types';

interface AppointmentStatusTagProps {
  status: AppointmentStatus;
}

const STATUS_CONFIG: Record<
  AppointmentStatus,
  { bg: string; color: string; border: string; dot: string; label: string }
> = {
  scheduled: {
    bg: '#eff6ff',
    color: '#1d4ed8',
    border: '#bfdbfe',
    dot: '#3b82f6',
    label: 'Scheduled',
  },
  confirmed: {
    bg: '#ecfeff',
    color: '#0e7490',
    border: '#a5f3fc',
    dot: '#06b6d4',
    label: 'Confirmed',
  },
  checked_in: {
    bg: '#faf5ff',
    color: '#6b21a8',
    border: '#e9d5ff',
    dot: '#9333ea',
    label: 'Checked In',
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
  no_show: {
    bg: '#f8fafc',
    color: '#475569',
    border: '#e2e8f0',
    dot: '#94a3b8',
    label: 'No Show',
  },
};

export function AppointmentStatusTag({ status }: AppointmentStatusTagProps) {
  const config = STATUS_CONFIG[status] ?? {
    bg: '#f8fafc',
    color: '#475569',
    border: '#e2e8f0',
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
      />
      {config.label}
    </span>
  );
}

