// ── Types Équipe (cf docs/50_EQUIPE_PROPSIGHT.md §5) ──────────────────

export type CollaborateurRole = 'OWNER' | 'ADMIN' | 'AGENT' | 'VIEWER';
export type CollaborateurStatus = 'active' | 'invited' | 'disabled';

export type CollaborateurSpecialite =
  | 'vente'
  | 'achat'
  | 'location'
  | 'investissement'
  | 'estimation'
  | 'gestion_locative';

export interface ZoneRef {
  zone_id: string;
  slug: string;
  label: string;
}

export interface Collaborateur {
  user_id: string;
  organization_id: string;
  display_name: string;
  initials: string;
  avatar_color: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  role: CollaborateurRole;
  status: CollaborateurStatus;
  zones: ZoneRef[];
  specialites: CollaborateurSpecialite[];
  capacity_weekly_hours: number;
  last_seen_at: string;
  created_at: string;
  updated_at: string;

  // KPIs d'activité (période filtrée — mock pré-calculé)
  leads_actifs: number;
  actions_retard: number;
  actions_retard_haute: number;
  rdv_semaine: number;
  mandats: number;
  mandats_exclusifs: number;
  ca_pipe: number;
  ca_realise: number;
  estimations_30j: number;
  avis_envoyes_30j: number;
  etudes_locatives_30j: number;
  rapports_ouverts: number;
  signaux_traites_30j: number;
  signaux_non_traites: number;
  rapports_a_relancer: number;
  workload_score: number;
  workload_status: WorkloadStatus;
  trend_30j: number[];
}

// ── TeamScope ─────────────────────────────────────────────────────────
export type TeamScopeTypeV1 = 'agence';

export interface TeamScope {
  scope_id: string;
  type: TeamScopeTypeV1;
  label: string;
  parent_scope_id?: string | null;
  organization_id: string;
}

// ── Assignment ────────────────────────────────────────────────────────
export type AssignableObjectType =
  | 'lead'
  | 'action'
  | 'bien'
  | 'estimation'
  | 'avis_valeur'
  | 'etude_locative'
  | 'opportunite'
  | 'dossier'
  | 'alerte'
  | 'notification'
  | 'signal';

export interface Assignment {
  assignment_id: string;
  object_type: AssignableObjectType;
  object_id: string;
  assignee_id: string;
  assigned_by: string;
  assigned_at: string;
  status: 'active' | 'done' | 'reassigned' | 'archived';
  note?: string;
  recommendation_score?: number;
  recommendation_reason?: string;
}

// ── TeamObjective ─────────────────────────────────────────────────────
export type TeamObjectivePeriod = 'month' | 'quarter' | 'year';

export interface TeamObjective {
  objective_id: string;
  organization_id: string;
  scope_id?: string;
  collaborator_id?: string;
  period: TeamObjectivePeriod;
  period_label: string;
  period_start: string;
  period_end: string;
  ca_target: number;
  ca_pipe_target?: number;
  mandates_target: number;
  exclusive_mandates_target?: number;
  leads_target?: number;
  rdv_target?: number;
  avis_valeur_target?: number;
  etudes_locatives_target?: number;
  signaux_traites_target?: number;
  part_captee_target?: number;
  created_at: string;
  updated_at: string;
}

// ── WorkloadSnapshot ──────────────────────────────────────────────────
export type WorkloadStatus = 'disponible' | 'normal' | 'charge' | 'surcharge';

export interface WorkloadSnapshot {
  collaborator_id: string;
  period_start: string;
  period_end: string;

  actions_open: number;
  actions_overdue: number;
  rdv_count: number;
  visits_count: number;
  leads_active: number;
  dossiers_active: number;
  rapports_a_relancer: number;
  opportunites_a_qualifier: number;
  capacity_weekly_hours: number;

  workload_score: number;
  status: WorkloadStatus;
}

// ── TeamActivityItem ──────────────────────────────────────────────────
export type TeamActivitySourceModule =
  | 'leads'
  | 'estimation'
  | 'prospection'
  | 'veille'
  | 'biens'
  | 'investissement'
  | 'observatoire'
  | 'equipe';

export type TeamActivityObjectType =
  | AssignableObjectType
  | 'rapport'
  | 'zone'
  | 'mandat'
  | 'avis_valeur'
  | 'etude_locative';

export type TeamActivityPriority = 'haute' | 'moyenne' | 'basse';

export type TeamActivityStatus =
  | 'nouveau'
  | 'en_cours'
  | 'en_retard'
  | 'non_assigne'
  | 'a_relancer'
  | 'ouvert_sans_relance'
  | 'non_traite'
  | 'qualifie';

