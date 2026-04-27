import React, { useState } from 'react';
import { X } from 'lucide-react';
import { PrimaryButton, SecondaryButton, Select } from './primitives';
import type { Collaborateur, AbsenceType } from '../types';

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit?: (data: { collaborator_id: string; type: AbsenceType; period_start: string; period_end: string; note: string }) => void;
  collaborateurs: Collaborateur[];
}

const DeclareAbsenceModal: React.FC<Props> = ({ open, onClose, onSubmit, collaborateurs }) => {
  const [collab, setCollab] = useState(collaborateurs[0]?.user_id ?? '');
  const [type, setType] = useState<AbsenceType>('conges');
  const [start, setStart] = useState('2026-04-25');
  const [end, setEnd] = useState('2026-04-25');
  const [note, setNote] = useState('');

  if (!open) return null;

  const submit = () => {
    const payload = { collaborator_id: collab, type, period_start: start, period_end: end, note };
    // eslint-disable-next-line no-console
    console.log('[Demo] Déclaration d’absence', payload);
    onSubmit?.(payload);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/40 z-[500]" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[440px] max-w-[94vw] bg-white rounded-lg shadow-2xl z-[501] flex flex-col">
        <div className="flex items-start justify-between px-4 py-3 border-b border-slate-200">
          <div className="text-[14px] font-bold text-slate-900">Déclarer une absence</div>
          <button
            onClick={onClose}
            className="w-6 h-6 rounded-md flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={14} />
          </button>
        </div>

        <div className="p-4 space-y-3">
          <div>
            <label className="text-[10.5px] uppercase tracking-wider font-semibold text-slate-500 block mb-1">
              Collaborateur
            </label>
            <Select
              value={collab}
              onChange={setCollab}
              compact={false}
              options={collaborateurs.map(c => ({ value: c.user_id, label: c.display_name }))}
            />
          </div>
          <div>
            <label className="text-[10.5px] uppercase tracking-wider font-semibold text-slate-500 block mb-1">
              Type
            </label>
            <Select
              value={type}
              onChange={v => setType(v as AbsenceType)}
              compact={false}
              options={[
                { value: 'conges', label: 'Congés' },
                { value: 'maladie', label: 'Maladie' },
                { value: 'formation', label: 'Formation' },
                { value: 'autre', label: 'Autre' },
              ]}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10.5px] uppercase tracking-wider font-semibold text-slate-500 block mb-1">
                Du
              </label>
              <input
                type="date"
                value={start}
                onChange={e => setStart(e.target.value)}
                className="w-full border border-slate-200 rounded-md text-[11.5px] px-2 py-1.5"
              />
            </div>
            <div>
              <label className="text-[10.5px] uppercase tracking-wider font-semibold text-slate-500 block mb-1">
                Au
              </label>
              <input
                type="date"
                value={end}
                onChange={e => setEnd(e.target.value)}
                className="w-full border border-slate-200 rounded-md text-[11.5px] px-2 py-1.5"
              />
            </div>
          </div>
          <div>
            <label className="text-[10.5px] uppercase tracking-wider font-semibold text-slate-500 block mb-1">
              Note
            </label>
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              rows={2}
              className="w-full border border-slate-200 rounded-md text-[11.5px] px-2 py-1.5 resize-none"
              placeholder="Optionnel"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-1.5 px-4 py-3 border-t border-slate-200 bg-slate-50">
          <SecondaryButton size="sm" onClick={onClose}>Annuler</SecondaryButton>
          <PrimaryButton size="sm" onClick={submit}>Enregistrer</PrimaryButton>
        </div>
      </div>
    </>
  );
};

export default DeclareAbsenceModal;
