export type StageId = 'atraiter' | 'qualifie' | 'estimation' | 'mandat' | 'negociation' | 'signe' | 'perdu';

export type Intention = 'vente' | 'achat' | 'estim' | 'locatif';

export type LeadSource = 'widget' | 'pige' | 'manuel' | 'import' | 'estimation' | 'recommandation';

export type LeadBadge = 'Exclusif' | 'Urgent' | 'À relancer';

export interface Lead {
  lead_id: string;
  stage: StageId;
  nom: string;
  initiales: string;
  source: LeadSource;
  intention: Intention;
  adresse: string;
  prix: number | null;
  commission: number | null;
  age: string;
  badge?: LeadBadge | null;
  sousStatut?: string;
  email?: string;
  telephone?: string;
  proprietaire?: string;
  zone?: string;
  tags?: string[];
  createdAt?: string;
  derniereAction?: string;
  prochaineAction?: { label: string; date: string; retard?: boolean } | null;
  scoreOpportunite?: number;
  probabiliteSignature?: number;
}

export interface StageMeta {
  id: StageId;
  label: string;
  accent: string;       // hex pour barre verticale
  headerBg: string;     // tailwind class fond header
  headerBorder: string; // tailwind class bordure header
  textColor: string;    // tailwind class label header
}

export interface MembreEquipe {
  id: string;
  nom: string;
  initiales: string;
}

export type ViewMode = 'kanban' | 'table';

export type IntentionTab = 'tous' | 'vendeurs' | 'acquereurs' | 'estim' | 'locatif';
