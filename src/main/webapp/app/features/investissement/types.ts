export type Persona = 'agent' | 'investor' | 'hybrid';

export type LocataireType = 'etudiant' | 'jeune_actif' | 'couple_sans_enfant' | 'famille' | 'senior' | 'mixte';
export type Profondeur = 'forte' | 'correcte' | 'etroite';

export interface LocataireProfile {
  type_dominant: LocataireType;
  types_secondaires: LocataireType[];
  profondeur_demande: Profondeur;
  revenu_indicatif_requis: number;
  taux_effort_reference: number;
  part_population_eligible: number;
  niveau_confiance: 'faible' | 'moyen' | 'eleve';
  sources: string[];
}

export type StrategyType =
  | 'patrimonial'
  | 'equilibree'
  | 'rendement'
  | 'cashflow'
  | 'travaux'
  | 'colocation'
  | 'meuble'
  | 'autre';

export type OccupancyMode = 'nu' | 'meuble' | 'colocation' | 'courte_duree' | 'mixte';
export type PropertyType = 'studio' | 't1' | 't2' | 't3' | 't4_plus' | 'immeuble' | 'local' | 'maison';
export type DPE = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';

export interface ProjetInvestisseur {
  project_id: string;
  name: string;
  owner_user_id: string;
  porteur_type: 'self' | 'lead' | 'client';
  porteur_id?: string;
  target_zones: string[];
  budget_min: number;
  budget_max: number;
  down_payment_target: number;
  strategy_type: StrategyType;
  yield_target: number;
  cashflow_target: number;
  holding_period: number;
  preferred_property_types: PropertyType[];
  occupancy_mode_target: OccupancyMode;
  works_tolerance: 'aucun' | 'legers' | 'moyens' | 'lourds';
  risk_tolerance: 'prudent' | 'equilibre' | 'offensif';
  taux_effort_reference: number;
  tmi: number;
  nombre_parts: number;
  profil_locataire_cible?: LocataireProfile;
  notes: string;
  status: 'actif' | 'pause' | 'archive';
  created_at: string;
  updated_at: string;
  nb_opportunites: number;
  progression_pct: number;
}

export type OpportunityStatus = 'nouveau' | 'a_qualifier' | 'compare' | 'a_arbitrer' | 'suivi' | 'ecarte';
export type SourceType =
  | 'annonce'
  | 'bien_suivi'
  | 'portefeuille'
  | 'manuel'
  | 'dvf_ref'
  | 'projet_vierge'
  | 'suggestion';

export interface ScoreBreakdown {
  rendement: number;
  marche: number;
  risque: number;
  potentiel: number;
  coherence_projet: number;
}

export interface BienInfo {
  adresse: string;
  ville: string;
  code_postal: string;
  quartier: string;
  type: PropertyType;
  surface: number;
  pieces: number;
  chambres: number;
  etage: number;
  nb_etages: number;
  annee: number;
  dpe: DPE;
  ges: DPE;
  charges_copro: number;
  taxe_fonciere: number;
  photo_url: string;
  source_plateforme?: 'SeLoger' | 'Leboncoin' | 'MeilleursAgents' | "Bien'ici" | 'LogicImmo';
  signaux: string[];
}

export interface Opportunity {
  opportunity_id: string;
  project_id: string;
  bien_id: string | null;
  source_type: SourceType;
  source_plateforme?: string;
  source_id: string;
  status: OpportunityStatus;
  bien: BienInfo;
  prix_affiche: number;
  prix_m2: number;
  loyer_estime: number;
  score_overall: number;
  score_breakdown: ScoreBreakdown;
  current_scenario_id: string;
  ancienneté_annonce_jours: number;
  baisse_prix: boolean;
  favori: boolean;
  first_detected_at: string;
  last_analyzed_at?: string;
  created_at: string;
  updated_at: string;
  profil_cible: LocataireProfile;
  lead_id?: string;
  dossier_id?: string;
}

export type FiscalRegime =
  | 'micro_foncier'
  | 'reel_foncier'
  | 'lmnp_micro'
  | 'lmnp_reel'
  | 'lmp'
  | 'sci_ir'
  | 'sci_is'
  | 'courte_duree';

