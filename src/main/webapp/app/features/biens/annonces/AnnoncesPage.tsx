import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { LayoutGrid, List, Map, Bookmark, Bell } from 'lucide-react';
import BiensLayout from '../layout/BiensLayout';
import KpiBar from '../shared/KpiBar';
import ViewToggle from '../shared/ViewToggle';
import FiltersBar from '../shared/FiltersBar';
import CardBien from '../shared/CardBien';
import TableBiens from '../shared/TableBiens';
import DrawerBien from '../shared/DrawerBien';
import FicheBienModal from '../shared/FicheBienModal';
import { MOCK_BIENS, ANNONCES_KPIS } from '../_mocks/biens';
import { Bien, PeriodeKpi, VueBien } from '../types';

type Tab = 'toutes' | 'nouvelles' | 'baisse' | 'remise' | 'favoris' | 'depuis_visite';

const TABS: { id: Tab; label: string }[] = [
  { id: 'toutes', label: 'Toutes les annonces' },
  { id: 'nouvelles', label: 'Nouvelles' },
  { id: 'baisse', label: 'Baisse de prix' },
  { id: 'remise', label: 'Remises en ligne' },
  { id: 'favoris', label: 'Favoris (veille)' },
  { id: 'depuis_visite', label: 'Depuis ma dernière visite' },
];

const AnnoncesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [biens, setBiens] = useState<Bien[]>(MOCK_BIENS);
  const [tab, setTab] = useState<Tab>('toutes');
  const [vue, setVue] = useState<VueBien>('cards');
  const [search, setSearch] = useState('');
  const [period, setPeriod] = useState<PeriodeKpi>('7j');
  const [drawerBienId, setDrawerBienId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const modalBienId = searchParams.get('bien');

  const biensAvecAnnonces = useMemo(
    () => biens.filter(b => b.annonces.length > 0),
    [biens],
  );

  const filtered = useMemo(() => {
    let list = biensAvecAnnonces;
    switch (tab) {
      case 'nouvelles': list = list.filter(b => b.flag === 'nouveau'); break;
      case 'baisse': list = list.filter(b => b.flag === 'baisse_prix' || b.annonces.some(a => a.statut === 'baisse_prix')); break;
      case 'remise': list = list.filter(b => b.flag === 'remise_en_ligne' || b.annonces.some(a => a.statut === 'remise_en_ligne')); break;
      case 'favoris': list = list.filter(b => b.suivi); break;
      case 'depuis_visite': list = list.slice(0, 8); break;
      case 'toutes':
      default: break;
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(b =>
        b.adresse.toLowerCase().includes(q) ||
        b.ville.toLowerCase().includes(q) ||
        b.annonces.some(a => a.source.toLowerCase().includes(q)),
      );
    }
    return list;
  }, [biensAvecAnnonces, tab, search]);

  const toggleFavorite = (id: string) =>
    setBiens(prev => prev.map(b => b.id === id ? { ...b, suivi: !b.suivi } : b));

  const openDrawer = (b: Bien) => setDrawerBienId(b.id);
  const closeDrawer = () => setDrawerBienId(null);
  const openFiche = (id: string) => { setDrawerBienId(null); setSearchParams({ bien: id }); };
  const closeFiche = () => { const n = new URLSearchParams(searchParams); n.delete('bien'); setSearchParams(n); };

  const drawerBien = drawerBienId ? biens.find(b => b.id === drawerBienId) || null : null;
  const modalBien = modalBienId ? biens.find(b => b.id === modalBienId) || null : null;

  const toggleSelect = (id: string) =>
    setSelectedIds(prev => { const n = new Set(prev); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  const toggleAll = () =>
    setSelectedIds(prev => prev.size === filtered.length ? new Set() : new Set(filtered.map(b => b.id)));

  return (
    <BiensLayout
      title="Annonces"
      breadcrumbCurrent="Annonces"
    >
      <div className="flex h-full min-h-0">
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          {/* Tabs */}
          <div className="px-6 border-b border-slate-200 bg-white flex-shrink-0">
            <div className="flex items-center gap-0 overflow-x-auto">
              {TABS.map(t => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`py-3 mr-7 text-[13px] font-medium transition-colors border-b-2 -mb-px whitespace-nowrap ${
                    tab === t.id ? 'text-propsight-700 border-propsight-500' : 'text-slate-500 border-transparent hover:text-slate-800'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* KPI + Filters */}
          <div className="flex-shrink-0 px-6 py-4 space-y-3">
            <KpiBar
              period={period}
              periodOptions={['24h', '7j', '30j', '90j']}
              onPeriodChange={setPeriod}
              items={[
                {
                  label: 'Annonces trouvées',
                  value: ANNONCES_KPIS.annonces_trouvees.toLocaleString('fr-FR'),
                  sub: 'Dans vos critères',
                  highlight: true,
                },
                {
                  label: 'Nouveaux biens',
                  value: `+${ANNONCES_KPIS.nouveaux_biens}`,
                  accent: 'green',
                  sub: 'depuis 24h',
                },
                {
                  label: 'Baisses de prix',
                  value: ANNONCES_KPIS.baisses_prix,
                  accent: 'amber',
                  sub: 'depuis 7j',
                },
                {
                  label: 'Biens expirés',
                  value: ANNONCES_KPIS.biens_expires,
                  accent: 'red',
                  sub: 'depuis 7j',
                },
              ]}
            />

            <FiltersBar
              search={search}
              searchPlaceholder="Rechercher dans les annonces…"
              onSearchChange={setSearch}
              filters={[
                { id: 'loc', label: 'Localisation' },
                { id: 'type', label: 'Type de bien' },
                { id: 'prix', label: 'Prix' },
                { id: 'surface', label: 'Surface' },
              ]}
              onMoreFiltersClick={() => {}}
            />

            <div className="flex items-center justify-between gap-2">
              <ViewToggle
                current={vue}
                onChange={v => setVue(v as VueBien)}
                views={[
                  { id: 'cards', label: 'Cards', icon: <LayoutGrid size={13} /> },
                  { id: 'liste', label: 'Liste', icon: <List size={13} /> },
                  { id: 'carte', label: 'Carte', icon: <Map size={13} /> },
                ]}
              />
              <div className="flex items-center gap-2">
                <button className="h-8 px-3 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-[12px] font-medium text-slate-700 flex items-center gap-1.5">
                  <Bookmark size={12} /> Sauvegarder recherche
                </button>
                <button className="h-8 px-3 rounded-md bg-propsight-600 hover:bg-propsight-700 text-white text-[12px] font-medium flex items-center gap-1.5">
                  <Bell size={12} /> Créer une alerte
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-h-0 overflow-auto px-6 pb-6">
            {vue === 'cards' && (
              <div className="grid grid-cols-3 gap-4">
                {filtered.map(b => (
                  <CardBien key={b.id} bien={b} onClick={openDrawer} onToggleFavorite={toggleFavorite} />
                ))}
                {filtered.length === 0 && (
                  <div className="col-span-3 text-center py-16 text-slate-400 text-sm">
                    Aucune annonce ne correspond à vos filtres.
                  </div>
                )}
              </div>
            )}

            {vue === 'liste' && (
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

            {vue === 'carte' && (
              <div className="h-full rounded-lg border border-slate-200 bg-slate-100 flex items-center justify-center">
                <div className="text-center text-slate-500">
                  <Map size={32} className="mx-auto mb-3 text-slate-300" />
                  <p className="text-sm font-medium">Vue carte Annonces</p>
                  <p className="text-xs text-slate-400 mt-1">Mapbox GL — branchement fin juillet 2026</p>
                </div>
              </div>
            )}
          </div>

          {/* Pagination */}
          <div className="px-6 py-3 border-t border-slate-200 bg-white flex items-center justify-between flex-shrink-0">
            <span className="text-[12px] text-slate-500 tabular-nums">
              1–{Math.min(18, filtered.length)} sur {ANNONCES_KPIS.annonces_trouvees.toLocaleString('fr-FR')} annonces
            </span>
            <div className="flex items-center gap-1">
              <button className="w-7 h-7 rounded border border-slate-200 hover:bg-slate-50 text-slate-500 flex items-center justify-center text-[12px]">‹</button>
              <button className="w-7 h-7 rounded bg-slate-900 text-white text-[12px] font-medium">1</button>
              <button className="w-7 h-7 rounded hover:bg-slate-50 text-slate-500 text-[12px]">2</button>
              <button className="w-7 h-7 rounded hover:bg-slate-50 text-slate-500 text-[12px]">3</button>
              <button className="w-7 h-7 rounded hover:bg-slate-50 text-slate-500 text-[12px]">4</button>
              <span className="px-1 text-slate-400 text-[12px]">…</span>
              <button className="w-7 h-7 rounded hover:bg-slate-50 text-slate-500 text-[12px]">103</button>
              <button className="w-7 h-7 rounded border border-slate-200 hover:bg-slate-50 text-slate-500 text-[12px]">›</button>
            </div>
            <button className="h-7 px-2.5 rounded border border-slate-200 hover:bg-slate-50 text-[12px] text-slate-600 flex items-center gap-1.5">
              18 / page <span className="text-slate-400">▾</span>
            </button>
          </div>
        </div>

        {drawerBien && (
          <div className="flex-shrink-0">
            <DrawerBien
              bien={drawerBien}
              sourceContext="annonces"
              onClose={closeDrawer}
              onToggleFavorite={toggleFavorite}
              onOpenFicheComplete={openFiche}
            />
          </div>
        )}
      </div>

      {modalBien && (
        <FicheBienModal bien={modalBien} onClose={closeFiche} onToggleFavorite={toggleFavorite} />
      )}
    </BiensLayout>
  );
};

export default AnnoncesPage;
