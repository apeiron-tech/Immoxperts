// ── Backbone types pour le module Veille (cf docs/22_VEILLE.md §4) ─────

// Alertes
export type AlerteTargetType = 'bien' | 'zone' | 'recherche' | 'agence';
export type AlerteDomain = 'prix' | 'annonce' | 'dpe' | 'urbanisme' | 'marche' | 'concurrence';
export type AlerteStatus = 'active' | 'paused' | 'archived';
export type AlertePriority = 'info' | 'moyenne' | 'haute';
export type AlerteChannel = 'in_app' | 'email';
export type AlerteFrequency = 'immediate' | 'daily' | 'weekly';
export type AlerteSourceModule =
  | 'veille'
  | 'biens'
  | 'prospection'
  | 'observatoire'
  | 'estimation'
  | 'investissement'
  | 'leads'
  | 'rapport';

export interface AlerteCondition {
  field: string;
  operator:
    | 'equals'
    | 'not_equals'
    | 'greater_than'
    | 'less_than'
    | 'between'
    | 'contains'
    | 'in'
    | 'changed'
    | 'decreased_by'
    | 'increased_by';
  value: unknown;
  label: string;
}

export interface Alerte {
  id: string;
  created_by: string;
  assigned_to?: string;

  name: string;
  description?: string;

  domain: AlerteDomain;
  target_type: AlerteTargetType;
  target_id: string;
  target_label: string;
  target_secondary_label?: string;

  conditions: AlerteCondition[];

  frequency: AlerteFrequency;
  channels: AlerteChannel[];
  priority: AlertePriority;

  status: AlerteStatus;

  last_triggered_at?: string;
  last_trigger_label?: string;
  triggers_count_7d: number;
  triggers_count_30d: number;
  treated_rate_30d: number;
  avg_treatment_time_hours?: number;

  source_module: AlerteSourceModule;

  health_status: 'healthy' | 'silent' | 'noisy' | 'error';

  created_at: string;
  updated_at: string;
}

// Notifications
export type NotificationSourceType =
  | 'alerte'
  | 'bien_suivi'
  | 'prospection'
  | 'observatoire'
  | 'estimation'
  | 'investissement'
  | 'agence_concurrente'
  | 'rapport'
  | 'system';

export type NotificationObjectType =
  | 'bien'
  | 'annonce'
  | 'zone'
  | 'alerte'
  | 'agence'
  | 'lead'
  | 'action'
  | 'dossier'
  | 'rapport'
  | 'opportunite'
  | 'estimation';

export type NotificationStatus = 'unread' | 'read' | 'todo' | 'done' | 'ignored';
export type NotificationPriority = 'info' | 'moyenne' | 'haute';

export type RecommendedAction =
  | 'ouvrir_bien'
  | 'ouvrir_annonce'
  | 'ouvrir_zone'
  | 'creer_action'
  | 'creer_lead'
  | 'rattacher_lead'
  | 'lancer_estimation'
  | 'ouvrir_analyse'
  | 'creer_alerte'
  | 'ouvrir_observatoire'
  | 'ajouter_comparatif'
  | 'creer_dossier'
  | 'preparer_message'
  | 'mettre_a_jour_suivi'
  | 'ignorer';

export interface NotificationLink {
  label: string;
  route: string;
  module: string;
  count?: number;
}

export interface NotificationVeille {
  id: string;
  user_id: string;

  source_type: NotificationSourceType;
  source_id: string;

  object_type: NotificationObjectType;
  object_id: string;

  title: string;
  message: string;
  explanation: string;
  business_impact: string;

  priority: NotificationPriority;
  status: NotificationStatus;

  recommended_action: RecommendedAction;
  secondary_actions: RecommendedAction[];

  freshness_label: string;
  event_at: string;
  created_at: string;

  read_at?: string;
  done_at?: string;
  ignored_at?: string;

  assigned_to?: string;

  is_aggregated: boolean;
  aggregate_count?: number;
  triggering_alertes: string[];

  metadata: Record<string, unknown>;
  links: NotificationLink[];
}

