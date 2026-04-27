import React, { useState } from 'react';
import {
  Calendar,
  AlertTriangle,
  Users,
  CalendarCheck,
  UserPlus,
  Download,
  Plus,
  Clock,
} from 'lucide-react';
import EquipePageHeader, { OrgSwitcher } from '../components/EquipePageHeader';
import EquipeFiltersBar from '../components/EquipeFiltersBar';
import EquipeKpiRow, { EquipeKpi } from '../components/EquipeKpiRow';
import AgendaHeatmap from '../components/AgendaHeatmap';
import WorkloadPanel from '../components/WorkloadPanel';
import AbsencesList from '../components/AbsencesList';
import DeclareAbsenceModal from '../components/DeclareAbsenceModal';
import RebalancingSuggestions from '../components/RebalancingSuggestions';
import { PrimaryButton, SecondaryButton, Segmented } from '../components/primitives';
import {
  ABSENCES,
  AGENDA_EVENTS,
  AGENDA_KPIS,
  AGENDA_OVERDUE,
  AGENDA_WEEK_DAYS,
  AGENDA_WEEK_LABEL,
  COLLABORATEURS,
  REBALANCING,
} from '../_mocks/equipe';
import type { Absence } from '../types';

const TAB_OPTIONS = [
  { value: 'semaine', label: 'Semaine' },
  { value: 'jour', label: 'Jour' },
  { value: 'collab', label: 'Par collaborateur' },
  { value: 'charge', label: 'Charge' },
  { value: 'retards', label: 'Retards' },
  { value: 'dispos', label: 'Disponibilités' },
];

const AgendaPage: React.FC = () => {
  const [view, setView] = useState('semaine');
  const [collab, setCollab] = useState('tous');
  const [declareOpen, setDeclareOpen] = useState(false);
  const [absences, setAbsences] = useState<Absence[]>(ABSENCES);

  const kpis: EquipeKpi[] = [
    {
      id: 'rdv_sem',
      label: 'RDV cette semaine',
      value: AGENDA_KPIS.rdv_semaine,
      delta: AGENDA_KPIS.rdv_semaine_delta,
      trend: 'up',
      icon: Calendar,
      tone: 'violet',
    },
    {
      id: 'retard',
      label: 'Actions en retard',
      value: AGENDA_KPIS.actions_retard,
      delta: AGENDA_KPIS.actions_retard_delta,
      trend: 'down',
      icon: AlertTriangle,
      tone: 'red',
    },
    {
      id: 'critiques',
      label: 'Relances critiques',
      value: AGENDA_KPIS.relances_critiques,
      delta: AGENDA_KPIS.relances_critiques_delta,
      trend: 'up',
      icon: Clock,
      tone: 'orange',
    },
    {
      id: 'surcharges',
      label: 'Collaborateurs surchargés',
      value: AGENDA_KPIS.surcharges,
      delta: AGENDA_KPIS.surcharges_delta,
      trend: 'down',
      icon: Users,
      tone: 'red',
    },
    {
      id: 'creneaux',
      label: 'Créneaux disponibles',
      value: AGENDA_KPIS.creneaux_dispo,
      delta: AGENDA_KPIS.creneaux_dispo_delta,
      trend: 'up',
      icon: CalendarCheck,
      tone: 'emerald',
    },
  ];

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden">
      <EquipePageHeader
        title="Agenda & charge"
        subtitle="Répartissez les RDV, relances et actions selon la disponibilité de votre équipe."
        right={
          <>
            <OrgSwitcher />
            <SecondaryButton icon={<UserPlus size={11} />}>Réassigner actions</SecondaryButton>
            <SecondaryButton icon={<Download size={11} />}>Exporter</SecondaryButton>
            <PrimaryButton icon={<Plus size={11} />}>Créer un RDV</PrimaryButton>
          </>
        }
      />

      <EquipeFiltersBar
        filters={[
          {
            key: 'periode',
            label: 'Période',
            value: 'semaine',
            options: [
              { value: 'semaine', label: AGENDA_WEEK_LABEL },
              { value: 'mois', label: 'Mois en cours' },
            ],
            onChange: () => undefined,
          },
          {
            key: 'vue',
            label: 'Vue',
            value: 'semaine',
            options: [
              { value: 'semaine', label: 'Semaine' },
              { value: 'jour', label: 'Jour' },
            ],
            onChange: () => undefined,
          },
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
            value: 'toutes',
            options: [{ value: 'toutes', label: 'Toutes' }],
            onChange: () => undefined,
          },
          {
            key: 'type',
            label: 'Type',
            value: 'tous',
            options: [{ value: 'tous', label: 'Tous' }],
            onChange: () => undefined,
          },
          {
            key: 'charge',
            label: 'Charge',
            value: 'toutes',
            options: [{ value: 'toutes', label: 'Toutes' }],
            onChange: () => undefined,
          },
        ]}
        activeFiltersCount={1}
      />

      <EquipeKpiRow kpis={kpis} />

      <div className="px-4 py-1.5 bg-white border-b border-slate-200 flex items-center gap-2 flex-shrink-0">
        <Segmented value={view} onChange={setView} options={TAB_OPTIONS} />
        <div className="flex-1" />
        <span className="text-[10.5px] text-slate-400">{AGENDA_WEEK_LABEL}</span>
      </div>

      <div className="flex-1 min-h-0 px-3 py-2.5 grid grid-cols-[minmax(0,1.75fr)_minmax(320px,1fr)] grid-rows-[minmax(0,1.2fr)_minmax(0,1fr)] gap-2.5 overflow-hidden">
        <div className="min-h-0 row-span-1">
          <AgendaHeatmap
            collaborateurs={COLLABORATEURS}
            days={AGENDA_WEEK_DAYS}
            events={AGENDA_EVENTS}
            absences={absences}
          />
        </div>
        <div className="min-h-0 row-span-1">
          <WorkloadPanel collaborateurs={COLLABORATEURS} />
        </div>
        <div className="min-h-0 row-span-1">
          <AbsencesList
            absences={absences}
            onDeclare={() => setDeclareOpen(true)}
            onDelete={a => setAbsences(list => list.filter(x => x.absence_id !== a.absence_id))}
          />
        </div>
        <div className="min-h-0 row-span-1">
          <RebalancingSuggestions suggestions={REBALANCING} overdue={AGENDA_OVERDUE} />
        </div>
      </div>

      <DeclareAbsenceModal
        open={declareOpen}
        onClose={() => setDeclareOpen(false)}
        collaborateurs={COLLABORATEURS}
        onSubmit={data => {
          const target = COLLABORATEURS.find(c => c.user_id === data.collaborator_id);
          setAbsences(list => [
            ...list,
            {
              absence_id: `abs_${Date.now()}`,
              collaborator_id: data.collaborator_id,
              collaborator_label: target?.display_name ?? '—',
              type: data.type,
              period_start: data.period_start,
              period_end: data.period_end,
              note: data.note,
              created_by: 'u_sophie',
              created_at: new Date().toISOString(),
            },
          ]);
        }}
      />
    </div>
  );
};

export default AgendaPage;
