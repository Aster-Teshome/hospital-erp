import { Tag } from 'antd';
import type { OpdVisitStatus } from '../types';

interface OpdStatusBadgeProps {
  status: OpdVisitStatus;
}

const STATUS_CONFIG: Record<OpdVisitStatus, { color: string; label: string }> = {
  waiting: { color: 'gold', label: 'Waiting for Vitals' },
  vitals_done: { color: 'blue', label: 'Vitals Recorded' },
  in_consultation: { color: 'purple', label: 'In Consultation' },
  completed: { color: 'success', label: 'Completed' },
  cancelled: { color: 'error', label: 'Cancelled' },
};

export function OpdStatusBadge({ status }: OpdStatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? { color: 'default', label: status };
  return <Tag color={config.color}>{config.label}</Tag>;
}
