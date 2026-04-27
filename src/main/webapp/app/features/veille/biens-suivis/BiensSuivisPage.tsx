import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Plus,
  Bell,
  Download,
  Heart,
  Activity,
  TrendingDown,
  Target,
  Table as TableIcon,
  LayoutGrid,
  Map as MapIcon,
  MoreHorizontal,
  Bell as BellIcon,
  UserPlus,
  Layers,
  Briefcase,
} from 'lucide-react';
import {
  PageHeader,
  KpiRow,
  KpiTileConfig,
  FiltersBar,
  SearchInput,
  FilterDropdown,
  PrimaryButton,
  SecondaryButton,
  ViewToggle,
  EmptyState,
  DpeBadge,
  AnnonceStatusBadge,
  ScoreInteretBadge,
  FreshnessLabel,
  AssigneeAvatar,
  PortailBadge,
} from '../components/shared/primitives';
import { BIENS_SUIVIS } from '../_mocks/biens-suivis';
import { BienSuivi } from '../types';
import DrawerBienSuivi from '../components/drawer/DrawerBienSuivi';
import BiensSuivisMap from './BiensSuivisMap';
import BiensSuivisCards from './BiensSuivisCards';
import { findUser } from '../_mocks/users';
import { fmtEuro, fmtEuroM2, fmtPct, fmtSurface } from '../utils/format';
import { useToast } from '../components/shared/Toast';

type View = 'table' | 'cards' | 'map';

