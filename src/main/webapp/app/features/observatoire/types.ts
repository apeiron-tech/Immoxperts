export type ZoneType =
  | 'commune'
  | 'arrondissement'
  | 'quartier'
  | 'iris'
  | 'adresse'
  | 'zone_custom'
  | 'zone_suivie';

export interface ZoneRef {
  zone_id: string;
  label: string;
  type: ZoneType;
  parent_label?: string;
  code_insee?: string;
  code_postal?: string;
  iris_code?: string;
  centroid?: { lat: number; lon: number };
  geometry_available: boolean;
}

export type ConfidenceLevel = 'faible' | 'moyenne' | 'forte' | 'tres_forte';

export interface ConfidenceReason {
  label: string;
  status: 'positive' | 'neutral' | 'warning';
  detail: string;
}

export interface Confidence {
  level: ConfidenceLevel;
  score: number;
  reasons: ConfidenceReason[];
}

/* ----- Marché ----- */

export type MarketMode = 'vente' | 'location' | 'rendement';

export interface MarketQuery {
  zone_id: string;
  mode: MarketMode;
  property_type: 'all' | 'appartement' | 'maison';
  segment?: 'studio_t1' | 't2' | 't3' | 't4_plus' | 'custom';
  period: '6m' | '12m' | '24m' | '5y' | '10y';
  source: 'dvf' | 'annonces' | 'mixed';
}

export interface MarketKpi {
  id: string;
  label: string;
  value: string;
  helper: string;
  trend?: 'up' | 'down' | 'flat';
  trend_label?: string;
  confidence?: ConfidenceLevel;
}

export interface MarketRange {
  low: number;
  median: number;
  high: number;
  unit: 'eur_m2' | 'eur_m2_hc' | 'percent';
  period_label: string;
}

export interface MarketTimeSeriesPoint {
  period: string;
  median: number;
  low?: number;
  high?: number;
  volume?: number;
}

export interface MarketSegmentRow {
  segment_id: string;
  label: string;
  median_value: number;
  volume: number;
  evolution_12m_pct?: number;
  confidence: ConfidenceLevel;
}

export interface MarketComparable {
  comparable_id: string;
  status: 'vendu' | 'en_vente' | 'invendu' | 'a_louer' | 'loue' | 'expire';
  address_label: string;
  distance_m?: number;
  surface_m2: number;
  rooms?: number;
  price?: number;
  rent_hc?: number;
  value_per_m2: number;
  date: string;
}

export interface NeighborZone {
  zone_id: string;
  label: string;
  code_postal: string;
  median_value: number;
  evolution_12m_pct: number;
  volume: number;
  confidence: ConfidenceLevel;
}

export interface MarketDistributionBin {
  min: number;
  max: number;
  count: number;
  share_pct: number;
}

/* ----- Tension ----- */

export type TensionMode = 'vente' | 'location';

export type TensionLabel =
  | 'tres_ralenti'
  | 'ralenti'
  | 'equilibre'
  | 'dynamique'
  | 'tres_dynamique';

export interface TensionScore {
  value: number;
  label: TensionLabel;
  explanation: string;
  components: TensionScoreComponent[];
}

export interface TensionScoreComponent {
  id: string;
  label: string;
  value: string;
  direction: 'ralentit' | 'soutient' | 'neutre';
  detail: string;
}

export interface TensionDelayStats {
  fast_days: number;
  median_days: number;
  slow_days: number;
  period_label: string;
  distribution: { bucket: string; share_pct: number }[];
}

export interface TensionStockStats {
  active_count: number;
  evolution_pct: number;
  period_label: string;
  by_segment: {
    segment_id: string;
    label: string;
    count: number;
    evolution_pct?: number;
  }[];
}

export interface PriceRevisionStats {
  revision_rate_pct: number;
  median_revision_pct: number;
  median_days_before_revision?: number;
  by_segment: {
    segment_id: string;
    label: string;
    revision_rate_pct: number;
    median_revision_pct: number;
  }[];
}

export interface AncienneAnnonce {
  id: string;
  label: string;
  rooms: number;
  surface: number;
  price?: number;
  rent_hc?: number;
  age_days: number;
  signal_label: string;
}

