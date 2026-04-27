import React, { useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Download, ChevronDown, MoreHorizontal, ChevronLeft, ChevronRight, Clock, Zap, TrendingUp, Repeat, Target, BarChart3, Users } from 'lucide-react';
import HeaderProspection from '../components/shared/HeaderProspection';
import KpiRow from '../components/shared/KpiRow';
import BarreSticky, { viewIcons } from '../components/shared/BarreSticky';
import DrawerSignal from '../components/drawer-signal/DrawerSignal';
import ModaleCreerLead from '../components/modales/ModaleCreerLead';
import ModaleCreerAction from '../components/modales/ModaleCreerAction';
import ModaleCreerAlerte from '../components/modales/ModaleCreerAlerte';
import EmptyState from '../components/shared/EmptyState';
import AssigneDropdown from '../components/shared/AssigneDropdown';
import { BadgeStatut, BadgeScore } from '../components/shared/Badges';
import { getDvfKpis } from '../utils/kpis';
import { labelDvf, formatDate, formatEuro, formatPrixM2, formatDureeDetention } from '../utils/formatters';
import { useProspectionStore, useFilteredSignals, SignalFiltersState } from '../hooks/useProspection';
import { SignalDVF, SignalProspection, MetaSignalRadar, DVFSignalType } from '../types';
import { useToast } from '../components/shared/Toast';

const DVF_ICONS: Record<DVFSignalType, React.ComponentType<any>> = {
  vente_proche: Target,
  detention_longue: Clock,
  revente_rapide: Zap,
  cycle_revente_regulier: Repeat,
  zone_rotation_forte: TrendingUp,
  ecart_marche: BarChart3,
  comparables_denses: Users,
};

const DVF_COLORS: Record<DVFSignalType, { bg: string; text: string }> = {
  vente_proche: { bg: 'bg-blue-50', text: 'text-blue-700' },
  detention_longue: { bg: 'bg-slate-100', text: 'text-slate-700' },
  revente_rapide: { bg: 'bg-rose-50', text: 'text-rose-700' },
  cycle_revente_regulier: { bg: 'bg-orange-50', text: 'text-orange-700' },
  zone_rotation_forte: { bg: 'bg-rose-50', text: 'text-rose-700' },
  ecart_marche: { bg: 'bg-amber-50', text: 'text-amber-700' },
  comparables_denses: { bg: 'bg-emerald-50', text: 'text-emerald-700' },
};

