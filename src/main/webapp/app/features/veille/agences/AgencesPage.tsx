import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Plus,
  Download,
  Eye,
  Building2,
  TrendingDown,
  Map,
  Table as TableIcon,
  LayoutGrid,
  AlertTriangle,
  MoreHorizontal,
  Bookmark,
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
  Pill,
  FreshnessLabel,
  Sparkline,
} from '../components/shared/primitives';
import { AGENCES } from '../_mocks/agences';
import { AgenceConcurrente } from '../types';
import DrawerAgence from '../components/drawer/DrawerAgence';
import ModaleSuivreAgence from './ModaleSuivreAgence';
import DiscoverAgencesDrawer from './DiscoverAgencesDrawer';
import { fmtEuroM2, fmtInt } from '../utils/format';
import { useToast } from '../components/shared/Toast';

type View = 'table' | 'cards' | 'map';

const AgencesPage: React.FC = () => {
  const [params, setParams] = useSearchParams();
  const [agences, setAgences] = useState<AgenceConcurrente[]>(AGENCES);
  const [view, setView] = useState<View>('table');
  const [search, setSearch] = useState('');
  const [filterZone, setFilterZone] = useState('all');
  const [filterStock, setFilterStock] = useState('all');
  const [filterBaisses, setFilterBaisses] = useState('all');
  const [filterPression, setFilterPression] = useState('all');
  const [showSuivre, setShowSuivre] = useState(false);
  const [showDiscover, setShowDiscover] = useState(false);
  const toast = useToast();

  const drawerId = params.get('agence');
  const currentAgence = agences.find(a => a.id === drawerId);

  const openDrawer = (id: string) =>
    setParams(p => {
      const np = new URLSearchParams(p);
      np.set('agence', id);
      return np;
    });
  const closeDrawer = () => {
    setParams(p => {
      const np = new URLSearchParams(p);
      np.delete('agence');
      return np;
    });
  };

  const filtered = useMemo(() => {
    return agences.filter(a => {
      if (search) {
        const s = search.toLowerCase();
        if (
          !a.name.toLowerCase().includes(s) &&
          !a.ville.toLowerCase().includes(s) &&
          !(a.siren ?? '').includes(search)
        )
          return false;
      }
      if (filterZone !== 'all' && !a.zones.some(z => z.label.toLowerCase().includes(filterZone.toLowerCase()))) return false;
      if (filterStock === 'low' && a.stock_actif > 50) return false;
      if (filterStock === 'high' && a.stock_actif < 100) return false;
      if (filterBaisses === 'high' && a.baisses_prix_30d < 3) return false;
      if (filterPression === 'yes' && !a.has_mandat_simple_sous_pression) return false;
      return true;
    });
  }, [agences, search, filterZone, filterStock, filterBaisses, filterPression]);

  const counts = {
    total: agences.length,
    nouvelles: agences.reduce((s, a) => s + a.nouvelles_annonces_7d, 0),
    baisses: agences.reduce((s, a) => s + a.baisses_prix_30d, 0),
    zones: new Set(agences.flatMap(a => a.zones.map(z => z.zone_id))).size,
  };

  const kpis: KpiTileConfig[] = [
    {
      id: 'total',
      icon: <Building2 size={15} />,
      iconBg: 'bg-propsight-100',
      iconFg: 'text-propsight-600',
      label: 'Agences suivies',
      value: counts.total,
      delta: '+2 vs 30 derniers jours',
      deltaTone: 'up',
    },
    {
      id: 'nouv',
      icon: <Eye size={15} />,
      iconBg: 'bg-sky-100',
      iconFg: 'text-sky-600',
      label: 'Nouvelles annonces 7j',
      value: counts.nouvelles,
      delta: '+15 vs 7 derniers jours',
      deltaTone: 'up',
    },
    {
      id: 'baisses',
      icon: <TrendingDown size={15} />,
      iconBg: 'bg-amber-100',
      iconFg: 'text-amber-600',
      label: 'Baisses de prix 30j',
      value: counts.baisses,
      delta: '+3 vs 30 derniers jours',
      deltaTone: 'up',
    },
    {
      id: 'zones',
      icon: <Map size={15} />,
      iconBg: 'bg-emerald-100',
      iconFg: 'text-emerald-600',
      label: 'Zones en concurrence',
      value: counts.zones,
      delta: '+1 vs 7 derniers jours',
      deltaTone: 'up',
    },
  ];

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <PageHeader
        title="Agences concurrentes"
        count={`${counts.total} suivies`}
        subtitle="Surveillez les agences actives sur vos zones et leurs mouvements d'annonces."
        actions={
          <>
            <SecondaryButton onClick={() => setShowDiscover(true)}>
              <Eye size={12} />
              Découvrir agences actives
            </SecondaryButton>
            <SecondaryButton onClick={() => toast.push({ message: 'Export CSV (démo)' })}>
              <Download size={12} />
              Exporter
            </SecondaryButton>
            <PrimaryButton onClick={() => setShowSuivre(true)}>
              <Plus size={13} />
              Suivre une agence
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
              { value: 'map', label: 'Carte', icon: <Map size={11} /> },
            ]}
          />
        }
      >
        <SearchInput placeholder="Rechercher agence…" value={search} onChange={setSearch} width="w-[240px]" />
        <FilterDropdown
          label="Zone"
          value={filterZone}
          onChange={setFilterZone}
          options={[
            { value: 'all', label: 'Toutes' },
            { value: 'paris', label: 'Paris' },
            { value: 'boulogne', label: 'Boulogne' },
            { value: 'lyon', label: 'Lyon' },
            { value: 'bordeaux', label: 'Bordeaux' },
          ]}
        />
        <FilterDropdown
          label="Stock"
          value={filterStock}
          onChange={setFilterStock}
          options={[
            { value: 'all', label: 'Tous' },
            { value: 'low', label: '< 50' },
            { value: 'high', label: '> 100' },
          ]}
        />
        <FilterDropdown
          label="Baisses"
          value={filterBaisses}
          onChange={setFilterBaisses}
          options={[
            { value: 'all', label: 'Toutes' },
            { value: 'high', label: '≥ 3 / 30j' },
          ]}
        />
        <FilterDropdown
          label="Pression"
          value={filterPression}
          onChange={setFilterPression}
          options={[
            { value: 'all', label: 'Toutes' },
            { value: 'yes', label: 'Mandat sous pression' },
          ]}
        />
      </FiltersBar>

      <KpiRow tiles={kpis} />

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Building2 size={20} />}
          title="Aucune agence"
          description="Suivez les agences actives sur vos zones pour surveiller leurs annonces et parts de marché."
          primary={{ label: 'Suivre une agence', onClick: () => setShowSuivre(true) }}
          secondary={{ label: 'Découvrir les actives', onClick: () => setShowDiscover(true) }}
        />
      ) : view === 'table' ? (
        <AgencesTable rows={filtered} onRowClick={openDrawer} highlightId={drawerId} />
      ) : view === 'cards' ? (
        <AgencesCards rows={filtered} onRowClick={openDrawer} />
      ) : (
        <AgencesMap rows={filtered} onRowClick={openDrawer} />
      )}

      {currentAgence && (
        <DrawerAgence
          agence={currentAgence}
          onClose={closeDrawer}
          onUnfollow={() => {
            setAgences(prev => prev.filter(a => a.id !== currentAgence.id));
            closeDrawer();
          }}
        />
      )}

      {showSuivre && (
        <ModaleSuivreAgence
          onClose={() => setShowSuivre(false)}
          onFollow={ag => {
            setAgences(prev => [ag, ...prev]);
            setShowSuivre(false);
            toast.push({ message: `Agence "${ag.name}" ajoutée au suivi`, kind: 'success' });
          }}
        />
      )}

      {showDiscover && (
        <DiscoverAgencesDrawer
          onClose={() => setShowDiscover(false)}
          onFollow={ag => {
            setAgences(prev => [{ ...ag, followed: true }, ...prev]);
            toast.push({ message: `Agence "${ag.name}" ajoutée`, kind: 'success' });
          }}
        />
      )}
    </div>
  );
};

