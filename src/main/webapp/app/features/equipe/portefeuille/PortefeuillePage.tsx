import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Building2,
  FileText,
  AlertTriangle,
  Briefcase,
  CheckCircle2,
  Plus,
  UserPlus,
  Download,
} from 'lucide-react';
import EquipePageHeader, { OrgSwitcher } from '../components/EquipePageHeader';
import EquipeFiltersBar from '../components/EquipeFiltersBar';
import EquipeKpiRow, { EquipeKpi } from '../components/EquipeKpiRow';
import TeamPortfolioTable from '../components/TeamPortfolioTable';
import DeliverableQualityPanel from '../components/DeliverableQualityPanel';
import { PrimaryButton, SecondaryButton } from '../components/primitives';
import {
  COLLABORATEURS,
  DELIVERABLE_QUALITY_AGGREGATE,
  PORTFOLIO_ITEMS,
  PORTFOLIO_KPIS,
  ZONES,
} from '../_mocks/equipe';

const PRESETS = [
  { key: 'tous', label: 'Tous' },
  { key: 'biens', label: 'Biens', count: 42 },
  { key: 'estimations', label: 'Estimations' },
  { key: 'rapports', label: 'Rapports' },
  { key: 'dossiers', label: 'Dossiers' },
  { key: 'opportunites', label: 'Opportunités' },
  { key: 'a-relancer', label: 'À relancer', count: 31 },
  { key: 'blocages', label: 'Blocages', count: 6 },
  { key: 'ecart-avm', label: 'Écart AVM', count: 2 },
];

const PortefeuillePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [period, setPeriod] = useState('30j');
  const [collab, setCollab] = useState('tous');
  const [zone, setZone] = useState('toutes');
  const [preset, setPreset] = useState<string>(searchParams.get('preset') ?? 'tous');
  const [selectedId, setSelectedId] = useState<string | null>(PORTFOLIO_ITEMS[0]?.id ?? null);

  const items = useMemo(() => {
    let filtered = PORTFOLIO_ITEMS;
    if (preset === 'biens') filtered = filtered.filter(i => i.type === 'bien' || i.type === 'mandat');
    else if (preset === 'estimations')
      filtered = filtered.filter(i => i.type === 'estimation_rapide' || i.type === 'avis_valeur');
    else if (preset === 'rapports')
      filtered = filtered.filter(i => i.type === 'avis_valeur' || i.type === 'etude_locative');
    else if (preset === 'dossiers') filtered = filtered.filter(i => i.type === 'dossier_invest');
    else if (preset === 'opportunites') filtered = filtered.filter(i => i.type === 'opportunite');
    else if (preset === 'a-relancer') filtered = filtered.filter(i => !i.has_relance);
    else if (preset === 'blocages') filtered = filtered.filter(i => i.risk === 'bloque');
    else if (preset === 'ecart-avm') filtered = filtered.filter(i => i.ecart_avm_sup_5pct_sans_justif);

    if (collab !== 'tous') filtered = filtered.filter(i => i.collaborator_id === collab);
    if (zone !== 'toutes') filtered = filtered.filter(i => i.zone_label?.toLowerCase().includes(zone));
    return filtered;
  }, [preset, collab, zone]);

  const selectedItem = items.find(i => i.id === selectedId) ?? items[0] ?? null;

  const kpis: EquipeKpi[] = [
    {
      id: 'biens',
      label: 'Biens portefeuille',
      value: PORTFOLIO_KPIS.biens.toLocaleString('fr-FR'),
      delta: '+14 % vs 5-11 mai',
      trend: 'up',
      icon: Building2,
      tone: 'violet',
    },
    {
      id: 'rapports_en_cours',
      label: 'Rapports en cours',
      value: PORTFOLIO_KPIS.rapports_en_cours,
      delta: '+18 % vs 5-11 mai',
      trend: 'up',
      icon: FileText,
      tone: 'blue',
    },
    {
      id: 'ouverts_sans_relance',
      label: 'Ouverts sans relance',
      value: PORTFOLIO_KPIS.ouverts_sans_relance,
      delta: '+22 % vs 5-11 mai',
      trend: 'down',
      icon: AlertTriangle,
      tone: 'orange',
    },
    {
      id: 'dossiers',
      label: 'Dossiers investissement',
      value: PORTFOLIO_KPIS.dossiers,
      delta: '+11 % vs 5-11 mai',
      trend: 'up',
      icon: Briefcase,
      tone: 'emerald',
    },
    {
      id: 'rapports_complets',
      label: 'Rapports complets',
      value: PORTFOLIO_KPIS.rapports_complets_pct + ' %',
      delta: '+16 % vs 5-11 mai',
      trend: 'up',
      icon: CheckCircle2,
      tone: 'violet',
    },
  ];

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden">
      <EquipePageHeader
        title="Portefeuille & dossiers"
        subtitle="Suivez les biens, estimations, rapports et dossiers portés par votre équipe."
        right={
          <>
            <OrgSwitcher />
            <SecondaryButton icon={<UserPlus size={11} />}>Réassigner</SecondaryButton>
            <SecondaryButton icon={<Download size={11} />}>Exporter</SecondaryButton>
            <PrimaryButton icon={<Plus size={11} />}>Créer un dossier</PrimaryButton>
          </>
        }
      />

      <EquipeFiltersBar
        period={{ value: period, onChange: setPeriod }}
        filters={[
          {
            key: 'collab',
            label: 'Collab.',
            value: collab,
            options: [
              { value: 'tous', label: 'Tous' },
              ...COLLABORATEURS.map(c => ({ value: c.user_id, label: c.display_name })),
            ],
            onChange: setCollab,
          },
          {
            key: 'zone',
            label: 'Zone',
            value: zone,
            options: [
              { value: 'toutes', label: 'Toutes' },
              ...ZONES.map(z => ({ value: z.slug, label: z.label })),
            ],
            onChange: setZone,
          },
          {
            key: 'type',
            label: 'Type objet',
            value: 'tous',
            options: [
              { value: 'tous', label: 'Tous' },
              { value: 'bien', label: 'Bien' },
              { value: 'avis_valeur', label: 'AdV' },
              { value: 'etude_locative', label: 'Étude locative' },
              { value: 'dossier_invest', label: 'Dossier invest.' },
              { value: 'mandat', label: 'Mandat' },
            ],
            onChange: () => undefined,
          },
          {
            key: 'statut',
            label: 'Statut',
            value: 'tous',
            options: [
              { value: 'tous', label: 'Tous' },
              { value: 'actif', label: 'Actif' },
              { value: 'ouvert', label: 'Ouvert' },
              { value: 'en_cours', label: 'En cours' },
              { value: 'nouveau', label: 'Nouveau' },
            ],
            onChange: () => undefined,
          },
          {
            key: 'risque',
            label: 'Risque',
            value: 'tous',
            options: [
              { value: 'tous', label: 'Tous' },
              { value: 'bloque', label: 'Bloqué' },
              { value: 'a_relancer', label: 'À relancer' },
              { value: 'ok', label: 'OK' },
            ],
            onChange: () => undefined,
          },
        ]}
        activeFiltersCount={2}
      />

      <EquipeKpiRow kpis={kpis} />

      <div className="px-4 py-1.5 bg-white border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto flex-shrink-0">
        {PRESETS.map(p => (
          <button
            key={p.key}
            onClick={() => {
              setPreset(p.key);
              const next = new URLSearchParams(searchParams);
              if (p.key === 'tous') next.delete('preset');
              else next.set('preset', p.key);
              setSearchParams(next);
            }}
            className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium whitespace-nowrap transition-colors ${
              preset === p.key
                ? 'bg-propsight-100 text-propsight-700'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {p.label}
            {p.count && (
              <span className={`text-[10px] ${preset === p.key ? 'text-propsight-600' : 'text-slate-400'}`}>
                {p.count}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="flex-1 min-h-0 px-3 py-2.5 grid grid-cols-[minmax(0,2.2fr)_minmax(320px,1fr)] gap-2.5 overflow-hidden">
        <div className="min-h-0">
          <TeamPortfolioTable items={items} selectedId={selectedId ?? undefined} onSelect={setSelectedId} />
        </div>
        <div className="min-h-0">
          <DeliverableQualityPanel
            aggregate={DELIVERABLE_QUALITY_AGGREGATE}
            selectedItem={selectedItem}
            onViewIncomplete={() => setPreset('blocages')}
          />
        </div>
      </div>
    </div>
  );
};

export default PortefeuillePage;
