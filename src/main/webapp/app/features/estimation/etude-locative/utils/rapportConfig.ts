import { Estimation, ValeurRetenueLocatifDetail } from '../../types';
import { RapportConfig } from 'app/features/shared/template-rapport/types';
import { getDefaultConfig } from 'app/features/shared/template-rapport/BlocsRegistry';

export function buildInitialConfig(etude: Estimation): RapportConfig {
  const blocs = getDefaultConfig('etude_locative');

  const vr = etude.valeur_retenue_locatif;
  if (vr) {
    const idx = blocs.findIndex(b => b.id === 'conclusion');
    if (idx >= 0) {
      blocs[idx] = {
        ...blocs[idx],
        customContent: {
          loyer_hc: vr.loyer_hc,
          charges_mensuelles: vr.charges_mensuelles,
          honoraires: vr.honoraires,
          justification_ecart: vr.justification_ecart,
          unite_loyer: 'eur',
        },
      };
    }
  }

  return {
    rapportType: 'etude_locative',
    style: 'style_1',
    blocs,
    metadata: {
      titre: `Étude locative · ${etude.bien.adresse}`,
    },
  };
}

export function extractValeurRetenueLocatif(config: RapportConfig): ValeurRetenueLocatifDetail | null {
  const conclusion = config.blocs.find(b => b.id === 'conclusion');
  if (!conclusion?.customContent) return null;
  const c = conclusion.customContent;
  const loyer_hc = typeof c.loyer_hc === 'number' ? c.loyer_hc : 0;
  if (!loyer_hc) return null;
  return {
    loyer_hc,
    charges_mensuelles: typeof c.charges_mensuelles === 'number' ? c.charges_mensuelles : 0,
    honoraires: typeof c.honoraires === 'number' ? c.honoraires : loyer_hc,
    justification_ecart: typeof c.justification_ecart === 'string' ? c.justification_ecart : undefined,
  };
}
