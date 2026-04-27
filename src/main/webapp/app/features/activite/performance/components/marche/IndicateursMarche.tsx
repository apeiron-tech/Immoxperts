import React from 'react';
import { ArrowUp } from 'lucide-react';
import { INDICATEURS_MARCHE } from '../../_mocks/performance';

const TENSION_STYLES = {
  high:   { dot: 'bg-red-500',    label: 'text-red-700' },
  medium: { dot: 'bg-amber-500',  label: 'text-amber-700' },
  low:    { dot: 'bg-green-500',  label: 'text-green-700' },
};

const IndicateursMarche: React.FC = () => {
  const { volumeDvf, prixMedian, tension } = INDICATEURS_MARCHE;
  const tStyle = TENSION_STYLES[tension.level];
  return (
    <section className="bg-white border border-slate-200 rounded p-2 h-full">
      <p className="text-[9px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
        Indicateurs marché <span className="font-normal lowercase">(12 mois)</span>
      </p>

      <div className="grid grid-cols-3 gap-3">
        <Indicator label="Volume DVF secteur" value={volumeDvf.value.toLocaleString('fr-FR')} delta={volumeDvf.delta} compare={`vs ${volumeDvf.compare}`} />
        <Indicator label="Prix médian" value={`${prixMedian.value} ${prixMedian.unite}`} delta={prixMedian.delta} compare={`vs ${prixMedian.compare}`} />
        <div>
          <p className="text-[9px] text-slate-500 leading-tight">Tension marché</p>
          <p className={`text-[14px] font-semibold leading-tight tabular-nums mt-0.5 ${tStyle.label}`}>{tension.value}</p>
          <p className="flex items-center gap-1 text-[9px] text-slate-500 mt-0.5">
            <span className={`w-1.5 h-1.5 rounded-full ${tStyle.dot}`} />
            {tension.delta}
          </p>
        </div>
      </div>
    </section>
  );
};

interface IndicatorProps { label: string; value: string; delta: string; compare: string; }
const Indicator: React.FC<IndicatorProps> = ({ label, value, delta, compare }) => (
  <div>
    <p className="text-[9px] text-slate-500 leading-tight">{label}</p>
    <p className="text-[14px] font-semibold text-slate-900 leading-tight tabular-nums mt-0.5">{value}</p>
    <p className="flex items-center gap-0.5 text-[9px] text-green-600 font-medium mt-0.5">
      <ArrowUp size={8} />
      {delta}
      <span className="text-slate-400 font-normal ml-1">{compare}</span>
    </p>
  </div>
);

export default IndicateursMarche;