export interface TeamActivityItem {
  activity_id: string;
  type:
    | 'lead'
    | 'action'
    | 'relance'
    | 'rdv'
    | 'visite'
    | 'signal'
    | 'notification'
    | 'rapport'
    | 'estimation'
    | 'avis_valeur'
    | 'etude_locative'
    | 'opportunite'
    | 'dossier';
  title: string;
  subtitle?: string;
  object_type: TeamActivityObjectType;
  object_id: string;
  source_module: TeamActivitySourceModule;
  source_label: string;
  collaborator_id?: string;
  collaborator_label?: string;
  client_label?: string;
  client_contact?: string;
  adresse?: string;
  zone_slug?: string;
  zone_label?: string;
  derniere_action_label?: string;
  derniere_action_at?: string;
  prochaine_action_label?: string;
  prochaine_action_at?: string;
  age_days?: number;
  retard_days?: number;
  priority: TeamActivityPriority;
  status: TeamActivityStatus;
  event_at: string;
}

// ── CoachingInsight ───────────────────────────────────────────────────
export type CoachingInsightType =
  | 'adoption_faible'
  | 'conversion_bloquee_avis_valeur'
  | 'conversion_bloquee_etude_locative'
  | 'relance_manquante_rapport'
  | 'charge_elevee'
  | 'qualite_livrable_faible'
  | 'zone_sous_exploitee'
  | 'signaux_prospection_non_traites'
  | 'estimations_non_promues'
  | 'ecart_avm_non_justifie'
  | 'mandat_simple_sous_pression';

export interface CoachingInsight {
  insight_id: string;
  rule_id: string;
  scope: 'collaborateur' | 'equipe' | 'zone' | 'source';
  target_id?: string;
  target_label?: string;
  type: CoachingInsightType;
  title: string;
  explanation: string;
  recommended_action: string;
  cta_label: string;
  cta_target: string;
  priority: TeamActivityPriority;
  triggered_at: string;
  metric_snapshot?: Record<string, number>;
}

// ── WatchItem (À surveiller) ──────────────────────────────────────────
export type WatchItemColor = 'red' | 'orange' | 'yellow' | 'grey';

export interface WatchItem {
  id: string;
  color: WatchItemColor;
  title: string;
  subtitle?: string;
  cta_label: string;
  cta_target: string;
  priority: TeamActivityPriority;
}

// ── AdoptionMetric ────────────────────────────────────────────────────
export interface AdoptionMetric {
  id: string;
  label: string;
  value: number | string;
  total?: number;
  pct?: number;
  delta?: string;
  trend: 'up' | 'down' | 'flat';
}

// ── Absence ───────────────────────────────────────────────────────────
export type AbsenceType = 'conges' | 'maladie' | 'formation' | 'autre';

export interface Absence {
  absence_id: string;
  collaborator_id: string;
  collaborator_label: string;
  type: AbsenceType;
  period_start: string;
  period_end: string;
  note?: string;
  created_by: string;
  created_at: string;
}

// ── DeliverableQuality ────────────────────────────────────────────────
export type DeliverableType = 'avis_valeur' | 'etude_locative' | 'dossier_invest';

export type DeliverableQualityCriterion =
  | 'couverture_personnalisee'
  | 'comparables_selectionnes'
  | 'contexte_local_present'
  | 'justification_avm'
  | 'relance_programmee'
  | 'branding_agence'
  | 'photos_bien';

export interface DeliverableQuality {
  deliverable_id: string;
  deliverable_type: DeliverableType;
  collaborator_id: string;
  criteria: Record<DeliverableQualityCriterion, boolean>;
  is_complete: boolean;
  completeness_score: number;
  computed_at: string;
}

export interface DeliverableQualityAggregate {
  taux_rapports_complets: number;
  by_criterion: Record<DeliverableQualityCriterion, number>;
  by_type: { type: DeliverableType; count: number; completeness_pct: number }[];
  total_deliverables: number;
}

// ── PortfolioItem ─────────────────────────────────────────────────────
export type PortfolioObjectType =
  | 'bien'
  | 'estimation_rapide'
  | 'avis_valeur'
  | 'etude_locative'
  | 'opportunite'
  | 'dossier_invest'
  | 'mandat';

export type PortfolioRisk = 'bloque' | 'a_relancer' | 'ok';

export interface PortfolioItem {
  id: string;
  type: PortfolioObjectType;
  type_label: string;
  title: string;
  adresse: string;
  zone_label?: string;
  collaborator_id: string;
  collaborator_label: string;
  client_label?: string;
  statut: string;
  statut_tone: 'neutral' | 'success' | 'warning' | 'info' | 'violet' | 'danger';
  valeur?: number;
  valeur_label?: string;
  valeur_unit?: string;
  last_activity_at: string;
  last_activity_label: string;
  next_action_label?: string;
  quality_score?: number;
  risk: PortfolioRisk;
  risk_label: string;
  is_complete: boolean;
  ecart_avm_sup_5pct_sans_justif: boolean;
  has_relance: boolean;
}

