import React, { useEffect, useState } from 'react';
import { X, Pencil, MapPin, Phone, Mail, Copy, Phone as PhoneIcon, FileText, Send, ChevronRight, Sparkles, Calendar } from 'lucide-react';
import { Intention, Lead } from '../types';
import { MEMBRES, STAGES } from '../_mocks/leads';

interface Props {
  lead: Lead | null;
  onClose: () => void;
}

type TabId = 'resume' | 'biens' | 'actions' | 'estimations' | 'ai';

const TABS: { id: TabId; label: string }[] = [
  { id: 'resume',      label: 'Résumé' },
  { id: 'biens',       label: 'Biens' },
  { id: 'actions',     label: 'Actions' },
  { id: 'estimations', label: 'Estimations' },
  { id: 'ai',          label: 'AI' },
];

const INTENTION_LABEL: Record<Intention, string> = {
  vente: 'Vente', achat: 'Achat', estim: 'Estimation', locatif: 'Locatif',
};

const INTENTION_CHIP: Record<Intention, string> = {
  vente:   'bg-propsight-50 text-propsight-700',
  achat:   'bg-teal-50 text-teal-700',
  estim:   'bg-slate-100 text-slate-700',
  locatif: 'bg-amber-50 text-amber-700',
};

const LeadDrawer: React.FC<Props> = ({ lead, onClose }) => {
  const [tab, setTab] = useState<TabId>('resume');
  const [aiOpen, setAiOpen] = useState(false);

  useEffect(() => {
    if (lead) setTab('resume');
  }, [lead?.lead_id]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (lead) window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lead, onClose]);

  if (!lead) return null;

  const proprio = MEMBRES.find(m => m.id === lead.proprietaire);
  const stage = STAGES.find(s => s.id === lead.stage);
  const score = lead.scoreOpportunite ?? Math.round(40 + (lead.lead_id.charCodeAt(2) % 60));
  const proba = lead.probabiliteSignature ?? Math.round(35 + (lead.lead_id.charCodeAt(3) % 55));

  return (
    <>
      <div className="fixed inset-0 bg-black/20 z-40" onClick={onClose} />
      <aside className="fixed top-[76px] right-0 bottom-0 w-[420px] bg-white border-l border-slate-200 shadow-lg z-50 flex flex-col">
        <header className="px-4 py-3 border-b border-slate-200 flex-shrink-0">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-propsight-100 text-propsight-700 flex items-center justify-center text-[12px] font-semibold flex-shrink-0">
              {lead.initiales}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-[15px] font-semibold text-slate-900 truncate">{lead.nom}</h2>
              <p className="text-[11px] text-slate-500 capitalize">{lead.source}</p>
              <p className="text-[10px] text-slate-400">ID #{lead.lead_id}</p>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <button type="button" className="flex items-center gap-1 px-2 h-7 text-[11px] font-medium text-slate-700 border border-slate-200 rounded hover:bg-slate-50">
                <Pencil size={11} />
                Éditer
              </button>
              <button type="button" onClick={onClose} className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100">
                <X size={14} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-3">
            <div className="bg-slate-50 border border-slate-200 rounded p-2">
              <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${INTENTION_CHIP[lead.intention]}`}>{INTENTION_LABEL[lead.intention]}</span>
              <p className="text-[18px] font-semibold text-slate-900 mt-1.5 tabular-nums">
                {lead.prix !== null ? `${lead.prix.toLocaleString('fr-FR')} €` : '—'}
              </p>
              <p className="text-[10px] text-slate-500">Prix du bien estimé</p>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded p-2">
              <p className="text-[10px] text-slate-500">&nbsp;</p>
              <p className="text-[18px] font-semibold text-slate-900 mt-1.5 tabular-nums">
                {lead.commission !== null ? `${lead.commission.toLocaleString('fr-FR')} €` : '—'}
              </p>
              <p className="text-[10px] text-slate-500">Potentiel commission</p>
            </div>
          </div>
        </header>

        <div className="flex border-b border-slate-200 flex-shrink-0 overflow-x-auto">
          {TABS.map(t => {
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`px-3 h-8 text-[12px] font-medium border-b-2 transition-colors whitespace-nowrap ${active ? 'text-propsight-700 border-propsight-600' : 'text-slate-600 border-transparent hover:text-slate-900'}`}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        <div className="flex-1 overflow-y-auto">
          {tab === 'resume' && (
            <div className="p-4 space-y-4">
              <Section title="Identité & contact">
                <Row icon={<MapPin size={11} />} text={lead.adresse} />
                {proprio && <Row label="Propriétaire" text={proprio.nom} />}
                <Row label="Source" text={lead.source} capitalize />
                <Row label="Stage" text={stage?.label || lead.stage} />
                <Row label="Créé le" text={lead.createdAt || '19 mai 2025'} />
                <ContactRow icon={<Phone size={11} />} value={lead.telephone || '06 12 34 56 78'} />
                <ContactRow icon={<Mail size={11} />} value={lead.email || `${lead.nom.toLowerCase().replace(/[^a-z]/g, '.')}@email.com`} />
              </Section>

              <Section title="Actions rapides">
                <div className="grid grid-cols-2 gap-2">
                  <ActionTile icon={<PhoneIcon size={14} />} label="Créer une action" />
                  <ActionTile icon={<ChevronRight size={14} />} label="Promouvoir en AdV" primary />
                  <ActionTile icon={<FileText size={14} />} label="Créer un mandat" />
                  <ActionTile icon={<Send size={14} />} label="Envoyer email" />
                </div>
              </Section>

              <Section title="Timeline unifiée" right={<a className="text-[11px] text-blue-600 hover:underline" href="#">Voir tout →</a>}>
                <Timeline />
              </Section>

              <Section
                title="Bloc IA"
                right={
                  <button type="button" onClick={() => setAiOpen(o => !o)} className="text-[11px] text-slate-400 hover:text-slate-700">
                    {aiOpen ? '▲' : '▼'}
                  </button>
                }
              >
                {aiOpen && (
                  <div className="space-y-2.5">
                    <ScoreRow label="Score d'opportunité" value={score} suffix={score >= 75 ? 'Élevé' : score >= 50 ? 'Moyen' : 'Faible'} />
                    <ScoreRow label="Probabilité de signature" value={proba} suffix={`${proba}%`} />
                    <div>
                      <p className="text-[11px] text-slate-500 mb-0.5">Meilleure action suivante</p>
                      <p className="text-[12px] font-medium text-slate-900">Proposer un RDV de visite</p>
                    </div>
                    <button type="button" onClick={() => setTab('ai')} className="text-[11px] text-propsight-700 font-medium hover:underline inline-flex items-center gap-0.5">
                      <Sparkles size={11} />
                      Voir l'analyse complète
                    </button>
                  </div>
                )}
              </Section>
            </div>
          )}

          {tab === 'biens' && (
            <div className="p-4">
              <p className="text-[12px] text-slate-500 mb-3">
                {lead.intention === 'vente' || lead.intention === 'estim' ? 'Bien à vendre' : 'Critères de recherche'}
              </p>
              <Placeholder text={lead.intention === 'vente' || lead.intention === 'estim'
                ? 'Adresse, typologie, prix souhaité, DPE/GES, urgence, photos.'
                : 'Zones, budget, typologie souhaitée, critères must-have.'
              } />
            </div>
          )}

          {tab === 'actions' && (
            <div className="p-4">
              <button type="button" className="text-[11px] font-semibold text-propsight-700 hover:underline mb-3">+ Nouvelle action</button>
              <Placeholder text="Liste de toutes les actions passées et futures sur ce lead (appels, emails, RDV, relances, notes)." />
            </div>
          )}

          {tab === 'estimations' && (
            <div className="p-4">
              <button type="button" className="text-[11px] font-semibold text-propsight-700 hover:underline mb-3">+ Nouvelle estimation rapide</button>
              <Placeholder text="Liste des estimations / avis / études liés à ce lead." />
            </div>
          )}

          {tab === 'ai' && (
            <div className="p-4 space-y-3">
              <ScoreRow label="Score d'opportunité" value={score} suffix={`${score}/100`} />
              <ScoreRow label="Probabilité de signature" value={proba} suffix={`${proba}%`} />
              <Placeholder text="Facteurs explicatifs, historique des recommandations, comparables détaillés." />
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

interface SectionProps { title: string; right?: React.ReactNode; children: React.ReactNode; }
const Section: React.FC<SectionProps> = ({ title, right, children }) => (
  <section>
    <div className="flex items-center justify-between mb-2">
      <h3 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{title}</h3>
      {right}
    </div>
    {children}
  </section>
);

interface RowProps { icon?: React.ReactNode; label?: string; text: string; capitalize?: boolean; }
const Row: React.FC<RowProps> = ({ icon, label, text, capitalize }) => (
  <div className="flex items-center gap-2 py-1 text-[12px]">
    {icon && <span className="text-slate-400 flex-shrink-0">{icon}</span>}
    {label && <span className="text-slate-500 w-24 flex-shrink-0">{label}</span>}
    <span className={`text-slate-900 truncate ${capitalize ? 'capitalize' : ''}`}>{text}</span>
  </div>
);

interface ContactRowProps { icon: React.ReactNode; value: string; }
const ContactRow: React.FC<ContactRowProps> = ({ icon, value }) => (
  <div className="flex items-center gap-2 py-1 text-[12px]">
    <span className="text-slate-400 flex-shrink-0">{icon}</span>
    <span className="text-slate-900 truncate flex-1">{value}</span>
    <button type="button" onClick={() => navigator.clipboard?.writeText(value)} title="Copier" className="p-0.5 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100">
      <Copy size={11} />
    </button>
  </div>
);

interface ActionTileProps { icon: React.ReactNode; label: string; primary?: boolean; }
const ActionTile: React.FC<ActionTileProps> = ({ icon, label, primary }) => (
  <button
    type="button"
    onClick={() => console.warn('[Leads] Action rapide', label)}
    className={`flex items-center gap-2 px-2.5 py-2 rounded text-[11px] font-medium text-left transition-colors ${primary ? 'bg-propsight-600 text-white hover:bg-propsight-700' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'}`}
  >
    <span className={primary ? 'text-white' : 'text-slate-500'}>{icon}</span>
    {label}
  </button>
);

const Timeline: React.FC = () => (
  <ul className="space-y-3">
    <TimelineEntry icon={<Phone size={11} />} type="Appel sortant" when="Aujourd'hui · 10:32" author="Sophie Leroy" body="Discussion sur le projet de vente. Est déjà en contact avec un notaire." />
    <TimelineEntry icon={<Mail size={11} />} type="Email envoyé" when="Hier · 16:05" author="Sophie Leroy" body="Envoi de l'estimation et des comparables." />
    <TimelineEntry icon={<Calendar size={11} />} type="RDV planifié" when="23 mai 2025 · 11:00" author="—" body="Visite de l'appartement." />
  </ul>
);

interface TimelineEntryProps { icon: React.ReactNode; type: string; when: string; author: string; body: string; }
const TimelineEntry: React.FC<TimelineEntryProps> = ({ icon, type, when, author, body }) => (
  <li className="flex items-start gap-2">
    <div className="w-6 h-6 rounded-full bg-propsight-100 text-propsight-700 flex items-center justify-center flex-shrink-0">{icon}</div>
    <div className="flex-1 min-w-0">
      <p className="text-[12px] font-medium text-slate-900 truncate">{type}<span className="text-slate-400 font-normal"> · {when}</span></p>
      <p className="text-[11px] text-slate-500">{author}</p>
      <p className="text-[11px] text-slate-700 mt-0.5">{body}</p>
    </div>
  </li>
);

interface ScoreRowProps { label: string; value: number; suffix: string; }
const ScoreRow: React.FC<ScoreRowProps> = ({ label, value, suffix }) => (
  <div>
    <div className="flex items-center justify-between mb-1">
      <span className="text-[11px] text-slate-500">{label}</span>
      <span className="text-[11px] font-semibold text-propsight-700">{suffix}</span>
    </div>
    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
      <div className="h-full bg-propsight-500 rounded-full" style={{ width: `${value}%` }} />
    </div>
  </div>
);

const Placeholder: React.FC<{ text: string }> = ({ text }) => (
  <p className="text-[11px] text-slate-400 italic">{text}</p>
);

export default LeadDrawer;