const TypeSignalBadge: React.FC<{ type: DVFSignalType }> = ({ type }) => {
  const cfg = DVF_COLORS[type];
  const Icon = DVF_ICONS[type];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-medium ${cfg.bg} ${cfg.text}`}>
      <Icon size={11} />
      {labelDvf[type]}
    </span>
  );
};

const presets = [
  { key: 'tous', label: 'Tous les presets' },
  { key: 'detention_longue', label: 'Détention longue' },
  { key: 'revente_rapide', label: 'Revente rapide' },
  { key: 'zones_actives', label: 'Zones actives' },
  { key: 'comparables', label: 'Comparables exploitables' },
  { key: 'non_traites', label: 'Non traités' },
  { key: 'haute_priorite', label: 'Haute priorité' },
];

const sortOptions = [
  { key: 'score_desc', label: 'Score décroissant' },
  { key: 'score_asc', label: 'Score croissant' },
  { key: 'date_vente_desc', label: 'Date vente récente' },
  { key: 'date_detection_desc', label: 'Date détection' },
];

const periods = [
  { key: '30j', label: '30 jours' },
  { key: '90j', label: '90 jours' },
  { key: '12m', label: '12 mois' },
  { key: '24m', label: '24 mois' },
];

const viewOptions: { key: 'table' | 'carte' | 'split'; label: string; icon?: React.ReactNode }[] = [
  { key: 'table', label: 'Table', icon: viewIcons.table },
  { key: 'carte', label: 'Carte', icon: viewIcons.carte },
  { key: 'split', label: 'Split', icon: viewIcons.split },
];

type ModaleOpen = null | 'lead' | 'action' | 'alerte';

const SignauxDvfPage: React.FC = () => {
  const { state, setStatusDvf, setAssigneeDvf } = useProspectionStore();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const toast = useToast();

  const [filters, setFilters] = useState<SignalFiltersState>({
    search: searchParams.get('recherche') || '',
    preset: searchParams.get('preset') || 'tous',
    period: searchParams.get('periode') || '90j',
    sort: 'score_desc',
    showIgnored: searchParams.get('show_ignored') === '1',
  });
  const [view, setView] = useState<'table' | 'carte' | 'split'>('table');
  const [page, setPage] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(searchParams.get('signal'));
  const [modale, setModale] = useState<ModaleOpen>(null);

  const signalsAll = state.dvf;
  const filtered = useFilteredSignals(signalsAll, filters);
  const kpis = getDvfKpis(signalsAll);
  const selected = useMemo(() => signalsAll.find(s => s.signal_id === selectedId) || null, [signalsAll, selectedId]);

  const pageSize = 10;
  const paginated = filtered.slice(page * pageSize, (page + 1) * pageSize);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  const updateParam = (key: string, val?: string) => {
    const next = new URLSearchParams(searchParams);
    if (val) next.set(key, val);
    else next.delete(key);
    setSearchParams(next, { replace: true });
  };

  const openSignal = (id: string) => {
    setSelectedId(id);
    updateParam('signal', id);
  };
  const closeDrawer = () => {
    setSelectedId(null);
    updateParam('signal', undefined);
  };

  const handleLeadConfirm = () => {
    if (selected) setStatusDvf(selected.signal_id, 'converti_lead');
    setModale(null);
    toast.push({
      message: 'Lead créé avec succès.',
      type: 'success',
      actionLabel: 'Voir dans Mon activité',
      onAction: () => navigate('/app/activite/leads'),
    });
  };
  const handleActionConfirm = () => {
    if (selected) setStatusDvf(selected.signal_id, 'converti_action');
    setModale(null);
    toast.push({ message: 'Action créée.', type: 'success' });
  };
  const handleAlerteConfirm = () => {
    setModale(null);
    toast.push({ message: 'Alerte créée.', type: 'success' });
  };
  const handleIgnorer = (s: SignalProspection | MetaSignalRadar) => {
    if ('signal_id' in s) {
      const prev = s.status;
      setStatusDvf(s.signal_id, 'ignore');
      closeDrawer();
      toast.push({
        message: 'Signal ignoré.',
        undoLabel: 'Annuler',
        onUndo: () => setStatusDvf(s.signal_id, prev),
      });
    }
  };
  const handleSuivre = (s: SignalProspection | MetaSignalRadar) => {
    if ('signal_id' in s) setStatusDvf(s.signal_id, 'suivi');
    toast.push({ message: 'Ajouté à vos biens suivis.', type: 'success' });
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <HeaderProspection
        breadcrumb="Signaux DVF"
        title="Signaux DVF"
        subtitle="Détectez les patterns de mutation exploitables pour votre prospection."
        actions={
          <>
            <button className="h-8 px-3 rounded-md border border-slate-200 bg-white text-[12px] text-slate-700 hover:bg-slate-50 inline-flex items-center gap-1.5">
              <Download size={13} />
              Exporter
            </button>
            <button className="h-8 px-3 rounded-md border border-slate-200 bg-white text-[12px] text-slate-700 hover:bg-slate-50 inline-flex items-center gap-1.5">
              Vues enregistrées
              <ChevronDown size={12} />
            </button>
          </>
        }
      />

      <KpiRow kpis={kpis} />

      <BarreSticky
        searchPlaceholder="Rechercher une adresse, une zone, un vendeur…"
        searchValue={filters.search}
        onSearchChange={v => setFilters(f => ({ ...f, search: v }))}
        presets={presets}
        activePreset={filters.preset}
        onPresetChange={v => {
          setFilters(f => ({ ...f, preset: v }));
          setPage(0);
          updateParam('preset', v === 'tous' ? undefined : v);
        }}
        activeFiltersCount={0}
        onFiltersClick={() => toast.push({ message: 'Drawer filtres — à venir.', type: 'info' })}
        sortOptions={sortOptions}
        sortValue={filters.sort}
        onSortChange={v => setFilters(f => ({ ...f, sort: v }))}
        periods={periods}
        periodValue={filters.period}
        onPeriodChange={v => {
          setFilters(f => ({ ...f, period: v }));
          updateParam('periode', v === '90j' ? undefined : v);
        }}
        viewOptions={viewOptions}
        viewValue={view}
        onViewChange={setView}
        onColumnsClick={() => toast.push({ message: 'Configuration des colonnes — à venir.', type: 'info' })}
        showIgnored={filters.showIgnored}
        onShowIgnoredChange={v => {
          setFilters(f => ({ ...f, showIgnored: v }));
          updateParam('show_ignored', v ? '1' : undefined);
        }}
      />

      <div className="flex-1 overflow-auto">
        {filtered.length === 0 ? (
          <EmptyState
            kind="no_filter_result"
            onPrimary={() => setFilters(f => ({ ...f, search: '', preset: 'tous' }))}
            onSecondary={() => setFilters(f => ({ ...f, period: '24m' }))}
          />
        ) : (
          <div className={view === 'carte' ? 'hidden' : ''}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="w-8 px-3 py-2">
                      <input type="checkbox" className="h-3.5 w-3.5 rounded border-slate-300 text-propsight-600" />
                    </th>
                    <th className="text-left px-3 py-2 text-[11px] font-medium text-slate-600 uppercase tracking-wide">Type signal</th>
                    <th className="text-left px-3 py-2 text-[11px] font-medium text-slate-600 uppercase tracking-wide">Adresse / Zone</th>
                    <th className="text-left px-3 py-2 text-[11px] font-medium text-slate-600 uppercase tracking-wide">Date vente</th>
                    <th className="text-left px-3 py-2 text-[11px] font-medium text-slate-600 uppercase tracking-wide">Prix vente</th>
                    <th className="text-left px-3 py-2 text-[11px] font-medium text-slate-600 uppercase tracking-wide">Prix / m²</th>
                    <th className="text-left px-3 py-2 text-[11px] font-medium text-slate-600 uppercase tracking-wide">Durée détention</th>
                    <th className="text-left px-3 py-2 text-[11px] font-medium text-slate-600 uppercase tracking-wide">Score</th>
                    <th className="text-left px-3 py-2 text-[11px] font-medium text-slate-600 uppercase tracking-wide">Statut</th>
                    <th className="text-left px-3 py-2 text-[11px] font-medium text-slate-600 uppercase tracking-wide">Assigné</th>
                    <th className="w-10 px-3 py-2" />
                  </tr>
                </thead>
                <tbody>
                  {paginated.map(s => (
                    <SignalRowDvf
                      key={s.signal_id}
                      signal={s}
                      onClick={() => openSignal(s.signal_id)}
                      onAssign={uid => setAssigneeDvf(s.signal_id, uid)}
                      selected={selectedId === s.signal_id}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between px-5 py-3 border-t border-slate-200 bg-white">
              <span className="text-[11px] text-slate-500">
                {page * pageSize + 1}-{Math.min((page + 1) * pageSize, filtered.length)} sur {filtered.length} signaux
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage(p => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="h-7 w-7 inline-flex items-center justify-center rounded border border-slate-200 hover:bg-slate-50 disabled:opacity-40"
                >
                  <ChevronLeft size={13} />
                </button>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i)}
                    className={`h-7 min-w-[28px] px-2 rounded text-[11px] ${
                      page === i ? 'bg-propsight-600 text-white font-medium' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                  disabled={page >= totalPages - 1}
                  className="h-7 w-7 inline-flex items-center justify-center rounded border border-slate-200 hover:bg-slate-50 disabled:opacity-40"
                >
                  <ChevronRight size={13} />
                </button>
              </div>
            </div>
          </div>
        )}

        {view === 'carte' && (
          <div className="p-5">
            <div className="h-[480px] rounded-lg border border-slate-200 bg-gradient-to-br from-slate-50 to-blue-50/30 flex items-center justify-center">
              <p className="text-sm text-slate-500 italic">Vue Carte DVF — implémentée dans Radar. Cliquez sur Radar pour voir la carto complète.</p>
            </div>
          </div>
        )}
      </div>

      <DrawerSignal
        signal={selected}
        onClose={closeDrawer}
        onCreerLead={() => setModale('lead')}
        onCreerAction={() => setModale('action')}
        onCreerAlerte={() => setModale('alerte')}
        onIgnorer={handleIgnorer}
        onSuivre={handleSuivre}
        onAssign={(id, uid) => setAssigneeDvf(id, uid)}
      />

      <ModaleCreerLead open={modale === 'lead'} onClose={() => setModale(null)} signal={selected} onConfirm={handleLeadConfirm} />
      <ModaleCreerAction open={modale === 'action'} onClose={() => setModale(null)} signal={selected} onConfirm={handleActionConfirm} />
      <ModaleCreerAlerte open={modale === 'alerte'} onClose={() => setModale(null)} signal={selected} onConfirm={handleAlerteConfirm} />
    </div>
  );
};

