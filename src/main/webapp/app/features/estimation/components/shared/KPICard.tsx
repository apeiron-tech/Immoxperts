import React from 'react';
import KpiCardPrimitive from 'app/shared/ui/KpiCard';

interface Props {
  label: string;
  value: string | number;
  sub?: string;
  trend?: { value: string; positive: boolean };
  highlight?: boolean;
}

export const KPICard: React.FC<Props> = ({ label, value, sub, trend, highlight }) => (
  <KpiCardPrimitive
    label={label}
    value={value}
    density="comfort"
    highlight={highlight}
    valueClassName={highlight ? 'text-propsight-700' : 'text-slate-900'}
    trend={
      trend
        ? { value: trend.value, direction: trend.positive ? 'up' : 'down' }
        : undefined
    }
    subtitle={sub}
  />
);
