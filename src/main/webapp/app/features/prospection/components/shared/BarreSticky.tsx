import React, { useRef, useState, useEffect } from 'react';
import { Search, Filter, ArrowUpDown, Calendar, ChevronDown, Eye, EyeOff, LayoutGrid, Map, Columns } from 'lucide-react';

export interface Preset {
  key: string;
  label: string;
}

export interface BarreStickyProps {
  // recherche
  searchPlaceholder: string;
  searchValue: string;
  onSearchChange: (v: string) => void;

  // presets
  presets: Preset[];
  activePreset?: string;
  onPresetChange: (key: string) => void;

  // filtres
  activeFiltersCount: number;
  onFiltersClick: () => void;

  // tri
  sortOptions: { key: string; label: string }[];
  sortValue: string;
  onSortChange: (v: string) => void;

  // période
  periods: { key: string; label: string }[];
  periodValue: string;
  onPeriodChange: (v: string) => void;

  // vue (optionnel — pour DVF/DPE)
  viewOptions?: { key: 'table' | 'carte' | 'split'; label: string; icon?: React.ReactNode }[];
  viewValue?: 'table' | 'carte' | 'split';
  onViewChange?: (v: 'table' | 'carte' | 'split') => void;

  // colonnes (optionnel — tables)
  onColumnsClick?: () => void;

  // show ignored
  showIgnored: boolean;
  onShowIgnoredChange: (v: boolean) => void;

  // Radar extras
  couchesSelector?: React.ReactNode;
  legende?: React.ReactNode;
  densiteSelector?: React.ReactNode;
}

interface DropdownProps {
  label: string;
  badgeCount?: number;
  icon?: React.ReactNode;
  children: (close: () => void) => React.ReactNode;
  align?: 'left' | 'right';
}

const Dropdown: React.FC<DropdownProps> = ({ label, icon, badgeCount, children, align = 'left' }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);
  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="h-8 inline-flex items-center gap-1.5 px-2.5 text-xs text-slate-700 border border-slate-200 bg-white rounded-md hover:bg-slate-50 transition-colors"
      >
        {icon}
        {label}
        {badgeCount !== undefined && badgeCount > 0 && (
          <span className="ml-1 px-1.5 h-4 min-w-[16px] inline-flex items-center justify-center text-[10px] font-medium bg-propsight-600 text-white rounded-full">
            {badgeCount}
          </span>
        )}
        <ChevronDown size={12} className="text-slate-400" />
      </button>
      {open && (
        <div
          className={`absolute top-full mt-1 ${
            align === 'right' ? 'right-0' : 'left-0'
          } min-w-[200px] bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-50`}
        >
          {children(() => setOpen(false))}
        </div>
      )}
    </div>
  );
};

