export type SourceModule =
  | 'leads'
  | 'pilotage'
  | 'biens'
  | 'prospection'
  | 'estimation'
  | 'investissement'
  | 'observatoire'
  | 'veille'
  | 'equipe'
  | 'widget'
  | 'agenda'
  | 'performance';

export type PropsightObjectType =
  | 'lead'
  | 'action'
  | 'bien'
  | 'annonce'
  | 'vente_dvf'
  | 'estimation'
  | 'rapport'
  | 'opportunite'
  | 'dossier'
  | 'alerte'
  | 'notification'
  | 'bien_suivi'
  | 'zone'
  | 'collaborateur'
  | 'rdv'
  | 'mandat';

export type DashboardScope = 'me' | 'equipe';
export type DashboardPersona = 'agent' | 'investor' | 'hybrid';
export type DashboardPeriod = '7j' | '30j' | 'trim' | '12m' | 'custom';

export type DashboardCtaAction = 'open_drawer' | 'open_route' | 'open_modal';

export interface DashboardCta {
  label: string;
  action: DashboardCtaAction;
  href?: string;
  drawer_ref?: string;
}

export interface DashboardKpi {
  id: string;
  label: string;
  value: string | number;
  context?: string;
  delta?: {
    value: string;
    trend: 'up' | 'down' | 'neutral';
    is_positive: boolean;
  };
  icon: string;
  source_module: SourceModule;
  href: string;
  action_label: string;
}

export type PriorityItemType =
  | 'lead_a_traiter'
  | 'action_en_retard'
  | 'rapport_ouvert_sans_relance'
  | 'rdv_du_jour'
  | 'rdv_a_preparer'
  | 'signature_imminente'
  | 'signal_prospection_chaud'
  | 'bien_suivi_mouvement'
  | 'opportunite_invest'
  | 'dossier_ouvert'
  | 'estimation_faible_confiance';

export type UrgencyLevel = 'en_retard' | 'aujourdhui' | 'cette_semaine' | 'a_surveiller';

export interface DashboardPriorityItem {
  id: string;
  rank: number;
  type: PriorityItemType;
  urgency: UrgencyLevel;
  urgency_label: string;
  title: string;
  subtitle: string;
  source_module: SourceModule;
  source_label: string;
  linked_object_type: PropsightObjectType;
  linked_object_id: string;
  priority_score: number;
  cta_primary: DashboardCta;
  cta_secondary?: DashboardCta;
}

export type AlertItemType =
  | 'bien_suivi_baisse_prix'
  | 'bien_suivi_retrait_annonce'
  | 'bien_suivi_prix_ajuste'
  | 'agence_concurrente_mandat'
  | 'rapport_rouvert_multiple'
  | 'signal_dpe'
  | 'signal_dvf'
  | 'signal_mandat_expire'
  | 'marche_zone_variation'
  | 'nouvelle_annonce_zone'
  | 'alerte_user_triggered'
  | 'systeme';

export interface DashboardAlertItem {
  id: string;
  rank: number;
  type: AlertItemType;
  icon: string;
  title: string;
  subtitle: string;
  source_module: SourceModule;
  source_label: string;
  linked_object_type?: PropsightObjectType;
  linked_object_id?: string;
  zone_label?: string;
  occurred_at: string;
  impact_score: number;
  cta_primary: DashboardCta;
  is_unread: boolean;
}

export type RapportType = 'avis_valeur' | 'etude_locative' | 'dossier_invest';

export type RapportEngagementState =
  | 'non_ouvert'
  | 'ouvert_passif'
  | 'chaud'
  | 'tres_chaud'
  | 'signe'
  | 'abandonne';

