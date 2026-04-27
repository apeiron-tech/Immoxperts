import React from 'react';
import { LucideIcon } from 'lucide-react';
import KpiCardPrimitive, { KpiIconVariant } from 'app/shared/ui/KpiCard';

export interface EquipeKpi {
  id: string;
  label: string;
  value: React.ReactNode;
  subtitle?: string;
  delta?: string;
  trend?: 'up' | 'down' | 'flat';
  icon?: LucideIcon;
  onClick?: () => void;
  tone?: 'violet' | 'blue' | 'orange' | 'red' | 'emerald' | 'slate';
}

interface Props {
  kpis: EquipeKpi[];
  compact?: boolean;
}

const TONE_TO_VARIANT: Record<NonNullable<EquipeKpi['tone']>, KpiIconVariant> = {
  violet: 'violet',
  blue: 'blue',
  orange: 'amber',
  red: 'rose',
  emerald: 'emerald',
  slate: 'default',
};

const EquipeKpiRow: React.FC<Props> = ({ kpis, compact = false }) => (
  <div
    className={`grid gap-2 px-4 ${compact ? 'py-2' : 'py-2.5'} bg-slate-50 border-b border-slate-200 flex-shrink-0`}
    style={{ gridTemplateColumns: `repeat(${kpis.length}, minmax(0, 1fr))` }}
  >
    {kpis.map(k => (
      <KpiCardPrimitive
        key={k.id}
        label={k.label}
        value={k.value}
        icon={k.icon}
        iconVariant={TONE_TO_VARIANT[k.tone ?? 'slate']}
        iconLayout="left"
        density={compact ? 'compact' : 'default'}
        onClick={k.onClick}
        subtitle={k.subtitle}
        trend={k.delta && k.trend ? { value: k.delta, direction: k.trend } : undefined}
      />
    ))}
  </div>
);

export default EquipeKpiRow;
