export type BienSource = 'portefeuille' | 'annonce' | 'dvf';
export type TypeBien = 'appartement' | 'maison' | 'local' | 'terrain' | 'parking';
export type StatutMandat =
  | 'mandat_exclusif'
  | 'mandat_simple'
  | 'sous_compromis'
  | 'estimation_en_cours'
  | 'prospection';
export type SourceAnnonce = 'seloger' | 'pap' | 'leboncoin' | 'logic_immo' | 'bienici';
export type StatutAnnonce = 'active' | 'baisse_prix' | 'remise_en_ligne' | 'expiree';
export type DPE = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | null;
export type FlagAnnonce = 'nouveau' | 'baisse_prix' | 'opportunite' | 'remise_en_ligne' | null;
export type SignalBien = 'baisse_prix' | 'nouvelle_annonce' | 'echeance' | 'hot';
export type TypeAcquereur = 'particulier' | 'sci' | 'personne_morale';

export interface Annonce {
  id: string;
  bien_id: string;
  source: SourceAnnonce;
  url_source: string;
  prix_affiche: number;
  prix_m2: number;
  publiee_le: string;
  statut: StatutAnnonce;
  evolution_prix: { date: string; prix: number }[];
  photos: string[];
  description: string;
}

export interface VenteDVF {
  id: string;
  bien_id: string | null;
  adresse: string;
  code_postal: string;
  ville: string;
  date_vente: string;
  prix_vente: number;
  surface_m2: number;
  prix_m2: number;
  pieces: number;
  type: TypeBien;
  type_acquereur: TypeAcquereur;
  utilise_comme_comparable: boolean;
  latitude: number;
  longitude: number;
  ref_dvf: string;
}

export interface FeatureContributive {
  feature: string;
  impact: 'positif' | 'negatif';
  poids: number;
}

export interface AVMResult {
  prix_estime: number;
  fourchette_basse: number;
  fourchette_haute: number;
  loyer_estime: number | null;
  loyer_fourchette: [number, number] | null;
  score_confiance: number;
  features_contributives: FeatureContributive[];
  comparables_utilises: string[];
}

export interface Evenement {
  id: string;
  bien_id: string;
  type:
    | 'annonce_detectee'
    | 'ajout_portefeuille'
    | 'ajout_suivi'
    | 'action_creee'
    | 'lead_rattache'
    | 'estimation_creee'
    | 'avis_valeur_promu'
    | 'analyse_invest'
    | 'dossier_cree'
    | 'alerte_declenchee'
    | 'changement_prix'
    | 'note_ajoutee';
  date: string;
  user: string | null;
  titre: string;
  detail?: string;
}

export interface ProchaineAction {
  libelle: string;
  date: string;
}

export interface LienModule {
  count: number;
  href?: string;
}

export interface Bien {
  id: string;
  source_principale: BienSource;

  adresse: string;
  code_postal: string;
  ville: string;
  latitude: number;
  longitude: number;
  geocoding_confidence: 'exact' | 'zone' | 'approx';

  type: TypeBien;
  surface_m2: number;
  pieces: number | null;
  etage: number | null;
  nb_etages?: number | null;
  annee_construction: number | null;
  dpe: DPE;

  statut_commercial: StatutMandat | null;
  responsable_nom: string | null;
  responsable_avatar: string | null;
  proprietaire_nom: string | null;
  proprietaire_lead_ref: string | null;
  reference_mandat: string | null;

  annonces: Annonce[];
  ventes_dvf_ids: string[];

  // Compteurs liens inter-modules
  estimations_count: number;
  avis_valeur_count: number;
  etudes_locatives_count: number;
  opportunites_count: number;
  dossier_ref: string | null;
  leads_count: number;
  actions_count: number;
  alertes_count: number;
  suivi: boolean;

  avm: AVMResult | null;

  photo_principale: string;
  photos: string[];

  // Portefeuille
  prochaine_action: ProchaineAction | null;

  // Annonces
  flag: FlagAnnonce;
  publie_il_y_a: string | null;

  signaux: SignalBien[];
  derniere_maj: string;
  evenements: Evenement[];

  created_at: string;
  updated_at: string;
}

export interface KpiTile {
  value: string | number;
  label: string;
  delta?: { value: string; direction: 'up' | 'down' | 'neutral' };
  sub?: string;
  highlight?: boolean;
  accent?: 'violet' | 'red' | 'green' | 'amber' | 'slate';
}

export type PeriodeKpi = '24h' | '7j' | '30j' | '90j' | '12m' | '24m';
export type VueBien = 'table' | 'cards' | 'carte' | 'liste';

export interface FiltresBiens {
  search: string;
  statuts: StatutMandat[];
  types: TypeBien[];
  responsables: string[];
  sources: SourceAnnonce[];
  prix_min: number | null;
  prix_max: number | null;
  surface_min: number | null;
  surface_max: number | null;
  pieces: number[];
  periode?: PeriodeKpi;
}
