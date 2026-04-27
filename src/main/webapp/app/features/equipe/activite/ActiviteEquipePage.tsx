import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  CheckCircle2,
  AlertTriangle,
  Users,
  Zap,
  Mail,
  Plus,
  Download,
  UserPlus,
} from 'lucide-react';
import EquipePageHeader, { OrgSwitcher } from '../components/EquipePageHeader';
import EquipeFiltersBar from '../components/EquipeFiltersBar';
import EquipeKpiRow, { EquipeKpi } from '../components/EquipeKpiRow';
import TeamActivityTable from '../components/TeamActivityTable';
import TeamActivityDetailPanel from '../components/TeamActivityDetailPanel';
import { PrimaryButton, SecondaryButton } from '../components/primitives';
import { COLLABORATEURS, TEAM_ACTIVITY, ZONES } from '../_mocks/equipe';
import type { TeamActivityItem } from '../types';

const PRESETS = [
  { key: 'tous', label: 'Tous' },
  { key: 'en-retard', label: 'En retard', count: 54 },
  { key: 'sans-prochaine-action', label: 'Sans prochaine action', count: 61 },
  { key: 'leads-non-assignes', label: 'Leads non assignés', count: 12 },
  { key: 'leads-widget', label: 'Leads widget', count: 126 },
  { key: 'rapports-a-relancer', label: 'Rapports à relancer', count: 22 },
  { key: 'signaux-non-traites', label: 'Signaux non traités', count: 9 },
  { key: 'opportunites-invest', label: 'Opportunités invest', count: 9 },
];

const ActiviteEquipePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [period, setPeriod] = useState('7j');
  const [collab, setCollab] = useState('tous');
  const [zone, setZone] = useState('toutes');
  const [preset, setPreset] = useState<string>(searchParams.get('preset') ?? 'tous');
  const [selectedId, setSelectedId] = useState<string | null>(TEAM_ACTIVITY[0]?.activity_id ?? null);

  const items = useMemo<TeamActivityItem[]>(() => {
    let filtered = TEAM_ACTIVITY;
    if (preset === 'en-retard') filtered = filtered.filter(i => i.status === 'en_retard');
    else if (preset === 'leads-non-assignes')
      filtered = filtered.filter(i => i.type === 'lead' && i.status === 'non_assigne');
    else if (preset === 'rapports-a-relancer')
      filtered = filtered.filter(i => i.status === 'a_relancer' || i.status === 'ouvert_sans_relance');
    else if (preset === 'signaux-non-traites') filtered = filtered.filter(i => i.type === 'signal');
    else if (preset === 'opportunites-invest') filtered = filtered.filter(i => i.type === 'opportunite');

    if (collab !== 'tous') filtered = filtered.filter(i => i.collaborator_id === collab);
    if (zone !== 'toutes') filtered = filtered.filter(i => i.zone_slug === zone);
    return filtered;
  }, [preset, collab, zone]);

  const selectedItem = items.find(i => i.activity_id === selectedId) ?? items[0] ?? null;

  const kpis: EquipeKpi[] = [
    {
      id: 'actions_realisees',
      label: 'Actions réalisées',
      value: '348',
      delta: '+18 % vs 5-11 mai',
      trend: 'up',
      icon: CheckCircle2,
      tone: 'violet',
    },
    {
      id: 'actions_retard',
      label: 'Actions en retard',
      value: '54',
      delta: '+24 % vs 5-11 mai',
      trend: 'down',
      icon: AlertTriangle,
      tone: 'red',
    },
    {
      id: 'leads_traites',
      label: 'Leads traités',
      value: '296',
      delta: '+21 % vs 5-11 mai',
      trend: 'up',
      icon: Users,
      tone: 'blue',
    },
    {
      id: 'signaux_convertis',
      label: 'Signaux convertis',
      value: '38',
      delta: '+19 % vs 5-11 mai',
      trend: 'up',
      icon: Zap,
      tone: 'emerald',
    },
    {
      id: 'rapports_a_relancer',
      label: 'Rapports à relancer',
      value: '22',
      delta: '+10 % vs 5-11 mai',
      trend: 'up',
      icon: Mail,
      tone: 'orange',
    },
  ];

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden">
      <EquipePageHeader
        title="Activité commerciale"
        subtitle="Suivez les leads, actions, relances et signaux traités par votre équipe."
        right={
          <>
            <OrgSwitcher />
            <SecondaryButton icon={<UserPlus size={11} />}>Assigner des leads</SecondaryButton>
            <SecondaryButton icon={<Download size={11} />}>Exporter</SecondaryButton>
            <PrimaryButton icon={<Plus size={11} />}>Créer une action</PrimaryButton>
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
            key: 'source',
            label: 'Source',
            value: 'toutes',
            options: [
              { value: 'toutes', label: 'Toutes' },
              { value: 'widget', label: 'Widget' },
              { value: 'site', label: 'Site' },
              { value: 'interne', label: 'Interne' },
            ],
            onChange: () => undefined,
          },
          {
            key: 'type',
            label: 'Type',
            value: 'tous',
            options: [
              { value: 'tous', label: 'Tous' },
              { value: 'lead', label: 'Lead' },
              { value: 'action', label: 'Action' },
              { value: 'rapport', label: 'Rapport' },
              { value: 'signal', label: 'Signal' },
            ],
            onChange: () => undefined,
          },
          {
            key: 'priorite',
            label: 'Priorité',
            value: 'toutes',
            options: [
              { value: 'toutes', label: 'Toutes' },
              { value: 'haute', label: 'Haute' },
              { value: 'moyenne', label: 'Moyenne' },
              { value: 'basse', label: 'Basse' },
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
        <div className="flex-1" />
        <span className="text-[10.5px] text-slate-400 whitespace-nowrap">
          {items.length} résultats · Personnaliser
        </span>
      </div>

      <div className="flex-1 min-h-0 px-3 py-2.5 grid grid-cols-[minmax(0,2.3fr)_minmax(340px,1fr)] gap-2.5 overflow-hidden">
        <div className="min-h-0">
          <TeamActivityTable items={items} selectedId={selectedId ?? undefined} onSelect={setSelectedId} />
        </div>
        <div className="min-h-0">
          <TeamActivityDetailPanel item={selectedItem} onClose={() => setSelectedId(null)} />
        </div>
      </div>
    </div>
  );
};

export default ActiviteEquipePage;
