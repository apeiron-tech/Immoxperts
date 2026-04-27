import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleDot,
  Filter,
  Plus,
  RefreshCw,
  Search,
  Sparkles,
  Wifi,
  WifiOff,
  XCircle,
} from 'lucide-react';
import StudioLayout from '../layout/StudioLayout';
import KpiTile from '../shared/KpiTile';
import ChannelBadge from '../shared/ChannelBadge';
import {
  ACTIVE_CAMPAIGNS,
  CONNECTORS,
  formatEuros,
  formatNumber,
  PUBLICATIONS,
  SCHEDULED_THIS_WEEK,
  type ConnectorRow,
  type PublicationRow,
} from '../_mocks/marketing';

type Tab = 'calendrier' | 'publications' | 'campagnes' | 'comptes';

const TABS: { id: Tab; label: string }[] = [
  { id: 'calendrier', label: 'Calendrier' },
  { id: 'publications', label: 'Publications' },
  { id: 'campagnes', label: 'Campagnes locales' },
  { id: 'comptes', label: 'Comptes connectés' },
];

const DAY_LABELS = ['Lun 21', 'Mar 22', 'Mer 23', 'Jeu 24', 'Ven 25', 'Sam 26', 'Dim 27'];
const DAYS = ['lun', 'mar', 'mer', 'jeu', 'ven', 'sam', 'dim'] as const;
const HOURS = ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00'];

const KPIS = [
  { id: 'planifies', label: 'Posts planifiés', value: '14', delta: '+5 cette semaine', trend: 'up' as const },
  { id: 'publies', label: 'Publiés (7j)', value: '28', delta: '+12 %', trend: 'up' as const },
  { id: 'campagnes', label: 'Campagnes actives', value: '3', delta: '1 en pause', trend: 'flat' as const },
  { id: 'budget', label: 'Budget en cours', value: '4 000 €', delta: '2 992 € dépensés', trend: 'flat' as const },
];

const PUBLICATION_STATUS: Record<
  PublicationRow['status'],
  { label: string; tone: string; icon: React.ReactNode }
> = {
  brouillon: { label: 'Brouillon', tone: 'bg-neutral-100 text-neutral-600', icon: <CircleDot size={11} /> },
  programme: { label: 'Programmé', tone: 'bg-propsight-50 text-propsight-700', icon: <CircleDot size={11} /> },
  publie: { label: 'Publié', tone: 'bg-success-50 text-success-700', icon: <CheckCircle2 size={11} /> },
  echec: { label: 'Échec', tone: 'bg-danger-50 text-danger-700', icon: <XCircle size={11} /> },
  reauth: { label: 'Reconnecter', tone: 'bg-amber-50 text-amber-700', icon: <AlertTriangle size={11} /> },
};

const CONNECTOR_STATUS: Record<
  ConnectorRow['status'],
  { label: string; tone: string; icon: React.ReactNode }
> = {
  connected: { label: 'Connecté', tone: 'bg-success-50 text-success-700', icon: <Wifi size={11} /> },
  needs_reauth: { label: 'Reconnecter', tone: 'bg-amber-50 text-amber-700', icon: <AlertTriangle size={11} /> },
  expired: { label: 'Expiré', tone: 'bg-danger-50 text-danger-700', icon: <XCircle size={11} /> },
  disconnected: { label: 'Déconnecté', tone: 'bg-neutral-100 text-neutral-600', icon: <WifiOff size={11} /> },
};

