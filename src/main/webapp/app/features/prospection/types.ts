// Prospection — types partagés (V1)
// Cf. docs/20_PROSPECTION.md §4

export type SignalSource = 'annonce' | 'dvf' | 'dpe' | 'zone';

export type SignalStatus =
  | 'nouveau'
  | 'vu'
  | 'a_traiter'
  | 'a_qualifier'
  | 'en_cours'
  | 'converti_action'
  | 'converti_lead'
  | 'suivi'
  | 'ignore'
  | 'archive';

export type SignalPriority = 'haute' | 'moyenne' | 'basse';

export type GeoPrecision = 'exacte' | 'adresse_approx' | 'quartier' | 'iris' | 'zone';

export type ClasseDPE = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';

export interface ScoreContributor {
  label: string;
  contribution: number;
  detail?: string;
}

export interface User {
  user_id: string;
  prenom: string;
  nom: string;
  color: string; // couleur d'avatar de fallback
}

export interface SignalBase {
  signal_id: string;
  source: SignalSource;
  type: string;
  title: string;
  subtitle: string;

  geo_precision: GeoPrecision;
  lat?: number;
  lon?: number;
  adresse?: string;
  ville: string;
  code_postal?: string;
  quartier?: string;

  score: number;
  score_breakdown: ScoreContributor[];
  priority: SignalPriority;
  status: SignalStatus;

  bien_id?: string;
  annonce_id?: string;
  vente_dvf_id?: string;
  lead_id?: string;
  action_id?: string;
  estimation_id?: string;
  alerte_id?: string;
  opportunite_id?: string;

  assignee_id?: string;

  explanation_short: string;
  explanation_long?: string;
  tags: string[];

  detected_at: string;
  created_at: string;
  updated_at: string;
}

// ---- DVF -----------------------------------------------------------------
export type DVFSignalType =
  | 'vente_proche'
  | 'detention_longue'
  | 'revente_rapide'
  | 'cycle_revente_regulier'
  | 'zone_rotation_forte'
  | 'ecart_marche'
  | 'comparables_denses';

export interface DVFPayload {
  date_vente?: string;
  prix_vente?: number;
  prix_m2?: number;
  surface_m2?: number;
  type_bien?: 'appartement' | 'maison' | 'local' | 'terrain';
  type_acquereur?: 'particulier' | 'sci' | 'personne_morale';
  duree_detention_ans?: number;
  duree_detention_mois?: number;
  nb_mutations_10_ans?: number;
  ecart_vs_marche_pct?: number;
  prix_median_secteur?: number;
  volume_mutations_30j?: number;
  delai_median_vente_j?: number;
}

export interface SignalDVF extends SignalBase {
  source: 'dvf';
  type: DVFSignalType;
  is_territorial: boolean;
  dvf_payload: DVFPayload;
}

// ---- DPE -----------------------------------------------------------------
export type DPESignalKind = 'business' | 'support';

export type DPESignalType =
  | 'vendeur_probable'
  | 'bailleur_a_arbitrer'
  | 'potentiel_renovation'
  | 'opportunite_investisseur'
  | 'passoire_thermique'
  | 'risque_locatif'
  | 'poche_passoires'
  | 'revalorisation_apres_travaux';

export const DPE_KIND_MAP: Record<DPESignalType, DPESignalKind> = {
  vendeur_probable: 'business',
  bailleur_a_arbitrer: 'business',
  potentiel_renovation: 'business',
  opportunite_investisseur: 'business',
  passoire_thermique: 'support',
  risque_locatif: 'support',
  poche_passoires: 'support',
  revalorisation_apres_travaux: 'support',
};

export interface DPEPayload {
  classe_dpe?: ClasseDPE;
  date_dpe?: string;
  type_bien?: 'appartement' | 'maison';
  surface_m2?: number;
  usage_probable?: 'residence_principale' | 'locatif' | 'vacant' | 'inconnu';
  zone_tendue?: boolean;
  potentiel_gain_classe?: number;
  loyer_ou_valeur_apres_travaux_pct?: number;
  risque_reglementaire?: 'faible' | 'moyen' | 'fort';
  conso_energie_kwh_m2_an?: number;
  ges_kgco2_m2_an?: number;
  travaux_estimes_euros?: number;
}

