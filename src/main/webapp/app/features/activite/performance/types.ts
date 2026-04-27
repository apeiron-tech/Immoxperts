export type PeriodKey = '7j' | '30j' | 'trim' | '12m' | 'custom';
export type ComparisonKey = 'periode' | 'objectif' | 'equipe';

export type Trend = 'up' | 'down';

export interface KpiData {
  label: string;
  value: string;
  delta?: string;
  trend?: Trend;
  compare?: string;
}

export interface PipelineStageStat {
  stage: string;
  label: string;
  volume: number;
  taux: number;
  delta: number | null;
  deltaLabel: string | null;
  color: string;
  textColor: string;
  bgColor: string;
}

export type ActiviteType = 'appel' | 'email' | 'rdv' | 'visite' | 'relance';

export interface ActiviteTypeMeta {
  id: ActiviteType;
  label: string;
  color: string;
}

export interface ActiviteDay {
  date: string;
  appel: number;
  email: number;
  rdv: number;
  visite: number;
  relance: number;
}

export interface SourceRow {
  source: string;
  leads: number;
  tauxConv: number;
  caGenere: number;
  delaiMoyen: number;
  href: string;
}

export interface CaMonth {
  label: string;
  ca: number;
  current?: boolean;
}

export interface DonutSlice {
  label: string;
  value: number;
  percent: number;
  color: string;
}

export interface DossierRow {
  dossier: string;
  type: string;
  probabilite: number;
  caPondere: number;
  echeance: string;
}

export interface MarcheZone {
  id: string;
  label: string;
  sousLabel: string;
  transactions: number;
}

export interface IndicateursMarcheData {
  volumeDvf:  { value: number; delta: string; compare: string };
  prixMedian: { value: string; unite: string; delta: string; compare: string };
  tension:    { value: string; delta: string; level: 'low' | 'medium' | 'high' };
}

export interface Hypotheses {
  commissionMoyenne: number;     // %
  partCaptableCible: number;     // %
  objectifMandatsAnnuel: number;
  panierMoyen: number;           // €
}
