import React, { useState } from 'react';
import { LayoutGrid, Rows3, Search, ChevronDown, Plus, Settings2 } from 'lucide-react';
import { IntentionTab, ViewMode } from '../types';

interface Props {
  view: ViewMode;
  onViewChange: (v: ViewMode) => void;
  search: string;
  onSearchChange: (v: string) => void;
  intentionTab: IntentionTab;
  onIntentionTabChange: (v: IntentionTab) => void;
  onCreateLead: () => void;
  countsByTab: Record<IntentionTab, number>;
}

const FILTRES = [
  { id: 'source',     label: 'Source',       options: ['Widget', 'Pige', 'Manuel', 'Import', 'Estimation', 'Recommandation'] },
  { id: 'intention',  label: 'Intention',    options: ['Vente', 'Achat', 'Location', 'Estimation'] },
  { id: 'proprio',    label: 'Propriétaire', options: ['Moi', 'Sophie Leroy', 'Thomas Bernard', 'Aline Perrin', 'Non assigné'] },
  { id: 'zone',       label: 'Zone',         options: ['Paris 15e', 'Paris 16e', 'Boulogne', 'Lyon 3e', 'Bordeaux'] },
  { id: 'tag',        label: 'Tag',          options: ['VIP', 'Premium', 'Investisseur', 'Primo'] },
  { id: 'date',       label: 'Date',         options: ['Création', 'Dernière action'] },
];

const PERIODES = ['Aujourd\'hui', '7 jours', '19 – 25 mai 2025', '30 jours', 'Trimestre', '12 mois', 'Personnalisé'];

const TABS: { id: IntentionTab; label: string }[] = [
  { id: 'tous',        label: 'Tous' },
  { id: 'vendeurs',    label: 'Vendeurs' },
  { id: 'acquereurs',  label: 'Acquéreurs' },
  { id: 'estim',       label: 'Estim' },
  { id: 'locatif',     label: 'Locatif' },
];