export interface SignalDPE extends SignalBase {
  source: 'dpe';
  type: DPESignalType;
  kind: DPESignalKind;
  support_types?: DPESignalType[];
  dpe_payload: DPEPayload;
}

// ---- Annonce -------------------------------------------------------------
export type AnnonceSignalType =
  | 'baisse_prix'
  | 'remise_en_ligne'
  | 'annonce_ancienne'
  | 'anomalie_prix_m2'
  | 'zone_suivie_active';

export interface AnnoncePayload {
  prix_actuel: number;
  prix_initial?: number;
  variation_pct?: number;
  date_mise_en_ligne: string;
  age_jours: number;
  prix_m2?: number;
  ecart_prix_m2_secteur_pct?: number;
}

export interface SignalAnnonce extends SignalBase {
  source: 'annonce';
  type: AnnonceSignalType;
  annonce_payload: AnnoncePayload;
}

export type SignalProspection = SignalDVF | SignalDPE | SignalAnnonce;

// ---- Méta-signal Radar --------------------------------------------------
export interface MetaSignalRadar {
  meta_id: string;
  bien_id: string;
  sources: SignalSource[];

  score_agrege: number;
  priority_agregee: SignalPriority;
  status_agrege: SignalStatus;
  reasons_short: string[];

  ville: string;
  code_postal?: string;
  adresse?: string;
  lat?: number;
  lon?: number;

  children: SignalProspection[];

  assignee_id?: string;

  created_at: string;
  updated_at: string;
}

// ---- Zone Radar ---------------------------------------------------------
export interface ZoneRadar {
  zone_id: string;
  label: string;
  type: 'quartier' | 'iris' | 'commune' | 'zone_custom';
  ville: string;
  code_postal?: string;

  score_zone: number;
  nb_signaux_total: number;
  nb_signaux_annonce: number;
  nb_signaux_dvf: number;
  nb_signaux_dpe: number;
  nb_biens_concernes: number;

  tendance_7j: 'hausse' | 'stable' | 'baisse';
  tendance_30j: 'hausse' | 'stable' | 'baisse';
  evolution_pct?: number;

  priorite: 'chaude' | 'interessante' | 'froide';

  reasons: string[];

  centroid_lat?: number;
  centroid_lon?: number;
}

// ---- Vues enregistrées ---------------------------------------------------
export interface VueEnregistree {
  vue_id: string;
  nom: string;
  sous_section: 'radar' | 'signaux_dvf' | 'signaux_dpe';
  user_id: string;
  is_shared: boolean;
  filters: Record<string, unknown>;
  preset?: string;
  period: '24h' | '7j' | '30j' | '90j' | '12m' | '24m';
  sort?: string;
  view_mode?: 'table' | 'carte' | 'split';
  visible_columns?: string[];
  created_at: string;
  updated_at: string;
}

// ---- Event timeline -----------------------------------------------------
export type EventType =
  | 'signal_detecte'
  | 'signal_vu'
  | 'signal_assigne'
  | 'action_creee'
  | 'lead_cree'
  | 'estimation_creee'
  | 'suivi_ajoute'
  | 'commentaire_ajoute'
  | 'signal_ignore';

export interface SignalEvent {
  event_id: string;
  signal_id: string;
  type: EventType;
  timestamp: string;
  actor_id?: string;
  actor_name?: string;
  payload?: Record<string, unknown>;
  label: string;
}

// ---- Helpers -----------------------------------------------------------
export type PeriodKey = '24h' | '7j' | '30j' | '90j' | '12m' | '24m';

export type ViewMode = 'table' | 'carte' | 'split';

export type SortKey =
  | 'score_desc'
  | 'score_asc'
  | 'pertinence_desc'
  | 'date_vente_desc'
  | 'date_vente_asc'
  | 'prix_m2_desc'
  | 'duree_detention_desc'
  | 'date_detection_desc'
  | 'classe_dpe_desc'
  | 'potentiel_desc'
  | 'date_dpe_asc';
