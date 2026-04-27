import React, { useState } from 'react';
import { Calendar, ChevronDown, Filter, Settings2 } from 'lucide-react';

const PERIODES = ['Aujourd\'hui', '7 jours', '19 – 25 mai 2025', '30 jours', 'Mois en cours', 'Trimestre', 'Personnalisé'];
const PROPRIETAIRES = ['Tous les propriétaires', 'Moi uniquement', 'Sophie Leroy', 'Thomas Bernard', 'Aline Perrin'];

const PageHeaderPilotage: React.FC = () => {
  const [periode, setPeriode] = useState('19 – 25 mai 2025');
  const [proprio, setProprio] = useState('Tous les propriétaires');
  const [periodeOpen, setPeriodeOpen] = useState(false);
  const [proprioOpen, setProprioOpen] = useState(false);

  return (
    <div className="px-4 pt-3 pb-2.5 bg-white border-b border-slate-200 flex-shrink-0">
      <div className="flex items-center justify-between gap-4 mb-2.5">
        <div>
          <h1 className="text-lg font-semibold text-slate-900 leading-tight">Pilotage commercial</h1>
          <p className="text-xs text-slate-500 mt-0.5">Suivez votre activité, priorisez vos actions et développez votre portefeuille.</p>
        </div>
        <button
          type="button"
          className="flex items-center gap-1.5 px-2.5 h-7 text-[11px] font-medium text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
        >
          <Settings2 size={11} />
          Personnaliser
        </button>
      </div>

      <div className="flex items-center gap-2">
        <Dropdown
          icon={<Calendar size={11} />}
          label={periode}
          options={PERIODES}
          isOpen={periodeOpen}
          onToggle={() => { setPeriodeOpen(o => !o); setProprioOpen(false); }}
          onSelect={v => { setPeriode(v); setPeriodeOpen(false); }}
        />
        <Dropdown
          label={proprio}
          options={PROPRIETAIRES}
          isOpen={proprioOpen}
          onToggle={() => { setProprioOpen(o => !o); setPeriodeOpen(false); }}
          onSelect={v => { setProprio(v); setProprioOpen(false); }}
        />
        <button
          type="button"
          className="flex items-center gap-1.5 px-2.5 h-7 text-[11px] font-medium text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors"
        >
          <Filter size={11} />
          Filtres
        </button>
      </div>
    </div>
  );
};

interface DropdownProps {
  icon?: React.ReactNode;
  label: string;
  options: string[];
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (v: string) => void;
}

const Dropdown: React.FC<DropdownProps> = ({ icon, label, options, isOpen, onToggle, onSelect }) => (
  <div className="relative">
    <button
      type="button"
      onClick={onToggle}
      className="flex items-center gap-1.5 px-2.5 h-7 text-[11px] font-medium text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors"
    >
      {icon}
      <span className="truncate max-w-[180px]">{label}</span>
      <ChevronDown size={11} className="text-slate-400" />
    </button>
    {isOpen && (
      <>
        <div className="fixed inset-0 z-10" onClick={onToggle} />
        <div className="absolute top-full left-0 mt-1 z-20 min-w-[180px] bg-white border border-slate-200 rounded-md shadow-md py-1">
          {options.map(opt => (
            <button
              key={opt}
              type="button"
              onClick={() => onSelect(opt)}
              className="w-full text-left px-3 py-1.5 text-[11px] text-slate-700 hover:bg-slate-50 transition-colors"
            >
              {opt}
            </button>
          ))}
        </div>
      </>
    )}
  </div>
);

export default PageHeaderPilotage;
