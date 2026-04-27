import { Persona } from '../types';

export interface PersonaLabels {
  createDossier: string;
  partager: string;
  relance: string;
  porteur: string;
  newProject: string;
  client: string;
  leadsLink: string;
}

export const PERSONA_LABELS: Record<Persona, PersonaLabels> = {
  agent: {
    createDossier: 'Créer un dossier client',
    partager: 'Partager avec le client',
    relance: 'Créer une relance',
    porteur: 'Client',
    newProject: 'Nouveau projet client',
    client: 'Client',
    leadsLink: 'Mon activité > Leads',
  },
  investor: {
    createDossier: 'Créer mon dossier',
    partager: 'Partager cette analyse',
    relance: 'Ajouter un rappel',
    porteur: 'Porteur',
    newProject: 'Mon nouveau projet',
    client: 'Moi',
    leadsLink: 'Mes affaires',
  },
  hybrid: {
    createDossier: 'Créer un dossier',
    partager: 'Partager',
    relance: 'Créer une relance',
    porteur: 'Porteur',
    newProject: 'Nouveau projet',
    client: 'Client',
    leadsLink: 'Mon activité',
  },
};

export const DEFAULT_PERSONA: Persona = 'investor';

export function labelLocataire(t: string): string {
  const map: Record<string, string> = {
    etudiant: 'Étudiants',
    jeune_actif: 'Jeunes actifs',
    couple_sans_enfant: 'Couples',
    famille: 'Familles',
    senior: 'Seniors',
    mixte: 'Mixte',
  };
  return map[t] ?? t;
}

export function labelProfondeur(p: string): string {
  const map: Record<string, string> = { forte: 'Forte', correcte: 'Correcte', etroite: 'Étroite' };
  return map[p] ?? p;
}

export function labelTension(t: string): string {
  const map: Record<string, string> = {
    tres_faible: 'Très faible',
    faible: 'Faible',
    moyenne: 'Moyenne',
    elevee: 'Élevée',
    tres_elevee: 'Très élevée',
  };
  return map[t] ?? t;
}

export function labelStrategy(s: string): string {
  const map: Record<string, string> = {
    patrimonial: 'Patrimonial',
    equilibree: 'Équilibrée',
    rendement: 'Rendement',
    cashflow: 'Cash-flow',
    travaux: 'Travaux/décote',
    colocation: 'Colocation',
    meuble: 'Meublé',
    autre: 'Autre',
  };
  return map[s] ?? s;
}

export function labelRegime(r: string): string {
  const map: Record<string, string> = {
    micro_foncier: 'Micro-foncier',
    reel_foncier: 'Réel foncier',
    lmnp_micro: 'LMNP micro-BIC',
    lmnp_reel: 'LMNP réel',
    lmp: 'LMP',
    sci_ir: 'SCI IR',
    sci_is: 'SCI IS',
    courte_duree: 'Courte durée',
  };
  return map[r] ?? r;
}

export function labelStatutOpp(s: string): string {
  const map: Record<string, string> = {
    nouveau: 'Nouveau',
    a_qualifier: 'À qualifier',
    compare: 'Comparé',
    a_arbitrer: 'À arbitrer',
    suivi: 'Suivi',
    ecarte: 'Écarté',
  };
  return map[s] ?? s;
}

export function labelStatutDossier(s: string): string {
  const map: Record<string, string> = {
    brouillon: 'Brouillon',
    analyse_prete: 'Analyse prête',
    finalise: 'Finalisé',
    envoye: 'Envoyé',
    ouvert: 'Ouvert',
    archive: 'Archivé',
  };
  return map[s] ?? s;
}

export function colorStatutDossier(s: string): string {
  const map: Record<string, string> = {
    brouillon: 'bg-slate-100 text-slate-700 border-slate-200',
    analyse_prete: 'bg-sky-50 text-sky-700 border-sky-200',
    finalise: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    envoye: 'bg-propsight-50 text-propsight-700 border-propsight-200',
    ouvert: 'bg-amber-50 text-amber-700 border-amber-200',
    archive: 'bg-slate-50 text-slate-500 border-slate-200',
  };
  return map[s] ?? 'bg-slate-50 text-slate-600 border-slate-200';
}
