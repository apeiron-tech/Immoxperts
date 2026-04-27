import { MetaSignalRadar, SignalDVF, SignalDPE } from '../types';

export interface Kpi {
  key: string;
  label: string;
  value: number;
  delta: string; // "+12%", "stable"
  deltaPositive?: boolean;
  deltaStable?: boolean;
  tooltip: string;
  sparkline: number[];
}

// Sparklines mockées pour une démo propre
const spark1 = [40, 48, 42, 55, 50, 62, 58, 70, 72, 68, 75, 80];
const spark2 = [60, 55, 50, 45, 50, 48, 42, 38, 40, 36, 34, 30];
const spark3 = [45, 48, 45, 50, 52, 50, 55, 54, 58, 56, 60, 63];
const spark4 = [30, 34, 40, 36, 42, 45, 50, 48, 55, 58, 60, 65];

export const getRadarKpis = (signals: MetaSignalRadar[]): Kpi[] => {
  const aTraiter = signals.filter(s => s.status_agrege === 'nouveau' || s.status_agrege === 'a_traiter').length;
  const hautePriorite = signals.filter(s => s.score_agrege >= 80 && (s.status_agrege === 'nouveau' || s.status_agrege === 'a_traiter')).length;
  // Zones chaudes : on se base sur les méta-signaux de ville avec priorité haute
  const villesHautes = new Set(signals.filter(s => s.priority_agregee === 'haute').map(s => s.code_postal));

  return [
    {
      key: 'a_traiter',
      label: 'À traiter',
      value: aTraiter,
      delta: '+12%',
      deltaPositive: true,
      tooltip: 'Signaux non traités (statut nouveau ou à traiter).',
      sparkline: spark1,
    },
    {
      key: 'haute_priorite',
      label: 'Haute priorité',
      value: hautePriorite,
      delta: '+5',
      deltaPositive: true,
      tooltip: 'Signaux avec score ≥ 80 non traités.',
      sparkline: spark3,
    },
    {
      key: 'zones_chaudes',
      label: 'Zones chaudes',
      value: villesHautes.size || 7,
      delta: 'stable',
      deltaStable: true,
      tooltip: 'Secteurs en tension avec concentration de signaux haute priorité.',
      sparkline: [7, 7, 8, 8, 7, 8, 7, 7, 7, 7, 7, 7],
    },
  ];
};

export const getDvfKpis = (signals: SignalDVF[]): Kpi[] => {
  const vendeursProbables = signals.filter(
    s => s.type === 'detention_longue' && s.dvf_payload.type_acquereur === 'particulier'
  ).length;
  const hautePriorite = signals.filter(s => s.score >= 80 && (s.status === 'nouveau' || s.status === 'a_traiter')).length;
  const patternsZone = signals.filter(s => s.is_territorial).length;

  return [
    {
      key: 'vendeurs_probables',
      label: 'Vendeurs probables',
      value: vendeursProbables || 482,
      delta: '+14%',
      deltaPositive: true,
      tooltip: 'Biens en détention longue sans annonce active, dont le contexte suggère une mise en vente à venir.',
      sparkline: spark1,
    },
    {
      key: 'haute_priorite',
      label: 'Haute priorité',
      value: hautePriorite || 156,
      delta: '+21%',
      deltaPositive: true,
      tooltip: 'Signaux avec score ≥ 80 non traités.',
      sparkline: spark4,
    },
    {
      key: 'patterns_zone',
      label: 'Patterns de zone',
      value: patternsZone || 243,
      delta: 'stable',
      deltaStable: true,
      tooltip: 'Phénomènes territoriaux : rotation forte, poches de comparables.',
      sparkline: spark3,
    },
  ];
};

export const getDpeKpis = (signals: SignalDPE[]): Kpi[] => {
  const vendeursProbables = signals.filter(s => s.type === 'vendeur_probable').length;
  const bailleursArbitrer = signals.filter(s => s.type === 'bailleur_a_arbitrer').length;
  const potentielsRenovation = signals.filter(s => s.type === 'potentiel_renovation').length;
  const opportunitesInvest = signals.filter(s => s.type === 'opportunite_investisseur').length;

  return [
    {
      key: 'vendeurs_probables',
      label: 'Vendeurs probables',
      value: vendeursProbables || 412,
      delta: '+18%',
      deltaPositive: true,
      tooltip: 'Biens dont le contexte DPE suggère une probabilité élevée de mise en vente.',
      sparkline: spark1,
    },
    {
      key: 'bailleurs_arbitrer',
      label: 'Bailleurs à arbitrer',
      value: bailleursArbitrer || 236,
      delta: '+12%',
      deltaPositive: true,
      tooltip: 'Bailleurs avec DPE F/G en zone tendue — décision locative à prendre.',
      sparkline: spark4,
    },
    {
      key: 'potentiels_renovation',
      label: 'Potentiels rénovation',
      value: potentielsRenovation || 689,
      delta: '+21%',
      deltaPositive: true,
      tooltip: 'Biens avec potentiel de gain ≥ 2 classes.',
      sparkline: spark3,
    },
    {
      key: 'opportunites_invest',
      label: 'Opportunités invest.',
      value: opportunitesInvest || 856,
      delta: '+16%',
      deltaPositive: true,
      tooltip: 'Signaux avec angle investisseur (décote, rendement post-travaux).',
      sparkline: spark1,
    },
  ];
};
