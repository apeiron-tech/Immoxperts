import { Estimation } from 'app/features/estimation/types';

export type RapportType = 'avis_valeur' | 'etude_locative' | 'dossier_invest';

export type StyleRapport = 'style_1' | 'style_2' | 'style_3';

export type BlocId =
  | 'couverture'
  | 'sommaire'
  | 'agence'
  | 'conseiller'
  | 'bien'
  | 'photos'
  | 'points'
  | 'cadastre'
  | 'urbanisme'
  | 'historique_ventes'
  | 'socio_eco'
  | 'profil_cible'
  | 'budget_revenu'
  | 'solvabilite'
  | 'score_emplacement'
  | 'services_proximite'
  | 'repartition_logements'
  | 'prix_marche'
  | 'evolution_prix'
  | 'loyers_marche'
  | 'evolution_loyers'
  | 'rendement'
  | 'tension'
  | 'delais'
  | 'comp_vente'
  | 'comp_vendus'
  | 'comp_invendus'
  | 'comp_location'
  | 'comp_loues'
  | 'focus_comp'
  | 'synthese_3_methodes'
  | 'ajustements'
  | 'reglementations'
  | 'projet_invest'
  | 'analyse_financiere'
  | 'fiscalite'
  | 'simulation_renov'
  | 'conclusion'
  | 'annexes'
  | 'footer';

export type BlocGroup =
  | 'identity'
  | 'bien'
  | 'socio'
  | 'marche'
  | 'comparables'
  | 'synthese'
  | 'reglementations'
  | 'invest'
  | 'conclusion'
  | 'annexes';

export interface BlocDefinition {
  id: BlocId;
  label: string;
  description?: string;
  group: BlocGroup;
  defaultActiveBy: Partial<Record<RapportType, boolean>>;
  editable: boolean;
  pageBreakBefore?: boolean;
}

export interface BlocConfig {
  id: BlocId;
  active: boolean;
  order: number;
  customContent?: Record<string, unknown>;
}

export interface AgenceInfo {
  nom: string;
  adresse: string;
  code_postal: string;
  ville: string;
  siret: string;
  carte_t: string;
  telephone: string;
  email: string;
  site: string;
  description: string;
  logo_url: string;
  couleur_primaire: string;
}

export interface ConseillerInfo {
  prenom: string;
  nom: string;
  titre: string;
  telephone: string;
  email: string;
  photo_url: string;
  bio: string;
}

export interface RapportData {
  type: RapportType;
  estimation: Estimation;
  agence: AgenceInfo;
  conseiller: ConseillerInfo;
  date_rapport: string;
}

export interface RapportConfig {
  rapportType: RapportType;
  style: StyleRapport;
  blocs: BlocConfig[];
  metadata: {
    titre?: string;
  };
}

export interface BlocComponentProps {
  data: RapportData;
  blocConfig: BlocConfig;
  isEditing: boolean;
  onEdit: () => void;
  onContentChange: (content: Record<string, unknown>) => void;
}
