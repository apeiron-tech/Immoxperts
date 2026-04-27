import React from 'react';
import KpiCardPrimitive, { KpiIconVariant } from 'app/shared/ui/KpiCard';

interface Props {
  icon?: React.ReactNode;
  label: string;
  value: string | number;
  subtitle?: string;
  trend?: { value: string; positive: boolean };
  onClick?: () => void;
  active?: boolean;
  variant?: 'default' | 'violet' | 'emerald' | 'amber' | 'rose';
}

const KpiCard: React.FC<Props> = ({
  icon,
  label,
  value,
  subtitle,
  trend,
  onClick,
  active,
  variant = 'default',
}) => (
  <KpiCardPrimitive
    label={label}
    value={value}
    icon={icon}
    iconVariant={variant as KpiIconVariant}
    iconLayout="left"
    density="default"
    active={active}
    onClick={onClick}
    trend={
      trend
        ? { value: trend.value, direction: trend.positive ? 'up' : 'down', style: 'badge' }
        : undefined
    }
    subtitle={subtitle}
  />
);

export default KpiCard;
