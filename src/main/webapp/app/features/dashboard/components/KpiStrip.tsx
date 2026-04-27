import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  Euro,
  FileSignature,
  Wallet,
  Filter,
  Target,
  LucideIcon,
} from 'lucide-react';
import KpiCard, { KpiIconVariant } from 'app/shared/ui/KpiCard';
import type { DashboardKpi } from '../types';

const ICONS: Record<string, LucideIcon> = {
  TrendingUp,
  FileSignature,
  Wallet,
  Filter,
  Target,
};

const ICON_VARIANT: Record<string, KpiIconVariant> = {
  TrendingUp: 'emerald',
  FileSignature: 'violet',
  Wallet: 'sky',
  Filter: 'amber',
  Target: 'rose',
};

interface Props {
  kpis: DashboardKpi[];
}

const KpiStrip: React.FC<Props> = ({ kpis }) => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-5 gap-2.5">
      {kpis.map(kpi => {
        const Icon = ICONS[kpi.icon] ?? Euro;
        const variant = ICON_VARIANT[kpi.icon] ?? 'default';
        const direction = kpi.delta
          ? kpi.delta.trend === 'down'
            ? 'down'
            : kpi.delta.is_positive
              ? 'up'
              : 'down'
          : undefined;

        return (
          <KpiCard
            key={kpi.id}
            label={kpi.label}
            value={kpi.value}
            icon={Icon}
            iconVariant={variant}
            iconLayout="topRight"
            density="default"
            subtitle={kpi.context}
            trend={
              kpi.delta && direction
                ? { value: kpi.delta.value, direction }
                : undefined
            }
            onClick={() => navigate(kpi.href)}
            title={kpi.action_label}
          />
        );
      })}
    </div>
  );
};

export default KpiStrip;
