import React from 'react';
import { Search, ChevronDown, Sliders } from 'lucide-react';

export interface FilterDef {
  id: string;
  label: string;
  value?: string;
}

interface Props {
  search: string;
  searchPlaceholder?: string;
  onSearchChange: (v: string) => void;
  filters: FilterDef[];
  onFilterClick?: (id: string) => void;
  onMoreFiltersClick?: () => void;
  moreFiltersCount?: number;
  rightActions?: React.ReactNode;
}

const FiltersBar: React.FC<Props> = ({
  search,
  searchPlaceholder = 'Rechercher…',
  onSearchChange,
  filters,
  onFilterClick,
  onMoreFiltersClick,
  moreFiltersCount,
  rightActions,
}) => {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <div className="relative">
        <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={e => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          className="h-8 pl-8 pr-3 border border-slate-200 rounded-md text-[12px] text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-propsight-400 focus:border-propsight-400 w-64"
        />
      </div>

      {filters.map(f => (
        <button
          key={f.id}
          onClick={() => onFilterClick?.(f.id)}
          className={`h-8 px-2.5 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-[12px] transition-colors flex items-center gap-1.5 ${
            f.value ? 'text-slate-900 font-medium' : 'text-slate-600'
          }`}
        >
          <span className="text-slate-500">{f.label}</span>
          {f.value && <span>{f.value}</span>}
          <ChevronDown size={11} className="text-slate-400" />
        </button>
      ))}

      {onMoreFiltersClick && (
        <button
          onClick={onMoreFiltersClick}
          className="h-8 px-2.5 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-[12px] text-slate-600 transition-colors flex items-center gap-1.5"
        >
          <Sliders size={11} className="text-slate-400" />
          Plus de filtres
          {moreFiltersCount && moreFiltersCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-propsight-500 text-white text-[10px] font-semibold flex items-center justify-center">{moreFiltersCount}</span>
          )}
        </button>
      )}

      {rightActions && (
        <div className="ml-auto flex items-center gap-2">{rightActions}</div>
      )}
    </div>
  );
};

export default FiltersBar;