const BiensSuivisPage: React.FC = () => {
  const [params, setParams] = useSearchParams();
  const [biens, setBiens] = useState<BienSuivi[]>(BIENS_SUIVIS);
  const [view, setView] = useState<View>('table');
  const [search, setSearch] = useState('');
  const [filterSource, setFilterSource] = useState('all');
  const [filterVille, setFilterVille] = useState('all');
  const [filterVariation, setFilterVariation] = useState('all');
  const [filterDpe, setFilterDpe] = useState('all');
  const [filterStatut, setFilterStatut] = useState('all');
  const [selected, setSelected] = useState<string[]>([]);
  const toast = useToast();

  const drawerId = params.get('bien');
  const currentBien = biens.find(b => b.id === drawerId);

  const openDrawer = (id: string) =>
    setParams(p => {
      const np = new URLSearchParams(p);
      np.set('bien', id);
      return np;
    });
  const closeDrawer = () => {
    setParams(p => {
      const np = new URLSearchParams(p);
      np.delete('bien');
      return np;
    });
  };

  const filtered = useMemo(() => {
    return biens.filter(b => {
      if (search) {
        const s = search.toLowerCase();
        if (!b.adresse.toLowerCase().includes(s) && !b.ville.toLowerCase().includes(s)) return false;
      }
      if (filterSource !== 'all' && b.source !== filterSource) return false;
      if (filterVille !== 'all' && !b.ville.toLowerCase().includes(filterVille.toLowerCase())) return false;
      if (filterDpe !== 'all' && b.dpe !== filterDpe) return false;
      if (filterStatut !== 'all' && b.statut_annonce !== filterStatut) return false;
      if (filterVariation === 'baisse' && (b.variation_pct ?? 0) >= 0) return false;
      if (filterVariation === 'hausse' && (b.variation_pct ?? 0) <= 0) return false;
      if (filterVariation === 'stable' && (b.variation_pct ?? 0) !== 0) return false;
      return true;
    });
  }, [biens, search, filterSource, filterVille, filterVariation, filterDpe, filterStatut]);

  const counts = {
    total: biens.length,
    changements: biens.filter(b => b.last_event_at && Date.now() - new Date(b.last_event_at).getTime() < 7 * 86_400_000).length,
    baisses: biens.filter(b => b.last_event_type === 'baisse_prix').length,
    opportunites: biens.filter(b => b.score_interet >= 75).length,
  };

  const kpis: KpiTileConfig[] = [
    {
      id: 'total',
      icon: <Heart size={15} />,
      iconBg: 'bg-rose-100',
      iconFg: 'text-rose-600',
      label: 'Biens suivis',
      value: counts.total,
      delta: '+12 vs 7 derniers jours',
      deltaTone: 'up',
    },
    {
      id: 'chang',
      icon: <Activity size={15} />,
      iconBg: 'bg-propsight-100',
      iconFg: 'text-propsight-600',
      label: 'Changements 7j',
      value: counts.changements,
      delta: '+3 vs 7 derniers jours',
      deltaTone: 'up',
    },
    {
      id: 'baisses',
      icon: <TrendingDown size={15} />,
      iconBg: 'bg-amber-100',
      iconFg: 'text-amber-600',
      label: 'Baisses de prix',
      value: counts.baisses,
      delta: '+2 vs 7 derniers jours',
      deltaTone: 'up',
      active: filterVariation === 'baisse',
      onClick: () => setFilterVariation(filterVariation === 'baisse' ? 'all' : 'baisse'),
    },
    {
      id: 'opp',
      icon: <Target size={15} />,
      iconBg: 'bg-emerald-100',
      iconFg: 'text-emerald-600',
      label: 'Opportunités',
      value: counts.opportunites,
      delta: '+2 vs 7 derniers jours',
      deltaTone: 'up',
    },
  ];

  const retirer = (id: string) => {
    setBiens(prev => prev.filter(b => b.id !== id));
    toast.push({ message: 'Bien retiré du suivi', kind: 'info' });
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <PageHeader
        title="Biens suivis"
        count={counts.total}
        subtitle="Tous les biens sauvegardés depuis vos annonces, signaux, analyses et dossiers."
        actions={
          <>
            <SecondaryButton onClick={() => toast.push({ message: 'Alerte groupée créée (démo)' })}>
              <Bell size={12} />
              Créer alerte groupée
            </SecondaryButton>
            <SecondaryButton onClick={() => toast.push({ message: 'Export CSV (démo)' })}>
              <Download size={12} />
              Exporter
            </SecondaryButton>
            <PrimaryButton onClick={() => toast.push({ message: 'Ajouter un bien (démo)' })}>
              <Plus size={13} />
              Ajouter un bien
            </PrimaryButton>
          </>
        }
      />

      <FiltersBar
        right={
          <ViewToggle
            value={view}
            onChange={v => setView(v as View)}
            options={[
              { value: 'table', label: 'Table', icon: <TableIcon size={11} /> },
              { value: 'cards', label: 'Cards', icon: <LayoutGrid size={11} /> },
              { value: 'map', label: 'Carte', icon: <MapIcon size={11} /> },
            ]}
          />
        }
      >
        <SearchInput placeholder="Rechercher un bien…" value={search} onChange={setSearch} width="w-[240px]" />
        <FilterDropdown
          label="Source"
          value={filterSource}
          onChange={setFilterSource}
          options={[
            { value: 'all', label: 'Toutes' },
            { value: 'annonces', label: 'Annonces' },
            { value: 'dvf', label: 'DVF' },
            { value: 'prospection', label: 'Prospection' },
            { value: 'investissement', label: 'Investissement' },
            { value: 'estimation', label: 'Estimation' },
          ]}
        />
        <FilterDropdown
          label="Ville"
          value={filterVille}
          onChange={setFilterVille}
          options={[
            { value: 'all', label: 'Toutes' },
            { value: 'paris', label: 'Paris' },
            { value: 'boulogne', label: 'Boulogne' },
            { value: 'lyon', label: 'Lyon' },
            { value: 'versailles', label: 'Versailles' },
          ]}
        />
        <FilterDropdown
          label="Variation"
          value={filterVariation}
          onChange={setFilterVariation}
          options={[
            { value: 'all', label: 'Toutes' },
            { value: 'baisse', label: 'Baisses' },
            { value: 'hausse', label: 'Hausses' },
            { value: 'stable', label: 'Stables' },
          ]}
        />
        <FilterDropdown
          label="DPE"
          value={filterDpe}
          onChange={setFilterDpe}
          options={[
            { value: 'all', label: 'Tous' },
            ...['A', 'B', 'C', 'D', 'E', 'F', 'G'].map(c => ({ value: c, label: c })),
          ]}
        />
        <FilterDropdown
          label="Statut"
          value={filterStatut}
          onChange={setFilterStatut}
          options={[
            { value: 'all', label: 'Tous' },
            { value: 'Actif', label: 'Actif' },
            { value: 'Baisse', label: 'Baisse' },
            { value: 'Remis en ligne', label: 'Remis en ligne' },
          ]}
        />
      </FiltersBar>

      <KpiRow tiles={kpis} />

      {/* Bulk */}
      {selected.length > 0 && (
        <div className="px-4 py-2 bg-propsight-50 border-b border-propsight-200 flex items-center gap-2 flex-shrink-0">
          <span className="text-[12px] font-medium text-propsight-900">{selected.length} sélectionné(s)</span>
          <button
            onClick={() => toast.push({ message: `Comparatif de ${selected.length} biens (démo)` })}
            className="h-7 px-2.5 rounded text-[11px] text-slate-700 hover:bg-white"
            disabled={selected.length > 4}
          >
            Comparer (max 4)
          </button>
          <button
            onClick={() => toast.push({ message: 'Alerte groupée (démo)' })}
            className="h-7 px-2.5 rounded text-[11px] text-slate-700 hover:bg-white"
          >
            Créer alerte groupée
          </button>
          <button
            onClick={() => {
              setBiens(prev => prev.filter(b => !selected.includes(b.id)));
              setSelected([]);
              toast.push({ message: 'Biens retirés du suivi', kind: 'success' });
            }}
            className="h-7 px-2.5 rounded text-[11px] text-rose-600 hover:bg-white"
          >
            Retirer du suivi
          </button>
          <button onClick={() => setSelected([])} className="ml-auto h-7 px-2.5 rounded text-[11px] text-slate-500 hover:bg-white">
            Annuler
          </button>
        </div>
      )}

      {/* Content */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<Heart size={20} />}
          title="Aucun bien suivi"
          description="Cliquez sur ♡ depuis une annonce, un signal ou une analyse pour commencer."
          primary={{ label: 'Parcourir les annonces', onClick: () => (window.location.href = '/app/biens/annonces') }}
          secondary={{ label: 'Explorer la prospection', onClick: () => (window.location.href = '/app/prospection/radar') }}
        />
      ) : view === 'table' ? (
        <BiensSuivisTable
          rows={filtered}
          onRowClick={openDrawer}
          highlightId={drawerId}
          selected={selected}
          onSelectChange={setSelected}
        />
      ) : view === 'cards' ? (
        <BiensSuivisCards rows={filtered} onRowClick={openDrawer} />
      ) : (
        <BiensSuivisMap rows={filtered} onRowClick={openDrawer} />
      )}

      {currentBien && (
        <DrawerBienSuivi
          bien={currentBien}
          onClose={closeDrawer}
          onRetirer={() => {
            retirer(currentBien.id);
            closeDrawer();
          }}
        />
      )}
    </div>
  );
};

