import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Intention, Lead, LeadSource } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (lead: Partial<Lead>) => void;
}

const INTENTION_OPTIONS: { id: Intention; label: string }[] = [
  { id: 'vente',   label: 'Vente' },
  { id: 'achat',   label: 'Achat' },
  { id: 'locatif', label: 'Location' },
  { id: 'estim',   label: 'Estimation' },
];

const SOURCE_OPTIONS: { id: LeadSource; label: string }[] = [
  { id: 'manuel',     label: 'Manuel' },
  { id: 'widget',     label: 'Widget' },
  { id: 'pige',       label: 'Pige' },
  { id: 'import',     label: 'Import' },
  { id: 'estimation', label: 'Estimation' },
];

const initialesFromName = (prenom: string, nom: string): string => {
  const p = prenom.trim()[0] || '';
  const n = nom.trim()[0] || '';
  return (p + n).toUpperCase() || '??';
};

const CreateLeadModal: React.FC<Props> = ({ isOpen, onClose, onSubmit }) => {
  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');
  const [intention, setIntention] = useState<Intention | null>(null);
  const [adresse, setAdresse] = useState('');
  const [zones, setZones] = useState('');
  const [budget, setBudget] = useState('');
  const [prix, setPrix] = useState('');
  const [source, setSource] = useState<LeadSource>('manuel');
  const [tag, setTag] = useState('');
  const [note, setNote] = useState('');

  if (!isOpen) return null;

  const valid = prenom.trim() && nom.trim() && intention && (email.trim() || telephone.trim());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid || !intention) return;
    const isVendeur = intention === 'vente' || intention === 'estim';
    const lead: Partial<Lead> = {
      lead_id: `L-NEW-${Date.now()}`,
      stage: 'atraiter',
      nom: `${prenom} ${nom}`.trim(),
      initiales: initialesFromName(prenom, nom),
      source,
      intention,
      adresse: isVendeur ? adresse : zones,
      prix: isVendeur ? Number(prix) || null : Number(budget) || null,
      commission: null,
      age: 'à l\'instant',
      email: email || undefined,
      telephone: telephone || undefined,
      tags: tag ? [tag] : [],
      proprietaire: 'sl',
      createdAt: new Date().toLocaleDateString('fr-FR'),
    };
    console.warn('[Leads] Création lead', lead);
    onSubmit(lead);
    setPrenom(''); setNom(''); setEmail(''); setTelephone(''); setIntention(null);
    setAdresse(''); setZones(''); setBudget(''); setPrix(''); setSource('manuel'); setTag(''); setNote('');
  };

  const isVendeur = intention === 'vente' || intention === 'estim';
  const isAcquereur = intention === 'achat' || intention === 'locatif';

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-[60]" onClick={onClose} />
      <form
        onSubmit={handleSubmit}
        className="fixed top-[76px] right-0 bottom-0 w-[480px] bg-white border-l border-slate-200 shadow-lg z-[61] flex flex-col"
      >
        <header className="px-4 py-3 border-b border-slate-200 flex items-center justify-between flex-shrink-0">
          <h2 className="text-[14px] font-semibold text-slate-900">Nouveau lead</h2>
          <button type="button" onClick={onClose} className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100">
            <X size={14} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <Section title="1. Qui">
            <div className="grid grid-cols-2 gap-2">
              <Field label="Prénom *">
                <input value={prenom} onChange={e => setPrenom(e.target.value)} className={inputCls} placeholder="Marie" required />
              </Field>
              <Field label="Nom *">
                <input value={nom} onChange={e => setNom(e.target.value)} className={inputCls} placeholder="Bertrand" required />
              </Field>
              <Field label="Email">
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} className={inputCls} placeholder="marie@email.com" />
              </Field>
              <Field label="Téléphone">
                <input type="tel" value={telephone} onChange={e => setTelephone(e.target.value)} className={inputCls} placeholder="06 12 34 56 78" />
              </Field>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">Email ou téléphone requis (au moins un)</p>
          </Section>

          <Section title="2. Intention *">
            <div className="grid grid-cols-2 gap-2">
              {INTENTION_OPTIONS.map(opt => {
                const active = intention === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setIntention(opt.id)}
                    className={`px-3 py-2 rounded border text-[12px] font-medium transition-colors ${active ? 'border-propsight-600 bg-propsight-50 text-propsight-700' : 'border-slate-200 text-slate-700 hover:border-slate-300'}`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </Section>

          {intention && (
            <Section title="3. Contexte">
              {isVendeur && (
                <div className="space-y-2">
                  <Field label="Adresse du bien">
                    <input value={adresse} onChange={e => setAdresse(e.target.value)} className={inputCls} placeholder="45 avenue Roger…, 75015 Paris" />
                  </Field>
                  <Field label="Prix souhaité (€)">
                    <input type="number" value={prix} onChange={e => setPrix(e.target.value)} className={inputCls} placeholder="820000" />
                  </Field>
                </div>
              )}
              {isAcquereur && (
                <div className="space-y-2">
                  <Field label="Zones (séparées par des virgules)">
                    <input value={zones} onChange={e => setZones(e.target.value)} className={inputCls} placeholder="Paris 15e, Paris 16e" />
                  </Field>
                  <Field label="Budget max (€)">
                    <input type="number" value={budget} onChange={e => setBudget(e.target.value)} className={inputCls} placeholder="850000" />
                  </Field>
                </div>
              )}
            </Section>
          )}

          <Section title="4. Métadonnées">
            <Field label="Source">
              <select value={source} onChange={e => setSource(e.target.value as LeadSource)} className={inputCls}>
                {SOURCE_OPTIONS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
            </Field>
            <Field label="Tag (optionnel)">
              <input value={tag} onChange={e => setTag(e.target.value)} className={inputCls} placeholder="VIP, investisseur…" />
            </Field>
            <Field label="Note libre">
              <textarea value={note} onChange={e => setNote(e.target.value)} className={`${inputCls} min-h-[60px]`} placeholder="Contexte du lead…" />
            </Field>
          </Section>
        </div>

        <footer className="px-4 py-3 border-t border-slate-200 flex items-center justify-end gap-2 flex-shrink-0">
          <button type="button" onClick={onClose} className="px-3 h-8 text-[12px] font-medium text-slate-700 hover:bg-slate-100 rounded">
            Annuler
          </button>
          <button
            type="submit"
            disabled={!valid}
            className="px-3 h-8 text-[12px] font-semibold text-white bg-propsight-600 hover:bg-propsight-700 disabled:bg-slate-300 disabled:cursor-not-allowed rounded transition-colors"
          >
            Créer le lead
          </button>
        </footer>
      </form>
    </>
  );
};

const inputCls = 'w-full px-2.5 h-8 text-[12px] text-slate-900 placeholder:text-slate-400 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-propsight-400';

interface SectionProps { title: string; children: React.ReactNode; }
const Section: React.FC<SectionProps> = ({ title, children }) => (
  <section>
    <h3 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">{title}</h3>
    <div className="space-y-2">{children}</div>
  </section>
);

interface FieldProps { label: string; children: React.ReactNode; }
const Field: React.FC<FieldProps> = ({ label, children }) => (
  <label className="block">
    <span className="text-[11px] text-slate-600 mb-1 block">{label}</span>
    {children}
  </label>
);

export default CreateLeadModal;
