import React, { useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Download, ChevronDown, MoreHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import HeaderProspection from '../components/shared/HeaderProspection';
import KpiRow from '../components/shared/KpiRow';
import BarreSticky, { viewIcons } from '../components/shared/BarreSticky';
import DrawerSignal from '../components/drawer-signal/DrawerSignal';
import ModaleCreerLead from '../components/modales/ModaleCreerLead';
import ModaleCreerAction from '../components/modales/ModaleCreerAction';
import ModaleCreerAlerte from '../components/modales/ModaleCreerAlerte';
import EmptyState from '../components/shared/EmptyState';
import AssigneDropdown from '../components/shared/AssigneDropdown';
import AvatarUser from '../components/shared/AvatarUser';
import { BadgeStatut, BadgeScore, ClasseDPEBadge, PotentielDots, niveauFromScore } from '../components/shared/Badges';
import { getDpeKpis } from '../utils/kpis';
import { getCtaRecommande } from '../utils/ctaRecommande';
import { useProspectionStore, useFilteredSignals, SignalFiltersState } from '../hooks/useProspection';
import { SignalDPE, SignalProspection, MetaSignalRadar } from '../types';
import { getUserById } from '../_mocks/users';
import { useToast } from '../components/shared/Toast';

const DPE_SCENARIO_COLORS: Record<string, { bg: string; text: string; dot: string; label: string }> = {
  vendeur_probable: { bg: 'bg-propsight-50', text: 'text-propsight-700', dot: 'bg-propsight-500', label: 'Vendeur probable' },
  bailleur_a_arbitrer: { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500', label: 'Bailleur à arbitrer' },
  potentiel_renovation: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500', label: 'Potentiel rénovation' },
  opportunite_investisseur: { bg: 'bg-rose-50', text: 'text-rose-700', dot: 'bg-rose-500', label: 'Opportunité investisseur' },
  passoire_thermique: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500', label: 'Passoire thermique' },
  risque_locatif: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500', label: 'Risque locatif' },
  poche_passoires: { bg: 'bg-orange-50', text: 'text-orange-700', dot: 'bg-orange-500', label: 'Poche passoires' },
  revalorisation_apres_travaux: {
    bg: 'bg-teal-50',
    text: 'text-teal-700',
    dot: 'bg-teal-500',
    label: 'Revalorisation post-travaux',
  },
};

const ScenarioBadge: React.FC<{ type: string }> = ({ type }) => {
  const cfg = DPE_SCENARIO_COLORS[type] || DPE_SCENARIO_COLORS.vendeur_probable;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-medium ${cfg.bg} ${cfg.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
};

const presets = [
  { key: 'tous', label: 'Tous les presets' },
  { key: 'vendeurs_probables', label: 'Vendeurs probables' },
  { key: 'bailleurs_arbitrer', label: 'Bailleurs à arbitrer' },
  { key: 'potentiel_renovation', label: 'Potentiel rénovation' },
  { key: 'opportunites_invest', label: 'Opportunités investisseur' },
  { key: 'passoires', label: 'Passoires thermiques' },
  { key: 'non_traites', label: 'Non traités' },
  { key: 'haute_priorite', label: 'Haute priorité' },
];

const sortOptions = [
  { key: 'pertinence_desc', label: 'Pertinence' },
  { key: 'score_desc', label: 'Score décroissant' },
  { key: 'score_asc', label: 'Score croissant' },
  { key: 'classe_dpe_desc', label: 'Classe DPE' },
  { key: 'date_detection_desc', label: 'Date détection' },
];

const periods = [
  { key: '14j', label: '14 jours' },
  { key: '30j', label: '30 jours' },
  { key: '90j', label: '90 jours' },
];

const viewOptions: { key: 'table' | 'carte' | 'split'; label: string; icon?: React.ReactNode }[] = [
  { key: 'table', label: 'Table', icon: viewIcons.table },
  { key: 'carte', label: 'Carte', icon: viewIcons.carte },
  { key: 'split', label: 'Split', icon: viewIcons.split },
];

type ModaleOpen = null | 'lead' | 'action' | 'alerte';

const SignauxDpePage: React.FC = () => {
  const { state, setStatusDpe, setAssigneeDpe } = useProspectionStore();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const toast = useToast();

  const [filters, setFilters] = useState<SignalFiltersState>({
    search: searchParams.get('recherche') || '',
    preset: searchParams.get('preset') || 'tous',
    period: searchParams.get('periode') || '30j',
    sort: 'pertinence_desc',
    showIgnored: searchParams.get('show_ignored') === '1',
  });
  const [view, setView] = useState<'table' | 'carte' | 'split'>('table');
  const [page, setPage] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(searchParams.get('signal'));
  const [modale, setModale] = useState<ModaleOpen>(null);

  const signalsAll = state.dpe;
  const filtered = useFilteredSignals(signalsAll, filters);
  const kpis = getDpeKpis(signalsAll);

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

  const handleCreerLead = (s: SignalProspection | MetaSignalRadar) => {
    setModale('lead');
  };
  const handleLeadConfirm = () => {
    if (selected) setStatusDpe(selected.signal_id, 'converti_lead');
    setModale(null);
    toast.push({
      message: 'Lead créé avec succès.',
      type: 'success',
      actionLabel: 'Voir dans Mon activité',
      onAction: () => navigate('/app/activite/leads'),
    });
  };

  const handleActionConfirm = () => {
    if (selected) setStatusDpe(selected.signal_id, 'converti_action');
    setModale(null);
    toast.push({
      message: 'Action créée avec succès.',
      type: 'success',
      actionLabel: 'Voir dans Mon activité',
      onAction: () => navigate('/app/activite/pilotage'),
    });
  };

  const handleAlerteConfirm = () => {
    setModale(null);
    toast.push({ message: 'Alerte créée.', type: 'success' });
  };

  const handleIgnorer = (s: SignalProspection | MetaSignalRadar) => {
    if ('signal_id' in s) {
      const prev = s.status;
      setStatusDpe(s.signal_id, 'ignore');
      closeDrawer();
      toast.push({
        message: 'Signal ignoré.',
        undoLabel: 'Annuler',
        onUndo: () => setStatusDpe(s.signal_id, prev),
      });
    }
  };

  const handleSuivre = (s: SignalProspection | MetaSignalRadar) => {
    if ('signal_id' in s) setStatusDpe(s.signal_id, 'suivi');
    toast.push({ message: 'Ajouté à vos biens suivis.', type: 'success' });
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <HeaderProspection
        breadcrumb="Signaux DPE"
        title="Signaux DPE"
        subtitle="Repérez les biens et zones où la performance énergétique crée une opportunité commerciale."
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

      <KpiRow kpis={kpis} activeKey={filters.preset !== 'tous' ? filters.preset : undefined} />

      <BarreSticky
        searchPlaceholder="Rechercher une adresse, une zone, un propriétaire…"
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
        onFiltersClick={() => toast.push({ message: 'Drawer filtres avancés — à venir en démo complète.', type: 'info' })}
        sortOptions={sortOptions}
        sortValue={filters.sort}
        onSortChange={v => setFilters(f => ({ ...f, sort: v }))}
        periods={periods}
        periodValue={filters.period}
        onPeriodChange={v => {
          setFilters(f => ({ ...f, period: v }));
          updateParam('periode', v === '30j' ? undefined : v);
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
            onSecondary={() => setFilters(f => ({ ...f, period: '90j' }))}
          />
        ) : (
          <div className={`${view === 'carte' ? 'hidden' : ''}`}>
            {view === 'split' && (
              <div className="px-5 py-3 border-b border-slate-200 text-[11px] text-slate-500 italic bg-amber-50/50">
                Vue Split : table condensée + carte (mode démo — passer à Table pour la vue dense).
              </div>
            )}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="w-8 px-3 py-2">
                      <input type="checkbox" className="h-3.5 w-3.5 rounded border-slate-300 text-propsight-600" />
                    </th>
                    <th className="text-left px-3 py-2 text-[11px] font-medium text-slate-600 uppercase tracking-wide">Scénario</th>
                    <th className="text-left px-3 py-2 text-[11px] font-medium text-slate-600 uppercase tracking-wide">Adresse / Zone</th>
                    <th className="text-left px-3 py-2 text-[11px] font-medium text-slate-600 uppercase tracking-wide">Pourquoi ça remonte</th>
                    <th className="text-left px-3 py-2 text-[11px] font-medium text-slate-600 uppercase tracking-wide">Classe</th>
                    <th className="text-left px-3 py-2 text-[11px] font-medium text-slate-600 uppercase tracking-wide">Potentiel</th>
                    <th className="text-left px-3 py-2 text-[11px] font-medium text-slate-600 uppercase tracking-wide">CTA recommandé</th>
                    <th className="text-left px-3 py-2 text-[11px] font-medium text-slate-600 uppercase tracking-wide">Score</th>
                    <th className="text-left px-3 py-2 text-[11px] font-medium text-slate-600 uppercase tracking-wide">Statut</th>
                    <th className="text-left px-3 py-2 text-[11px] font-medium text-slate-600 uppercase tracking-wide">Assigné</th>
                    <th className="w-10 px-3 py-2" />
                  </tr>
                </thead>
                <tbody>
                  {paginated.map(s => (
                    <SignalRowDpe
                      key={s.signal_id}
                      signal={s}
                      onClick={() => openSignal(s.signal_id)}
                      onAssign={uid => setAssigneeDpe(s.signal_id, uid)}
                      onCreerLead={() => {
                        setSelectedId(s.signal_id);
                        setModale('lead');
                      }}
                      onEstimer={() => {
                        const cta = getCtaRecommande(s);
                        if (cta.estimationPath) navigate(`${cta.estimationPath}?signal_id=${s.signal_id}`);
                      }}
                      selected={selectedId === s.signal_id}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-5 py-3 border-t border-slate-200 bg-white">
              <span className="text-[11px] text-slate-500">
                {page * pageSize + 1}-{Math.min((page + 1) * pageSize, filtered.length)} sur {filtered.length} résultats
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
            <div className="h-[480px] rounded-lg border border-slate-200 bg-gradient-to-br from-slate-50 to-propsight-50/30 flex items-center justify-center">
              <p className="text-sm text-slate-500 italic">
                Vue Carte DPE — implémentée dans Radar (Mapbox GL). Cliquez sur Radar pour voir la carto complète.
              </p>
            </div>
          </div>
        )}
      </div>

      <DrawerSignal
        signal={selected}
        onClose={closeDrawer}
        onCreerLead={handleCreerLead}
        onCreerAction={() => setModale('action')}
        onCreerAlerte={() => setModale('alerte')}
        onIgnorer={handleIgnorer}
        onSuivre={handleSuivre}
        onAssign={(id, uid) => setAssigneeDpe(id, uid)}
      />

      <ModaleCreerLead open={modale === 'lead'} onClose={() => setModale(null)} signal={selected} onConfirm={handleLeadConfirm} />
      <ModaleCreerAction open={modale === 'action'} onClose={() => setModale(null)} signal={selected} onConfirm={handleActionConfirm} />
      <ModaleCreerAlerte open={modale === 'alerte'} onClose={() => setModale(null)} signal={selected} onConfirm={handleAlerteConfirm} />
    </div>
  );
};

// ---- Row ----------------------------------------------------------------
interface RowProps {
  signal: SignalDPE;
  selected?: boolean;
  onClick: () => void;
  onAssign: (userId: string | undefined) => void;
  onCreerLead: () => void;
  onEstimer: () => void;
}

const SignalRowDpe: React.FC<RowProps> = ({ signal, selected, onClick, onAssign, onCreerLead, onEstimer }) => {
  const assignee = getUserById(signal.assignee_id);
  const cta = getCtaRecommande(signal);
  const [menuOpen, setMenuOpen] = React.useState(false);

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
        <ScenarioBadge type={signal.type} />
      </td>
      <td className="px-3 py-2.5">
        <div className="text-[12px] font-medium text-slate-900">{signal.adresse || signal.ville}</div>
        <div className="text-[10px] text-slate-500">
          {signal.code_postal} {signal.ville} · {signal.dpe_payload.type_bien === 'maison' ? 'Maison' : 'Appartement'}
          {signal.dpe_payload.surface_m2 ? ` · ${signal.dpe_payload.surface_m2} m²` : ''}
        </div>
      </td>
      <td className="px-3 py-2.5 max-w-[240px]">
        <div className="text-[12px] text-slate-700 truncate">{signal.explanation_short}</div>
      </td>
      <td className="px-3 py-2.5">
        {signal.dpe_payload.classe_dpe ? (
          <div>
            <ClasseDPEBadge classe={signal.dpe_payload.classe_dpe} />
            {signal.dpe_payload.conso_energie_kwh_m2_an && (
              <div className="text-[10px] text-slate-400 mt-0.5">{signal.dpe_payload.conso_energie_kwh_m2_an} kWh/m²</div>
            )}
          </div>
        ) : (
          '—'
        )}
      </td>
      <td className="px-3 py-2.5">
        <PotentielDots niveau={niveauFromScore(signal.score)} />
      </td>
      <td className="px-3 py-2.5" onClick={e => e.stopPropagation()}>
        <button
          onClick={() => {
            if (cta.primary === 'estimer') onEstimer();
            else onCreerLead();
          }}
          className="h-7 px-2.5 rounded border border-propsight-200 bg-white hover:bg-propsight-50 text-[11px] font-medium text-propsight-700 whitespace-nowrap"
        >
          {cta.label}
        </button>
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

export default SignauxDpePage;
