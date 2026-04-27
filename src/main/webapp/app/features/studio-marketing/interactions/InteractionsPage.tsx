import React, { useMemo, useState } from 'react';
import {
  CheckCircle2,
  Filter,
  MailOpen,
  MessageSquareReply,
  MoreHorizontal,
  Search,
  UserPlus2,
  X,
} from 'lucide-react';
import StudioLayout from '../layout/StudioLayout';
import KpiTile from '../shared/KpiTile';
import ChannelBadge from '../shared/ChannelBadge';
import {
  INTERACTION_SOURCE_META,
  RECENT_INTERACTIONS,
  type InteractionRow,
} from '../_mocks/marketing';

type Tab = 'toutes' | 'a_traiter' | 'messages' | 'commentaires' | 'formulaires' | 'appels' | 'converties' | 'ignorees';

const TABS: { id: Tab; label: string; predicate: (i: InteractionRow) => boolean }[] = [
  { id: 'toutes', label: 'Toutes', predicate: () => true },
  { id: 'a_traiter', label: 'À traiter', predicate: i => i.status === 'a_traiter' },
  { id: 'messages', label: 'Messages', predicate: i => i.source.includes('_dm') || i.source.includes('_message') },
  { id: 'commentaires', label: 'Commentaires', predicate: i => i.source.includes('_comment') },
  { id: 'formulaires', label: 'Formulaires', predicate: i => i.source === 'landing_form' || i.source === 'ad_lead_form' },
  { id: 'appels', label: 'Appels', predicate: i => i.source === 'google_call' },
  { id: 'converties', label: 'Converties', predicate: i => i.status === 'converti_lead' },
  { id: 'ignorees', label: 'Ignorées', predicate: i => i.status === 'ignore' },
];

const KPIS = [
  { id: 'inbox', label: 'À traiter', value: '6', delta: '+2 dernière heure', trend: 'up' as const },
  { id: 'temps_moyen', label: 'Temps moyen de réponse', value: '38 min', delta: '−12 min', trend: 'down' as const, hint: 'amélioration' },
  { id: 'taux_conv', label: 'Taux de conversion lead', value: '24 %', delta: '+4 pt', trend: 'up' as const },
  { id: 'leads_24h', label: 'Leads créés (24h)', value: '11', delta: '+3', trend: 'up' as const },
];

const INTENT_LABEL: Record<InteractionRow['intent'], string> = {
  visite: 'Visite',
  estimation: 'Estimation',
  information: 'Information',
  investissement: 'Investissement',
  vente: 'Vente',
  location: 'Location',
  spam: 'Spam',
};

const INTENT_TONE: Record<InteractionRow['intent'], string> = {
  visite: 'bg-success-50 text-success-700',
  estimation: 'bg-propsight-50 text-propsight-700',
  information: 'bg-neutral-100 text-neutral-700',
  investissement: 'bg-info-50 text-info-700',
  vente: 'bg-amber-50 text-amber-700',
  location: 'bg-amber-50 text-amber-700',
  spam: 'bg-danger-50 text-danger-700',
};

const STATUS_TONE: Record<InteractionRow['status'], string> = {
  a_traiter: 'bg-amber-50 text-amber-700',
  repondu: 'bg-info-50 text-info-700',
  converti_lead: 'bg-success-50 text-success-700',
  ignore: 'bg-neutral-100 text-neutral-500',
};

const STATUS_LABEL: Record<InteractionRow['status'], string> = {
  a_traiter: 'À traiter',
  repondu: 'Répondu',
  converti_lead: 'Lead créé',
  ignore: 'Ignoré',
};

