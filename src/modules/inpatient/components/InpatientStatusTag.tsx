import { CheckCircleOutlined, ClockCircleOutlined, SwapOutlined } from '@ant-design/icons';
import { Tag } from 'antd';
import type { InpatientStatus, PatientSeverity } from '../types';

export function InpatientStatusTag({ status }: { status: InpatientStatus }) {
  switch (status) {
    case 'admitted':
      return (
        <Tag
          icon={<ClockCircleOutlined />}
          style={{
            background: '#e0f2fe',
            color: '#0369a1',
            borderColor: '#bae6fd',
            fontWeight: 600,
            borderRadius: 6,
            padding: '2px 8px',
          }}
        >
          ADMITTED
        </Tag>
      );
    case 'discharged':
      return (
        <Tag
          icon={<CheckCircleOutlined />}
          style={{
            background: '#ecfdf5',
            color: '#047857',
            borderColor: '#a7f3d0',
            fontWeight: 600,
            borderRadius: 6,
            padding: '2px 8px',
          }}
        >
          DISCHARGED
        </Tag>
      );
    case 'transferred':
      return (
        <Tag
          icon={<SwapOutlined />}
          style={{
            background: '#fef3c7',
            color: '#b45309',
            borderColor: '#fde68a',
            fontWeight: 600,
            borderRadius: 6,
            padding: '2px 8px',
          }}
        >
          TRANSFERRED
        </Tag>
      );
    default:
      return <Tag>{status}</Tag>;
  }
}

export function SeverityBadge({ severity }: { severity: PatientSeverity }) {
  switch (severity) {
    case 'critical':
      return (
        <Tag
          color="red"
          style={{
            fontWeight: 700,
            borderRadius: 6,
            fontSize: 11,
            letterSpacing: '0.5px',
          }}
        >
          CRITICAL
        </Tag>
      );
    case 'serious':
      return (
        <Tag
          color="orange"
          style={{
            fontWeight: 700,
            borderRadius: 6,
            fontSize: 11,
            letterSpacing: '0.5px',
          }}
        >
          SERIOUS
        </Tag>
      );
    case 'stable':
      return (
        <Tag
          color="blue"
          style={{
            fontWeight: 600,
            borderRadius: 6,
            fontSize: 11,
            letterSpacing: '0.5px',
          }}
        >
          STABLE
        </Tag>
      );
  }
}