/* ========== TABLE ========== */

interface TableProps {
  rows: BienSuivi[];
  onRowClick: (id: string) => void;
  highlightId: string | null;
  selected: string[];
  onSelectChange: (ids: string[]) => void;
}

const BiensSuivisTable: React.FC<TableProps> = ({ rows, onRowClick, highlightId, selected, onSelectChange }) => {
  const toggleSel = (id: string) => {
    if (selected.includes(id)) onSelectChange(selected.filter(x => x !== id));
    else onSelectChange([...selected, id]);
  };

  return (
    <div className="flex-1 overflow-auto bg-white">
      <table className="w-full border-collapse">
        <thead className="sticky top-0 z-10 bg-slate-50 border-b border-slate-200">
          <tr className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
            <th className="w-10 text-center py-2" />
            <th className="text-left px-2 py-2">Bien</th>
            <th className="text-left px-2 py-2">Source</th>
            <th className="text-left px-2 py-2">Ville</th>
            <th className="text-right px-2 py-2">Prix actuel</th>
            <th className="text-right px-2 py-2">Variation</th>
            <th className="text-right px-2 py-2">Surface</th>
            <th className="text-center px-2 py-2">DPE</th>
            <th className="text-left px-2 py-2">Statut</th>
            <th className="text-left px-2 py-2">Dernier événement</th>
            <th className="text-left px-2 py-2">Score</th>
            <th className="text-center px-2 py-2">Alertes</th>
            <th className="text-left px-2 py-2">Liens</th>
            <th className="text-center px-2 py-2">Assigné</th>
            <th className="w-8" />
          </tr>
        </thead>
        <tbody>
          {rows.map(b => {
            const assignee = findUser(b.assigned_to);
            const isSel = selected.includes(b.id);
            const isHl = b.id === highlightId;
            return (
              <tr
                key={b.id}
                onClick={() => onRowClick(b.id)}
                className={`border-b border-slate-100 cursor-pointer transition-colors ${
                  isHl ? 'bg-propsight-50/60' : isSel ? 'bg-propsight-50/30' : 'hover:bg-slate-50'
                }`}
              >
                <td className="text-center py-2" onClick={e => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={isSel}
                    onChange={() => toggleSel(b.id)}
                    className="h-3.5 w-3.5 rounded border-slate-300 text-propsight-600"
                  />
                </td>
                <td className="px-2 py-2.5">
                  <div className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded overflow-hidden bg-slate-200 flex-shrink-0">
                      {b.photo_url ? (
                        <img src={b.photo_url} alt={b.adresse} className="h-full w-full object-cover" />
                      ) : null}
                    </div>
                    <div className="min-w-0">
                      <div className="text-[12px] font-medium text-slate-900">
                        {b.type_bien} {b.pieces ? `T${b.pieces}` : ''}
                      </div>
                      <div className="text-[10.5px] text-slate-500 truncate max-w-[180px]">{b.adresse}</div>
                    </div>
                  </div>
                </td>
                <td className="px-2 py-2.5">
                  {b.source_portail ? <PortailBadge portail={b.source_portail} /> : <span className="text-[11px] text-slate-500">{b.source_label}</span>}
                </td>
                <td className="px-2 py-2.5">
                  <span className="text-[11.5px] text-slate-700">{b.ville}</span>
                </td>
                <td className="px-2 py-2.5 text-right">
                  <div className="text-[12.5px] font-semibold text-slate-900 tabular-nums">{fmtEuro(b.prix_actuel)}</div>
                  <div className="text-[10.5px] text-slate-500 tabular-nums">{fmtEuroM2(b.prix_m2)}</div>
                </td>
                <td className="px-2 py-2.5 text-right">
                  {b.variation_eur !== undefined && b.variation_eur !== 0 ? (
                    <>
                      <div
                        className={`text-[11.5px] font-semibold tabular-nums ${
                          b.variation_eur < 0 ? 'text-rose-600' : 'text-emerald-600'
                        }`}
                      >
                        {b.variation_eur > 0 ? '+' : ''}
                        {b.variation_eur.toLocaleString('fr-FR')} €
                      </div>
                      <div
                        className={`text-[10.5px] tabular-nums ${
                          (b.variation_pct ?? 0) < 0 ? 'text-rose-600' : 'text-emerald-600'
                        }`}
                      >
                        {fmtPct(b.variation_pct ?? 0)}
                      </div>
                    </>
                  ) : (
                    <span className="text-[11px] text-slate-400">0 %</span>
                  )}
                </td>
                <td className="px-2 py-2.5 text-right">
                  <span className="text-[11.5px] text-slate-700 tabular-nums">{fmtSurface(b.surface)}</span>
                </td>
                <td className="px-2 py-2.5 text-center">
                  <DpeBadge classe={b.dpe} size="sm" />
                </td>
                <td className="px-2 py-2.5">
                  <AnnonceStatusBadge status={b.statut_annonce} />
                </td>
                <td className="px-2 py-2.5">
                  {b.last_event_at ? (
                    <>
                      <div className="text-[11px] text-slate-700">{b.last_event_label ?? '—'}</div>
                      <FreshnessLabel iso={b.last_event_at} />
                    </>
                  ) : (
                    <span className="text-[11px] text-slate-400">—</span>
                  )}
                </td>
                <td className="px-2 py-2.5">
                  <ScoreInteretBadge score={b.score_interet} label={b.score_label} />
                </td>
                <td className="px-2 py-2.5 text-center">
                  {b.alertes_actives.length > 0 ? (
                    <span className="inline-flex items-center gap-1 text-[11px] text-slate-700">
                      <BellIcon size={11} className="text-propsight-500" />
                      {b.alertes_actives.length}
                    </span>
                  ) : (
                    <span className="text-[11px] text-slate-400">—</span>
                  )}
                </td>
                <td className="px-2 py-2.5">
                  <div className="flex items-center gap-1.5">
                    {b.estimation_valeur && (
                      <span title="Estimation">
                        <Layers size={12} className="text-slate-500" />
                      </span>
                    )}
                    {b.analyse_tri_pct && (
                      <span title="Analyse invest">
                        <Activity size={12} className="text-slate-500" />
                      </span>
                    )}
                    {b.leads_count > 0 && (
                      <span title="Leads" className="inline-flex items-center gap-0.5 text-[10px] text-slate-500">
                        <UserPlus size={11} />
                        {b.leads_count}
                      </span>
                    )}
                    {b.dossier_name && (
                      <span title="Dossier">
                        <Briefcase size={12} className="text-slate-500" />
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-2 py-2.5 text-center">
                  <AssigneeAvatar user={assignee} />
                </td>
                <td className="px-1 py-2.5">
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      onRowClick(b.id);
                    }}
                    className="h-6 w-6 inline-flex items-center justify-center rounded hover:bg-slate-100 text-slate-400"
                  >
                    <MoreHorizontal size={13} />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default BiensSuivisPage;
