import React, { useState } from 'react';
import {
  Users,
  Wallet,
  Home,
  User,
  Train,
  ShoppingBag,
  GraduationCap,
  Trees,
  Building2,
  FileText,
  Zap,
  Map as MapIcon,
  Bell,
  CopyPlus,
  Target,
  Eye,
} from 'lucide-react';
import {
  PageHeader,
  KpiStrip,
  FilterBar,
  FilterChip,
  ExportButton,
  SecondaryButton,
  KpiItem,
  ActionsFooter,
  CreerAlerteButton,
} from '../components/primitives';
import ObservatoireMap from '../components/ObservatoireMap';
import {
  DEFAULT_ZONE,
  CONTEXTE_PROFIL_KPIS,
  CONTEXTE_CADRE_KPIS,
  CONTEXTE_POTENTIEL_KPIS,
  POI_PROFIL,
  POI_CADRE,
  POI_POTENTIEL,
} from '../_mocks/observatoire';
import ProfilTab from './tabs/ProfilTab';
import CadreVieTab from './tabs/CadreVieTab';
import PotentielTab from './tabs/PotentielTab';

type TabKey = 'profil' | 'cadre_vie' | 'potentiel';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'profil', label: 'Profil' },
  { key: 'cadre_vie', label: 'Cadre de vie' },
  { key: 'potentiel', label: 'Potentiel' },
];

const ZONE_OPTIONS = [
  { value: 'paris-3e', label: 'Paris 3e (75003)' },
  { value: 'paris-4e', label: 'Paris 4e (75004)' },
  { value: 'paris-11e', label: 'Paris 11e (75011)' },
  { value: 'paris-10e', label: 'Paris 10e (75010)' },
];

const GRANULARITE_OPTIONS = [
  { value: 'arrondissement', label: 'Arrondissement' },
  { value: 'quartier', label: 'Quartier' },
  { value: 'iris', label: 'IRIS' },
  { value: 'adresse', label: 'Adresse' },
];

const PERSONA_OPTIONS = [
  { value: 'agent', label: 'Agent' },
  { value: 'investisseur', label: 'Investisseur' },
  { value: 'bailleur', label: 'Bailleur' },
  { value: 'acquereur', label: 'Acquéreur' },
  { value: 'vendeur', label: 'Vendeur' },
];

const RAYON_OPTIONS = [
  { value: '500m', label: '500 m' },
  { value: '1km', label: '1 km' },
  { value: '15min', label: '15 min à pied' },
  { value: 'commune', label: 'Commune entière' },
];

const SOURCE_OPTIONS = [
  { value: 'all', label: 'INSEE + BPE + OSM + PLU' },
  { value: 'insee', label: 'INSEE' },
  { value: 'osm', label: 'OSM / BPE' },
  { value: 'plu', label: 'PLU' },
];

