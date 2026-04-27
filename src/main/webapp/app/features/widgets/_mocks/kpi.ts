import type { FunnelStep } from '../types';

export const HUB_KPI = [
  { label: 'Vues', value: 24812, delta: 18.6, deltaUnit: '%', hint: 'vs 30 derniers jours' },
  { label: 'Démarrages', value: 7352, delta: 15.2, deltaUnit: '%', hint: 'vs 30 derniers jours' },
  { label: 'Leads générés', value: 1243, delta: 22.1, deltaUnit: '%', hint: 'vs 30 derniers jours' },
  { label: 'Taux de complétion', value: 68.3, delta: 6.4, deltaUnit: 'pts', hint: 'vs 30 derniers jours', format: 'percent' as const },
];

export const PERFORMANCE_KPI = [
  { label: 'Vues', value: 24812, delta: 18.6, deltaUnit: '%' },
  { label: 'Démarrages', value: 7352, delta: 15.2, deltaUnit: '%', sub: '29,6 % de taux de démarrage' },
  { label: 'Complétions', value: 1823, delta: 11.7, deltaUnit: '%', sub: '7,3 % de taux de complétion' },
  { label: 'Leads générés', value: 1243, delta: 22.1, deltaUnit: '%', sub: '5,0 % de taux de capture' },
];

export const FUNNEL_STEPS: FunnelStep[] = [
  { label: 'Vues', value: 24812, rate: 100 },
  { label: 'Démarrages', value: 7352, rate: 29.6 },
  { label: 'Étape 2 atteinte', value: 6104, rate: 24.6 },
  { label: 'Étape 4 atteinte', value: 5023, rate: 20.2 },
  { label: 'Complétions', value: 1823, rate: 7.3 },
  { label: 'Leads capturés', value: 1243, rate: 5.0 },
];

export const BEHAVIOR_METRICS = [
  { label: 'Temps moyen de complétion', value: '4 min 32 s' },
  { label: 'Étape la plus abandonnée', value: 'Étape 4 — Détails (22 %)' },
  { label: 'Appareil dominant', value: 'Desktop 62 % · Mobile 33 % · Tablet 5 %' },
  { label: 'Source de trafic dominante', value: 'Direct (44 %)' },
];

export const CONVERSION_METRICS = [
  { label: 'Canal préféré par les leads', value: 'WhatsApp 47 % · Email 38 % · Tél 15 %' },
  { label: 'Taux de réponse aux relances', value: '31,4 %' },
  { label: 'RDV générés', value: '108' },
  { label: 'Mandats issus du widget', value: '24' },
];

export const TOP_ZONES = [
  { label: '75116 Paris', leads: 143, trend: '+12 %' },
  { label: '75008 Paris', leads: 118, trend: '+9 %' },
  { label: '92200 Neuilly', leads: 97, trend: '+15 %' },
  { label: '75017 Paris', leads: 81, trend: '+3 %' },
  { label: '92100 Boulogne', leads: 72, trend: '+7 %' },
  { label: '78100 Saint-Germain', leads: 64, trend: '+4 %' },
  { label: '75007 Paris', leads: 58, trend: '-2 %' },
  { label: '92300 Levallois', leads: 51, trend: '+6 %' },
  { label: '78150 Le Chesnay', leads: 48, trend: '+11 %' },
  { label: '75006 Paris', leads: 42, trend: '-5 %' },
];

// Petite série temporelle 30j pour le graphique (vues / leads)
export const TIMESERIES_30D = Array.from({ length: 30 }, (_, i) => {
  const day = i + 1;
  const base = 750 + Math.sin(i / 3) * 180 + i * 12;
  return {
    day,
    vues: Math.round(base + (i % 4 === 0 ? 80 : 0)),
    leads: Math.round(base * 0.05 + (i % 5 === 0 ? 8 : 0)),
  };
});
