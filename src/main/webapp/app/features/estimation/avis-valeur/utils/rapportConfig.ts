import { Estimation } from '../../types';
import { RapportConfig } from 'app/features/shared/template-rapport/types';
import { getDefaultConfig } from 'app/features/shared/template-rapport/BlocsRegistry';

/**
 * Construit la config initiale du rapport pour un AdV.
 * Pré-remplit le bloc Conclusion depuis valeur_retenue_detail si présent.
 */
export function buildInitialConfig(avis: Estimation): RapportConfig {
  const blocs = getDefaultConfig('avis_valeur');

  const vrd = avis.valeur_retenue_detail;
  if (vrd) {
    const idxConclusion = blocs.findIndex(b => b.id === 'conclusion');
    if (idxConclusion >= 0) {
      blocs[idxConclusion] = {
        ...blocs[idxConclusion],
        customContent: {
          prix_retenu: vrd.prix,
          honoraires_pct: vrd.honoraires_pct,
          charge_honoraires: vrd.charge_honoraires,
          justification_ecart: vrd.justification_ecart,
          unite_prix: 'eur',
          unite_honoraires: 'pct',
        },
      };
    }
  }

  return {
    rapportType: 'avis_valeur',
    style: 'style_1',
    blocs,
    metadata: {
      titre: `Avis de valeur · ${avis.bien.adresse}`,
    },
  };
}

/**
 * Extrait valeur_retenue_detail depuis la config du rapport (bloc conclusion).
 * Utilisé pour snapshot avant envoi.
 */
export function extractValeurRetenue(config: RapportConfig): { prix: number; honoraires_pct: number; charge_honoraires: 'acquereur' | 'vendeur'; justification_ecart?: string } | null {
  const conclusion = config.blocs.find(b => b.id === 'conclusion');
  if (!conclusion?.customContent) return null;
  const c = conclusion.customContent;
  const prix = typeof c.prix_retenu === 'number' ? c.prix_retenu : 0;
  if (!prix) return null;
  return {
    prix,
    honoraires_pct: typeof c.honoraires_pct === 'number' ? c.honoraires_pct : 0,
    charge_honoraires: c.charge_honoraires === 'vendeur' ? 'vendeur' : 'acquereur',
    justification_ecart: typeof c.justification_ecart === 'string' ? c.justification_ecart : undefined,
  };
}