const CalendarView: React.FC = () => (
  <div className="bg-white border border-neutral-200 rounded-lg">
    <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-100">
      <div className="flex items-center gap-2">
        <button className="p-1.5 border border-neutral-200 rounded text-neutral-600 hover:bg-neutral-50">
          <ChevronLeft size={13} />
        </button>
        <span className="text-[13px] font-semibold text-neutral-900">Semaine du 21 – 27 avril 2026</span>
        <button className="p-1.5 border border-neutral-200 rounded text-neutral-600 hover:bg-neutral-50">
          <ChevronRight size={13} />
        </button>
      </div>
      <div className="flex items-center gap-2">
        <button className="px-2.5 py-1.5 text-[12px] border border-neutral-200 rounded-md text-neutral-700 bg-white hover:border-neutral-300">
          Mois
        </button>
        <button className="px-2.5 py-1.5 text-[12px] border border-propsight-300 bg-propsight-50 text-propsight-700 rounded-md font-medium">
          Semaine
        </button>
        <button className="px-2.5 py-1.5 text-[12px] border border-neutral-200 rounded-md text-neutral-700 bg-white hover:border-neutral-300 inline-flex items-center gap-1.5">
          <Sparkles size={12} />
          Remplir les trous
        </button>
      </div>
    </div>
    <div className="grid grid-cols-[60px_repeat(7,minmax(0,1fr))] text-[11.5px]">
      <div className="border-b border-r border-neutral-100" />
      {DAY_LABELS.map(d => (
        <div key={d} className="px-2 py-2 text-center border-b border-neutral-100 text-[11.5px] font-semibold text-neutral-700 border-l">
          {d}
        </div>
      ))}
      {HOURS.map(h => (
        <React.Fragment key={h}>
          <div className="text-right pr-2 py-1 text-[10.5px] text-neutral-400 border-r border-neutral-100">{h}</div>
          {DAYS.map(d => {
            const items = SCHEDULED_THIS_WEEK.filter(s => s.day === d && s.hour.startsWith(h.split(':')[0]));
            return (
              <div key={d + h} className="border-l border-b border-neutral-100 min-h-[64px] p-1 hover:bg-neutral-50">
                {items.map(it => (
                  <div
                    key={it.id}
                    className="bg-propsight-50 border border-propsight-200 rounded px-1.5 py-1 mb-1 text-left cursor-pointer hover:bg-propsight-100"
                  >
                    <div className="flex items-center gap-1">
                      <ChannelBadge channel={it.channel} />
                      <span className="text-[10px] text-neutral-500">{it.hour}</span>
                    </div>
                    <div className="text-[10.5px] font-medium text-neutral-900 truncate">{it.bien}</div>
                    {it.variant && <div className="text-[9.5px] text-neutral-500 truncate">{it.variant}</div>}
                  </div>
                ))}
              </div>
            );
          })}
        </React.Fragment>
      ))}
    </div>
  </div>
);

