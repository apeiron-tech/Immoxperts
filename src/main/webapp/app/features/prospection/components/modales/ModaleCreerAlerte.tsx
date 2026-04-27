import React, { useState, useEffect } from 'react';
import ModalShell, { Field } from './ModalShell';
import { SignalProspection, MetaSignalRadar } from '../../types';

interface Props {
  open: boolean;
  onClose: () => void;
  signal: SignalProspection | MetaSignalRadar | null;
  onConfirm: (payload: AlertePayload) => void;
}

export interface AlertePayload {
  signal_id: string;
  portee: 'bien' | 'zone' | 'pattern';
  evenements: string[];
  frequence: 'immediat' | 'quotidien' | 'hebdomadaire';
  canaux: string[];
}

const ModaleCreerAlerte: React.FC<Props> = ({ open, onClose, signal, onConfirm }) => {
  const [form, setForm] = useState<AlertePayload>({
    signal_id: '',
    portee: 'bien',
    evenements: ['baisse_prix', 'nouveau_signal'],
    frequence: 'immediat',
    canaux: ['in_app'],
  });

  useEffect(() => {
    if (signal) {
      const id = 'signal_id' in signal ? signal.signal_id : signal.meta_id;
      setForm(f => ({ ...f, signal_id: id }));
    }
  }, [signal]);

  const toggleEvt = (v: string) => {
    setForm(f => ({
      ...f,
      evenements: f.evenements.includes(v) ? f.evenements.filter(e => e !== v) : [...f.evenements, v],
    }));
  };

  const toggleCanal = (v: string) => {
    setForm(f => ({
      ...f,
      canaux: f.canaux.includes(v) ? f.canaux.filter(c => c !== v) : [...f.canaux, v],
    }));
  };

  if (!signal) return null;

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title="Créer une alerte"
      subtitle="Reçois une notification dès qu'un événement survient sur ce bien ou cette zone."
      footer={
        <>
          <button
            onClick={onClose}
            className="h-9 px-4 rounded-md border border-slate-200 text-sm text-slate-700 hover:bg-slate-50"
          >
            Annuler
          </button>
          <button
            onClick={() => {
              console.warn('[demo] Create Alerte', form);
              onConfirm(form);
            }}
            className="h-9 px-4 rounded-md bg-propsight-600 hover:bg-propsight-700 text-sm font-medium text-white"
          >
            Créer l'alerte
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <Field label="Portée">
          <div className="grid grid-cols-3 gap-2">
            {(
              [
                { k: 'bien', l: 'Ce bien' },
                { k: 'zone', l: 'Cette zone' },
                { k: 'pattern', l: 'Mes zones' },
              ] as { k: AlertePayload['portee']; l: string }[]
            ).map(o => (
              <button
                key={o.k}
                onClick={() => setForm({ ...form, portee: o.k })}
                className={`h-9 rounded-md border text-xs transition-colors ${
                  form.portee === o.k
                    ? 'border-propsight-600 bg-propsight-50 text-propsight-700 font-medium'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                {o.l}
              </button>
            ))}
          </div>
        </Field>

        <Field label="Événements déclencheurs">
          <div className="space-y-1.5">
            {[
              { k: 'baisse_prix', l: 'Baisse de prix' },
              { k: 'remise_en_ligne', l: 'Remise en ligne' },
              { k: 'nouveau_signal', l: 'Nouveau signal similaire' },
              { k: 'changement_statut', l: 'Changement de statut bien' },
            ].map(o => (
              <label key={o.k} className="flex items-center gap-2 text-[12px] text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.evenements.includes(o.k)}
                  onChange={() => toggleEvt(o.k)}
                  className="h-3.5 w-3.5 rounded border-slate-300 text-propsight-600 focus:ring-propsight-500"
                />
                {o.l}
              </label>
            ))}
          </div>
        </Field>

        <Field label="Fréquence">
          <div className="grid grid-cols-3 gap-2">
            {(['immediat', 'quotidien', 'hebdomadaire'] as AlertePayload['frequence'][]).map(f => (
              <button
                key={f}
                onClick={() => setForm({ ...form, frequence: f })}
                className={`h-9 rounded-md border text-xs capitalize transition-colors ${
                  form.frequence === f
                    ? 'border-propsight-600 bg-propsight-50 text-propsight-700 font-medium'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </Field>

        <Field label="Canaux">
          <div className="space-y-1.5">
            {[
              { k: 'in_app', l: 'Notification in-app' },
              { k: 'email', l: 'Email' },
            ].map(o => (
              <label key={o.k} className="flex items-center gap-2 text-[12px] text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.canaux.includes(o.k)}
                  onChange={() => toggleCanal(o.k)}
                  className="h-3.5 w-3.5 rounded border-slate-300 text-propsight-600 focus:ring-propsight-500"
                />
                {o.l}
              </label>
            ))}
          </div>
        </Field>
      </div>
    </ModalShell>
  );
};

export default ModaleCreerAlerte;
