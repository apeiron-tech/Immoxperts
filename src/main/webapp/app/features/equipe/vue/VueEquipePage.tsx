import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Users,
  AlertTriangle,
  Calendar,
  Briefcase,
  Wallet,
  Target,
  BarChart3,
  Sparkles,
} from 'lucide-react';
import EquipePageHeader, { OrgSwitcher } from '../components/EquipePageHeader';
import EquipeFiltersBar from '../components/EquipeFiltersBar';
import EquipeKpiRow, { EquipeKpi } from '../components/EquipeKpiRow';
import CollaborateurTable, { CollabColumnKey, DEFAULT_COLS } from '../components/CollaborateurTable';
import SanteCoachingPanel from '../components/SanteCoachingPanel';
import LeadsUnassignedBanner from '../components/LeadsUnassignedBanner';
import CollaborateurDrawer from '../components/CollaborateurDrawer';
import AssignModal from '../components/AssignModal';
import { PrimaryButton, SecondaryButton } from '../components/primitives';
import {
  ADOPTION_METRICS,
  ADOPTION_SCORE,
  COACHING_INSIGHTS,
  COLLABORATEURS,
  EQUIPE_KPI_SUMMARY,
  WATCH_ITEMS,
  ZONES,
} from '../_mocks/equipe';

const VueEquipePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [period, setPeriod] = useState('30j');
  const [zone, setZone] = useState('toutes');
  const [equipe, setEquipe] = useState('commerciale');
  const [cols, setCols] = useState<CollabColumnKey[]>(DEFAULT_COLS);
  const [assignOpen, setAssignOpen] = useState(false);

  const drawerParam = searchParams.get('drawer');
  const selectedId = drawerParam?.startsWith('collaborateur:') ? drawerParam.slice('collaborateur:'.length) : null;
  const selectedCollab = useMemo(
    () => COLLABORATEURS.find(c => c.user_id === selectedId) ?? null,
    [selectedId],
  );

  const openCollab = (id: string) => {
    const next = new URLSearchParams(searchParams);
    next.set('drawer', `collaborateur:${id}`);
    setSearchParams(next);
  };
  const closeDrawer = () => {
    const next = new URLSearchParams(searchParams);
    next.delete('drawer');
    setSearchParams(next);
  };

  const kpis: EquipeKpi[] = [
    {
      id: 'leads_actifs',
      label: 'Leads actifs',
      value: EQUIPE_KPI_SUMMARY.leads_actifs.toLocaleString('fr-FR'),
      delta: EQUIPE_KPI_SUMMARY.leads_actifs_delta,
      trend: 'up',
      icon: Users,
      tone: 'violet',
      onClick: () => (window.location.href = '/app/activite/leads'),
    },
    {
      id: 'actions_retard',
      label: 'Actions en retard',
      value: EQUIPE_KPI_SUMMARY.actions_retard,
      subtitle: `${EQUIPE_KPI_SUMMARY.actions_retard_haute} haute priorité`,
      icon: AlertTriangle,
      tone: 'red',
      onClick: () => (window.location.href = '/app/equipe/activite?preset=en-retard'),
    },
    {
      id: 'rdv_semaine',
      label: 'RDV semaine',
      value: EQUIPE_KPI_SUMMARY.rdv_semaine,
      subtitle: `${EQUIPE_KPI_SUMMARY.rdv_visites} visites · ${EQUIPE_KPI_SUMMARY.rdv_estimations} estimations`,
      icon: Calendar,
      tone: 'blue',
      onClick: () => (window.location.href = '/app/equipe/agenda'),
    },
    {
      id: 'mandats',
      label: 'Mandats en cours',
      value: EQUIPE_KPI_SUMMARY.mandats,
      subtitle: `${EQUIPE_KPI_SUMMARY.mandats_exclusifs} exclusifs`,
      icon: Briefcase,
      tone: 'emerald',
      onClick: () => (window.location.href = '/app/equipe/portefeuille'),
    },
    {
      id: 'ca_pipe',
      label: 'CA pipe pondéré',
      value: `${(EQUIPE_KPI_SUMMARY.ca_pipe / 1000).toFixed(0)} k€`,
      delta: EQUIPE_KPI_SUMMARY.ca_pipe_delta,
      trend: 'up',
      icon: Wallet,
      tone: 'violet',
      onClick: () => (window.location.href = '/app/equipe/performance'),
    },
  ];

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden">
      <EquipePageHeader
        title="Vue équipe"
        subtitle="Pilotez la charge, l’adoption et les blocages commerciaux de votre équipe."
        right={
          <>
            <OrgSwitcher />
            <SecondaryButton
              icon={<Users size={11} />}
              onClick={() => (window.location.href = '/app/parametres/membres?action=invite')}
            >
              Inviter un membre
            </SecondaryButton>
            <SecondaryButton icon={<Target size={11} />}>Définir objectifs</SecondaryButton>
            <PrimaryButton icon={<Sparkles size={11} />}>Assistant IA</PrimaryButton>
          </>
        }
      />

      <EquipeFiltersBar
        period={{ value: period, onChange: setPeriod }}
        comparison={{ value: 'periode', onChange: () => undefined }}
        filters={[
          {
            key: 'equipe',
            label: 'Équipe',
            value: equipe,
            options: [
              { value: 'commerciale', label: 'Commerciale' },
              { value: 'location', label: 'Location' },
              { value: 'investissement', label: 'Investissement' },
            ],
            onChange: setEquipe,
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
              { value: 'prospection', label: 'Prospection' },
              { value: 'manuel', label: 'Manuel' },
            ],
            onChange: () => undefined,
          },
          {
            key: 'objectif',
            label: 'Objectif',
            value: 'tous',
            options: [
              { value: 'tous', label: 'Tous' },
              { value: 'ca', label: 'CA' },
              { value: 'mandats', label: 'Mandats' },
            ],
            onChange: () => undefined,
          },
        ]}
        activeFiltersCount={2}
      />

      <EquipeKpiRow kpis={kpis} />

      <div className="flex-1 min-h-0 px-3 py-2.5 grid grid-cols-[minmax(0,1.9fr)_minmax(320px,1fr)] gap-2.5 overflow-hidden">
        <div className="min-h-0 flex flex-col gap-2">
          <div className="flex-1 min-h-0">
            <CollaborateurTable
              collaborateurs={COLLABORATEURS}
              visibleCols={cols}
              onToggleCol={setCols}
              onOpenCollaborateur={openCollab}
              selectedId={selectedId ?? undefined}
            />
          </div>
          <LeadsUnassignedBanner
            count={EQUIPE_KPI_SUMMARY.leads_unassigned}
            olderThan48h={EQUIPE_KPI_SUMMARY.leads_unassigned_48h}
            onAssign={() => setAssignOpen(true)}
          />
        </div>

        <div className="min-h-0">
          <SanteCoachingPanel
            watchItems={WATCH_ITEMS}
            adoptionMetrics={ADOPTION_METRICS}
            adoptionScore={ADOPTION_SCORE}
            coachingInsights={COACHING_INSIGHTS}
          />
        </div>
      </div>

      <CollaborateurDrawer collab={selectedCollab} onClose={closeDrawer} />
      <AssignModal
        open={assignOpen}
        onClose={() => setAssignOpen(false)}
        leadsCount={EQUIPE_KPI_SUMMARY.leads_unassigned}
        collaborateurs={COLLABORATEURS}
      />
    </div>
  );
};

export default VueEquipePage;
