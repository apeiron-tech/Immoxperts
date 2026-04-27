import React, { useState } from 'react';
import { X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const ObjectifsModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [caAnnuel, setCaAnnuel]   = useState('3 600 000');
  const [mandats, setMandats]     = useState('28');
  const [transfo, setTransfo]     = useState('20');
  const [delai, setDelai]         = useState('14');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.warn('[Performance] Objectifs définis', { caAnnuel, mandats, transfo, delai });
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-[60]" onClick={onClose} />
      <form
        onSubmit={handleSubmit}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] bg-white border border-slate-200 rounded-lg shadow-xl z-[61]"
      >
        <header className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-[14px] font-semibold text-slate-900">Définir mes objectifs</h2>
          <button type="button" onClick={onClose} className="p-1 rounded text-slate-400 hover:bg-slate-100">
            <X size={14} />
          </button>
        </header>

        <div className="p-4 space-y-3">
          <Field label="CA annuel cible (€)">
            <input value={caAnnuel} onChange={e => setCaAnnuel(e.target.value)} className={inputCls} />
          </Field>
          <Field label="Mandats / an">
            <input value={mandats} onChange={e => setMandats(e.target.value)} className={inputCls} type="number" />
          </Field>
          <Field label="Taux de transformation cible (%)">
            <input value={transfo} onChange={e => setTransfo(e.target.value)} className={inputCls} type="number" />
          </Field>
          <Field label="Délai lead → mandat cible (jours)">
            <input value={delai} onChange={e => setDelai(e.target.value)} className={inputCls} type="number" />
          </Field>
        </div>

        <footer className="px-4 py-3 border-t border-slate-200 flex items-center justify-end gap-2">
          <button type="button" onClick={onClose} className="px-3 h-8 text-[12px] font-medium text-slate-700 hover:bg-slate-100 rounded">
            Annuler
          </button>
          <button type="submit" className="px-3 h-8 text-[12px] font-semibold text-white bg-propsight-600 hover:bg-propsight-700 rounded transition-colors">
            Enregistrer
          </button>
        </footer>
      </form>
    </>
  );
};

const inputCls = 'w-full px-2.5 h-8 text-[12px] text-slate-900 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-propsight-400 tabular-nums';

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <label className="block">
    <span className="text-[11px] text-slate-600 mb-1 block">{label}</span>
    {children}
  </label>
);

export default ObjectifsModal;
