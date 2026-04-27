import React, { useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Bell, ChevronDown, Eye, EyeOff, Layers, BookOpen, SlidersHorizontal } from 'lucide-react';
import HeaderProspection from '../components/shared/HeaderProspection';
import KpiRow from '../components/shared/KpiRow';
import BarreSticky, { Dropdown } from '../components/shared/BarreSticky';
import DrawerSignal from '../components/drawer-signal/DrawerSignal';
import ModaleCreerLead from '../components/modales/ModaleCreerLead';
import ModaleCreerAction from '../components/modales/ModaleCreerAction';
import ModaleCreerAlerte from '../components/modales/ModaleCreerAlerte';
import EmptyState from '../components/shared/EmptyState';
import RadarCarte from './RadarCarte';
import CardSignalListe from './CardSignalListe';
import DrawerZone from './DrawerZone';
import { getRadarKpis } from '../utils/kpis';
import { useProspectionStore, useFilteredRadar, SignalFiltersState } from '../hooks/useProspection';
import { zonesRadar } from '../_mocks/zonesRadar';
import { SignalProspection, MetaSignalRadar, ZoneRadar } from '../types';
import { useToast } from '../components/shared/Toast';

const presets = [
  { key: 'tous', label: 'Tous les presets' },
  { key: 'haute_priorite', label: 'Haute priorité' },
  { key: 'mes_zones', label: 'Mes zones' },
  { key: 'annonces_chaudes', label: 'Annonces chaudes' },
  { key: 'detention_longue', label: 'Détention longue' },
  { key: 'passoires', label: 'DPE critiques' },
  { key: 'zones_forte_rotation', label: 'Zones à forte rotation' },
  { key: 'non_traites', label: 'Non traités' },
];

const sortOptions = [
  { key: 'score_desc', label: 'Score décroissant' },
  { key: 'score_asc', label: 'Score croissant' },
  { key: 'date_detection_desc', label: 'Date détection' },
];

const periods = [
  { key: '24h', label: '24 h' },
  { key: '7j', label: '7 jours' },
  { key: '30j', label: '30 jours' },
  { key: '90j', label: '90 jours' },
];

type ModaleOpen = null | 'lead' | 'action' | 'alerte';

interface LayerState {
  annonces: boolean;
  dvf_ponctuel: boolean;
  dvf_territorial: boolean;
  dpe: boolean;
  cadastre: boolean;
  indice: boolean;
}

