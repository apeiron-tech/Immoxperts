import type { InvestorStrategy, SellerValuation } from '../types';

export const MOCK_INVESTOR_STRATEGY: InvestorStrategy = {
  strategy_primary: {
    id: 't2_meuble_zone_tendue',
    title: 'T2 meublé en zone tendue',
    description: 'Un équilibre idéal entre rendement, sécurité et demande locative.',
    icon: 'trending-up',
    badge: 'Recommandé',
    kpi: {
      target_rent: 930,
      gross_yield: 5.2,
      rental_tension: 'élevée',
    },
  },
  scenarios: [
    {
      id: 'patrimonial',
      title: 'Option patrimoniale',
      description: 'Sécurisez votre capital sur le long terme.',
      tags: ['Valorisation', 'Sécurité'],
      kpi: { target_rent: 820, gross_yield: 3.2 },
    },
    {
      id: 'rendement_renforce',
      title: 'Option rendement renforcé',
      description: 'Optimisez la performance locative.',
      tags: ['Performance', 'Optimisé'],
      kpi: { target_rent: 980, gross_yield: 6.4 },
    },
  ],
  key_points: [
    {
      type: 'budget_coherent',
      title: 'Budget cohérent',
      text: 'Votre budget de 250 000 € est adapté à cette stratégie.',
      severity: 'success',
    },
    {
      type: 'dpe_warning',
      title: 'Vigilance DPE / travaux',
      text: 'Anticipez les normes énergétiques pour sécuriser la rentabilité.',
      severity: 'warning',
    },
    {
      type: 'low_vacancy',
      title: 'Vacance locative faible',
      text: 'La demande locative est forte dans votre zone cible.',
      severity: 'success',
    },
  ],
};

export const MOCK_SELLER_VALUATION: SellerValuation = {
  min: 482000,
  max: 515000,
  median_per_sqm_min: 8310,
  median_per_sqm_max: 8880,
  confidence: 'high',
  days_on_market: 43,
  market_trend: 'dynamic',
  comparables_count: 12,
  median_price: 8650,
};