export interface ScenarioInvest {
  scenario_id: string;
  opportunity_id: string;
  label: string;
  is_default: boolean;
  occupancy_mode: OccupancyMode;
  fiscal_regime: FiscalRegime;
  holding_structure: 'nom_propre' | 'sci_ir' | 'sci_is';
  millesime_fiscal: number;
  financing: {
    achat_cash: boolean;
    apport: number;
    montant_emprunte: number;
    taux: number;
    duree_annees: number;
    assurance_taux: number;
    differe_mois: number;
    frais_bancaires: number;
    travaux_finances: boolean;
    mobilier_finance: boolean;
  };
  assumptions: {
    prix_achat: number;
    frais_acquisition: number;
    travaux: number;
    ameublement: number;
    loyer_mensuel_hc: number;
    charges_recuperables: number;
    charges_non_recup: number;
    taxe_fonciere: number;
    vacance_mois_par_an: number;
    gestion_locative_pct: number;
    gli_pct: number;
    revalorisation_loyer_annuelle: number;
    revalorisation_prix_annuelle: number;
    horizon_annees: number;
  };
  tmi: number;
  nombre_parts: number;
  results: {
    mensualite: number;
    prix_total_projet: number;
    rendement_brut: number;
    rendement_net: number;
    rendement_net_net: number;
    cash_on_cash: number;
    cashflow_avant_impot_mensuel: number;
    cashflow_apres_impot_mensuel: number;
    tri_10_ans: number;
    dscr: number;
    effort_mensuel: number;
    impot_annuel: number;
    patrimoine_net_10ans: number;
  };
  status: 'brouillon' | 'valide' | 'archive';
}

export type DossierStatus =
  | 'brouillon'
  | 'analyse_prete'
  | 'finalise'
  | 'envoye'
  | 'ouvert'
  | 'archive';

export interface ShareToken {
  token: string;
  profile: 'complet' | 'synthese';
  recipient_label: string;
  created_at: string;
  opened_count: number;
  last_opened_at?: string;
}

export interface DossierInvestissement {
  dossier_id: string;
  project_id?: string;
  opportunity_id?: string;
  scenario_id?: string;
  title: string;
  subtitle?: string;
  client_name?: string;
  porteur_user_id: string;
  auteur_nom: string;
  ville: string;
  strategy: StrategyType;
  regime_principal: FiscalRegime;
  bien_label: string;
  photo_url: string;
  kpis: {
    prix_total: number;
    cashflow_atf: number;
    rendement_net_net: number;
    tri_10_ans: number;
    score: number;
  };
  profil_cible: LocataireProfile;
  status: DossierStatus;
  version: number;
  created_at: string;
  updated_at: string;
  last_opened_at?: string;
  share_tokens: ShareToken[];
  created_from: 'opportunite' | 'projet_vierge' | 'comparatif' | 'duplicata' | 'annonce' | 'portefeuille';
  created_from_label?: string;
  snapshot_date: string;
  last_sync_at: string;
}

export type ComparaisonType = 'biens' | 'scenarios' | 'mixte' | 'villes';

export interface Comparaison {
  comparison_id: string;
  project_id: string;
  type: ComparaisonType;
  name: string;
  items: { ref_id: string; ref_type: string; label: string }[];
  source_context: string;
  verdict_propsight?: string;
  created_at: string;
  updated_at: string;
  created_by: string;
}

export interface Ville {
  id: string;
  nom: string;
  code_postal: string;
  distance?: string;
  prix_m2_median: number;
  loyer_m2_median: number;
  rendement_median: number;
  vacance_pct: number;
  tension: 'tres_faible' | 'faible' | 'moyenne' | 'elevee' | 'tres_elevee';
  profondeur: Profondeur;
  profil_dominant: LocataireType;
  evol_prix_5a: number;
  evol_loyers_5a: number;
  avis_note: number;
  signal_plu: 'favorable' | 'neutre' | 'a_surveiller' | 'defavorable';
  part_csp_plus: number;
  budget_min_compatible: number;
}

export interface BenchmarkPlacement {
  placement: string;
  rendement: number;
  liquidite: 'tres_faible' | 'faible' | 'moyenne' | 'elevee' | 'tres_elevee';
  risque: 'tres_faible' | 'faible' | 'moyen' | 'eleve';
  millesime: number;
}

export type Preset =
  | 'toutes'
  | 'cashflow'
  | 'patrimonial'
  | 'travaux_decote'
  | 'zone_potentiel'
  | 'risque_eleve'
  | 'suivis';

export type ViewMode = 'cards' | 'liste';
export type TriOpp =
  | 'date_desc'
  | 'score_desc'
  | 'coherence_desc'
  | 'cashflow_desc'
  | 'rendement_desc'
  | 'tri_desc'
  | 'prix_asc'
  | 'prix_m2_asc';
