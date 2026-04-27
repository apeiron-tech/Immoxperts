import { Opportunity, ProjetInvestisseur, ScoreBreakdown } from '../types';

export function computeCoherenceProjet(opp: Opportunity, projet: ProjetInvestisseur | null): number {
  if (!projet) return 50;
  let score = 0;
  if (opp.prix_affiche >= projet.budget_min && opp.prix_affiche <= projet.budget_max) score += 30;
  else if (opp.prix_affiche < projet.budget_max * 1.1) score += 15;
  if (projet.target_zones.some(z => opp.bien.ville.toLowerCase().includes(z.toLowerCase()) || opp.bien.quartier.toLowerCase().includes(z.toLowerCase()))) score += 25;
  if (projet.preferred_property_types.includes(opp.bien.type)) score += 15;
  if (opp.score_breakdown.rendement >= 70) score += 15;
  if (opp.score_breakdown.rendement >= 60) score += 10;
  if (projet.works_tolerance !== 'aucun') score += 5;
  return Math.min(100, score);
}

export function niveauCoherence(pct: number): { label: string; color: string; tone: 'vert' | 'jaune-vert' | 'jaune' | 'gris' } {
  if (pct >= 80) return { label: 'Excellente', color: 'text-emerald-700 bg-emerald-50 border-emerald-200', tone: 'vert' };
  if (pct >= 60) return { label: 'Bonne', color: 'text-lime-700 bg-lime-50 border-lime-200', tone: 'jaune-vert' };
  if (pct >= 40) return { label: 'Moyenne', color: 'text-amber-700 bg-amber-50 border-amber-200', tone: 'jaune' };
  return { label: 'Hors projet', color: 'text-slate-500 bg-slate-50 border-slate-200', tone: 'gris' };
}

export function niveauScore(score: number): { label: string; color: string } {
  if (score >= 80) return { label: 'Excellent', color: 'text-emerald-700' };
  if (score >= 70) return { label: 'Très bon', color: 'text-emerald-600' };
  if (score >= 60) return { label: 'Bon', color: 'text-lime-600' };
  if (score >= 50) return { label: 'Moyen', color: 'text-amber-600' };
  return { label: 'Faible', color: 'text-red-600' };
}

export function aggregateScoreBreakdown(b: ScoreBreakdown): number {
  return Math.round(
    b.rendement * 0.3 + b.marche * 0.2 + b.risque * 0.15 + b.potentiel * 0.15 + b.coherence_projet * 0.2
  );
}
