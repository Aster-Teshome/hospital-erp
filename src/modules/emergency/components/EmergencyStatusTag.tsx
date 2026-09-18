import React from 'react';
import { Tag } from 'antd';
import type { EmergencyStatus } from '../types';

interface EmergencyStatusTagProps {
  status: EmergencyStatus;
}

export const EmergencyStatusTag: React.FC<EmergencyStatusTagProps> = ({ status }) => {
  const statusConfig: Record<EmergencyStatus, { color: string; label: string; bg: string }> = {
    registered: {
      color: '#f59e0b',
      bg: '#fef3c7',
      label: 'Awaiting Triage',
    },
    triaged: {
      color: '#0284c7',
      bg: '#e0f2fe',
      label: 'Triaged / Waiting Dr',
    },
    in_treatment: {
      color: '#8b5cf6',
      bg: '#ede9fe',
      label: 'In Treatment',
    },
    admitted: {
      color: '#059669',
      bg: '#d1fae5',
      label: 'Admitted to Inpatient',
    },
    discharged: {
      color: '#64748b',
      bg: '#f1f5f9',
      label: 'Discharged Home',
    },
    transferred: {
      color: '#d97706',
      bg: '#fef3c7',
      label: 'Transferred Out',
    },
  };

  const config = statusConfig[status] || {
    color: '#64748b',
    bg: '#f8fafc',
    label: status,
  };

  return (
    <Tag
      style={{
        color: config.color,
        background: config.bg,
        borderColor: 'transparent',
        fontWeight: 600,
        borderRadius: 6,
        padding: '2px 8px',
      }}
    >
      {config.label}
    </Tag>
  );
};