// ---- Row ----------------------------------------------------------------
interface RowProps {
  signal: SignalDVF;
  selected?: boolean;
  onClick: () => void;
  onAssign: (userId: string | undefined) => void;
}

const SignalRowDvf: React.FC<RowProps> = ({ signal, selected, onClick, onAssign }) => {
  return (
    <tr
      onClick={onClick}
      className={`border-b border-slate-100 cursor-pointer transition-colors ${
        selected ? 'bg-propsight-50/40' : 'hover:bg-slate-50/50'
      }`}
    >
      <td className="px-3 py-2.5" onClick={e => e.stopPropagation()}>
        <input type="checkbox" className="h-3.5 w-3.5 rounded border-slate-300 text-propsight-600" />
      </td>
      <td className="px-3 py-2.5">
        <TypeSignalBadge type={signal.type} />
      </td>
      <td className="px-3 py-2.5">
        <div className="text-[12px] font-medium text-slate-900">{signal.adresse || signal.ville}</div>
        <div className="text-[10px] text-slate-500">
          {signal.code_postal} {signal.ville}
          {signal.dvf_payload.surface_m2 && ` · ${signal.dvf_payload.surface_m2} m²`}
        </div>
      </td>
      <td className="px-3 py-2.5 text-[12px] text-slate-700 tabular-nums">{formatDate(signal.dvf_payload.date_vente)}</td>
      <td className="px-3 py-2.5 text-[12px] text-slate-900 font-medium tabular-nums">{formatEuro(signal.dvf_payload.prix_vente)}</td>
      <td className="px-3 py-2.5 text-[12px] text-slate-700 tabular-nums">{formatPrixM2(signal.dvf_payload.prix_m2)}</td>
      <td className="px-3 py-2.5 text-[12px] text-slate-700">
        {formatDureeDetention(signal.dvf_payload.duree_detention_ans, signal.dvf_payload.duree_detention_mois)}
      </td>
      <td className="px-3 py-2.5">
        <BadgeScore score={signal.score} size="sm" />
      </td>
      <td className="px-3 py-2.5">
        <BadgeStatut status={signal.status} />
      </td>
      <td className="px-3 py-2.5" onClick={e => e.stopPropagation()}>
        <AssigneDropdown assigneeId={signal.assignee_id} onChange={onAssign} />
      </td>
      <td className="px-3 py-2.5" onClick={e => e.stopPropagation()}>
        <button className="h-7 w-7 inline-flex items-center justify-center rounded hover:bg-slate-100">
          <MoreHorizontal size={14} className="text-slate-400" />
        </button>
      </td>
    </tr>
  );
};

export default SignauxDvfPage;