export interface TensionSegmentRow {
  segment_id: string;
  label: string;
  score: number;
  label_score: TensionLabel;
  delay_median: number;
  stock: number;
  revision_pct: number;
}

export interface TensionSignal {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  actions: string[];
}

/* ----- Contexte local ----- */

export type LocalContextTab = 'profil' | 'cadre_vie' | 'potentiel';

export type PersonaId =
  | 'agent'
  | 'investisseur'
  | 'bailleur'
  | 'acquereur'
  | 'vendeur';

export interface LocalContextKpi {
  id: string;
  label: string;
  value: string;
  helper: string;
  trend?: 'up' | 'down' | 'flat';
  trend_label?: string;
  status?: 'positive' | 'neutral' | 'warning' | 'critical';
  confidence?: ConfidenceLevel;
}

export interface LocalProfile {
  population: number;
  households: number;
  median_income_monthly: number;
  median_age: number;
  tenant_share_pct: number;
  owner_share_pct: number;
  unemployment_pct: number;
  students_pct: number;
  age_distribution: { bucket: string; share_pct: number }[];
  csp_distribution: { label: string; share_pct: number }[];
  housing_typology: { bucket: string; share_pct: number }[];
  dominant_target_profile:
    | 'etudiant'
    | 'jeune_actif'
    | 'couple_sans_enfant'
    | 'famille'
    | 'senior'
    | 'mixte';
  demand_depth: 'forte' | 'correcte' | 'etroite';
  required_income_monthly: number;
  eligible_population_share_pct: number;
}

export type Grade = 'A' | 'B' | 'C' | 'D' | 'E';

export interface ScoreDimension {
  score: number;
  grade: Grade;
  nearest_distance_m?: number;
  count_5min?: number;
  count_10min?: number;
  detail?: string;
}

export interface LifestyleScore {
  global_score: number;
  global_grade: Grade;
  dimensions: {
    transports: ScoreDimension;
    commerces: ScoreDimension;
    sante: ScoreDimension;
    education: ScoreDimension;
    services: ScoreDimension;
    vie_quartier: ScoreDimension;
  };
  strengths: string[];
  warnings: string[];
  transports_detail: { mode: string; stars: number; description: string }[];
  commerces_detail: { label: string; count: number; icon: string }[];
  education_detail: { label: string; stars: number; detail: string }[];
  environnement_detail: { label: string; stars: number; detail: string }[];
}

export type Verdict =
  | 'favorable'
  | 'neutre'
  | 'a_surveiller'
  | 'contraint'
  | 'defavorable';

export interface UrbanPotential {
  score: number;
  grade: Grade;
  verdict: Verdict;
  verdict_label: string;
  plu_zone: string;
  plu_destination: string;
  plu_height_max: string;
  plu_emprise_max: string;
  plu_servitudes: string;
  plu_abf: string;
  cadastre: {
    reference: string;
    surface_parcelle: number;
    surface_batie: number;
    surface_libre: number;
    emprise_au_sol_pct: number;
    nb_batiments: number;
  };
  permits_count_500m: number;
  permits: {
    type: 'PC' | 'DP' | 'PA' | 'PD';
    statut: string;
    date: string;
    projet: string;
    logements?: number;
    distance_m: number;
  }[];
  dpe_distribution: { grade: Grade | 'F/G' | 'A/B' | 'C/D'; share_pct: number; color: string }[];
  dpe_f_g_share_pct: number;
  dpe_evolution_pct: number;
  reglementations: { label: string; status: string; impact_level: 'ok' | 'warning' | 'critical' }[];
  transformabilite: { label: string; level: 'simple' | 'pertinente' | 'a_verifier' | 'contraint' | 'vigilance' }[];
  strengths: string[];
  warnings: string[];
  horizon: string;
}

export interface PoiMapItem {
  id: string;
  x: number;
  y: number;
  kind: 'transport' | 'commerce' | 'ecole' | 'sante' | 'service' | 'parc' | 'permis' | 'dpe_fg' | 'projet';
  label?: string;
}
