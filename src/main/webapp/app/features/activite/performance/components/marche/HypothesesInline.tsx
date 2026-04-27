import React, { useState } from 'react';
import { Pencil, Check, X } from 'lucide-react';
import { Hypotheses } from '../../types';

interface Props {
  hypotheses: Hypotheses;
  onChange: (h: Hypotheses) => void;
}

type EditableField = 'commissionMoyenne' | 'partCaptableCible' | 'objectifMandatsAnnuel';

const FIELDS: { key: EditableField; label: string; step: number; min: number; max: number; format: (v: number) => string }[] = [
  { key: 'commissionMoyenne',     label: '% commission moyenne', step: 0.1, min: 0, max: 20,  format: v => `${v.toFixed(2)} %` },
  { key: 'partCaptableCible',     label: '% part captable cible', step: 0.1, min: 0, max: 100, format: v => `${v.toFixed(2)} %` },
  { key: 'objectifMandatsAnnuel', label: 'Objectif mandats / an', step: 1,   min: 0, max: 999, format: v => `${v}` },
];

const HypothesesInline: React.FC<Props> = ({ hypotheses, onChange }) => {
  const [editing, setEditing] = useState<EditableField | null>(null);
  const [draft, setDraft] = useState<string>('');

  const startEdit = (key: EditableField) => { setEditing(key); setDraft(String(hypotheses[key])); };
  const cancelEdit = () => { setEditing(null); setDraft(''); };
  const saveEdit = (key: EditableField) => {
    const num = Number(draft.replace(',', '.'));
    if (!isNaN(num)) {
      onChange({ ...hypotheses, [key]: num });
      console.warn('[Performance] Hypothèse modifiée', key, '→', num);
    }
    setEditing(null);
  };

  return (
    <section className="bg-white border border-slate-200 rounded p-2">
      <div className="flex items-center gap-3">
        <p className="text-[9px] font-semibold text-slate-500 uppercase tracking-wider flex-shrink-0">Hypothèses</p>
        <div className="grid grid-cols-3 gap-2 flex-1">
          {FIELDS.map(f => {
            const isEditing = editing === f.key;
            const value = hypotheses[f.key];
            return (
              <div key={f.key} className="flex items-center gap-1.5 px-2 py-1 border border-slate-200 rounded bg-slate-50/40">
                <span className="text-[9px] text-slate-500 truncate flex-1">{f.label}</span>
                {isEditing ? (
                  <div className="flex items-center gap-0.5">
                    <input
                      autoFocus
                      type="number"
                      step={f.step}
                      min={f.min}
                      max={f.max}
                      value={draft}
                      onChange={e => setDraft(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') saveEdit(f.key);
                        if (e.key === 'Escape') cancelEdit();
                      }}
                      className="w-16 px-1 h-5 text-[11px] font-semibold text-slate-900 border border-propsight-300 rounded focus:outline-none focus:ring-1 focus:ring-propsight-400 tabular-nums"
                    />
                    <button type="button" onClick={() => saveEdit(f.key)} className="p-0.5 rounded text-green-600 hover:bg-green-50">
                      <Check size={10} />
                    </button>
                    <button type="button" onClick={cancelEdit} className="p-0.5 rounded text-slate-400 hover:bg-slate-100">
                      <X size={10} />
                    </button>
                  </div>
                ) : (
                  <button type="button" onClick={() => startEdit(f.key)} className="flex items-center gap-1 group hover:text-propsight-700 transition-colors">
                    <span className="text-[12px] font-semibold text-slate-900 tabular-nums group-hover:text-propsight-700">{f.format(value)}</span>
                    <Pencil size={9} className="text-slate-400 group-hover:text-propsight-600" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HypothesesInline;
