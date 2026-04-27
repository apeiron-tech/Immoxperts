export type Priority = 'haute' | 'moyenne' | 'basse';

export type ActionType = 'appel' | 'email' | 'rdv' | 'location' | 'relance' | 'file';

export type ActionGroupKey = 'En retard' | "Aujourd'hui" | 'Cette semaine';

export interface ActionItem {
  id: string;
  type: ActionType;
  label: string;
  target: string;
  lead_id?: string;
  dossier_id?: string;
  signal_id?: string;
  retard?: string;
  heure?: string;
  date?: string;
  priority: Priority;
  cta: string;
}

export interface ActionGroupBlock {
  group: ActionGroupKey;
  items: ActionItem[];
}

export type AgendaStatut = 'Confirmé' | 'À faire' | 'Interne';

export interface AgendaItem {
  id: string;
  heure: string;
  titre: string;
  sousInfo: string;
  statut: AgendaStatut;
  lead_id?: string;
}

export interface LeadChaud {
  lead_id: string;
  initiales: string;
  nom: string;
  sousInfo: string;
  estimation: string;
  nextAction: string;
  nextDate: string;
  retard?: boolean;
  priority: Priority;
}

export interface Entrant {
  lead_id: string;
  initiales: string;
  nom: string;
  sousInfo: string;
  time: string;
}

export type SignalType = 'DVF' | 'DPE' | 'ANN';

export interface SignalItem {
  type: SignalType;
  titre: string;
  loc: string;
  time: string;
  signal_id: string;
}

export type PipeStageId = 'atraiter' | 'qualifie' | 'estimation' | 'mandat' | 'negociation' | 'signe';

export interface PipeStage {
  id: PipeStageId;
  label: string;
  color: string;
  valeur: number;
}

export interface DossierTypeBlock {
  type: 'avis' | 'etude' | 'invest';
  label: string;
  count: number;
  ligne1: string;
  ligne2: string;
  href: string;
}

export interface MandatItem {
  type: string;
  adresse: string;
  expireLe: string;
  jours: number;
  mandat_id: string;
}

export type KpiIcon = 'users' | 'check-circle' | 'calendar' | 'file-text' | 'euro';

export interface KpiTile {
  label: string;
  value: string;
  delta: string;
  deltaLabel: string;
  trend: 'up' | 'down';
  icon: KpiIcon;
  href?: string;
}
