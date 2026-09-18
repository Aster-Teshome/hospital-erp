import {
  CheckCircleFilled,
  ClockCircleFilled,
  ToolFilled,
  UserOutlined,
} from '@ant-design/icons';
import { Tag } from 'antd';
import type { BedStatus, BedType } from '../types';

export function BedStatusBadge({ status }: { status: BedStatus }) {
  switch (status) {
    case 'available':
      return (
        <Tag
          icon={<CheckCircleFilled style={{ color: '#10b981' }} />}
          style={{
            background: '#ecfdf5',
            color: '#065f46',
            borderColor: '#a7f3d0',
            fontWeight: 700,
            borderRadius: 6,
            fontSize: 11,
          }}
        >
          AVAILABLE
        </Tag>
      );
    case 'occupied':
      return (
        <Tag
          icon={<UserOutlined style={{ color: '#3b82f6' }} />}
          style={{
            background: '#eff6ff',
            color: '#1e40af',
            borderColor: '#bfdbfe',
            fontWeight: 700,
            borderRadius: 6,
            fontSize: 11,
          }}
        >
          OCCUPIED
        </Tag>
      );
    case 'cleaning':
      return (
        <Tag
          icon={<ClockCircleFilled style={{ color: '#f59e0b' }} />}
          style={{
            background: '#fffbeb',
            color: '#92400e',
            borderColor: '#fde68a',
            fontWeight: 700,
            borderRadius: 6,
            fontSize: 11,
          }}
        >
          CLEANING
        </Tag>
      );
    case 'maintenance':
      return (
        <Tag
          icon={<ToolFilled style={{ color: '#ef4444' }} />}
          style={{
            background: '#fef2f2',
            color: '#991b1b',
            borderColor: '#fecaca',
            fontWeight: 700,
            borderRadius: 6,
            fontSize: 11,
          }}
        >
          MAINTENANCE
        </Tag>
      );
    case 'reserved':
      return (
        <Tag
          style={{
            background: '#faf5ff',
            color: '#6b21a8',
            borderColor: '#e9d5ff',
            fontWeight: 700,
            borderRadius: 6,
            fontSize: 11,
          }}
        >
          RESERVED
        </Tag>
      );
    default:
      return <Tag>{status}</Tag>;
  }
}

export function BedTypeTag({ type }: { type: BedType }) {
  const map: Record<BedType, { label: string; color: string }> = {
    standard: { label: 'Standard', color: 'default' },
    icu: { label: 'ICU / Critical', color: 'magenta' },
    isolation: { label: 'Isolation', color: 'purple' },
    pediatric: { label: 'Pediatric', color: 'cyan' },
    maternity: { label: 'Maternity', color: 'pink' },
    deluxe: { label: 'Private / Deluxe', color: 'gold' },
  };

  const item = map[type] || { label: type, color: 'default' };
  return (
    <Tag color={item.color} style={{ borderRadius: 4, fontSize: 10, fontWeight: 600 }}>
      {item.label}
    </Tag>
  );
}
