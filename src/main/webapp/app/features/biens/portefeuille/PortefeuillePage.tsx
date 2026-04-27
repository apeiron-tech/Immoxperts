import React, { useMemo, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { LayoutGrid, List, Map, Plus, MoreHorizontal, Download, Upload, Columns3 } from 'lucide-react';
import BiensLayout from '../layout/BiensLayout';
import KpiBar from '../shared/KpiBar';
import ViewToggle from '../shared/ViewToggle';
import FiltersBar from '../shared/FiltersBar';
import TableBiens from '../shared/TableBiens';
import CardBien from '../shared/CardBien';
import DrawerBien from '../shared/DrawerBien';
import FicheBienModal from '../shared/FicheBienModal';
import MultiSelectBar from '../shared/MultiSelectBar';
import { MOCK_BIENS, PORTEFEUILLE_KPIS } from '../_mocks/biens';
import { Bien, PeriodeKpi, VueBien } from '../types';
import { formatEuros } from '../utils/format';

const PortefeuillePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [biens, setBiens] = useState<Bien[]>(MOCK_BIENS);
  const [vue, setVue] = useState<VueBien>('table');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [drawerBienId, setDrawerBienId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [period, setPeriod] = useState<PeriodeKpi>('30j');
  const [moreFiltersCount] = useState(0);

  const modalBienId = searchParams.get('bien');

  const biensPortefeuille = useMemo(
    () => biens.filter(b => b.source_principale === 'portefeuille'),
    [biens],
  );

  const filtered = useMemo(() => {
    if (!search.trim()) return biensPortefeuille;
    const q = search.toLowerCase();
    return biensPortefeuille.filter(b =>
      b.adresse.toLowerCase().includes(q) ||
      b.ville.toLowerCase().includes(q) ||
      (b.proprietaire_nom || '').toLowerCase().includes(q) ||
      (b.proprietaire_lead_ref || '').toLowerCase().includes(q),
    );
  }, [biensPortefeuille, search]);

  const toggleFavorite = (id: string) =>
    setBiens(prev => prev.map(b => b.id === id ? { ...b, suivi: !b.suivi } : b));

  const toggleSelect = (id: string) =>
    setSelectedIds(prev => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });

  const toggleAll = () =>
    setSelectedIds(prev => prev.size === filtered.length ? new Set() : new Set(filtered.map(b => b.id)));

  const openDrawer = (b: Bien) => setDrawerBienId(b.id);
  const closeDrawer = () => setDrawerBienId(null);
  const openFiche = (id: string) => {
    setDrawerBienId(null);
    setSearchParams({ bien: id });
  };
  const closeFiche = () => {
    const next = new URLSearchParams(searchParams);
    next.delete('bien');
    setSearchParams(next);
  };

  const drawerBien = drawerBienId ? biens.find(b => b.id === drawerBienId) || null : null;
  const modalBien = modalBienId ? biens.find(b => b.id === modalBienId) || null : null;

  return (
    <BiensLayout
      title="Portefeuille"
      breadcrumbCurrent="Portefeuille"
      headerRight={
        <div className="flex items-center gap-2">
          <ViewToggle
            current={vue}
            onChange={v => setVue(v as VueBien)}
            views={[
              { id: 'table', label: 'Table', icon: <List size={13} /> },
              { id: 'cards', label: 'Cards', icon: <LayoutGrid size={13} /> },
              { id: 'carte', label: 'Carte', icon: <Map size={13} /> },
            ]}
          />
        </div>
      }
    >
      <div className="flex h-full min-h-0">
        {/* Main */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          {/* KPI bar */}
          <div className="px-6 py-4 flex-shrink-0">
            <KpiBar
              period={period}
              periodOptions={['7j', '30j', '90j', '12m']}
              onPeriodChange={setPeriod}
              items={[
                {
                  label: 'Mandats actifs',
                  value: PORTEFEUILLE_KPIS.mandats_actifs.value,
                  delta: { value: `${PORTEFEUILLE_KPIS.mandats_actifs.delta}%`, direction: 'up' },
                  sub: 'vs mois précédent',
                  highlight: true,
                },
                {
                  label: 'Nouveaux mandats',
                  value: PORTEFEUILLE_KPIS.nouveaux_mandats.value,
                  delta: { value: `${PORTEFEUILLE_KPIS.nouveaux_mandats.delta}%`, direction: 'up' },
                  sub: 'vs mois précédent',
                },
                {
                  label: 'Estimations réalisées',
                  value: PORTEFEUILLE_KPIS.estimations_realisees.value,
                  delta: { value: `${PORTEFEUILLE_KPIS.estimations_realisees.delta}%`, direction: 'up' },
                  sub: 'vs mois précédent',
                },
                {
                  label: 'Valeur mandats actifs',
                  value: formatEuros(PORTEFEUILLE_KPIS.valeur_mandats_actifs.value, true),
                  delta: { value: `${PORTEFEUILLE_KPIS.valeur_mandats_actifs.delta}%`, direction: 'up' },
                  sub: 'estimation cumulée',
                },
              ]}
            />
          </div>

          {/* Filters + actions */}
          <div className="px-6 pb-3 flex-shrink-0">
            <FiltersBar
              search={search}
              searchPlaceholder="Rechercher un bien…"
              onSearchChange={setSearch}
              filters={[
                { id: 'statut', label: 'Statut' },
                { id: 'type', label: 'Type de bien' },
                { id: 'responsable', label: 'Responsable' },
                { id: 'proprio', label: 'Propriétaire / Lead' },
              ]}
              onFilterClick={() => {}}
              onMoreFiltersClick={() => {}}
              moreFiltersCount={moreFiltersCount}
              rightActions={
                <>
                  <button className="h-8 px-3 rounded-md bg-propsight-600 hover:bg-propsight-700 text-white text-[12px] font-medium flex items-center gap-1.5 transition-colors">
                    <Plus size={12} /> Ajouter un bien
                  </button>
                  <button className="h-8 w-8 rounded-md border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center">
                    <MoreHorizontal size={13} className="text-slate-500" />
                  </button>
                </>
              }
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-h-0 overflow-hidden px-6 pb-6">
            {vue === 'table' && (
              <TableBiens
                biens={filtered}
                selectedIds={selectedIds}
                onToggleSelect={toggleSelect}
                onToggleAll={toggleAll}
                onToggleFavorite={toggleFavorite}
                onRowClick={openDrawer}
                activeId={drawerBienId}
              />
            )}
            {vue === 'cards' && (
              <div className="grid grid-cols-3 gap-4 overflow-auto h-full pb-2">
                {filtered.map(b => (
                  <CardBien key={b.id} bien={b} onClick={openDrawer} onToggleFavorite={toggleFavorite} />
                ))}
              </div>
            )}
            {vue === 'carte' && (
              <div className="h-full rounded-lg border border-slate-200 bg-slate-100 relative overflow-hidden flex items-center justify-center">
                <div className="text-center text-slate-500">
                  <Map size={32} className="mx-auto mb-3 text-slate-300" />
                  <p className="text-sm font-medium">Vue carte Portefeuille</p>
                  <p className="text-xs text-slate-400 mt-1">Mapbox GL — branchement fin juillet 2026</p>
                </div>
              </div>
            )}
          </div>

          {/* Pagination */}
          <div className="px-6 py-3 border-t border-slate-200 bg-white flex items-center justify-between flex-shrink-0">
            <span className="text-[12px] text-slate-500 tabular-nums">
              1–{Math.min(10, filtered.length)} sur {filtered.length} biens
            </span>
            <div className="flex items-center gap-1">
              <button className="w-7 h-7 rounded border border-slate-200 hover:bg-slate-50 text-slate-500 flex items-center justify-center text-[12px]">‹</button>
              <button className="w-7 h-7 rounded bg-slate-900 text-white text-[12px] font-medium flex items-center justify-center">1</button>
              <button className="w-7 h-7 rounded hover:bg-slate-50 text-slate-500 text-[12px] flex items-center justify-center">2</button>
              <button className="w-7 h-7 rounded hover:bg-slate-50 text-slate-500 text-[12px] flex items-center justify-center">3</button>
              <span className="px-1 text-slate-400 text-[12px]">…</span>
              <button className="w-7 h-7 rounded hover:bg-slate-50 text-slate-500 text-[12px] flex items-center justify-center">13</button>
              <button className="w-7 h-7 rounded border border-slate-200 hover:bg-slate-50 text-slate-500 flex items-center justify-center text-[12px]">›</button>
            </div>
            <button className="h-7 px-2.5 rounded border border-slate-200 hover:bg-slate-50 text-[12px] text-slate-600 flex items-center gap-1.5">
              10 / page <span className="text-slate-400">▾</span>
            </button>
          </div>
        </div>

        {/* Drawer */}
        {drawerBien && (
          <div className="flex-shrink-0">
            <DrawerBien
              bien={drawerBien}
              sourceContext="portefeuille"
              onClose={closeDrawer}
              onToggleFavorite={toggleFavorite}
              onOpenFicheComplete={openFiche}
            />
          </div>
        )}
      </div>

      <MultiSelectBar
        count={selectedIds.size}
        onClear={() => setSelectedIds(new Set())}
        onExport={() => console.warn('[Portefeuille] Export', [...selectedIds])}
        onAssign={() => console.warn('[Portefeuille] Assign', [...selectedIds])}
        onCreateAction={() => console.warn('[Portefeuille] Action', [...selectedIds])}
        onCompare={() => console.warn('[Portefeuille] Compare', [...selectedIds])}
      />

      {modalBien && (
        <FicheBienModal
          bien={modalBien}
          onClose={closeFiche}
          onToggleFavorite={toggleFavorite}
        />
      )}
    </BiensLayout>
  );
};

export default PortefeuillePage;
