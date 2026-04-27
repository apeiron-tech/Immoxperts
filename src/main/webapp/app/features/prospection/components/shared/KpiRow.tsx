import React from 'react';
import KpiCard from './KpiCard';
import { Kpi } from '../../utils/kpis';

interface Props {
  kpis: Kpi[];
  activeKey?: string;
  onClick?: (k: Kpi) => void;
}

const KpiRow: React.FC<Props> = ({ kpis, activeKey, onClick }) => {
  return (
    <div className="flex gap-2 px-5 py-3 border-b border-slate-200 bg-slate-50/50">
      {kpis.map(k => (
        <KpiCard key={k.key} kpi={k} active={activeKey === k.key} onClick={() => onClick?.(k)} />
      ))}
    </div>
  );
};

export default KpiRow;