const PublicationsView: React.FC = () => (
  <div className="bg-white border border-neutral-200 rounded-lg">
    <div className="flex items-center justify-between px-3 py-2.5 border-b border-neutral-100">
      <div className="relative w-72">
        <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400" />
        <input
          placeholder="Rechercher une publication…"
          className="w-full pl-8 pr-3 py-1.5 text-[12.5px] border border-neutral-200 rounded-md focus:outline-none focus:border-propsight-400 focus:ring-2 focus:ring-propsight-100 bg-white"
        />
      </div>
      <div className="flex items-center gap-2">
        <button className="px-2.5 py-1.5 text-[12px] border border-neutral-200 rounded-md text-neutral-700 bg-white hover:border-neutral-300 inline-flex items-center gap-1.5">
          <Filter size={12} /> Canal
        </button>
        <button className="px-2.5 py-1.5 text-[12px] border border-neutral-200 rounded-md text-neutral-700 bg-white hover:border-neutral-300 inline-flex items-center gap-1.5">
          <Filter size={12} /> Statut
        </button>
      </div>
    </div>
    <table className="w-full text-[12px]">
      <thead className="bg-neutral-50/50">
        <tr className="text-left text-[10.5px] font-semibold uppercase tracking-wide text-neutral-500 border-b border-neutral-100">
          <th className="py-2 pl-3 font-semibold">Asset</th>
          <th className="py-2 px-2 font-semibold">Bien</th>
          <th className="py-2 px-2 font-semibold">Canal</th>
          <th className="py-2 px-2 font-semibold">Compte</th>
          <th className="py-2 px-2 font-semibold">Date</th>
          <th className="py-2 px-2 font-semibold">Statut</th>
          <th className="py-2 px-2 text-right font-semibold">Vues</th>
          <th className="py-2 px-2 text-right font-semibold">Clics</th>
          <th className="py-2 pr-3 text-right font-semibold">Leads</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-neutral-100">
        {PUBLICATIONS.map(p => {
          const s = PUBLICATION_STATUS[p.status];
          return (
            <tr key={p.id} className="hover:bg-neutral-50/60 cursor-pointer">
              <td className="py-2.5 pl-3 font-medium text-neutral-900">{p.asset}</td>
              <td className="py-2.5 px-2 text-neutral-700">{p.bien}</td>
              <td className="py-2.5 px-2"><ChannelBadge channel={p.channel} withLabel /></td>
              <td className="py-2.5 px-2 text-neutral-600">{p.account}</td>
              <td className="py-2.5 px-2 text-neutral-700">{p.date}</td>
              <td className="py-2.5 px-2">
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10.5px] font-medium ${s.tone}`}>
                  {s.icon}
                  {s.label}
                </span>
              </td>
              <td className="py-2.5 px-2 text-right tabular-nums text-neutral-700">{p.views ? formatNumber(p.views) : '—'}</td>
              <td className="py-2.5 px-2 text-right tabular-nums text-neutral-700">{p.clicks ?? '—'}</td>
              <td className="py-2.5 pr-3 text-right tabular-nums font-medium text-neutral-900">{p.leads ?? '—'}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

const CampagnesView: React.FC = () => (
  <div className="bg-white border border-neutral-200 rounded-lg">
    <div className="flex items-center justify-between px-3 py-2.5 border-b border-neutral-100">
      <div className="text-[12.5px] text-neutral-700">
        <span className="font-medium text-neutral-900">{ACTIVE_CAMPAIGNS.length} campagnes</span>
        <span className="text-neutral-500 ml-2">· budget total {formatEuros(ACTIVE_CAMPAIGNS.reduce((s, c) => s + c.budget, 0))}</span>
      </div>
      <button className="px-3 py-1.5 text-[12.5px] font-medium rounded-md text-white bg-propsight-600 hover:bg-propsight-700 inline-flex items-center gap-1.5">
        <Plus size={13} />
        Nouvelle campagne
      </button>
    </div>
    <table className="w-full text-[12px]">
      <thead className="bg-neutral-50/50">
        <tr className="text-left text-[10.5px] font-semibold uppercase tracking-wide text-neutral-500 border-b border-neutral-100">
          <th className="py-2 pl-3 font-semibold">Campagne</th>
          <th className="py-2 px-2 font-semibold">Bien / source</th>
          <th className="py-2 px-2 font-semibold">Canal</th>
          <th className="py-2 px-2 font-semibold">Objectif</th>
          <th className="py-2 px-2 text-right font-semibold">Budget</th>
          <th className="py-2 px-2 text-right font-semibold">Dépensé</th>
          <th className="py-2 px-2 text-right font-semibold">Leads</th>
          <th className="py-2 px-2 text-right font-semibold">CPL</th>
          <th className="py-2 px-2 font-semibold">Statut</th>
          <th className="py-2 pr-3 font-semibold">Fin dans</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-neutral-100">
        {ACTIVE_CAMPAIGNS.map(c => (
          <tr key={c.id} className="hover:bg-neutral-50/60 cursor-pointer">
            <td className="py-2.5 pl-3 font-medium text-neutral-900">{c.name}</td>
            <td className="py-2.5 px-2 text-neutral-700">{c.bien}</td>
            <td className="py-2.5 px-2"><ChannelBadge channel={c.channel} withLabel /></td>
            <td className="py-2.5 px-2 text-neutral-700">{c.objective}</td>
            <td className="py-2.5 px-2 text-right tabular-nums text-neutral-700">{formatEuros(c.budget)}</td>
            <td className="py-2.5 px-2 text-right tabular-nums text-neutral-900 font-medium">{formatEuros(c.spend)}</td>
            <td className="py-2.5 px-2 text-right tabular-nums font-medium text-neutral-900">{c.leads}</td>
            <td className="py-2.5 px-2 text-right tabular-nums text-neutral-700">{c.cpl.toFixed(1)} €</td>
            <td className="py-2.5 px-2">
              <span
                className={`text-[10.5px] font-medium px-2 py-0.5 rounded ${
                  c.status === 'active'
                    ? 'bg-success-50 text-success-700'
                    : c.status === 'paused'
                      ? 'bg-amber-50 text-amber-700'
                      : 'bg-neutral-100 text-neutral-600'
                }`}
              >
                {c.status === 'active' ? 'Active' : c.status === 'paused' ? 'En pause' : c.status === 'pending_review' ? 'En revue' : 'Terminée'}
              </span>
            </td>
            <td className="py-2.5 pr-3 text-neutral-700">{c.endsIn ?? '—'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const ComptesView: React.FC = () => (
  <div className="grid grid-cols-2 gap-3">
    {CONNECTORS.map(c => {
      const s = CONNECTOR_STATUS[c.status];
      return (
        <div key={c.id} className="bg-white border border-neutral-200 rounded-lg p-4 flex items-start gap-3">
          <div className="w-10 h-10 rounded bg-neutral-100 flex items-center justify-center text-neutral-700 text-[14px] font-semibold">
            {c.label[0]}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h4 className="text-[13px] font-semibold text-neutral-900 truncate">{c.label}</h4>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10.5px] font-medium ${s.tone}`}>
                {s.icon}
                {s.label}
              </span>
            </div>
            <div className="text-[11.5px] text-neutral-500 mt-1 space-y-0.5">
              {c.pages > 0 && <div>{c.pages} page{c.pages > 1 ? 's' : ''} disponible{c.pages > 1 ? 's' : ''}</div>}
              {c.adAccounts > 0 && <div>{c.adAccounts} compte publicitaire</div>}
              {c.expiresIn && <div>Token expire dans {c.expiresIn}</div>}
            </div>
            <div className="mt-2 flex items-center gap-2">
              {c.status === 'connected' ? (
                <button className="text-[11.5px] font-medium text-neutral-600 hover:text-neutral-900 inline-flex items-center gap-1">
                  <RefreshCw size={11} /> Tester
                </button>
              ) : (
                <button className="text-[11.5px] font-medium text-propsight-700 hover:text-propsight-900 inline-flex items-center gap-1">
                  <RefreshCw size={11} /> Reconnecter
                </button>
              )}
              <button className="text-[11.5px] font-medium text-neutral-500 hover:text-neutral-700">
                Permissions
              </button>
            </div>
          </div>
        </div>
      );
    })}
  </div>
);

