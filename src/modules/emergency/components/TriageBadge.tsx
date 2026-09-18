import React from 'react';
import { Tag } from 'antd';
import type { TriageCategory } from '../types';

interface TriageBadgeProps {
  category?: TriageCategory;
  showLabel?: boolean;
}

export const TriageBadge: React.FC<TriageBadgeProps> = ({ category, showLabel = true }) => {
  if (!category) {
    return (
      <Tag style={{ background: '#f1f5f9', color: '#64748b', borderColor: '#cbd5e1' }}>
        Pending Triage
      </Tag>
    );
  }

  const triageMap: Record<
    TriageCategory,
    { label: string; priority: string; bg: string; border: string; text: string; dot: string }
  > = {
    immediate: {
      priority: 'P1',
      label: 'Immediate / Resuscitation',
      bg: '#fee2e2',
      border: '#f87171',
      text: '#b91c1c',
      dot: '#ef4444',
    },
    very_urgent: {
      priority: 'P2',
      label: 'Very Urgent',
      bg: '#ffedd5',
      border: '#fb923c',
      text: '#c2410c',
      dot: '#f97316',
    },
    urgent: {
      priority: 'P3',
      label: 'Urgent',
      bg: '#fef9c3',
      border: '#facc15',
      text: '#854d0e',
      dot: '#eab308',
    },
    standard: {
      priority: 'P4',
      label: 'Standard / Less Urgent',
      bg: '#dcfce7',
      border: '#86efac',
      text: '#15803d',
      dot: '#22c55e',
    },
    non_urgent: {
      priority: 'P5',
      label: 'Non-Urgent',
      bg: '#e0f2fe',
      border: '#7dd3fc',
      text: '#0369a1',
      dot: '#0284c7',
    },
  };

  const config = triageMap[category];

  return (
    <Tag
      style={{
        background: config.bg,
        borderColor: config.border,
        color: config.text,
        fontWeight: 600,
        padding: '2px 8px',
        borderRadius: 6,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
      }}
    >
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          backgroundColor: config.dot,
          display: 'inline-block',
          boxShadow: category === 'immediate' ? '0 0 6px rgba(239, 68, 68, 0.8)' : 'none',
        }}
      />
      <span>
        <strong>{config.priority}</strong>
        {showLabel ? ` - ${config.label}` : ''}
      </span>
    </Tag>
  );
};
