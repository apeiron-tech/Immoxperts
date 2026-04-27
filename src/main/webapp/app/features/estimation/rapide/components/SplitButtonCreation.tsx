import React, { useState, useRef, useEffect } from 'react';
import { Plus, ChevronDown, Link, FileEdit, Building2 } from 'lucide-react';

interface Props {
  onUrl: () => void;
  onManuel: () => void;
  onPortefeuille: () => void;
}

const SplitButtonCreation: React.FC<Props> = ({ onUrl, onManuel, onPortefeuille }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="flex" ref={ref}>
      <button
        onClick={onUrl}
        className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-propsight-600 text-white hover:bg-propsight-700 transition-colors rounded-l-md font-medium"
      >
        <Plus size={14} />
        Nouvelle estimation
      </button>
      <button
        onClick={() => setOpen(o => !o)}
        className="px-2 py-1.5 bg-propsight-700 text-white hover:bg-propsight-800 transition-colors rounded-r-md border-l border-propsight-500"
      >
        <ChevronDown size={13} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 bg-white border border-slate-200 rounded-md shadow-sm py-1 z-20 w-52">
          <button
            onClick={() => { onUrl(); setOpen(false); }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            <Link size={14} className="text-slate-400" />
            Depuis une annonce (URL)
          </button>
          <button
            onClick={() => { onManuel(); setOpen(false); }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            <FileEdit size={14} className="text-slate-400" />
            Saisie manuelle
          </button>
          <button
            onClick={() => { onPortefeuille(); setOpen(false); }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            <Building2 size={14} className="text-slate-400" />
            Depuis le portefeuille
          </button>
        </div>
      )}
    </div>
  );
};

export default SplitButtonCreation;
