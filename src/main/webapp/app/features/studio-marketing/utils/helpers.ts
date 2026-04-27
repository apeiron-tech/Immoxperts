import type {
  AtelierEnrichmentMode,
  AtelierTone,
  DataAnchorSnapshot,
  ModuleStatus,
  SuggestionPropsight,
} from '../types';

export const formatRelativeShort = (iso: string): string => {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return "à l'instant";
  if (diff < 3600) return `il y a ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `il y a ${Math.floor(diff / 3600)} h`;
  return `il y a ${Math.floor(diff / 86400)} j`;
};

export const computeEnrichmentMode = (
  modules: ModuleStatus,
  snapshot?: DataAnchorSnapshot,
): { mode: AtelierEnrichmentMode; available: number; total: number; usedKeys: string[] } => {
  const total = 5;
  const usedKeys: string[] = [];
  if (snapshot?.bien) usedKeys.push('bien');
  if (snapshot?.dvf) usedKeys.push('dvf');
  if (snapshot?.dpe) usedKeys.push('dpe');
  if (modules.observatoire === 'active' && snapshot?.observatoire) usedKeys.push('observatoire');
  if (modules.estimation === 'active' && snapshot?.estimation) usedKeys.push('estimation');
  if (modules.observatoire === 'active' && snapshot?.profondeur_solvable) usedKeys.push('profondeur_solvable');

  const enrichingModules = [
    modules.observatoire === 'active',
    modules.estimation === 'active',
    modules.leads === 'active',
  ].filter(Boolean).length;

  let mode: AtelierEnrichmentMode = 'lite';
  if (enrichingModules >= 1) mode = 'standard';
  if (enrichingModules >= 2 && modules.estimation === 'active') mode = 'premium';

  const available = Math.min(total, usedKeys.length);
  return { mode, available, total, usedKeys };
};

export const enrichmentModeLabel = (m: AtelierEnrichmentMode): string => {
  switch (m) {
    case 'lite': return 'Lite';
    case 'standard': return 'Standard';
    case 'premium': return 'Premium';
    default: return '';
  }
};

export const enrichmentDots = (m: AtelierEnrichmentMode): string => {
  switch (m) {
    case 'lite': return '●○○○○';
    case 'standard': return '●●●○○';
    case 'premium': return '●●●●●';
    default: return '○○○○○';
  }
};

export const toneLabel = (t: AtelierTone): string => {
  switch (t) {
    case 'professional': return 'Professionnel';
    case 'warm': return 'Chaleureux';
    case 'punchy': return 'Punchy';
    case 'luxury': return 'Luxe';
    case 'investor': return 'Investisseur';
    default: return '';
  }
};

export const toneSampleSentence = (t: AtelierTone): string => {
  switch (t) {
    case 'professional': return 'Présentation rigoureuse axée chiffres et arguments.';
    case 'warm': return 'Votre futur chez-vous, baigné de lumière naturelle.';
    case 'punchy': return 'À 5 min de la Tour Eiffel. Au juste prix. À saisir.';
    case 'luxury': return 'Adresse confidentielle, volumes rares, prestige discret.';
    case 'investor': return 'Rendement brut 3,4 % · plus-value potentielle 38 k€ · marché tendu.';
    default: return '';
  }
};

export const buildSuggestion = (
  snapshot?: DataAnchorSnapshot,
  modules?: ModuleStatus,
): SuggestionPropsight => {
  const ecart = snapshot?.dvf?.ecart_bien_vs_mediane_pct ?? 0;
  const dpe = snapshot?.bien?.dpe;
  const tension = snapshot?.observatoire?.tension_score ?? 0;
  const profondeur = snapshot?.profondeur_solvable?.nb_foyers_solvables_zone ?? 1000;
  const exclu = snapshot?.bien?.mandat_type === 'exclusif';

  if (exclu) {
    return {
      rule_id: 'mandat_exclusif',
      title: 'Activez le pack Mandat exclusif',
      body:
        "Ce bien est en mandat exclusif. Activez le pack dédié : boost Reel + DM base leads VIP + email priorisé. Les mandats exclusifs Propsight génèrent en moyenne 38 % de visites supplémentaires.",
      cta_label: 'Activer le pack Mandat exclusif',
    };
  }
  if (ecart < -3) {
    return {
      rule_id: 'bien_sous_mediane',
      title: 'Mettez en avant le bon prix',
      body:
        "Le bien est " + Math.abs(ecart).toFixed(1) +
        " % sous la médiane DVF du quartier. Mettez-le en avant dans les posts Insta et Reels — les biens « au juste prix » génèrent 32 % de leads en plus dans cette zone.",
      cta_label: 'Voir suggestion détaillée',
    };
  }
  if (ecart > 5) {
    return {
      rule_id: 'bien_au_dessus_mediane',
      title: 'Justifiez le prix',
      body:
        "Le bien est " + ecart.toFixed(1) +
        " % au-dessus de la médiane. Axez le contenu sur le potentiel (vue, étage, prestations) plutôt que sur le prix.",
      cta_label: 'Voir suggestion détaillée',
    };
  }
  if (dpe === 'F' || dpe === 'G') {
    return {
      rule_id: 'dpe_passoire',
      title: 'Axez sur le potentiel travaux',
      body:
        "Le DPE est " + dpe + ". Axez le contenu sur le potentiel travaux et la projection de note après rénovation.",
      cta_label: 'Voir suggestion détaillée',
    };
  }
  if (modules?.observatoire === 'active' && tension >= 8) {
    return {
      rule_id: 'tension_forte',
      title: 'Lancez une campagne rapide',
      body:
        "Tension " + tension.toFixed(1) +
        "/10 — marché tendu, lancez une campagne pub courte avec ciblage solvable, les délais de vente se raccourcissent.",
      cta_label: 'Voir suggestion détaillée',
    };
  }
  if (modules?.observatoire === 'active' && profondeur < 500) {
    return {
      rule_id: 'profondeur_faible',
      title: 'Élargissez la zone',
      body:
        "Seulement " + profondeur + " foyers solvables identifiés sur le secteur. Élargissez la zone de ciblage ou pivotez vers une cible investisseur.",
      cta_label: 'Voir suggestion détaillée',
    };
  }
  return {
    rule_id: 'bien_sous_mediane',
    title: 'Mettez en avant le bon prix',
    body:
      "Le bien est aligné sur la médiane du quartier. Mettez-le en avant dans les posts Insta et Reels pour booster les vues.",
    cta_label: 'Voir suggestion détaillée',
  };
};

export const truncate = (s: string, max: number): string =>
  s.length <= max ? s : s.slice(0, max - 1).trimEnd() + '…';
