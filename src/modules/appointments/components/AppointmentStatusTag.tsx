import { Tag } from 'antd';
import type { AppointmentStatus } from '../types';

interface AppointmentStatusTagProps {
  status: AppointmentStatus;
}

const STATUS_CONFIG: Record<AppointmentStatus, { color: string; label: string }> = {
  scheduled: { color: 'blue', label: 'Scheduled' },
  confirmed: { color: 'cyan', label: 'Confirmed' },
  checked_in: { color: 'purple', label: 'Checked In' },
  completed: { color: 'success', label: 'Completed' },
  cancelled: { color: 'error', label: 'Cancelled' },
  no_show: { color: 'default', label: 'No Show' },
};

export function AppointmentStatusTag({ status }: AppointmentStatusTagProps) {
  const config = STATUS_CONFIG[status] ?? { color: 'default', label: status };
  return <Tag color={config.color}>{config.label}</Tag>;
}