/* ========== TABLE ========== */

interface TableProps {
  rows: AgenceConcurrente[];
  onRowClick: (id: string) => void;
  highlightId: string | null;
}

const AgencesTable: React.FC<TableProps> = ({ rows, onRowClick, highlightId }) => (
  <div className="flex-1 overflow-auto bg-white">
    <table className="w-full border-collapse">
      <thead className="sticky top-0 z-10 bg-slate-50 border-b border-slate-200">
        <tr className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
          <th className="text-left px-4 py-2">Agence</th>
          <th className="text-left px-2 py-2">Zone principale</th>
          <th className="text-right px-2 py-2">Stock actif</th>
          <th className="text-right px-2 py-2">Nouvelles 7j</th>
          <th className="text-right px-2 py-2">Baisses 30j</th>
          <th className="text-right px-2 py-2">Prix moyen</th>
          <th className="text-right px-2 py-2">Délai moyen</th>
          <th className="text-left px-2 py-2">Zones fortes</th>
          <th className="text-right px-2 py-2">Biens similaires</th>
          <th className="text-right px-2 py-2">Mandats simples</th>
          <th className="text-left px-2 py-2">Dernier mouvement</th>
          <th className="text-left px-2 py-2">Statut suivi</th>
          <th className="w-8" />
        </tr>
      </thead>
      <tbody>
        {rows.map(a => {
          const isHl = a.id === highlightId;
          const spark = Array.from({ length: 7 }, (_, i) => Math.max(0, a.nouvelles_annonces_7d - (6 - i) * 0.8));
          return (
            <tr
              key={a.id}
              onClick={() => onRowClick(a.id)}
              className={`border-b border-slate-100 cursor-pointer transition-colors relative ${
                isHl ? 'bg-propsight-50/60' : 'hover:bg-slate-50'
              }`}
            >
              {a.has_mandat_simple_sous_pression && (
                <td className="absolute left-0 top-0 bottom-0 w-[3px] bg-rose-500 p-0" />
              )}
              <td className="px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <div
                    className="h-8 w-8 rounded-md flex items-center justify-center text-white font-bold text-[11px] flex-shrink-0"
                    style={{ backgroundColor: a.logo_color }}
                  >
                    {a.logo_initials}
                  </div>
                  <div>
                    <div className="text-[12.5px] font-medium text-slate-900">{a.name}</div>
                    {a.has_mandat_simple_sous_pression && (
                      <Pill className="bg-rose-50 text-rose-700 ring-rose-200">
                        <AlertTriangle size={9} />À surveiller
                      </Pill>
                    )}
                  </div>
                </div>
              </td>
              <td className="px-2 py-2.5">
                <span className="text-[11.5px] text-slate-700">{a.zone_principale}</span>
              </td>
              <td className="px-2 py-2.5 text-right text-[12px] font-semibold text-slate-900 tabular-nums">{fmtInt(a.stock_actif)}</td>
              <td className="px-2 py-2.5 text-right">
                <div className="inline-flex items-center gap-1.5">
                  <span className="text-[11.5px] font-medium text-slate-800 tabular-nums">{a.nouvelles_annonces_7d}</span>
                  <Sparkline data={spark} color="#7C3AED" />
                </div>
              </td>
              <td className="px-2 py-2.5 text-right text-[11.5px] text-slate-700 tabular-nums">{a.baisses_prix_30d}</td>
              <td className="px-2 py-2.5 text-right text-[11.5px] text-slate-700 tabular-nums">
                {a.prix_moyen_m2 ? fmtEuroM2(a.prix_moyen_m2) : '—'}
              </td>
              <td className="px-2 py-2.5 text-right text-[11.5px] text-slate-700 tabular-nums">
                {a.delai_moyen_jours ? `${a.delai_moyen_jours} j` : '—'}
              </td>
              <td className="px-2 py-2.5">
                <div className="flex items-center gap-1 flex-wrap">
                  {a.zones
                    .filter(z => z.strength !== 'faible')
                    .slice(0, 3)
                    .map(z => (
                      <Pill key={z.zone_id} className="bg-slate-50 text-slate-700 ring-slate-200">
                        {z.label.replace('Paris ', '')}
                      </Pill>
                    ))}
                  {a.zones.length > 3 && (
                    <Pill className="bg-slate-100 text-slate-500 ring-slate-200">+{a.zones.length - 3}</Pill>
                  )}
                </div>
              </td>
              <td className="px-2 py-2.5 text-right text-[11.5px] text-slate-700 tabular-nums">{a.biens_similaires_count}</td>
              <td className="px-2 py-2.5 text-right text-[11.5px] text-slate-700 tabular-nums">{a.mandats_simples_concurrents_count}</td>
              <td className="px-2 py-2.5">
                {a.last_event_at ? (
                  <>
                    <div className="text-[11px] text-slate-700">{a.last_event_label}</div>
                    <FreshnessLabel iso={a.last_event_at} />
                  </>
                ) : (
                  <span className="text-[11px] text-slate-400">—</span>
                )}
              </td>
              <td className="px-2 py-2.5">
                <Pill
                  className={
                    a.status_suivi === 'Mandat simple sous pression'
                      ? 'bg-rose-50 text-rose-700 ring-rose-200'
                      : a.status_suivi === 'Concurrent détecté'
                        ? 'bg-amber-50 text-amber-700 ring-amber-200'
                        : 'bg-sky-50 text-sky-700 ring-sky-200'
                  }
                >
                  {a.status_suivi}
                </Pill>
              </td>
              <td className="px-1 py-2.5">
                <button
                  onClick={e => {
                    e.stopPropagation();
                    onRowClick(a.id);
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

/* Cards + Map (versions simplifiées) */

const AgencesCards: React.FC<{ rows: AgenceConcurrente[]; onRowClick: (id: string) => void }> = ({ rows, onRowClick }) => (
  <div className="flex-1 overflow-auto bg-slate-50 p-3">
    <div className="grid grid-cols-3 gap-3">
      {rows.map(a => (
        <button
          key={a.id}
          onClick={() => onRowClick(a.id)}
          className={`bg-white rounded-md border p-3 text-left hover:border-propsight-300 hover:shadow-md transition-all ${
            a.has_mandat_simple_sous_pression ? 'border-rose-200' : 'border-slate-200'
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <div
              className="h-10 w-10 rounded-md flex items-center justify-center text-white font-bold text-[13px]"
              style={{ backgroundColor: a.logo_color }}
            >
              {a.logo_initials}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[12.5px] font-semibold text-slate-900 truncate">{a.name}</div>
              <div className="text-[10.5px] text-slate-500">{a.ville}</div>
            </div>
          </div>
          {a.has_mandat_simple_sous_pression && (
            <Pill className="bg-rose-50 text-rose-700 ring-rose-200 mb-2">
              <AlertTriangle size={9} />
              Mandat sous pression
            </Pill>
          )}
          <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-100">
            <Stat label="Stock" value={a.stock_actif} />
            <Stat label="Nouv. 7j" value={a.nouvelles_annonces_7d} />
            <Stat label="Baisses 30j" value={a.baisses_prix_30d} />
            <Stat label="Délai" value={`${a.delai_moyen_jours ?? '—'} j`} />
          </div>
          <div className="flex items-center gap-1 mt-2 flex-wrap">
            {a.zones.slice(0, 3).map(z => (
              <Pill key={z.zone_id} className="bg-slate-50 text-slate-700 ring-slate-200">
                {z.label}
              </Pill>
            ))}
          </div>
        </button>
      ))}
    </div>
  </div>
);

const Stat: React.FC<{ label: string; value: number | string }> = ({ label, value }) => (
  <div>
    <div className="text-[9.5px] text-slate-500 uppercase tracking-wide">{label}</div>
    <div className="text-[13px] font-semibold text-slate-900 tabular-nums">{value}</div>
  </div>
);

const AgencesMap: React.FC<{ rows: AgenceConcurrente[]; onRowClick: (id: string) => void }> = ({ rows, onRowClick }) => {
  const withCoords = rows.filter(r => r.latitude && r.longitude);
  if (withCoords.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-slate-400 text-[12px]">
        Aucune agence avec coordonnées GPS.
      </div>
    );
  }
  const lats = withCoords.map(r => r.latitude ?? 0);
  const lngs = withCoords.map(r => r.longitude ?? 0);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const latRange = maxLat - minLat || 1;
  const lngRange = maxLng - minLng || 1;
  const project = (lat: number, lng: number) => ({
    x: 40 + ((lng - minLng) / lngRange) * 720,
    y: 40 + (1 - (lat - minLat) / latRange) * 400,
  });

  return (
    <div className="flex-1 relative overflow-hidden bg-slate-100">
      <svg viewBox="0 0 800 480" className="w-full h-full">
        <defs>
          <pattern id="carte-ag-grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#E2E8F0" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="800" height="480" fill="url(#carte-ag-grid)" />
        <path d="M 0 300 Q 200 280 400 290 T 800 270" stroke="#BFDBFE" strokeWidth="6" fill="none" opacity="0.7" />
        {withCoords.map(a => {
          const { x, y } = project(a.latitude ?? 0, a.longitude ?? 0);
          return (
            <g
              key={a.id}
              transform={`translate(${x}, ${y})`}
              className="cursor-pointer"
              onClick={() => onRowClick(a.id)}
            >
              <circle r="14" fill={a.logo_color} opacity="0.2" />
              <rect x="-12" y="-12" width="24" height="24" rx="5" fill={a.logo_color} />
              <text y="4" textAnchor="middle" fill="white" fontSize="9" fontWeight="700">
                {a.logo_initials}
              </text>
              {a.has_mandat_simple_sous_pression && (
                <circle cx="10" cy="-10" r="5" fill="#EF4444" stroke="white" strokeWidth="1.5" />
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default AgencesPage;