// Biens suivis
export type BienSuiviSource =
  | 'annonces'
  | 'portefeuille'
  | 'dvf'
  | 'prospection'
  | 'investissement'
  | 'estimation'
  | 'observatoire'
  | 'fiche_bien'
  | 'manuel';

export type BienSuiviStatus = 'active' | 'paused' | 'archived';

export type BienSuiviEventType =
  | 'baisse_prix'
  | 'hausse_prix'
  | 'nouvelle_annonce'
  | 'sortie_publication'
  | 'remise_en_ligne'
  | 'nouvelle_source'
  | 'dpe_detecte'
  | 'concurrent_detecte'
  | 'vente_dvf_proche'
  | 'variation_marche'
  | 'analyse_invest_maj'
  | 'rapport_ouvert'
  | 'note_ajoutee';

export type ScoreInteretLabel = 'forte_opportunite' | 'a_surveiller' | 'faible_priorite';

export type PortailSource = 'SeLoger' | 'Leboncoin' | "Bien'ici" | 'PAP' | 'Logic Immo';

export type DpeClasse = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';

export interface ScoreContributor {
  key: 'variation_prix' | 'tension_zone' | 'anciennete_annonce' | 'pression_concurrent';
  label: string;
  contribution: number;
  detail?: string;
}

export interface BienSuivi {
  id: string;
  bien_id: string;
  followed_by: string;
  assigned_to?: string;

  source: BienSuiviSource;
  source_portail?: PortailSource;
  source_id?: string;
  source_label: string;

  // Infos bien (pour l'affichage en démo)
  type_bien: 'Appartement' | 'Maison' | 'Studio' | 'Loft';
  pieces?: number;
  surface: number;
  etage?: string;
  annee_construction?: number;
  charges_mois?: number;
  adresse: string;
  ville: string;
  code_postal: string;
  latitude: number;
  longitude: number;
  dpe: DpeClasse;

  prix_actuel: number;
  prix_precedent?: number;
  variation_pct?: number;
  variation_eur?: number;
  prix_m2: number;

  statut_annonce: 'Actif' | 'Baisse' | 'Remis en ligne' | 'Expiré';
  photo_url?: string;

  reason?: string;
  status: BienSuiviStatus;

  alertes_actives: string[];
  notifications_unread_count: number;

  last_event_at?: string;
  last_event_type?: BienSuiviEventType;
  last_event_label?: string;

  score_interet: number;
  score_label: ScoreInteretLabel;
  score_breakdown: ScoreContributor[];

  // Liens inter-modules (démo)
  estimation_valeur?: number;
  analyse_tri_pct?: number;
  leads_count: number;
  dossier_name?: string;

  created_at: string;
  updated_at: string;
}

// Agences concurrentes
export interface AgenceZone {
  zone_id: string;
  label: string;
  strength: 'faible' | 'moyenne' | 'forte';
  stock_actif: number;
  part_de_marche?: number;
  evolution_part_30d?: number;
}

export interface AgenceConcurrente {
  id: string;

  name: string;
  siren?: string;
  siret?: string;
  carte_t?: string;
  adresse?: string;
  ville: string;
  code_postal?: string;
  latitude?: number;
  longitude?: number;
  logo_initials: string;
  logo_color: string;

  zones: AgenceZone[];
  zone_principale: string;

  stock_actif: number;
  nouvelles_annonces_7d: number;
  nouvelles_annonces_30d: number;
  baisses_prix_30d: number;
  annonces_anciennes_count: number;

  delai_moyen_jours?: number;
  prix_moyen_m2?: number;
  loyer_moyen_m2?: number;
  types_biens_dominants: string[];

  biens_similaires_count: number;
  mandats_simples_concurrents_count: number;
  has_mandat_simple_sous_pression: boolean;

  followed: boolean;
  status_suivi: 'Sous surveillance' | 'Concurrent détecté' | 'Mandat simple sous pression';
  alertes_actives: string[];

  last_event_at?: string;
  last_event_type?: string;
  last_event_label?: string;

  created_at: string;
  updated_at: string;
}

// Consentement
export type ConsentStatus = 'unknown' | 'opt_in' | 'contractual' | 'do_not_contact';

// Utilisateurs (stub démo)
export interface UserLite {
  id: string;
  name: string;
  initials: string;
  color: string;
}
