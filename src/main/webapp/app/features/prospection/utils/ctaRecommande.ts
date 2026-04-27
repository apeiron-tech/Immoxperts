import { SignalProspection, MetaSignalRadar } from '../types';

export type CtaPrimaire =
  | 'lead_vendeur'
  | 'lead_bailleur'
  | 'lead_acquereur'
  | 'lead_investisseur'
  | 'estimer'
  | 'analyser_invest'
  | 'action';

export interface CtaRecommandation {
  primary: CtaPrimaire;
  label: string;
  estimationPath?: string;
}

// Cf. §5.2.1 et §5.3.1
export const getCtaRecommande = (
  signal: SignalProspection | MetaSignalRadar
): CtaRecommandation => {
  // Cas méta-signal Radar : on prend le type du premier enfant avec le plus gros score
  if ('children' in signal) {
    const top = [...signal.children].sort((a, b) => b.score - a.score)[0];
    return getCtaRecommande(top);
  }

  if (signal.source === 'dpe') {
    switch (signal.type) {
      case 'vendeur_probable':
        return { primary: 'lead_vendeur', label: 'Créer un lead vendeur', estimationPath: '/app/estimation/avis-valeur' };
      case 'bailleur_a_arbitrer':
        return { primary: 'lead_bailleur', label: 'Créer un lead bailleur', estimationPath: '/app/estimation/etude-locative' };
      case 'potentiel_renovation':
        return { primary: 'estimer', label: 'Estimer ce bien', estimationPath: '/app/estimation/avis-valeur' };
      case 'opportunite_investisseur':
        return { primary: 'analyser_invest', label: 'Analyser en investissement', estimationPath: '/app/estimation/etude-locative' };
      default:
        return { primary: 'action', label: 'Créer une action' };
    }
  }

  if (signal.source === 'dvf') {
    if (signal.is_territorial) {
      return { primary: 'action', label: 'Créer une action' };
    }
    switch (signal.type) {
      case 'detention_longue':
      case 'revente_rapide':
      case 'cycle_revente_regulier':
        return { primary: 'lead_vendeur', label: 'Créer un lead vendeur', estimationPath: '/app/estimation/rapide' };
      case 'vente_proche':
        return { primary: 'lead_acquereur', label: 'Créer un lead acquéreur', estimationPath: '/app/estimation/rapide' };
      case 'ecart_marche':
        return { primary: 'estimer', label: 'Estimer ce bien', estimationPath: '/app/estimation/rapide' };
      default:
        return { primary: 'action', label: 'Créer une action' };
    }
  }

  if (signal.source === 'annonce') {
    switch (signal.type) {
      case 'baisse_prix':
      case 'annonce_ancienne':
      case 'remise_en_ligne':
        return { primary: 'lead_vendeur', label: 'Créer un lead vendeur', estimationPath: '/app/estimation/rapide' };
      default:
        return { primary: 'action', label: 'Créer une action' };
    }
  }

  return { primary: 'action', label: 'Créer une action' };
};
