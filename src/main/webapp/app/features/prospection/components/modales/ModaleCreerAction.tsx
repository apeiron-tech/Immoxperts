import React, { useState, useEffect } from 'react';
import ModalShell, { Field, Input, Select, Textarea, ReadOnlyCell } from './ModalShell';
import { SignalProspection, MetaSignalRadar } from '../../types';
import { users, currentUser } from '../../_mocks/users';

interface Props {
  open: boolean;
  onClose: () => void;
  signal: SignalProspection | MetaSignalRadar | null;
  onConfirm: (payload: ActionPayload) => void;
}

export interface ActionPayload {
  signal_id: string;
  type: 'appel' | 'email' | 'rdv_physique' | 'rdv_visio' | 'prospection' | 'autre';
  objet: string;
  echeance: string;
  assignee_id: string;
  note: string;
}

const defaultEcheance = () => {
  const d = new Date();
  d.setDate(d.getDate() + 3);
  return d.toISOString().slice(0, 10);
};

const ModaleCreerAction: React.FC<Props> = ({ open, onClose, signal, onConfirm }) => {
  const [form, setForm] = useState<ActionPayload>({
    signal_id: '',
    type: 'appel',
    objet: '',
    echeance: defaultEcheance(),
    assignee_id: currentUser.user_id,
    note: '',
  });

  useEffect(() => {
    if (signal) {
      const id = 'signal_id' in signal ? signal.signal_id : signal.meta_id;
      const typeSignal = 'children' in signal ? signal.children[0].type : signal.type;
      const adresse = 'children' in signal ? signal.adresse : signal.adresse;
      setForm(f => ({
        ...f,
        signal_id: id,
        objet: `${typeSignal} · ${adresse || 'zone'}`,
      }));
    }
  }, [signal]);

  if (!signal) return null;
  const isMeta = 'children' in signal;
  const adresse = isMeta ? signal.adresse : signal.adresse;
  const ville = isMeta ? signal.ville : signal.ville;

  const submit = () => {
    console.warn('[demo] Create Action', form);
    onConfirm(form);
  };

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title="Créer une action"
      subtitle="Transforme ce signal en action commerciale planifiée."
      footer={
        <>
          <button
            onClick={onClose}
            className="h-9 px-4 rounded-md border border-slate-200 text-sm text-slate-700 hover:bg-slate-50"
          >
            Annuler
          </button>
          <button
            onClick={submit}
            className="h-9 px-4 rounded-md bg-propsight-600 hover:bg-propsight-700 text-sm font-medium text-white"
          >
            Créer l'action
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Type d'action" required>
            <Select value={form.type} onChange={e => setForm({ ...form, type: e.target.value as ActionPayload['type'] })}>
              <option value="appel">Appel</option>
              <option value="email">Email</option>
              <option value="rdv_physique">RDV physique</option>
              <option value="rdv_visio">RDV visio</option>
              <option value="prospection">Prospection terrain</option>
              <option value="autre">Autre</option>
            </Select>
          </Field>
          <Field label="Échéance" required>
            <Input type="date" value={form.echeance} onChange={e => setForm({ ...form, echeance: e.target.value })} />
          </Field>
        </div>
        <Field label="Objet" required>
          <Input value={form.objet} onChange={e => setForm({ ...form, objet: e.target.value })} />
        </Field>
        <ReadOnlyCell label="Signal concerné" value={adresse || ville} />
        <Field label="Assigné à">
          <Select value={form.assignee_id} onChange={e => setForm({ ...form, assignee_id: e.target.value })}>
            {users.map(u => (
              <option key={u.user_id} value={u.user_id}>
                {u.prenom} {u.nom}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Note">
          <Textarea rows={3} value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} />
        </Field>
      </div>
    </ModalShell>
  );
};

export default ModaleCreerAction;