const DiffusionPage: React.FC = () => {
  const [tab, setTab] = useState<Tab>('calendrier');

  return (
    <StudioLayout
      title="Diffusion & campagnes"
      breadcrumbCurrent="Diffusion & campagnes"
      headerRight={
        <div className="flex items-center gap-2">
          <button className="px-2.5 py-1.5 text-[12.5px] border border-neutral-200 rounded-md text-neutral-700 bg-white hover:border-neutral-300 inline-flex items-center gap-1.5">
            <RefreshCw size={13} />
            Synchroniser
          </button>
          <button className="px-3 py-1.5 text-[12.5px] font-medium rounded-md text-white bg-propsight-600 hover:bg-propsight-700 inline-flex items-center gap-1.5">
            <Sparkles size={13} />
            Nouvelle campagne
          </button>
        </div>
      }
    >
      <div className="h-full overflow-y-auto p-5 space-y-4">
        <div className="grid grid-cols-4 gap-3">
          {KPIS.map(k => (
            <KpiTile key={k.id} label={k.label} value={k.value} delta={k.delta} trend={k.trend} />
          ))}
        </div>

        <div className="border-b border-neutral-200 flex items-center gap-1">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-2 text-[12.5px] font-medium border-b-2 -mb-px ${
                tab === t.id
                  ? 'text-propsight-700 border-propsight-600'
                  : 'text-neutral-600 border-transparent hover:text-neutral-900'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'calendrier' && <CalendarView />}
        {tab === 'publications' && <PublicationsView />}
        {tab === 'campagnes' && <CampagnesView />}
        {tab === 'comptes' && <ComptesView />}
      </div>
    </StudioLayout>
  );
};

export default DiffusionPage;
