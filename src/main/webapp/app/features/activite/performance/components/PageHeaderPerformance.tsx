import React from 'react';
import { Settings2 } from 'lucide-react';
import { ComparisonKey, PeriodKey } from '../types';

interface Props {
  period: PeriodKey;
  onPeriodChange: (p: PeriodKey) => void;
  comparison: ComparisonKey;
  onComparisonChange: (c: ComparisonKey) => void;
  onOpenObjectifs: () => void;
}

const PERIODS: { id: PeriodKey; label: string }[] = [
  { id: '7j',     label: '7 j' },
  { id: '30j',    label: '30 j' },
  { id: 'trim',   label: 'Trim.' },
  { id: '12m',    label: '12 mois' },
  { id: 'custom', label: 'Perso.' },
];

const COMPARISONS: { id: ComparisonKey; label: string }[] = [
  { id: 'periode',  label: 'vs précédent' },
  { id: 'objectif', label: 'vs objectif' },
  { id: 'equipe',   label: 'vs équipe' },
];

const PageHeaderPerformance: React.FC<Props> = ({ period, onPeriodChange, comparison, onComparisonChange, onOpenObjectifs }) => (
  <div className="px-3 py-2 bg-white border-b border-slate-200 flex-shrink-0 flex items-center gap-4">
    <div className="flex-shrink-0">
      <h1 className="text-[15px] font-semibold text-slate-900 leading-tight">Performance</h1>
      <p className="text-[10px] text-slate-500 leading-tight">Mes résultats, mon pipe et mon potentiel.</p>
    </div>

    <div className="flex border border-slate-200 rounded overflow-hidden">
      {PERIODS.map(p => (
        <button
          key={p.id}
          type="button"
          onClick={() => onPeriodChange(p.id)}
          className={`px-2 h-6 text-[10px] font-medium transition-colors ${period === p.id ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
        >
          {p.label}
        </button>
      ))}
    </div>

    <div className="flex items-center gap-1.5">
      <span className="text-[10px] text-slate-500">Comparer :</span>
      {COMPARISONS.map(c => {
        const active = comparison === c.id;
        return (
          <button
            key={c.id}
            type="button"
            onClick={() => onComparisonChange(c.id)}
            className={`flex items-center gap-1 px-2 h-6 text-[10px] font-medium rounded-full border transition-colors ${active ? 'bg-propsight-50 border-propsight-300 text-propsight-700' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-propsight-600' : 'bg-slate-300'}`} />
            {c.label}
          </button>
        );
      })}
    </div>

    <div className="flex-1" />

    <button
      type="button"
      onClick={onOpenObjectifs}
      className="flex items-center gap-1 px-2 h-6 text-[10px] font-medium text-slate-700 bg-white border border-slate-200 rounded hover:bg-slate-50 transition-colors flex-shrink-0"
    >
      <Settings2 size={10} />
      Définir mes objectifs
    </button>
  </div>
);

export default PageHeaderPerformance;