// ── Agenda ────────────────────────────────────────────────────────────
export type AgendaEventType =
  | 'rdv_vendeur'
  | 'rdv_acquereur'
  | 'rdv_estimation'
  | 'visite'
  | 'appel'
  | 'email'
  | 'relance'
  | 'dossier'
  | 'preparation'
  | 'echeance_mandat'
  | 'action'
  | 'signature';

export interface AgendaEvent {
  id: string;
  collaborator_id: string;
  type: AgendaEventType;
  label: string;
  zone_label?: string;
  day: string;     // ISO date YYYY-MM-DD
  hour?: string;   // HH:MM
  tone: 'violet' | 'blue' | 'orange' | 'red' | 'green' | 'slate';
  related_object_id?: string;
  related_object_type?: AssignableObjectType | 'rapport';
}

export interface AgendaOverdueAction {
  id: string;
  label: string;
  collaborator_id: string;
  collaborator_label: string;
  retard_days: number;
  priority: TeamActivityPriority;
  cta_label: string;
}

export interface RebalancingSuggestion {
  id: string;
  type: 'charge' | 'leads_unassigned' | 'creneaux' | 'retards';
  title: string;
  explanation: string;
  cta_label: string;
  tone: 'violet' | 'orange' | 'red' | 'blue';
}

// ── Performance ───────────────────────────────────────────────────────
export type PeriodKey = '7j' | '30j' | '90j' | '12m';

export interface FunnelStage {
  key: string;
  label: string;
  value: number;
  pct_from_top: number;
  pct_from_previous: number;
}

export interface SourceConversionRow {
  source: string;
  leads: number;
  qualif_pct: number;
  rapports: number;
  mandats: number;
  ca_genere: number;
  delai_moyen_jours: number;
}

export interface MarcheZone {
  zone_id: string;
  slug: string;
  label: string;
  volume_dvf_12m: number;
  leads_equipe: number;
  mandats: number;
  part_captee_pct: number;
  part_moyenne_marche_pct: number;
  potentiel_ca: number;
  ca_realise_12m: number;
  tension_score: number;
  signal_label: string;
  signal_tone: 'violet' | 'green' | 'orange' | 'red';
}

export interface BusinessCollaboratorRow {
  collaborator_id: string;
  collaborator_label: string;
  ca_realise: number;
  ca_pipe: number;
  mandats_signes: number;
  taux_exclusivite_pct: number;
  commission_moyenne: number;
}

export interface AdoptionCollaboratorRow {
  collaborator_id: string;
  collaborator_label: string;
  estimations: number;
  rapports_envoyes: number;
  rapports_ouverts: number;
  relances: number;
  mandats: number;
  signal_label: string;
  signal_tone: 'violet' | 'green' | 'orange' | 'red' | 'slate';
}

export interface CaMonthlyPoint {
  label: string;
  ca_realise: number;
  mandats: number;
}

export interface MandatsStatusSlice {
  label: string;
  value: number;
  pct: number;
  tone: 'violet' | 'blue' | 'orange' | 'green' | 'slate';
}

export interface Hypotheses {
  taux_commission_pct: number;
  panier_moyen: number;
  taux_mandat_atteignable_pct: number;
  part_objectif_pct: number;
  periode_reference_mois: number;
}

// ── RdvBrief (drawer §10.9) ───────────────────────────────────────────
export interface RdvBrief {
  rdv_id: string;
  date: string;
  type_rdv: 'vendeur' | 'acquereur' | 'estimation' | 'visite';
  client_label: string;
  collaborator_label: string;
  bien_adresse: string;
  bien_type: string;
  bien_surface: number;
  bien_pieces: number;
  bien_annee: number;
  bien_dpe: string;
  estimation_min: number;
  estimation_median: number;
  estimation_max: number;
  last_interaction_type: string;
  last_interaction_by: string;
  last_interaction_at: string;
  last_interaction_summary: string;
  rapport_type: string;
  rapport_sent_at: string;
  rapport_opened_count: number;
  rapport_last_opened_at: string;
  points_defendus: string[];
  points_a_defendre: string[];
  prix_m2_median: number;
  evolution_12m: number;
  actions_recommandees: string[];
  timeline: RdvTimelineEntry[];
}

export interface RdvTimelineEntry {
  id: string;
  date: string;
  type: 'appel' | 'email' | 'ouverture_rapport' | 'action' | 'rdv' | 'note';
  label: string;
  by?: string;
}
