// Catalogue des 11 règles de coaching V1 (cf docs/50_EQUIPE_PROPSIGHT.md §17)

import type { CoachingInsightType, TeamActivityPriority } from './types';

export interface CoachingRule {
  rule_id: string;
  type: CoachingInsightType;
  scope: 'collaborateur' | 'equipe' | 'zone' | 'source';
  priority: TeamActivityPriority;
  label: string;
  description: string;
}

export const COACHING_RULES: CoachingRule[] = [
  {
    rule_id: 'adoption_faible',
    type: 'adoption_faible',
    scope: 'collaborateur',
    priority: 'moyenne',
    label: 'Adoption faible',
    description: "Collaborateur AGENT inactif depuis > 14 j.",
  },
  {
    rule_id: 'conversion_bloquee_avis_valeur',
    type: 'conversion_bloquee_avis_valeur',
    scope: 'collaborateur',
    priority: 'moyenne',
    label: 'Conversion bloquée (AdV)',
    description: "Estimations ≥ 10 mais ratio AdV envoyés/estimations < 30 % et < moyenne équipe.",
  },
  {
    rule_id: 'conversion_bloquee_etude_locative',
    type: 'conversion_bloquee_etude_locative',
    scope: 'collaborateur',
    priority: 'basse',
    label: 'Conversion bloquée (étude locative)',
    description: "Leads bailleurs ≥ 5 mais ratio études/leads bailleurs < 25 %.",
  },
  {
    rule_id: 'relance_manquante_rapport',
    type: 'relance_manquante_rapport',
    scope: 'collaborateur',
    priority: 'haute',
    label: 'Relance manquante',
    description: "≥ 3 rapports ouverts sans relance créée après last_opened_at.",
  },
  {
    rule_id: 'charge_elevee',
    type: 'charge_elevee',
    scope: 'collaborateur',
    priority: 'haute',
    label: 'Charge élevée',
    description: "Score charge ≥ 85 ET au moins un collaborateur disponible (charge < 50).",
  },
  {
    rule_id: 'qualite_livrable_faible',
    type: 'qualite_livrable_faible',
    scope: 'collaborateur',
    priority: 'moyenne',
    label: 'Qualité livrable faible',
    description: "≥ 5 rapports livrés avec taux complétude < 50 % et < moyenne équipe.",
  },
  {
    rule_id: 'zone_sous_exploitee',
    type: 'zone_sous_exploitee',
    scope: 'zone',
    priority: 'basse',
    label: 'Zone sous-exploitée',
    description: "Volume DVF ≥ 500, leads équipe < 2 % du volume DVF, tension ≥ 60.",
  },
  {
    rule_id: 'signaux_prospection_non_traites',
    type: 'signaux_prospection_non_traites',
    scope: 'collaborateur',
    priority: 'moyenne',
    label: 'Signaux non traités',
    description: "≥ 20 signaux non traités sur 30 j et < 10 signaux traités.",
  },
  {
    rule_id: 'estimations_non_promues',
    type: 'estimations_non_promues',
    scope: 'equipe',
    priority: 'basse',
    label: 'Estimations non promues',
    description: "≥ 10 estimations rapides sauvegardées sur 60 j avec taux de promotion < 15 %.",
  },
  {
    rule_id: 'ecart_avm_non_justifie',
    type: 'ecart_avm_non_justifie',
    scope: 'collaborateur',
    priority: 'moyenne',
    label: 'Écart AVM non justifié',
    description: "≥ 3 rapports avec écart AVM > 5 % sans justification renseignée.",
  },
  {
    rule_id: 'mandat_simple_sous_pression',
    type: 'mandat_simple_sous_pression',
    scope: 'collaborateur',
    priority: 'moyenne',
    label: 'Mandat simple sous pression',
    description: "Mandat simple > 30 j avec ≥ 2 agences concurrentes actives sur la zone.",
  },
];

export const DEFAULT_ENABLED_RULES = COACHING_RULES.map(r => r.rule_id);

// Helpers de calcul (mode démo : pris sur les mocks)
export function computeWorkloadScore(input: {
  actions_open: number;
  actions_overdue: number;
  rdv_count: number;
  visits_count: number;
  leads_active: number;
  rapports_a_relancer: number;
  dossiers_active: number;
  opportunites_a_qualifier: number;
  capacity_weekly_hours: number;
}): number {
  const weighted =
    input.actions_open * 1.0 +
    input.actions_overdue * 2.5 +
    input.rdv_count * 2.0 +
    input.visits_count * 2.5 +
    input.leads_active * 0.3 +
    input.rapports_a_relancer * 1.5 +
    input.dossiers_active * 1.8 +
    input.opportunites_a_qualifier * 0.5;
  const cap = input.capacity_weekly_hours || 35;
  const raw = (weighted / (cap * 1.2)) * 100;
  return Math.min(100, Math.max(0, Math.round(raw)));
}

export function workloadStatus(score: number): 'disponible' | 'normal' | 'charge' | 'surcharge' {
  if (score >= 85) return 'surcharge';
  if (score >= 65) return 'charge';
  if (score >= 40) return 'normal';
  return 'disponible';
}
