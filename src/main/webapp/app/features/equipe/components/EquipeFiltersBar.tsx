import React from 'react';
import { Filter, Search } from 'lucide-react';
import { Segmented, Select, SelectOption } from './primitives';

export interface FilterConfig {
  key: string;
  label: string;
  value: string;
  options: SelectOption[];
  onChange: (v: string) => void;
}

interface Props {
  period?: { value: string; onChange: (v: string) => void };
  comparison?: { value: string; onChange: (v: string) => void };
  filters: FilterConfig[];
  activeFiltersCount?: number;
  extra?: React.ReactNode;
  search?: { value: string; onChange: (v: string) => void; placeholder?: string };
}

const PERIOD_OPTIONS: SelectOption[] = [
  { value: '7j', label: '7 j' },
  { value: '30j', label: '30 j' },
  { value: 'trimestre', label: 'Trimestre' },
  { value: '12m', label: '12 mois' },
];

const EquipeFiltersBar: React.FC<Props> = ({
  period,
  comparison,
  filters,
  activeFiltersCount = 0,
  extra,
  search,
}) => (
  <div className="flex items-center gap-2 px-4 py-2 bg-white border-b border-slate-200 flex-shrink-0 overflow-x-auto">
    {period && (
      <Segmented value={period.value} onChange={period.onChange} options={PERIOD_OPTIONS} />
    )}
    {comparison && (
      <Select
        value={comparison.value}
        label="Comparer à"
        onChange={comparison.onChange}
        options={[
          { value: 'periode', label: 'Période précédente' },
          { value: 'annee', label: 'Année précédente' },
        ]}
      />
    )}
    {filters.map(f => (
      <Select key={f.key} label={f.label} value={f.value} onChange={f.onChange} options={f.options} />
    ))}
    {search && (
      <div className="inline-flex items-center gap-1 border border-slate-200 bg-white rounded-md px-2 py-1">
        <Search size={11} className="text-slate-400" />
        <input
          value={search.value}
          onChange={e => search.onChange(e.target.value)}
          placeholder={search.placeholder ?? 'Rechercher'}
          className="text-[11.5px] text-slate-700 placeholder-slate-400 bg-transparent focus:outline-none w-36"
        />
      </div>
    )}
    <div className="flex-1" />
    {extra}
    <button className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-[11.5px] text-slate-700 font-medium transition-colors">
      <Filter size={11} />
      Filtres
      {activeFiltersCount > 0 && (
        <span className="inline-flex items-center justify-center min-w-4 h-4 px-1 rounded-full bg-propsight-100 text-propsight-700 text-[9.5px] font-semibold">
          {activeFiltersCount}
        </span>
      )}
    </button>
  </div>
);

export default EquipeFiltersBar;