const RadarPage: React.FC = () => {
  const { state, setStatusRadar, setAssigneeRadar } = useProspectionStore();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const toast = useToast();

  const [filters, setFilters] = useState<SignalFiltersState>({
    search: searchParams.get('recherche') || '',
    preset: searchParams.get('preset') || 'tous',
    period: searchParams.get('periode') || '30j',
    sort: 'score_desc',
    showIgnored: searchParams.get('show_ignored') === '1',
  });
  const [layers, setLayers] = useState<LayerState>({
    annonces: true,
    dvf_ponctuel: true,
    dvf_territorial: true,
    dpe: true,
    cadastre: false,
    indice: true,
  });
  const [density, setDensity] = useState<'legere' | 'standard' | 'dense'>('standard');
  const [selectedSignalId, setSelectedSignalId] = useState<string | null>(searchParams.get('signal'));
  const [selectedZone, setSelectedZone] = useState<ZoneRadar | null>(null);
  const [modale, setModale] = useState<ModaleOpen>(null);

  const signalsAll = state.radar;
  const filtered = useFilteredRadar(signalsAll, filters);
  const kpis = getRadarKpis(signalsAll);

  const selected: MetaSignalRadar | null = useMemo(
    () => signalsAll.find(s => s.meta_id === selectedSignalId) || null,
    [signalsAll, selectedSignalId]
  );

  const updateParam = (key: string, val?: string) => {
    const next = new URLSearchParams(searchParams);
    if (val) next.set(key, val);
    else next.delete(key);
    setSearchParams(next, { replace: true });
  };

  const openSignal = (id: string) => {
    setSelectedSignalId(id);
    setSelectedZone(null);
    updateParam('signal', id);
  };
  const closeDrawer = () => {
    setSelectedSignalId(null);
    updateParam('signal', undefined);
  };

  const handleLeadConfirm = () => {
    if (selected) setStatusRadar(selected.meta_id, 'converti_lead');
    setModale(null);
    toast.push({
      message: 'Lead créé avec succès.',
      type: 'success',
      actionLabel: 'Voir dans Mon activité',
      onAction: () => navigate('/app/activite/leads'),
    });
  };
  const handleActionConfirm = () => {
    if (selected) setStatusRadar(selected.meta_id, 'converti_action');
    setModale(null);
    toast.push({ message: 'Action créée.', type: 'success' });
  };
  const handleAlerteConfirm = () => {
    setModale(null);
    toast.push({ message: 'Alerte créée.', type: 'success' });
  };

  const handleIgnorer = (s: SignalProspection | MetaSignalRadar) => {
    if ('meta_id' in s) {
      const prev = s.status_agrege;
      setStatusRadar(s.meta_id, 'ignore');
      closeDrawer();
      toast.push({
        message: 'Signal ignoré.',
        undoLabel: 'Annuler',
        onUndo: () => setStatusRadar(s.meta_id, prev),
      });
    }
  };
  const handleSuivre = (s: SignalProspection | MetaSignalRadar) => {
    if ('meta_id' in s) setStatusRadar(s.meta_id, 'suivi');
    toast.push({ message: 'Ajouté à vos biens suivis.', type: 'success' });
  };

  const activeFiltersCount = (filters.preset !== 'tous' ? 1 : 0) + (filters.search ? 1 : 0);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <HeaderProspection
        breadcrumb="Radar"
        title="Radar"
        subtitle="Repérez les zones et signaux les plus actionnables de vos secteurs."
        actions={
          <>
            <button
              onClick={() => setModale('alerte')}
              className="h-8 px-3 rounded-md border border-slate-200 bg-white text-[12px] text-slate-700 hover:bg-slate-50 inline-flex items-center gap-1.5"
            >
              <Bell size={13} />
              Créer une alerte
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
        searchPlaceholder="Rechercher une adresse, un quartier, une commune…"
        searchValue={filters.search}
        onSearchChange={v => setFilters(f => ({ ...f, search: v }))}
        presets={presets}
        activePreset={filters.preset}
        onPresetChange={v => {
          setFilters(f => ({ ...f, preset: v }));
          updateParam('preset', v === 'tous' ? undefined : v);
        }}
        activeFiltersCount={activeFiltersCount}
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
        showIgnored={filters.showIgnored}
        onShowIgnoredChange={v => {
          setFilters(f => ({ ...f, showIgnored: v }));
          updateParam('show_ignored', v ? '1' : undefined);
        }}
        couchesSelector={
          <Dropdown label="Couches" icon={<Layers size={12} />}>
            {close => (
              <div className="p-2 space-y-1 min-w-[200px]">
                {(
                  [
                    { k: 'annonces', l: 'Annonces' },
                    { k: 'dvf_ponctuel', l: 'DVF ponctuel' },
                    { k: 'dvf_territorial', l: 'DVF territorial' },
                    { k: 'dpe', l: 'DPE' },
                    { k: 'cadastre', l: 'Cadastre / parcelles' },
                    { k: 'indice', l: 'Indice Radar' },
                  ] as { k: keyof LayerState; l: string }[]
                ).map(o => (
                  <label
                    key={o.k}
                    className="flex items-center gap-2 text-[12px] text-slate-700 px-2 py-1 rounded hover:bg-slate-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={layers[o.k]}
                      onChange={() => setLayers(l => ({ ...l, [o.k]: !l[o.k] }))}
                      className="h-3 w-3 rounded border-slate-300 text-propsight-600"
                    />
                    {o.l}
                  </label>
                ))}
              </div>
            )}
          </Dropdown>
        }
        legende={
          <Dropdown label="Légende" icon={<BookOpen size={12} />}>
            {() => (
              <div className="p-3 min-w-[200px] space-y-1.5 text-[11px] text-slate-700">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-propsight-500" /> Annonce
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-blue-500" /> DVF
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> DPE
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-500" /> Zone chaude
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-propsight-400" /> Zone intéressante
                </div>
              </div>
            )}
          </Dropdown>
        }
        densiteSelector={
          <Dropdown label={`Densité : ${density === 'legere' ? 'Légère' : density === 'dense' ? 'Dense' : 'Standard'}`} icon={<SlidersHorizontal size={12} />}>
            {close => (
              <div className="p-1 min-w-[140px]">
                {(['legere', 'standard', 'dense'] as const).map(d => (
                  <button
                    key={d}
                    onClick={() => {
                      setDensity(d);
                      close();
                    }}
                    className={`w-full text-left px-2.5 py-1.5 text-xs rounded ${
                      density === d ? 'bg-propsight-50 text-propsight-700 font-medium' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {d === 'legere' ? 'Légère' : d === 'dense' ? 'Dense' : 'Standard'}
                  </button>
                ))}
              </div>
            )}
          </Dropdown>
        }
      />

      {/* Split map + liste — hauteur contrôlée, carte à gauche (62%), liste à droite (38%) */}
      <div className="flex-1 grid grid-cols-[1fr_360px] gap-3 p-3 overflow-hidden min-h-0">
        <div className="relative min-h-0 min-w-0 flex flex-col">
          <div className="absolute top-3 left-3 z-30">
            <button className="h-8 px-3 rounded-md bg-white border border-slate-200 shadow-sm hover:bg-slate-50 text-[12px] text-slate-700 inline-flex items-center gap-1.5">
              <span className="inline-block h-3 w-3 border-2 border-propsight-600 rounded-sm" />
              Dessiner une zone
            </button>
          </div>
          <RadarCarte
            signals={filtered}
            zones={layers.indice ? zonesRadar : []}
            selectedId={selectedSignalId}
            onPinClick={openSignal}
            onZoneClick={z => {
              setSelectedZone(z);
              setSelectedSignalId(null);
            }}
          />
        </div>

        <div className="min-h-0 min-w-0 border border-slate-200 rounded-lg bg-white flex flex-col overflow-hidden">
          <div className="px-4 py-2.5 border-b border-slate-200 flex items-center justify-between flex-shrink-0">
            <div>
              <div className="text-[12px] font-semibold text-slate-900">{filtered.length} signaux</div>
              <div className="text-[10px] text-slate-500">Actualisé il y a 1 min</div>
            </div>
            <button className="text-[11px] text-slate-500 hover:text-propsight-600">Voir plus ↓</button>
          </div>
          <div className="flex-1 overflow-y-auto p-2.5 space-y-2 min-h-0">
            {filtered.length === 0 ? (
              <EmptyState
                kind="no_filter_result"
                onPrimary={() => setFilters(f => ({ ...f, search: '', preset: 'tous' }))}
                onSecondary={() => setFilters(f => ({ ...f, period: '90j' }))}
              />
            ) : (
              filtered.map(s => (
                <CardSignalListe
                  key={s.meta_id}
                  signal={s}
                  selected={selectedSignalId === s.meta_id}
                  onClick={() => openSignal(s.meta_id)}
                />
              ))
            )}
          </div>
        </div>
      </div>

      <DrawerSignal
        signal={selected}
        onClose={closeDrawer}
        onCreerLead={() => setModale('lead')}
        onCreerAction={() => setModale('action')}
        onCreerAlerte={() => setModale('alerte')}
        onIgnorer={handleIgnorer}
        onSuivre={handleSuivre}
        onAssign={(id, uid) => setAssigneeRadar(id, uid)}
      />

      <DrawerZone
        zone={selectedZone}
        onClose={() => setSelectedZone(null)}
        onVoirSignaux={() => {
          if (selectedZone) {
            setFilters(f => ({ ...f, search: selectedZone.ville }));
            setSelectedZone(null);
          }
        }}
        onCreerAlerte={() => {
          toast.push({ message: 'Alerte de zone créée.', type: 'success' });
          setSelectedZone(null);
        }}
      />

      <ModaleCreerLead open={modale === 'lead'} onClose={() => setModale(null)} signal={selected} onConfirm={handleLeadConfirm} />
      <ModaleCreerAction open={modale === 'action'} onClose={() => setModale(null)} signal={selected} onConfirm={handleActionConfirm} />
      <ModaleCreerAlerte open={modale === 'alerte'} onClose={() => setModale(null)} signal={selected} onConfirm={handleAlerteConfirm} />
    </div>
  );
};

export default RadarPage;
