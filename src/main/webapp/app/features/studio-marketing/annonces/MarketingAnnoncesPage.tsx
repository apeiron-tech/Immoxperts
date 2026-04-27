import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  Filter,
  Plus,
  Search,
  SlidersHorizontal,
  TableProperties,
} from 'lucide-react';
import StudioLayout from '../layout/StudioLayout';
import KpiTile from '../shared/KpiTile';
import ChannelBadge from '../shared/ChannelBadge';
import { proRoutes } from 'app/config/proRoutes';
import {
  MARKETING_PROPERTIES,
  STATUS_META,
  formatNumber,
  type MarketingPropertyRow,
  type MarketingPropertyStatus,
} from '../_mocks/marketing';

type Tab = 'toutes' | 'a_preparer' | 'pretes' | 'publiees' | 'campagnes' | 'a_relancer' | 'sous_perf';

const TABS: { id: Tab; label: string; predicate: (p: MarketingPropertyRow) => boolean }[] = [
  { id: 'toutes', label: 'Toutes', predicate: () => true },
  { id: 'a_preparer', label: 'À préparer', predicate: p => p.status === 'a_completer' || p.status === 'non_prepare' },
  { id: 'pretes', label: 'Prêtes', predicate: p => p.status === 'pret_a_publier' },
  { id: 'publiees', label: 'Publiées', predicate: p => p.status === 'publie' },
  { id: 'campagnes', label: 'Campagnes actives', predicate: p => p.status === 'campagne_active' },
  { id: 'a_relancer', label: 'À relancer', predicate: p => p.status === 'a_relancer' },
  { id: 'sous_perf', label: 'Sous-performance', predicate: p => p.status === 'sous_performance' },
];

const KPIS = [
  { id: 'biens', label: 'Biens actifs', value: '24', delta: '+3 ce mois', trend: 'up' as const },
  { id: 'pretes', label: 'Prêtes à publier', value: '8', delta: 'score ≥ 80', trend: 'flat' as const },
  { id: 'sous_perf', label: 'Sous-performance', value: '3', delta: '+1 vs. semaine -1', trend: 'up' as const },
  { id: 'a_relancer', label: 'À relancer', value: '5', delta: 'sans diffusion 14j+', trend: 'flat' as const },
];

const ScoreGauge: React.FC<{ value: number }> = ({ value }) => {
  const tone = value >= 80 ? 'bg-success-500' : value >= 60 ? 'bg-amber-500' : 'bg-danger-500';
  return (
    <div className="flex items-center gap-2 min-w-[110px]">
      <div className="flex-1 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
        <div className={`h-full ${tone} rounded-full`} style={{ width: `${value}%` }} />
      </div>
      <span className="text-[11.5px] font-semibold text-neutral-700 tabular-nums">{value}</span>
    </div>
  );
};

