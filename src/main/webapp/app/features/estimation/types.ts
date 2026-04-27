export type StatutEstimation = 'brouillon' | 'finalisee' | 'envoyee' | 'ouverte' | 'archivee';
export type TypeBien = 'appartement' | 'maison' | 'terrain' | 'parking';
export type EtatBien = 'neuf' | 'refait_a_neuf' | 'bon' | 'a_rafraichir' | 'a_renover' | 'a_restructurer';
export type DpeGes = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'inconnu';

export interface ClientInfo {
  civilite: 'M.' | 'Mme' | '';
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
}

export interface AvmResult {
  prix: {
    estimation: number;
    fourchette_basse: number;
    fourchette_haute: number;
    prix_m2: number;
    confiance: number;
    confiance_label: 'faible' | 'bon' | 'fort';
  };
  loyer: {
    estimation: number;
    fourchette_basse: number;
    fourchette_haute: number;
    loyer_m2: number;
    rendement_brut: number;
  };
  ajustements: Array<{
    libelle: string;
    delta_pct: number;
    delta_m2: number;
    positif: boolean;
  }>;
  comparables: Array<{
    id: string;
    adresse: string;
    type: 'dvf' | 'annonce';
    surface: number;
    nb_pieces: number;
    etage: number;
    dpe: string;
    prix: number;
    prix_m2: number;
    date: string;
    score_similarite: number;
    photo_url: string;
  }>;
  marche_reference: {
    prix_m2_bas: number;
    prix_m2_median: number;
    prix_m2_haut: number;
    ecart_vs_marche_pct: number;
  };
}

export interface EstimationFormData {
  adresse: string;
  ville: string;
  code_postal: string;
  lat: number;
  lon: number;
  type_bien: TypeBien;
  surface: number;
  nb_pieces: number;
  nb_chambres: number;
  etage: number;
  nb_etages: number;
  surface_terrain: number;
  annee_construction: number;
  dpe: DpeGes;
  ges: DpeGes;
  etat: EtatBien;
  exposition: string;
  caracteristiques: string[];
  description: string;
  points_forts: string[];
  points_defendre: string[];
  charges_mensuelles: number;
  taxe_fonciere: number;
}

export interface OuvertureEvent {
  date: string;
  user_agent: 'mobile' | 'desktop' | 'tablette';
}

export interface EnvoiInfo {
  envoye_le: string;
  email_destinataire: string;
  nom_destinataire: string;
  objet: string;
  message: string;
  ouvertures: OuvertureEvent[];
  derniere_ouverture?: string;
  token_public: string;
}

export interface ValeurRetenueDetail {
  prix: number;
  honoraires_pct: number;
  charge_honoraires: 'acquereur' | 'vendeur';
  justification_ecart?: string;
}

export interface ValeurRetenueLocatifDetail {
  loyer_hc: number;
  charges_mensuelles: number;
  honoraires: number;
  justification_ecart?: string;
}

export type MethodeExpertise =
  | 'comparaison_directe'
  | 'capitalisation_revenus'
  | 'cout_remplacement'
  | 'sol_constructible';

export type ReferentielExpertise = 'RICS' | 'TEGOVA' | 'RICS_TEGOVA';

export type FinaliteExpertise =
  | 'cession'
  | 'succession'
  | 'donation'
  | 'apport_societe'
  | 'garantie_bancaire'
  | 'litige'
  | 'audit_patrimoine';

export interface ExpertInfo {
  /** Référentiel d'expertise (RICS, TEGOVA, ou les deux) */
  referentiel: ReferentielExpertise;
  /** Méthodologie principale appliquée */
  methode_principale: MethodeExpertise;
  /** Méthodes complémentaires */
  methodes_complementaires: MethodeExpertise[];
  /** Finalité du rapport */
  finalite: FinaliteExpertise;
  /** Donneur d'ordre (peut différer du propriétaire) */
  donneur_ordre: ClientInfo | null;
  /** Date de la visite sur site */
  date_visite?: string;
  /** Date de valeur (date à laquelle la valeur est estimée) */
  date_valeur?: string;
  /** Numéro de dossier interne */
  numero_dossier?: string;
  /** Signature de l'expert (nom, n° agrément RICS/TEGOVA) */
  expert_signature?: {
    nom: string;
    qualification: string;
    numero_agrement?: string;
  };
  /** Hypothèses spéciales / réserves */
  hypotheses_speciales?: string[];
  /** Conformité / déclaration d'indépendance */
  declaration_independance?: boolean;
}

export interface Estimation {
  id: string;
  type: 'rapide' | 'avis_valeur' | 'etude_locative' | 'expertise_rics_tegova';
  statut: StatutEstimation;
  source: 'manuel' | 'annonce_url' | 'bien_portefeuille' | 'estimation_rapide';
  created_at: string;
  updated_at: string;
  auteur: string;
  client: ClientInfo | null;
  bien: EstimationFormData;
  avm: AvmResult | null;
  valeur_retenue: number | null;
  valeur_retenue_detail?: ValeurRetenueDetail;
  valeur_retenue_locatif?: ValeurRetenueLocatifDetail;
  photo_url: string | null;
  parent_estimation_id?: string;
  envoi?: EnvoiInfo;
  version?: number;
  versions_precedentes?: string[];
  mandat_signe?: boolean;
  mandat_signe_le?: string;
  /** Champs spécifiques au rapport d'expert (RICS/TEGOVA) */
  expert?: ExpertInfo;
}

export interface BienPortefeuille {
  id: string;
  adresse: string;
  ville: string;
  code_postal: string;
  type_bien: TypeBien;
  surface: number;
  nb_pieces: number;
  etage: number;
  dpe: DpeGes;
  statut_mandat: string;
  auteur: string;
  photo_url: string;
}

export interface SolvabiliteData {
  prix_reference: number;
  part_eligible: number;
  benchmark_quartier: number;
  positionnement: 'en_dessous_mediane' | 'proche_mediane' | 'au_dessus_mediane';
  revenu_necessaire: number;
  repartition_profils: {
    personne_seule: number;
    couple: number;
    famille: number;
    monoparental: number;
  };
  hypotheses: {
    taux: number;
    duree: number;
    apport: number;
    endettement: number;
  };
}