const LeadsControls: React.FC<Props> = ({
  view, onViewChange, search, onSearchChange,
  intentionTab, onIntentionTabChange, onCreateLead, countsByTab,
}) => {
  const [openFilter, setOpenFilter] = useState<string | null>(null);
  const [periode, setPeriode] = useState('19 – 25 mai 2025');
  const [filtersActifs, setFiltersActifs] = useState<Record<string, string[]>>({});

  const toggleOption = (filterId: string, opt: string) => {
    setFiltersActifs(prev => {
      const current = prev[filterId] || [];
      const next = current.includes(opt) ? current.filter(o => o !== opt) : [...current, opt];
      return { ...prev, [filterId]: next };
    });
  };

  return (
    <div className="bg-white border-b border-slate-200 flex-shrink-0">
      <div className="px-4 pt-3 pb-2 flex items-center gap-3">
        <div className="flex border border-slate-200 rounded-md overflow-hidden">
          <button
            type="button"
            onClick={() => onViewChange('kanban')}
            className={`flex items-center gap-1 px-2.5 h-7 text-[11px] font-medium transition-colors ${view === 'kanban' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <LayoutGrid size={11} />
            Kanban
          </button>
          <button
            type="button"
            onClick={() => onViewChange('table')}
            className={`flex items-center gap-1 px-2.5 h-7 text-[11px] font-medium transition-colors ${view === 'table' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Rows3 size={11} />
            Table
          </button>
        </div>

        <div className="relative flex-1 max-w-[480px]">
          <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => onSearchChange(e.target.value)}
            placeholder="Rechercher un lead, un bien, un email, un téléphone…"
            className="w-full pl-7 pr-3 h-7 text-[11px] text-slate-900 placeholder:text-slate-400 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-propsight-400"
          />
        </div>
      </div>

      <div className="px-4 pb-2 flex items-center gap-2 flex-wrap">
        {FILTRES.map(f => (
          <FilterDropdown
            key={f.id}
            label={f.label}
            options={f.options}
            selected={filtersActifs[f.id] || []}
            isOpen={openFilter === f.id}
            onToggle={() => setOpenFilter(prev => prev === f.id ? null : f.id)}
            onSelect={opt => toggleOption(f.id, opt)}
          />
        ))}

        <PeriodeDropdown
          value={periode}
          options={PERIODES}
          isOpen={openFilter === 'periode'}
          onToggle={() => setOpenFilter(prev => prev === 'periode' ? null : 'periode')}
          onSelect={v => { setPeriode(v); setOpenFilter(null); }}
        />

        <div className="flex-1" />

        <button
          type="button"
          onClick={() => console.warn('[Leads] Gérer les colonnes')}
          className="flex items-center gap-1.5 px-2.5 h-7 text-[11px] font-medium text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
        >
          <Settings2 size={11} />
          Gérer les colonnes
        </button>

        <button
          type="button"
          onClick={onCreateLead}
          className="flex items-center gap-1 px-3 h-7 text-[11px] font-semibold text-white bg-propsight-600 hover:bg-propsight-700 rounded-md transition-colors"
        >
          <Plus size={12} />
          Lead
        </button>
      </div>

      <div className="px-4 flex items-center gap-1 border-t border-slate-100">
        {TABS.map(tab => {
          const active = intentionTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onIntentionTabChange(tab.id)}
              className={`flex items-center gap-1.5 px-3 h-8 text-[12px] font-medium border-b-2 transition-colors ${active ? 'text-propsight-700 border-propsight-600' : 'text-slate-600 border-transparent hover:text-slate-900'}`}
            >
              {tab.label}
              <span className={`text-[10px] tabular-nums ${active ? 'text-propsight-500' : 'text-slate-400'}`}>{countsByTab[tab.id]}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

interface FilterDropdownProps {
  label: string;
  options: string[];
  selected: string[];
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (opt: string) => void;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({ label, options, selected, isOpen, onToggle, onSelect }) => (
  <div className="relative">
    <button
      type="button"
      onClick={onToggle}
      className="flex items-center gap-1 px-2.5 h-7 text-[11px] font-medium text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors"
    >
      {label}
      {selected.length > 0 && (
        <span className="bg-propsight-100 text-propsight-700 text-[10px] font-semibold px-1.5 rounded tabular-nums">{selected.length}</span>
      )}
      <ChevronDown size={11} className="text-slate-400" />
    </button>
    {isOpen && (
      <>
        <div className="fixed inset-0 z-10" onClick={onToggle} />
        <div className="absolute top-full left-0 mt-1 z-20 min-w-[180px] bg-white border border-slate-200 rounded-md shadow-md py-1">
          {options.map(opt => {
            const checked = selected.includes(opt);
            return (
              <label
                key={opt}
                className="flex items-center gap-2 px-3 py-1.5 text-[11px] text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                <input type="checkbox" checked={checked} onChange={() => onSelect(opt)} className="accent-propsight-600" />
                {opt}
              </label>
            );
          })}
        </div>
      </>
    )}
  </div>
);

interface PeriodeDropdownProps {
  value: string;
  options: string[];
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (opt: string) => void;
}

const PeriodeDropdown: React.FC<PeriodeDropdownProps> = ({ value, options, isOpen, onToggle, onSelect }) => (
  <div className="relative">
    <button
      type="button"
      onClick={onToggle}
      className="flex items-center gap-1 px-2.5 h-7 text-[11px] font-medium text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors"
    >
      <span className="truncate max-w-[140px]">{value}</span>
      <ChevronDown size={11} className="text-slate-400" />
    </button>
    {isOpen && (
      <>
        <div className="fixed inset-0 z-10" onClick={onToggle} />
        <div className="absolute top-full left-0 mt-1 z-20 min-w-[180px] bg-white border border-slate-200 rounded-md shadow-md py-1">
          {options.map(opt => (
            <button key={opt} type="button" onClick={() => onSelect(opt)} className="w-full text-left px-3 py-1.5 text-[11px] text-slate-700 hover:bg-slate-50">
              {opt}
            </button>
          ))}
        </div>
      </>
    )}
  </div>
);

export default LeadsControls;