const StatusPill: React.FC<{ status: MarketingPropertyStatus }> = ({ status }) => {
  const meta = STATUS_META[status];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10.5px] font-medium ${meta.tone}`}>
      <span className="w-1 h-1 rounded-full bg-current" />
      {meta.label}
    </span>
  );
};

const MarketingAnnoncesPage: React.FC = () => {
  const [tab, setTab] = useState<Tab>('toutes');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const rows = useMemo(() => {
    const tabPredicate = TABS.find(t => t.id === tab)?.predicate ?? (() => true);
    return MARKETING_PROPERTIES.filter(p => {
      if (!tabPredicate(p)) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return p.bienLabel.toLowerCase().includes(q) || p.ville.toLowerCase().includes(q);
      }
      return true;
    });
  }, [tab, search]);

  const allSelected = rows.length > 0 && rows.every(r => selected.has(r.id));

  const toggleAll = () => {
    if (allSelected) setSelected(new Set());
    else setSelected(new Set(rows.map(r => r.id)));
  };

  const toggleOne = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <StudioLayout
      title="Mes annonces"
      breadcrumbCurrent="Mes annonces"
      headerRight={
        <div className="flex items-center gap-2">
          <button className="px-2.5 py-1.5 text-[12.5px] border border-neutral-200 rounded-md text-neutral-700 bg-white hover:border-neutral-300 inline-flex items-center gap-1.5">
            <Bell size={13} />
            Alertes
          </button>
          <Link
            to={proRoutes.studioMarketing.atelier}
            className="px-3 py-1.5 text-[12.5px] font-medium rounded-md text-white bg-propsight-600 hover:bg-propsight-700 inline-flex items-center gap-1.5"
          >
            <Plus size={13} />
            Nouvelle annonce
          </Link>
        </div>
      }
    >
      <div className="h-full overflow-y-auto p-5 space-y-4">
        {/* KPIs */}
        <div className="grid grid-cols-4 gap-3">
          {KPIS.map(k => (
            <KpiTile key={k.id} label={k.label} value={k.value} delta={k.delta} trend={k.trend} />
          ))}
        </div>

        {/* Filtres */}
        <div className="bg-white border border-neutral-200 rounded-lg">
          <div className="px-3 py-2.5 border-b border-neutral-100 flex items-center gap-2">
            <div className="relative flex-1 max-w-md">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Rechercher un bien, une ville…"
                className="w-full pl-8 pr-3 py-1.5 text-[12.5px] border border-neutral-200 rounded-md focus:outline-none focus:border-propsight-400 focus:ring-2 focus:ring-propsight-100 bg-white"
              />
            </div>
            <button className="px-2.5 py-1.5 text-[12px] border border-neutral-200 rounded-md text-neutral-700 bg-white hover:border-neutral-300 inline-flex items-center gap-1.5">
              <Filter size={12} /> Statut
            </button>
            <button className="px-2.5 py-1.5 text-[12px] border border-neutral-200 rounded-md text-neutral-700 bg-white hover:border-neutral-300 inline-flex items-center gap-1.5">
              <Filter size={12} /> Canal
            </button>
            <button className="px-2.5 py-1.5 text-[12px] border border-neutral-200 rounded-md text-neutral-700 bg-white hover:border-neutral-300 inline-flex items-center gap-1.5">
              <Filter size={12} /> Agent
            </button>
            <button className="px-2.5 py-1.5 text-[12px] border border-neutral-200 rounded-md text-neutral-700 bg-white hover:border-neutral-300 inline-flex items-center gap-1.5">
              <Filter size={12} /> Zone
            </button>
            <button className="px-2.5 py-1.5 text-[12px] border border-neutral-200 rounded-md text-neutral-700 bg-white hover:border-neutral-300 inline-flex items-center gap-1.5">
              <SlidersHorizontal size={12} /> Score
            </button>
            <div className="ml-auto inline-flex items-center gap-1">
              <button className="px-2.5 py-1.5 text-[12px] border border-neutral-200 rounded-md text-neutral-700 bg-white hover:border-neutral-300 inline-flex items-center gap-1.5">
                <TableProperties size={12} /> Colonnes
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="px-3 pt-2 flex items-center gap-1 border-b border-neutral-100">
            {TABS.map(t => {
              const count = MARKETING_PROPERTIES.filter(p => t.predicate(p)).length;
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`px-3 py-1.5 text-[12px] font-medium rounded-t -mb-px border-b-2 ${
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

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-[12px]">
              <thead className="bg-neutral-50/50">
                <tr className="text-left text-[10.5px] font-semibold uppercase tracking-wide text-neutral-500 border-b border-neutral-100">
                  <th className="py-2 pl-3 w-8">
                    <input type="checkbox" checked={allSelected} onChange={toggleAll} className="accent-propsight-600" />
                  </th>
                  <th className="py-2 px-2 font-semibold">Bien</th>
                  <th className="py-2 px-2 font-semibold">Statut</th>
                  <th className="py-2 px-2 font-semibold">Score</th>
                  <th className="py-2 px-2 font-semibold">Canaux</th>
                  <th className="py-2 px-2 text-right font-semibold">Vues 30j</th>
                  <th className="py-2 px-2 text-right font-semibold">Leads 30j</th>
                  <th className="py-2 px-2 text-right font-semibold">CPL</th>
                  <th className="py-2 px-2 font-semibold">Dernière diffusion</th>
                  <th className="py-2 px-2 font-semibold">Action recommandée</th>
                  <th className="py-2 pr-3 font-semibold">Agent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {rows.map(p => (
                  <tr key={p.id} className="hover:bg-neutral-50/60 group cursor-pointer">
                    <td className="py-2.5 pl-3">
                      <input
                        type="checkbox"
                        checked={selected.has(p.id)}
                        onChange={() => toggleOne(p.id)}
                        className="accent-propsight-600"
                        onClick={e => e.stopPropagation()}
                      />
                    </td>
                    <td className="py-2.5 px-2">
                      <div className="font-medium text-neutral-900">{p.bienLabel}</div>
                      <div className="text-[10.5px] text-neutral-500 mt-0.5">{p.bienSubtitle}</div>
                      <div className="text-[10.5px] text-neutral-400">{p.ville}</div>
                    </td>
                    <td className="py-2.5 px-2">
                      <StatusPill status={p.status} />
                    </td>
                    <td className="py-2.5 px-2">
                      <ScoreGauge value={p.publishabilityScore} />
                      {p.missing.length > 0 && (
                        <div className="text-[10px] text-neutral-400 mt-1 truncate max-w-[140px]">
                          Manque : {p.missing.join(', ')}
                        </div>
                      )}
                    </td>
                    <td className="py-2.5 px-2">
                      <div className="flex items-center gap-1 flex-wrap max-w-[120px]">
                        {p.channels.length === 0 && <span className="text-[10.5px] text-neutral-400">aucun</span>}
                        {p.channels.map(c => (
                          <ChannelBadge key={c} channel={c} />
                        ))}
                      </div>
                    </td>
                    <td className="py-2.5 px-2 text-right tabular-nums text-neutral-700">{formatNumber(p.views30d)}</td>
                    <td className="py-2.5 px-2 text-right tabular-nums font-medium text-neutral-900">{p.leads30d}</td>
                    <td className="py-2.5 px-2 text-right tabular-nums text-neutral-700">
                      {p.cpl ? `${p.cpl.toFixed(1)} €` : '—'}
                    </td>
                    <td className="py-2.5 px-2 text-[11.5px] text-neutral-600">{p.lastDiffusion}</td>
                    <td className="py-2.5 px-2">
                      {p.recommendation && (
                        <button className="text-[11.5px] font-medium text-propsight-700 hover:text-propsight-900">
                          {p.recommendation}
                        </button>
                      )}
                    </td>
                    <td className="py-2.5 pr-3">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-propsight-100 text-propsight-700 text-[10.5px] font-semibold">
                        {p.responsable.split(' ').map(s => s[0]).join('')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {rows.length === 0 && (
              <div className="py-12 text-center text-[12px] text-neutral-500">Aucun bien ne correspond à ces filtres.</div>
            )}
          </div>
          <div className="px-3 py-2 text-[11px] text-neutral-500 border-t border-neutral-100 flex items-center justify-between">
            <span>{rows.length} biens affichés</span>
            <span>1 – {rows.length} sur {MARKETING_PROPERTIES.length}</span>
          </div>
        </div>
      </div>
    </StudioLayout>
  );
};

export default MarketingAnnoncesPage;
