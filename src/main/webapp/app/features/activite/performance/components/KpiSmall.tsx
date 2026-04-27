import React from 'react';
import KpiCard from 'app/shared/ui/KpiCard';
import { KpiData } from '../types';

interface Props {
  data: KpiData;
  highlight?: boolean;
}

const KpiSmall: React.FC<Props> = ({ data, highlight }) => {
  const direction = data.trend === 'up' ? 'up' : 'down';
  return (
    <KpiCard
      label={data.label}
      value={data.value}
      density="mini"
      highlight={highlight}
      trend={data.delta ? { value: data.delta, direction } : undefined}
      subtitle={data.compare}
      valueClassName={highlight ? 'text-propsight-700' : 'text-slate-900'}
    />
  );
};

export default KpiSmall;
