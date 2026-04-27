import React from 'react';
import { Info } from 'lucide-react';
import KpiCardPrimitive from 'app/shared/ui/KpiCard';
import Sparkline from './Sparkline';
import { Kpi } from '../../utils/kpis';

interface Props {
  kpi: Kpi;
  active?: boolean;
  onClick?: () => void;
}

// Couleur sparkline alignée sur les tokens sémantiques.
const SPARK_COLOR = {
  up: '#16A34A',
  down: '#DC2626',
  flat: '#64748B',
};

const KpiCard: React.FC<Props> = ({ kpi, active = false, onClick }) => {
  const direction = kpi.deltaStable ? 'flat' : kpi.deltaPositive ? 'up' : 'down';
  const formatted = new Intl.NumberFormat('fr-FR').format(kpi.value);

  return (
    <KpiCardPrimitive
      label={kpi.label}
      value={formatted}
      density="default"
      active={active}
      onClick={onClick}
      labelSuffix={
        <span title={kpi.tooltip}>
          <Info size={11} className="text-slate-400 cursor-help" />
        </span>
      }
      trend={{ value: kpi.delta, direction }}
      trendCompare="vs 30 derniers jours"
      rightSlot={<Sparkline data={kpi.sparkline} color={SPARK_COLOR[direction]} width={70} height={24} />}
      className="flex-1 min-w-[170px]"
    />
  );
};

export default KpiCard;