const ContexteLocalPage: React.FC = () => {
  const [tab, setTab] = useState<TabKey>('profil');
  const [zone, setZone] = useState('paris-3e');
  const [granularite, setGranularite] = useState('arrondissement');
  const [persona, setPersona] = useState('investisseur');
  const [rayon, setRayon] = useState('500m');
  const [source, setSource] = useState('all');

  const kpis = (tab === 'profil'
    ? CONTEXTE_PROFIL_KPIS
    : tab === 'cadre_vie'
    ? CONTEXTE_CADRE_KPIS
    : CONTEXTE_POTENTIEL_KPIS) as KpiItem[];

  const kpisWithIcons: KpiItem[] = React.useMemo(() => {
    const iconsProfil: Record<string, { icon: React.ReactNode; accent: KpiItem['accent'] }> = {
      population: { icon: <Users size={13} />, accent: 'violet' },
      revenu_median: { icon: <Wallet size={13} />, accent: 'emerald' },
      locataires: { icon: <Home size={13} />, accent: 'amber' },
      age: { icon: <User size={13} />, accent: 'violet' },
    };
    const iconsCadre: Record<string, { icon: React.ReactNode; accent: KpiItem['accent'] }> = {
      transports: { icon: <Train size={13} />, accent: 'violet' },
      commerces: { icon: <ShoppingBag size={13} />, accent: 'amber' },
      education: { icon: <GraduationCap size={13} />, accent: 'violet' },
      espaces_verts: { icon: <Trees size={13} />, accent: 'emerald' },
    };
    const iconsPotentiel: Record<string, { icon: React.ReactNode; accent: KpiItem['accent'] }> = {
      score: { icon: <Building2 size={13} />, accent: 'violet' },
      permis: { icon: <FileText size={13} />, accent: 'rose' },
      dpe_fg: { icon: <Zap size={13} />, accent: 'emerald' },
      zonage: { icon: <MapIcon size={13} />, accent: 'amber' },
    };
    const map = tab === 'profil' ? iconsProfil : tab === 'cadre_vie' ? iconsCadre : iconsPotentiel;
    return kpis.map(k => ({ ...k, ...map[k.id] }));
  }, [tab, kpis]);

  return (
    <>
      <PageHeader
        title="Contexte local"
        zoneLabel={DEFAULT_ZONE.label}
        zoneCode={DEFAULT_ZONE.code_postal ?? ''}
        subtitle="Cette section présente le profil du quartier, la qualité de vie et le potentiel local, et alimente les estimations, études locatives, dossiers d'investissement et rapports PDF éditables."
        actions={
          <>
            <SecondaryButton>
              <CopyPlus size={11} />
              Comparer une zone
            </SecondaryButton>
            <CreerAlerteButton />
            <ExportButton />
          </>
        }
      />

      {/* Tabs */}
      <div className="px-3 border-b border-slate-200 bg-white flex items-center gap-0 flex-shrink-0">
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`relative h-7 px-2.5 text-[11.5px] font-medium transition-colors ${
              tab === t.key ? 'text-propsight-700' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {t.label}
            {tab === t.key && <div className="absolute bottom-0 left-1.5 right-1.5 h-0.5 bg-propsight-600 rounded-t-sm" />}
          </button>
        ))}
      </div>

      <FilterBar>
        <FilterChip label="Zone" value={zone} options={ZONE_OPTIONS} onChange={setZone} />
        <FilterChip label="Granularité" value={granularite} options={GRANULARITE_OPTIONS} onChange={setGranularite} />
        <FilterChip label="Persona" value={persona} options={PERSONA_OPTIONS} onChange={setPersona} />
        <FilterChip label="Rayon" value={rayon} options={RAYON_OPTIONS} onChange={setRayon} />
        <FilterChip label="Source" value={source} options={SOURCE_OPTIONS} onChange={setSource} />
      </FilterBar>

      <KpiStrip kpis={kpisWithIcons} />

      <div className="flex-1 grid grid-cols-[1fr_400px] gap-2 p-2 overflow-hidden min-h-0">
        <div className="min-h-0 min-w-0 overflow-y-auto pr-1 space-y-2">
          {tab === 'profil' && <ProfilTab />}
          {tab === 'cadre_vie' && <CadreVieTab />}
          {tab === 'potentiel' && <PotentielTab />}
        </div>
        <div className="min-h-0 min-w-0 flex flex-col">
          <ObservatoireMap
            title={
              tab === 'profil'
                ? 'Points d\'intérêt'
                : tab === 'cadre_vie'
                ? 'Cadre de vie'
                : 'Potentiel urbain'
            }
            layerLabel={
              tab === 'profil'
                ? 'Densité population'
                : tab === 'cadre_vie'
                ? 'Accessibilité 15 min'
                : 'Permis récents (500 m)'
            }
            layerOptions={
              tab === 'profil'
                ? ['Densité population', 'Revenu médian', 'Part locataires', 'Part étudiants']
                : tab === 'cadre_vie'
                ? ['Accessibilité 15 min', 'Transports', 'Écoles', 'Commerces', 'Espaces verts']
                : ['Permis récents (500 m)', 'DPE F/G', 'PLU', 'Projets urbains']
            }
            showGradient
            pois={tab === 'profil' ? POI_PROFIL : tab === 'cadre_vie' ? POI_CADRE : POI_POTENTIEL}
            dotDensity={tab === 'potentiel' ? 'low' : undefined}
            legend={
              tab === 'potentiel'
                ? [
                    { color: '#7C3AED', label: 'Permis de construire', shape: 'dot' },
                    { color: '#F59E0B', label: 'Déclarations préalables', shape: 'dot' },
                    { color: '#0EA5E9', label: 'Projets urbains', shape: 'dot' },
                    { color: '#DC2626', label: 'DPE F / G', shape: 'dot' },
                    { color: '#8B5CF6', label: 'Zonage PLU', shape: 'square' },
                  ]
                : tab === 'cadre_vie'
                ? [
                    { color: '#6366F1', label: 'Transports', shape: 'dot' },
                    { color: '#14B8A6', label: 'Écoles', shape: 'dot' },
                    { color: '#F59E0B', label: 'Commerces', shape: 'dot' },
                    { color: '#16A34A', label: 'Espaces verts', shape: 'dot' },
                    { color: '#8B5CF6', label: 'Services', shape: 'dot' },
                  ]
                : [
                    { color: '#14B8A6', label: 'Écoles', shape: 'dot' },
                    { color: '#6366F1', label: 'Transports', shape: 'dot' },
                    { color: '#16A34A', label: 'Espaces verts', shape: 'dot' },
                    { color: '#F59E0B', label: 'Commerces', shape: 'dot' },
                  ]
            }
          />
        </div>
      </div>

      <ActionsFooter
        actions={[
          { label: 'Ouvrir Prospection', icon: <Eye size={10} /> },
          { label: 'Créer alerte urbanisme', icon: <Bell size={10} /> },
          { label: 'Voir biens dans cette zone', icon: <Eye size={10} /> },
          { label: 'Comparer avec une autre zone', icon: <Target size={10} /> },
        ]}
      />
    </>
  );
};

export default ContexteLocalPage;