export interface DashboardRapportItem {
  id: string;
  rapport_id: string;
  type: RapportType;
  type_label: string;
  client: {
    name: string;
    linked_lead_id: string;
  };
  sent_at: string;
  sent_label: string;
  opens_count: number;
  last_opened_at: string | null;
  last_opened_label: string | null;
  engagement_state: RapportEngagementState;
  relance_status: 'jamais' | 'en_cours' | 'signee' | 'abandonnee';
  priority_engagement_score: number;
  cta_primary: DashboardCta;
}

export type PortfolioHealthCategoryId =
  | 'expirant_court_terme'
  | 'expirant_moyen_terme'
  | 'sans_mouvement_long'
  | 'overpricing'
  | 'mandat_simple_candidat_exclusif'
  | 'annonce_ancienne'
  | 'baisse_prix_recommandee';

export interface DashboardPortfolioHealthCategory {
  id: PortfolioHealthCategoryId;
  severity: 'critical' | 'warning' | 'info' | 'opportunity';
  icon: string;
  label: string;
  count: number;
  excerpt: string;
  linked_bien_ids: string[];
  cta: DashboardCta;
}

export interface DashboardPortfolioHealth {
  total_mandats_actifs: number;
  health_score: number;
  trend_30d: 'improving' | 'stable' | 'degrading';
  health_categories: DashboardPortfolioHealthCategory[];
}

export type PulseScope =
  | 'mon_portefeuille'
  | 'biens_suivis'
  | 'annonces_particuliers'
  | 'annonces_agences'
  | 'dvf_vendus';

export type PulseIndicator = 'nouveaux' | 'baisses_prix' | 'expires' | 'vendus';

export interface DashboardPulseCell {
  scope: PulseScope;
  indicator: PulseIndicator;
  value: number | null;
  delta_vs_previous?: {
    value: string;
    trend: 'up' | 'down' | 'neutral';
  };
  href: string;
}

export interface DashboardPulseMarket {
  zone_id: string;
  zone_label: string;
  period: DashboardPeriod;
  cells: DashboardPulseCell[];
  synthese: {
    prix_median_m2: number;
    evolution_12m_pct: number;
    tension: 'Faible' | 'Équilibrée' | 'Forte' | 'Très forte';
    volume_dvf_12m: number;
    confidence: 'faible' | 'moyenne' | 'forte';
  };
}

export type TerritoryItemType =
  | 'opportunite_invest'
  | 'bien_suivi_mouvement'
  | 'annonce_opportunite'
  | 'signal_radar'
  | 'signal_dvf'
  | 'signal_dpe'
  | 'signal_marche';

export type BadgeTone = 'violet' | 'blue' | 'green' | 'amber' | 'red' | 'gray';

export interface DashboardTerritoryItem {
  id: string;
  side: 'opportunites' | 'signaux';
  rank: number;
  type: TerritoryItemType;
  title: string;
  subtitle: string;
  score?: number;
  metric_label?: string;
  badge: {
    label: string;
    tone: BadgeTone;
  };
  source_module: SourceModule;
  linked_object_type: PropsightObjectType;
  linked_object_id: string;
  cta_primary: DashboardCta;
}

export interface DashboardQuickAction {
  id: string;
  label: string;
  subtitle?: string;
  icon: string;
  href: string;
  source_module: SourceModule;
}

export interface DashboardSummary {
  meta: {
    user_id: string;
    organization_id: string;
    persona: DashboardPersona;
    scope: DashboardScope;
    period: DashboardPeriod;
    zone_id: string | null;
    zone_label: string | null;
    generated_at: string;
  };
  kpis: DashboardKpi[];
  priorities: DashboardPriorityItem[];
  alerts: DashboardAlertItem[];
  rapports: DashboardRapportItem[];
  portfolio_health: DashboardPortfolioHealth;
  pulse_market: DashboardPulseMarket | null;
  territory: DashboardTerritoryItem[];
  counts: {
    total_priorities: number;
    total_alerts_unread: number;
    total_rapports_90j: number;
    total_opportunities: number;
  };
  quick_actions: DashboardQuickAction[];
}
