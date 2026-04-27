import React, { useState } from 'react';
import ModalShell, { Field, Input, Select, Textarea, ReadOnlyCell } from './ModalShell';
import { SignalProspection, MetaSignalRadar } from '../../types';
import { users, currentUser } from '../../_mocks/users';
import { getCtaRecommande } from '../../utils/ctaRecommande';
import { labelSource } from '../../utils/formatters';

interface Props {
  open: boolean;
  onClose: () => void;
  signal: SignalProspection | MetaSignalRadar | null;
  onConfirm: (payload: LeadPayload) => void;
}

export interface LeadPayload {
  signal_id: string;
  type_lead: 'vendeur' | 'bailleur' | 'acquereur' | 'investisseur';
  prenom: string;
  nom: string;
  telephone: string;
  email: string;
  assignee_id: string;
  stage: string;
  note: string;
}

const ModaleCreerLead: React.FC<Props> = ({ open, onClose, signal, onConfirm }) => {
  const cta = signal ? getCtaRecommande(signal) : null;
  const defaultType =
    cta?.primary === 'lead_bailleur'
      ? 'bailleur'
      : cta?.primary === 'lead_acquereur'
        ? 'acquereur'
        : cta?.primary === 'lead_investisseur'
          ? 'investisseur'
          : 'vendeur';

  const [form, setForm] = useState<LeadPayload>({
    signal_id: '',
    type_lead: defaultType,
    prenom: '',
    nom: '',
    telephone: '',
    email: '',
    assignee_id: currentUser.user_id,
    stage: 'a_traiter',
    note: '',
  });

  React.useEffect(() => {
    if (signal) {
      const id = 'signal_id' in signal ? signal.signal_id : signal.meta_id;
      setForm(f => ({ ...f, signal_id: id, type_lead: defaultType }));
    }
  }, [signal, defaultType]);

  if (!signal) return null;
  const isMeta = 'children' in signal;
  const adresse = isMeta ? signal.adresse : signal.adresse;
  const ville = isMeta ? signal.ville : signal.ville;
  const cp = isMeta ? signal.code_postal : signal.code_postal;
  const source = isMeta ? signal.children[0].source : signal.source;
  const typeSignal = isMeta ? signal.children[0].type : signal.type;

  const submit = () => {
    console.warn('[demo] Create Lead', form);
    onConfirm(form);
  };

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title="Créer un lead"
      subtitle="Transforme ce signal en opportunité commerciale dans Mon activité > Leads."
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
            Créer le lead
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Type de lead" required>
            <Select
              value={form.type_lead}
              onChange={e => setForm({ ...form, type_lead: e.target.value as LeadPayload['type_lead'] })}
            >
              <option value="vendeur">Vendeur</option>
              <option value="bailleur">Bailleur</option>
              <option value="acquereur">Acquéreur</option>
              <option value="investisseur">Investisseur</option>
            </Select>
          </Field>
          <Field label="Stage initial">
            <Select value={form.stage} onChange={e => setForm({ ...form, stage: e.target.value })}>
              <option value="a_traiter">À traiter</option>
              <option value="contacte">Contacté</option>
              <option value="rdv_planifie">RDV planifié</option>
            </Select>
          </Field>
          <Field label="Prénom">
            <Input
              value={form.prenom}
              onChange={e => setForm({ ...form, prenom: e.target.value })}
              placeholder="Prénom"
            />
          </Field>
          <Field label="Nom">
            <Input value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} placeholder="Nom" />
          </Field>
          <Field label="Téléphone">
            <Input
              value={form.telephone}
              onChange={e => setForm({ ...form, telephone: e.target.value })}
              placeholder="06 ..."
            />
          </Field>
          <Field label="Email">
            <Input
              type="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              placeholder="nom@exemple.fr"
            />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <ReadOnlyCell label="Bien concerné" value={adresse || `${ville} ${cp || ''}`} />
          <ReadOnlyCell label="Source" value={`Signal ${labelSource[source]} · ${typeSignal}`} />
        </div>

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
          <Textarea
            rows={3}
            value={form.note}
            onChange={e => setForm({ ...form, note: e.target.value })}
            placeholder="Contexte, angle de contact, historique..."
          />
        </Field>
      </div>
    </ModalShell>
  );
};

export default ModaleCreerLead;