const InteractionDrawer: React.FC<{ interaction: InteractionRow; onClose: () => void }> = ({ interaction, onClose }) => {
  const meta = INTERACTION_SOURCE_META[interaction.source];
  const Icon = meta.icon;
  return (
    <aside className="fixed inset-y-0 right-0 w-[480px] bg-white border-l border-neutral-200 shadow-xl z-30 flex flex-col">
      <header className="px-4 py-3 border-b border-neutral-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-700">
            <Icon size={14} />
          </span>
          <div>
            <div className="text-[13px] font-semibold text-neutral-900">{interaction.contactName}</div>
            <div className="text-[11px] text-neutral-500">{meta.label} · {interaction.receivedAgo}</div>
          </div>
        </div>
        <button onClick={onClose} className="p-1.5 hover:bg-neutral-100 rounded text-neutral-500"><X size={14} /></button>
      </header>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <section>
          <h4 className="text-[10.5px] font-semibold uppercase tracking-wide text-neutral-500 mb-1.5">Message</h4>
          <div className="bg-neutral-50 border border-neutral-100 rounded p-3 text-[12.5px] text-neutral-800 leading-relaxed">
            {interaction.message}
          </div>
        </section>
        <section>
          <h4 className="text-[10.5px] font-semibold uppercase tracking-wide text-neutral-500 mb-1.5">Contexte</h4>
          <dl className="grid grid-cols-2 gap-2 text-[12px]">
            {interaction.bien && (
              <>
                <dt className="text-neutral-500">Bien</dt>
                <dd className="text-neutral-900 font-medium">{interaction.bien}</dd>
              </>
            )}
            {interaction.campaign && (
              <>
                <dt className="text-neutral-500">Campagne</dt>
                <dd className="text-neutral-900 font-medium">{interaction.campaign}</dd>
              </>
            )}
            <dt className="text-neutral-500">Canal</dt>
            <dd><ChannelBadge channel={interaction.channel} withLabel /></dd>
            <dt className="text-neutral-500">Intention</dt>
            <dd>
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10.5px] font-medium ${INTENT_TONE[interaction.intent]}`}>
                {INTENT_LABEL[interaction.intent]}
              </span>
            </dd>
          </dl>
        </section>
        <section>
          <h4 className="text-[10.5px] font-semibold uppercase tracking-wide text-neutral-500 mb-1.5">Suggestion Propsight</h4>
          <div className="border border-propsight-200 bg-propsight-50/50 rounded p-3 text-[12px] text-neutral-800 leading-relaxed">
            Le contact ressemble à un acquéreur déjà présent dans votre base sur Antibes (4 critères matchés). Associez-le au lead existant et proposez la visite cette semaine — la zone est très tendue.
          </div>
        </section>
      </div>
      <footer className="border-t border-neutral-200 p-3 grid grid-cols-2 gap-2">
        <button className="px-3 py-2 text-[12.5px] font-medium border border-neutral-200 rounded text-neutral-700 hover:bg-neutral-50 inline-flex items-center justify-center gap-1.5">
          <MessageSquareReply size={13} /> Répondre
        </button>
        <button className="px-3 py-2 text-[12.5px] font-medium rounded text-white bg-propsight-600 hover:bg-propsight-700 inline-flex items-center justify-center gap-1.5">
          <UserPlus2 size={13} /> Créer le lead
        </button>
        <button className="px-3 py-2 text-[12.5px] font-medium border border-neutral-200 rounded text-neutral-700 hover:bg-neutral-50 inline-flex items-center justify-center gap-1.5">
          <CheckCircle2 size={13} /> Marquer traité
        </button>
        <button className="px-3 py-2 text-[12.5px] font-medium border border-neutral-200 rounded text-neutral-500 hover:bg-neutral-50 inline-flex items-center justify-center gap-1.5">
          Ignorer
        </button>
      </footer>
    </aside>
  );
};

const InteractionsPage: React.FC = () => {
  const [tab, setTab] = useState<Tab>('a_traiter');
  const [search, setSearch] = useState('');
  const [openId, setOpenId] = useState<string | null>(null);

  const rows = useMemo(() => {
    const tabPredicate = TABS.find(t => t.id === tab)?.predicate ?? (() => true);
    return RECENT_INTERACTIONS.filter(i => {
      if (!tabPredicate(i)) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return i.contactName.toLowerCase().includes(q) || i.message.toLowerCase().includes(q);
      }
      return true;
    });
  }, [tab, search]);

  const open = openId ? RECENT_INTERACTIONS.find(i => i.id === openId) : null;

  return (
    <StudioLayout
      title="Interactions"
      breadcrumbCurrent="Interactions"
      headerRight={
        <div className="flex items-center gap-2">
          <button className="px-2.5 py-1.5 text-[12.5px] border border-neutral-200 rounded-md text-neutral-700 bg-white hover:border-neutral-300 inline-flex items-center gap-1.5">
            <MailOpen size={13} />
            Tout marquer lu
          </button>
          <button className="px-3 py-1.5 text-[12.5px] font-medium rounded-md text-white bg-propsight-600 hover:bg-propsight-700 inline-flex items-center gap-1.5">
            <CheckCircle2 size={13} />
            Convertir en leads
          </button>
        </div>
      }
    >
      <div className="h-full overflow-y-auto p-5 space-y-4">
        <div className="grid grid-cols-4 gap-3">
          {KPIS.map(k => (
            <KpiTile
              key={k.id}
              label={k.label}
              value={k.value}
              delta={k.delta}
              trend={k.trend}
              hint={k.hint}
              invertTrendSemantics={k.id === 'temps_moyen'}
            />
          ))}
        </div>

        <div className="bg-white border border-neutral-200 rounded-lg">
          <div className="px-3 py-2.5 border-b border-neutral-100 flex items-center gap-2">
            <div className="relative flex-1 max-w-md">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Rechercher contact ou message…"
                className="w-full pl-8 pr-3 py-1.5 text-[12.5px] border border-neutral-200 rounded-md focus:outline-none focus:border-propsight-400 focus:ring-2 focus:ring-propsight-100 bg-white"
              />
            </div>
            <button className="px-2.5 py-1.5 text-[12px] border border-neutral-200 rounded-md text-neutral-700 bg-white hover:border-neutral-300 inline-flex items-center gap-1.5">
              <Filter size={12} /> Canal
            </button>
            <button className="px-2.5 py-1.5 text-[12px] border border-neutral-200 rounded-md text-neutral-700 bg-white hover:border-neutral-300 inline-flex items-center gap-1.5">
              <Filter size={12} /> Bien
            </button>
            <button className="px-2.5 py-1.5 text-[12px] border border-neutral-200 rounded-md text-neutral-700 bg-white hover:border-neutral-300 inline-flex items-center gap-1.5">
              <Filter size={12} /> Intention
            </button>
            <button className="px-2.5 py-1.5 text-[12px] border border-neutral-200 rounded-md text-neutral-700 bg-white hover:border-neutral-300 inline-flex items-center gap-1.5">
              <Filter size={12} /> Assigné
            </button>
          </div>

          <div className="px-3 pt-2 flex items-center gap-1 border-b border-neutral-100 overflow-x-auto">
            {TABS.map(t => {
              const count = RECENT_INTERACTIONS.filter(i => t.predicate(i)).length;
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`px-3 py-1.5 text-[12px] font-medium border-b-2 -mb-px whitespace-nowrap ${
                    active
                      ? 'text-propsight-700 border-propsight-600'
                      : 'text-neutral-600 border-transparent hover:text-neutral-900'
                  }`}
                >
                  {t.label}
                  <span className={`ml-1.5 text-[10.5px] ${active ? 'text-propsight-600' : 'text-neutral-400'}`}>
                    ({count})
                  </span>
                </button>
              );
            })}
          </div>

          <ul className="divide-y divide-neutral-100">
            {rows.map(i => {
              const meta = INTERACTION_SOURCE_META[i.source];
              const Icon = meta.icon;
              return (
                <li
                  key={i.id}
                  onClick={() => setOpenId(i.id)}
                  className={`px-4 py-3 flex items-start gap-3 hover:bg-neutral-50 cursor-pointer transition-colors ${
                    i.status === 'a_traiter' ? 'bg-amber-50/20' : ''
                  }`}
                >
                  <span className="flex-shrink-0 w-9 h-9 rounded-full bg-neutral-100 text-neutral-700 flex items-center justify-center">
                    <Icon size={14} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[13px] font-semibold text-neutral-900">{i.contactName}</span>
                      <span className="text-[10.5px] text-neutral-400">·</span>
                      <span className="text-[11.5px] text-neutral-500">{meta.label}</span>
                      <span className="text-[10.5px] text-neutral-400">·</span>
                      <span className="text-[11.5px] text-neutral-500">{i.contactSubtitle}</span>
                    </div>
                    <p className="text-[12.5px] text-neutral-800 leading-snug line-clamp-1">{i.message}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      {i.bien && <span className="text-[10.5px] text-neutral-500">📍 {i.bien}</span>}
                      {i.campaign && <span className="text-[10.5px] text-neutral-500">🎯 {i.campaign}</span>}
                      <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium ${INTENT_TONE[i.intent]}`}>
                        {INTENT_LABEL[i.intent]}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                    <span className="text-[10.5px] text-neutral-400">{i.receivedAgo}</span>
                    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium ${STATUS_TONE[i.status]}`}>
                      {STATUS_LABEL[i.status]}
                    </span>
                    <button className="p-1 hover:bg-neutral-100 rounded text-neutral-400" onClick={e => e.stopPropagation()}>
                      <MoreHorizontal size={12} />
                    </button>
                  </div>
                </li>
              );
            })}
            {rows.length === 0 && (
              <li className="py-12 text-center text-[12px] text-neutral-500">Inbox vide pour ce filtre.</li>
            )}
          </ul>
        </div>
      </div>

      {open && <InteractionDrawer interaction={open} onClose={() => setOpenId(null)} />}
    </StudioLayout>
  );
};

export default InteractionsPage;