const BarreSticky: React.FC<BarreStickyProps> = ({
  searchPlaceholder,
  searchValue,
  onSearchChange,
  presets,
  activePreset,
  onPresetChange,
  activeFiltersCount,
  onFiltersClick,
  sortOptions,
  sortValue,
  onSortChange,
  periods,
  periodValue,
  onPeriodChange,
  viewOptions,
  viewValue,
  onViewChange,
  onColumnsClick,
  showIgnored,
  onShowIgnoredChange,
  couchesSelector,
  legende,
  densiteSelector,
}) => {
  const activePresetLabel = presets.find(p => p.key === activePreset)?.label || 'Tous les presets';
  const activeSortLabel = sortOptions.find(o => o.key === sortValue)?.label || sortOptions[0]?.label;
  const activePeriodLabel = periods.find(p => p.key === periodValue)?.label || periods[0]?.label;
  const activeViewLabel = viewOptions?.find(v => v.key === viewValue)?.label;

  return (
    <div className="flex items-center gap-2 px-5 py-2.5 border-b border-slate-200 bg-white">
      <div className="relative flex-1 min-w-[260px] max-w-md">
        <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchValue}
          onChange={e => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          className="w-full h-8 pl-8 pr-3 text-xs border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-propsight-500 focus:border-propsight-500"
        />
      </div>

      <Dropdown label={activePresetLabel}>
        {close => (
          <>
            {presets.map(p => (
              <button
                key={p.key}
                onClick={() => {
                  onPresetChange(p.key);
                  close();
                }}
                className={`w-full text-left px-3 py-1.5 text-xs hover:bg-slate-50 ${
                  activePreset === p.key ? 'text-propsight-700 font-medium bg-propsight-50/50' : 'text-slate-700'
                }`}
              >
                {p.label}
              </button>
            ))}
          </>
        )}
      </Dropdown>

      {couchesSelector}

      <button
        onClick={onFiltersClick}
        className="h-8 inline-flex items-center gap-1.5 px-2.5 text-xs text-slate-700 border border-slate-200 bg-white rounded-md hover:bg-slate-50 transition-colors"
      >
        <Filter size={12} />
        Filtres
        {activeFiltersCount > 0 && (
          <span className="ml-1 px-1.5 h-4 min-w-[16px] inline-flex items-center justify-center text-[10px] font-medium bg-propsight-600 text-white rounded-full">
            {activeFiltersCount}
          </span>
        )}
      </button>

      <Dropdown label={`Tri : ${activeSortLabel}`} icon={<ArrowUpDown size={12} />}>
        {close => (
          <>
            {sortOptions.map(o => (
              <button
                key={o.key}
                onClick={() => {
                  onSortChange(o.key);
                  close();
                }}
                className={`w-full text-left px-3 py-1.5 text-xs hover:bg-slate-50 ${
                  sortValue === o.key ? 'text-propsight-700 font-medium' : 'text-slate-700'
                }`}
              >
                {o.label}
              </button>
            ))}
          </>
        )}
      </Dropdown>

      <Dropdown label={`Période : ${activePeriodLabel}`} icon={<Calendar size={12} />}>
        {close => (
          <>
            {periods.map(p => (
              <button
                key={p.key}
                onClick={() => {
                  onPeriodChange(p.key);
                  close();
                }}
                className={`w-full text-left px-3 py-1.5 text-xs hover:bg-slate-50 ${
                  periodValue === p.key ? 'text-propsight-700 font-medium' : 'text-slate-700'
                }`}
              >
                {p.label}
              </button>
            ))}
          </>
        )}
      </Dropdown>

      {viewOptions && onViewChange && (
        <div className="inline-flex items-center rounded-md border border-slate-200 bg-white p-0.5 h-8">
          {viewOptions.map(v => (
            <button
              key={v.key}
              onClick={() => onViewChange(v.key)}
              className={`h-7 px-2 text-xs inline-flex items-center gap-1 rounded ${
                viewValue === v.key ? 'bg-propsight-50 text-propsight-700 font-medium' : 'text-slate-600'
              }`}
            >
              {v.icon}
              <span>{v.label}</span>
            </button>
          ))}
        </div>
      )}

      {onColumnsClick && (
        <button
          onClick={onColumnsClick}
          className="h-8 inline-flex items-center gap-1.5 px-2.5 text-xs text-slate-700 border border-slate-200 bg-white rounded-md hover:bg-slate-50 transition-colors"
        >
          <Columns size={12} />
          Colonnes
        </button>
      )}

      {legende}
      {densiteSelector}

      <div className="ml-auto flex items-center gap-3">
        <label className="inline-flex items-center gap-1.5 text-[11px] text-slate-600 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={showIgnored}
            onChange={e => onShowIgnoredChange(e.target.checked)}
            className="h-3 w-3 rounded border-slate-300 text-propsight-600 focus:ring-propsight-500"
          />
          {showIgnored ? <Eye size={11} /> : <EyeOff size={11} />}
          Afficher les ignorés
        </label>
      </div>
    </div>
  );
};

export default BarreSticky;
export { Dropdown };
export const viewIcons = {
  table: <LayoutGrid size={11} />,
  carte: <Map size={11} />,
  split: <Columns size={11} />,
};
