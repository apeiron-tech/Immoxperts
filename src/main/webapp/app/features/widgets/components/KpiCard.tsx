import React from 'react';
import { Eye, PlayCircle, Users, CheckCircle2 } from 'lucide-react';
import KpiCardPrimitive from 'app/shared/ui/KpiCard';

interface Props {
  label: string;
  value: number | string;
  delta?: number;
  deltaUnit?: '%' | 'pts';
  hint?: string;
  sub?: string;
  icon?: 'views' | 'starts' | 'leads' | 'completion';
  format?: 'number' | 'percent';
}

const ICONS = {
  views: Eye,
  starts: PlayCircle,
  leads: Users,
  completion: CheckCircle2,
};

const formatNumber = (n: number | string): string => {
  if (typeof n === 'string') return n;
  return new Intl.NumberFormat('fr-FR').format(n);
};

const KpiCard: React.FC<Props> = ({ label, value, delta, deltaUnit = '%', hint, sub, icon, format }) => {
  const Icon = icon ? ICONS[icon] : undefined;
  const positive = (delta ?? 0) >= 0;
  const displayValue =
    format === 'percent' && typeof value === 'number'
      ? `${value.toString().replace('.', ',')} %`
      : formatNumber(value);

  const trendValue =
    delta !== undefined
      ? `${positive ? '+' : ''}${delta.toString().replace('.', ',')}${deltaUnit === '%' ? ' %' : ' pts'}`
      : undefined;

  const subtitle = hint || sub;

  return (
    <KpiCardPrimitive
      label={label}
      value={displayValue}
      icon={Icon}
      iconVariant="violet"
      iconLayout="left"
      density="default"
      trend={
        delta !== undefined && trendValue
          ? { value: trendValue, direction: positive ? 'up' : 'down' }
          : undefined
      }
      subtitle={subtitle}
    />
  );
};

export default KpiCard;
