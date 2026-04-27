import React, { useState, useRef, useEffect } from 'react';
import { Plus, ChevronDown, Link as LinkIcon, Building2, Zap, FileEdit } from 'lucide-react';

interface Props {
  onDepuisAnnonce: () => void;
  onDepuisPortefeuille: () => void;
  onDepuisEstimation: () => void;
  onSaisieManuelle: () => void;
}

const SplitButtonCreationEtude: React.FC<Props> = ({ onDepuisAnnonce, onDepuisPortefeuille, onDepuisEstimation, onSaisieManuelle }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="relative flex" ref={ref}>
      <button
        onClick={onDepuisAnnonce}
        className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-propsight-600 text-white hover:bg-propsight-700 transition-colors rounded-l-md font-medium"
        title="Depuis une annonce (mode prioritaire)"
      >
        <Plus size={14} />
        Nouvelle étude locative
      </button>
      <button
        onClick={() => setOpen(o => !o)}
        className="px-2 py-1.5 bg-propsight-700 text-white hover:bg-propsight-800 transition-colors rounded-r-md border-l border-propsight-500"
        aria-label="Autres modes de création"
      >
        <ChevronDown size={13} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 bg-white border border-slate-200 rounded-md shadow-sm py-1 z-20 w-64">
          <DropdownItem
            icon={<LinkIcon size={14} className="text-propsight-500" />}
            label="Depuis une annonce"
            sub="Mode prioritaire"
            primary
            onClick={() => { onDepuisAnnonce(); setOpen(false); }}
          />
          <div className="border-t border-slate-100 my-1" />
          <DropdownItem
            icon={<Building2 size={14} className="text-slate-400" />}
            label="Depuis un bien du portefeuille"
            onClick={() => { onDepuisPortefeuille(); setOpen(false); }}
          />
          <DropdownItem
            icon={<Zap size={14} className="text-slate-400" />}
            label="Depuis une estimation existante"
            onClick={() => { onDepuisEstimation(); setOpen(false); }}
          />
          <DropdownItem
            icon={<FileEdit size={14} className="text-slate-400" />}
            label="Saisie manuelle"
            onClick={() => { onSaisieManuelle(); setOpen(false); }}
          />
        </div>
      )}
    </div>
  );
};

const DropdownItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  sub?: string;
  primary?: boolean;
  onClick: () => void;
}> = ({ icon, label, sub, primary, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-2.5 px-3 py-2 text-left transition-colors ${
      primary ? 'bg-propsight-50 hover:bg-propsight-100' : 'hover:bg-slate-50'
    }`}
  >
    <span className="flex-shrink-0">{icon}</span>
    <div className="min-w-0 flex-1">
      <p className={`text-sm ${primary ? 'text-propsight-900 font-medium' : 'text-slate-700'}`}>{label}</p>
      {sub && <p className="text-[11px] text-propsight-600">{sub}</p>}
    </div>
  </button>
);

export default SplitButtonCreationEtude;
