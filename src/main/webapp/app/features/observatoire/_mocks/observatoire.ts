import {
  ZoneRef,
  MarketKpi,
  MarketRange,
  MarketTimeSeriesPoint,
  MarketSegmentRow,
  MarketComparable,
  NeighborZone,
  MarketDistributionBin,
  TensionScore,
  TensionDelayStats,
  TensionStockStats,
  PriceRevisionStats,
  AncienneAnnonce,
  TensionSegmentRow,
  TensionSignal,
  LocalContextKpi,
  LocalProfile,
  LifestyleScore,
  UrbanPotential,
  Confidence,
  PoiMapItem,
} from '../types';

/* ------------------------------------------------------------------ */
/* Zones                                                               */
/* ------------------------------------------------------------------ */

export const DEFAULT_ZONE: ZoneRef = {
  zone_id: 'paris-3e',
  label: 'Paris 3e',
  type: 'arrondissement',
  parent_label: 'Île-de-France',
  code_insee: '75103',
  code_postal: '75003',
  geometry_available: true,
  centroid: { lat: 48.862, lon: 2.362 },
};

export const ZONE_OPTIONS: ZoneRef[] = [
  DEFAULT_ZONE,
  {
    zone_id: 'paris-4e',
    label: 'Paris 4e',
    type: 'arrondissement',
    parent_label: 'Île-de-France',
    code_postal: '75004',
    geometry_available: true,
  },
  {
    zone_id: 'paris-11e',
    label: 'Paris 11e',
    type: 'arrondissement',
    parent_label: 'Île-de-France',
    code_postal: '75011',
    geometry_available: true,
  },
  {
    zone_id: 'paris-10e',
    label: 'Paris 10e',
    type: 'arrondissement',
    parent_label: 'Île-de-France',
    code_postal: '75010',
    geometry_available: true,
  },
  {
    zone_id: 'paris-2e',
    label: 'Paris 2e',
    type: 'arrondissement',
    parent_label: 'Île-de-France',
    code_postal: '75002',
    geometry_available: true,
  },
];

/* ------------------------------------------------------------------ */
/* Marché — Mode Vente                                                 */
/* ------------------------------------------------------------------ */

export const MARCHE_VENTE_KPIS: MarketKpi[] = [
  {
    id: 'prix_median',
    label: 'Prix médian',
    value: '11 420 €/m²',
    helper: 'DVF · 12 mois',
    confidence: 'forte',
  },
  {
    id: 'evolution_12m',
    label: 'Évolution 12m',
    value: '+2,4 %',
    helper: 'vs 12 mois précédents',
    trend: 'up',
    trend_label: '+2,4 %',
    confidence: 'forte',
  },
  {
    id: 'volume_dvf',
    label: 'Volume DVF',
    value: '624 ventes',
    helper: '12 mois glissants',
    confidence: 'forte',
  },
  {
    id: 'confiance',
    label: 'Confiance',
    value: 'Forte',
    helper: 'Volume + couverture',
    confidence: 'forte',
  },
];

export const MARCHE_VENTE_RANGE: MarketRange = {
  low: 10120,
  median: 11420,
  high: 13280,
  unit: 'eur_m2',
  period_label: '12 mois',
};

export const MARCHE_VENTE_TIMESERIES: MarketTimeSeriesPoint[] = [
  { period: 'mai 25', median: 11190, low: 9950, high: 12820, volume: 52 },
  { period: 'juin 25', median: 11220, low: 10010, high: 12910, volume: 48 },
  { period: 'juil. 25', median: 11150, low: 9920, high: 12760, volume: 56 },
  { period: 'août 25', median: 11080, low: 9870, high: 12640, volume: 39 },
  { period: 'sept. 25', median: 11180, low: 9990, high: 12820, volume: 52 },
  { period: 'oct. 25', median: 11260, low: 10040, high: 12960, volume: 58 },
  { period: 'nov. 25', median: 11310, low: 10070, high: 13010, volume: 51 },
  { period: 'déc. 25', median: 11340, low: 10080, high: 13040, volume: 44 },
  { period: 'janv. 26', median: 11360, low: 10090, high: 13110, volume: 49 },
  { period: 'févr. 26', median: 11390, low: 10120, high: 13180, volume: 55 },
  { period: 'mars 26', median: 11410, low: 10160, high: 13240, volume: 61 },
  { period: 'avr. 26', median: 11420, low: 10120, high: 13280, volume: 59 },
];

export const MARCHE_VENTE_SEGMENTS: MarketSegmentRow[] = [
  { segment_id: 'studio_t1', label: 'Studio / T1', median_value: 11050, volume: 128, evolution_12m_pct: 1.8, confidence: 'forte' },
  { segment_id: 't2', label: 'T2', median_value: 11780, volume: 242, evolution_12m_pct: 2.7, confidence: 'forte' },
  { segment_id: 't3', label: 'T3', median_value: 11520, volume: 186, evolution_12m_pct: 2.1, confidence: 'forte' },
  { segment_id: 't4_plus', label: 'T4 et +', median_value: 10620, volume: 68, evolution_12m_pct: 0.9, confidence: 'moyenne' },
];

export const MARCHE_VENTE_DISTRIBUTION: MarketDistributionBin[] = [
  { min: 6000, max: 8000, count: 22, share_pct: 3.5 },
  { min: 8000, max: 9000, count: 41, share_pct: 6.6 },
  { min: 9000, max: 10000, count: 86, share_pct: 13.8 },
  { min: 10000, max: 11000, count: 134, share_pct: 21.5 },
  { min: 11000, max: 12000, count: 158, share_pct: 25.3 },
  { min: 12000, max: 13000, count: 104, share_pct: 16.7 },
  { min: 13000, max: 14000, count: 48, share_pct: 7.7 },
  { min: 14000, max: 16000, count: 24, share_pct: 3.8 },
  { min: 16000, max: 18000, count: 7, share_pct: 1.1 },
];

export const MARCHE_VENTE_COMPARABLES_VENDUS: MarketComparable[] = [
  { comparable_id: 'c1', status: 'vendu', address_label: 'Rue de Turenne', distance_m: 140, surface_m2: 43, rooms: 2, price: 520000, value_per_m2: 12093, date: '03/2026' },
  { comparable_id: 'c2', status: 'vendu', address_label: 'Rue Charlot', distance_m: 180, surface_m2: 56, rooms: 2, price: 640000, value_per_m2: 11429, date: '03/2026' },
  { comparable_id: 'c3', status: 'vendu', address_label: 'Rue de Bretagne', distance_m: 250, surface_m2: 72, rooms: 3, price: 850000, value_per_m2: 11806, date: '02/2026' },
  { comparable_id: 'c4', status: 'vendu', address_label: 'Rue de Picardie', distance_m: 310, surface_m2: 64, rooms: 3, price: 745000, value_per_m2: 11641, date: '02/2026' },
  { comparable_id: 'c5', status: 'vendu', address_label: 'Rue des Gravilliers', distance_m: 330, surface_m2: 38, rooms: 2, price: 430000, value_per_m2: 11316, date: '02/2026' },
];

export const MARCHE_VENTE_COMPARABLES_EN_VENTE: MarketComparable[] = [
  { comparable_id: 'e1', status: 'en_vente', address_label: 'Rue Vieille du Temple', distance_m: 220, surface_m2: 48, rooms: 2, price: 595000, value_per_m2: 12396, date: '04/2026' },
  { comparable_id: 'e2', status: 'en_vente', address_label: 'Rue des Archives', distance_m: 290, surface_m2: 65, rooms: 3, price: 785000, value_per_m2: 12077, date: '04/2026' },
  { comparable_id: 'e3', status: 'en_vente', address_label: 'Rue du Temple', distance_m: 380, surface_m2: 32, rooms: 1, price: 420000, value_per_m2: 13125, date: '04/2026' },
];

export const MARCHE_VENTE_COMPARABLES_INVENDUS: MarketComparable[] = [
  { comparable_id: 'i1', status: 'invendu', address_label: 'Rue Beaubourg', distance_m: 410, surface_m2: 84, rooms: 3, price: 1150000, value_per_m2: 13690, date: '10/2025' },
  { comparable_id: 'i2', status: 'invendu', address_label: 'Rue de Montmorency', distance_m: 490, surface_m2: 58, rooms: 2, price: 780000, value_per_m2: 13448, date: '11/2025' },
];

export const MARCHE_NEIGHBORS: NeighborZone[] = [
  { zone_id: 'paris-2e', label: 'Paris 2e', code_postal: '75002', median_value: 12980, evolution_12m_pct: 2.1, volume: 542, confidence: 'forte' },
  { zone_id: 'paris-4e', label: 'Paris 4e', code_postal: '75004', median_value: 12250, evolution_12m_pct: 2.0, volume: 611, confidence: 'forte' },
  { zone_id: 'paris-11e', label: 'Paris 11e', code_postal: '75011', median_value: 10230, evolution_12m_pct: 2.6, volume: 736, confidence: 'forte' },
  { zone_id: 'paris-10e', label: 'Paris 10e', code_postal: '75010', median_value: 9860, evolution_12m_pct: 2.3, volume: 689, confidence: 'forte' },
];

export const MARCHE_VENTE_CONFIDENCE: Confidence = {
  level: 'forte',
  score: 82,
  reasons: [
    { label: 'Volume suffisant et représentatif', status: 'positive', detail: '624 ventes sur 12 mois' },
    { label: 'Couverture complète de la zone', status: 'positive', detail: 'Granularité arrondissement' },
    { label: 'Données récentes et cohérentes', status: 'positive', detail: 'MAJ avril 2026' },
    { label: 'Faible volume T4+', status: 'warning', detail: '68 ventes seulement' },
  ],
};

export const MARCHE_VENTE_INSIGHTS: string[] = [
  'Les prix restent globalement stables sur 12 mois.',
  'Les T2 sont le segment le plus liquide du secteur.',
  'Les annonces actives sont en moyenne 5,8 % au-dessus du réalisé DVF.',
];

export const MARCHE_VENTE_TAGS = ['Marché actif', 'Volume fiable', 'Prix stable', 'Écart annonces élevé'];

/* ------------------------------------------------------------------ */
/* Marché — Mode Location                                              */
/* ------------------------------------------------------------------ */

export const MARCHE_LOCATION_KPIS: MarketKpi[] = [
  { id: 'loyer_median', label: 'Loyer médian', value: '32,4 €/m²', helper: 'HC · 12 mois', confidence: 'forte' },
  { id: 'evolution_12m', label: 'Évolution 12m', value: '+3,1 %', helper: 'vs 12 mois précédents', trend: 'up', confidence: 'forte' },
  { id: 'volume_annonces', label: 'Volume annonces', value: '1 842', helper: '12 mois glissants', confidence: 'forte' },
  { id: 'confiance', label: 'Confiance', value: 'Forte', helper: 'Profondeur élevée', confidence: 'forte' },
];

export const MARCHE_LOCATION_RANGE: MarketRange = {
  low: 27.5,
  median: 32.4,
  high: 38.8,
  unit: 'eur_m2_hc',
  period_label: '12 mois',
};

/* ------------------------------------------------------------------ */
/* Marché — Mode Rendement                                             */
/* ------------------------------------------------------------------ */

export const MARCHE_RENDEMENT_KPIS: MarketKpi[] = [
  { id: 'rendement_brut', label: 'Rendement brut médian', value: '3,4 %', helper: 'Prix / loyer', confidence: 'moyenne' },
  { id: 'prix_median', label: 'Prix médian', value: '11 420 €/m²', helper: 'DVF · 12 mois', confidence: 'forte' },
  { id: 'loyer_median', label: 'Loyer médian', value: '32,4 €/m²', helper: 'HC · 12 mois', confidence: 'forte' },
  { id: 'confiance', label: 'Confiance', value: 'Moyenne', helper: 'Rendement sensible au mode', confidence: 'moyenne' },
];

/* ------------------------------------------------------------------ */
/* Tension                                                             */
/* ------------------------------------------------------------------ */

export const TENSION_VENTE_KPIS: MarketKpi[] = [
  { id: 'score', label: 'Score tension', value: '56 / 100', helper: 'Équilibré', confidence: 'forte' },
  { id: 'delai', label: 'Délai médian', value: '49 j', helper: '90 jours', trend: 'up', trend_label: '+4 j', confidence: 'forte' },
  { id: 'stock', label: 'Stock actif', value: '318', helper: 'annonces actives', trend: 'up', trend_label: '+12 %', confidence: 'forte' },
  { id: 'baisses', label: 'Baisses de prix', value: '18 %', helper: 'Part des annonces', trend: 'up', trend_label: '+3 pts', confidence: 'moyenne' },
];

export const TENSION_LOCATION_KPIS: MarketKpi[] = [
  { id: 'score', label: 'Indice de tension', value: '8,7 / 10', helper: 'Forte', trend: 'up', trend_label: '+0,9', confidence: 'forte' },
  { id: 'delai', label: 'Délai médian', value: '18 j', helper: 'Location', trend: 'down', trend_label: '-6 j', confidence: 'forte' },
  { id: 'rotation', label: 'Rotation du stock', value: '1,8x / trim.', helper: 'Absorption', trend: 'up', trend_label: '+0,3', confidence: 'forte' },
  { id: 'vacance', label: 'Vacance estimée', value: '2,1 %', helper: 'vs 12 mois', trend: 'down', trend_label: '-1,0 pt', confidence: 'moyenne' },
];

export const TENSION_VENTE_SCORE: TensionScore = {
  value: 56,
  label: 'equilibre',
  explanation:
    'Le marché reste équilibré : les délais sont proches de la tendance, mais le stock augmente légèrement sur les T3/T4.',
  components: [
    { id: 'stock', label: 'Stock en hausse sur 90 jours', value: '+12 %', direction: 'ralentit', detail: '318 annonces actives' },
    { id: 'baisses', label: '18 % des annonces ont baissé leur prix', value: '18 %', direction: 'ralentit', detail: 'Baisse médiane -4,2 %' },
    { id: 'delai', label: 'Délai médian inférieur à 60 jours', value: '49 j', direction: 'soutient', detail: 'Absorption correcte' },
    { id: 'volume_dvf', label: 'Volume DVF stable sur 12 mois', value: '624', direction: 'soutient', detail: 'Liquidité préservée' },
  ],
};

export const TENSION_LOCATION_SCORE: TensionScore = {
  value: 87,
  label: 'tres_dynamique',
  explanation:
    'Demande locative très soutenue, supérieure à l\'offre disponible. Stock limité sur petites surfaces, forte concurrence T1/T2.',
  components: [
    { id: 'delai', label: 'Délai médian < 20 jours', value: '18 j', direction: 'soutient', detail: 'Absorption rapide' },
    { id: 'stock_faible', label: 'Stock locatif faible', value: '654', direction: 'soutient', detail: '-8 % sur 90j' },
    { id: 'vacance', label: 'Vacance basse', value: '2,1 %', direction: 'soutient', detail: 'vs 3,1 % année n-1' },
    { id: 'revisions', label: 'Peu de révisions de loyers', value: '9 %', direction: 'soutient', detail: 'Loyers tenus' },
  ],
};

export const TENSION_DELAYS_VENTE: TensionDelayStats = {
  fast_days: 20,
  median_days: 49,
  slow_days: 105,
  period_label: '6 mois',
  distribution: [
    { bucket: '0-7', share_pct: 4 },
    { bucket: '8-14', share_pct: 12 },
    { bucket: '15-21', share_pct: 15 },
    { bucket: '22-45', share_pct: 28 },
    { bucket: '46-60', share_pct: 18 },
    { bucket: '61-90', share_pct: 14 },
    { bucket: '90+', share_pct: 9 },
  ],
};

export const TENSION_DELAYS_LOCATION: TensionDelayStats = {
  fast_days: 4,
  median_days: 18,
  slow_days: 42,
  period_label: '6 mois',
  distribution: [
    { bucket: '0-7', share_pct: 28 },
    { bucket: '8-14', share_pct: 31 },
    { bucket: '15-21', share_pct: 18 },
    { bucket: '22-45', share_pct: 15 },
    { bucket: '46-60', share_pct: 5 },
    { bucket: '61-90', share_pct: 2 },
    { bucket: '90+', share_pct: 1 },
  ],
};

export const TENSION_STOCK_VENTE: TensionStockStats = {
  active_count: 318,
  evolution_pct: 12,
  period_label: '90 jours',
  by_segment: [
    { segment_id: 'studio_t1', label: 'Studio / T1', count: 42, evolution_pct: 4 },
    { segment_id: 't2', label: 'T2', count: 86, evolution_pct: 9 },
    { segment_id: 't3', label: 'T3', count: 104, evolution_pct: 22 },
    { segment_id: 't4_plus', label: 'T4 et +', count: 86, evolution_pct: 18 },
  ],
};

export const TENSION_STOCK_LOCATION: TensionStockStats = {
  active_count: 654,
  evolution_pct: -8,
  period_label: '90 jours',
  by_segment: [
    { segment_id: 'studio_t1', label: 'Studio / T1', count: 214 },
    { segment_id: 't2', label: 'T2', count: 238 },
    { segment_id: 't3', label: 'T3', count: 128 },
    { segment_id: 't4_plus', label: 'T4 et +', count: 74 },
  ],
};

export const TENSION_REVISIONS_VENTE: PriceRevisionStats = {
  revision_rate_pct: 18,
  median_revision_pct: -4.2,
  median_days_before_revision: 38,
  by_segment: [
    { segment_id: 'studio_t1', label: 'T1 / T2', revision_rate_pct: 11, median_revision_pct: -3.1 },
    { segment_id: 't3', label: 'T3', revision_rate_pct: 21, median_revision_pct: -4.5 },
    { segment_id: 't4_plus', label: 'T4 et +', revision_rate_pct: 24, median_revision_pct: -5.2 },
  ],
};

export const TENSION_REVISIONS_LOCATION: PriceRevisionStats = {
  revision_rate_pct: 9,
  median_revision_pct: -2.8,
  median_days_before_revision: 21,
  by_segment: [
    { segment_id: 'studio_t1', label: 'T1 meublé', revision_rate_pct: 3, median_revision_pct: -2.0 },
    { segment_id: 't2', label: 'T2 meublé', revision_rate_pct: 5, median_revision_pct: -2.2 },
    { segment_id: 't3', label: 'T3 vide', revision_rate_pct: 12, median_revision_pct: -3.1 },
    { segment_id: 't4_plus', label: 'T4 et +', revision_rate_pct: 18, median_revision_pct: -3.8 },
  ],
};

export const TENSION_ANNONCES_ANCIENNES: AncienneAnnonce[] = [
  { id: 'aa1', label: 'T3 · Rue du Temple', rooms: 3, surface: 64, price: 895000, age_days: 128, signal_label: 'Prix trop haut' },
  { id: 'aa2', label: 'T2 · Rue Chapon', rooms: 2, surface: 48, price: 685000, age_days: 94, signal_label: 'Baisse récente' },
  { id: 'aa3', label: 'T4 · Rue Beaubourg', rooms: 4, surface: 110, price: 1620000, age_days: 156, signal_label: 'Stock rare mais cher' },
  { id: 'aa4', label: 'T2 · Rue Michel le Comte', rooms: 2, surface: 42, price: 580000, age_days: 102, signal_label: 'Prix > médiane' },
];

export const TENSION_SEGMENTS_VENTE: TensionSegmentRow[] = [
  { segment_id: 'studio_t1', label: 'T1 / T2', score: 72, label_score: 'dynamique', delay_median: 32, stock: 42, revision_pct: 8 },
  { segment_id: 't3', label: 'T3', score: 49, label_score: 'equilibre', delay_median: 61, stock: 104, revision_pct: 21 },
  { segment_id: 't4_plus', label: 'T4 et +', score: 38, label_score: 'ralenti', delay_median: 84, stock: 86, revision_pct: 24 },
];

export const TENSION_SEGMENTS_LOCATION: TensionSegmentRow[] = [
  { segment_id: 'studio_t1', label: 'Studio / T1', score: 92, label_score: 'tres_dynamique', delay_median: 12, stock: 214, revision_pct: 2 },
  { segment_id: 't2', label: 'T2', score: 87, label_score: 'tres_dynamique', delay_median: 17, stock: 238, revision_pct: 4 },
  { segment_id: 't3', label: 'T3', score: 76, label_score: 'dynamique', delay_median: 23, stock: 128, revision_pct: 8 },
  { segment_id: 't4_plus', label: 'T4 et +', score: 61, label_score: 'equilibre', delay_median: 31, stock: 74, revision_pct: 15 },
];

export const TENSION_SIGNALS_VENTE: TensionSignal[] = [
  {
    id: 's1',
    title: '18 annonces anciennes avec prix > marché',
    description: 'Prix affiché en moyenne +7,8 % au-dessus du réalisé DVF.',
    severity: 'high',
    actions: ['Voir annonces', 'Créer action prospection'],
  },
  {
    id: 's2',
    title: 'Stock T3 en hausse de 22 %',
    description: 'Absorption ralentie sur le segment intermédiaire.',
    severity: 'medium',
    actions: ['Créer alerte tension', 'Ajouter au brief marché'],
  },
  {
    id: 's3',
    title: 'Petites surfaces sous 12 jours de délai médian',
    description: 'Opportunité investisseur — forte demande locative.',
    severity: 'low',
    actions: ['Ouvrir opportunités', 'Ajouter au dossier'],
  },
];

export const TENSION_VENTE_INSIGHTS: string[] = [
  'Marché équilibré mais délais qui s\'allongent sur les T3.',
  '18 % des annonces ont déjà baissé leur prix sur 90 jours.',
  'Les biens au-dessus du marché génèrent des opportunités de prospection.',
];

export const TENSION_LOCATION_INSIGHTS: string[] = [
  'Demande locative très soutenue, supérieure à l\'offre disponible.',
  'Stock limité sur petites surfaces, forte concurrence T1/T2.',
  'Absorption rapide : la moitié des biens se loue en moins de 18 jours.',
];

export const TENSION_VENTE_TAGS = ['Marché tendu', 'Demande forte', 'Rotation rapide', 'Vacance faible'];

export const TENSION_VENTE_CONFIDENCE: Confidence = {
  level: 'moyenne',
  score: 68,
  reasons: [
    { label: 'Volume annonces suffisant', status: 'positive', detail: '318 annonces actives' },
    { label: 'Historique disponible sur 12 mois', status: 'positive', detail: 'Données de retrait' },
    { label: 'Données DVF non temps réel', status: 'warning', detail: 'Décalage 3-6 mois' },
    { label: 'Segment T4+ peu profond', status: 'warning', detail: '86 annonces seulement' },
  ],
};

/* ------------------------------------------------------------------ */
/* Contexte local — Profil                                             */
/* ------------------------------------------------------------------ */

export const CONTEXTE_PROFIL_KPIS: LocalContextKpi[] = [
  { id: 'population', label: 'Population', value: '32 420', helper: '+1,5 % vs 2021', trend: 'up', confidence: 'tres_forte' },
  { id: 'revenu_median', label: 'Revenu médian', value: '35 790 €', helper: '+2,3 % vs 2021', trend: 'up', confidence: 'tres_forte' },
  { id: 'locataires', label: 'Part de locataires', value: '69,2 %', helper: '+1,1 pt vs 2021', trend: 'up', confidence: 'tres_forte' },
  { id: 'age', label: 'Âge médian', value: '37,6 ans', helper: '+1,0 vs 2021', trend: 'flat', confidence: 'tres_forte' },
];

export const CONTEXTE_PROFIL: LocalProfile = {
  population: 32420,
  households: 20145,
  median_income_monthly: 2983,
  median_age: 37.6,
  tenant_share_pct: 69.2,
  owner_share_pct: 30.8,
  unemployment_pct: 8.6,
  students_pct: 12.8,
  age_distribution: [
    { bucket: '0-14', share_pct: 11.2 },
    { bucket: '15-24', share_pct: 17.4 },
    { bucket: '25-39', share_pct: 36.3 },
    { bucket: '40-54', share_pct: 22.1 },
    { bucket: '55-64', share_pct: 8.6 },
    { bucket: '65+', share_pct: 4.4 },
  ],
  csp_distribution: [
    { label: 'Cadres', share_pct: 34.7 },
    { label: 'Professions intermédiaires', share_pct: 25.1 },
    { label: 'Employés', share_pct: 22.0 },
    { label: 'Ouvriers', share_pct: 10.1 },
    { label: 'Autres inactifs', share_pct: 8.1 },
  ],
  housing_typology: [
    { bucket: 'Studio / T1', share_pct: 33.5 },
    { bucket: 'T2', share_pct: 31.2 },
    { bucket: 'T3', share_pct: 21.7 },
    { bucket: 'T4+', share_pct: 13.6 },
  ],
  dominant_target_profile: 'jeune_actif',
  demand_depth: 'forte',
  required_income_monthly: 3000,
  eligible_population_share_pct: 34,
};

export const CONTEXTE_PROFIL_INSIGHTS: string[] = [
  'Quartier central et historique du Marais, très recherché pour sa localisation.',
  'Population jeune, active et diplômée avec forte part d\'étudiants.',
  'Parc dominé par les petites surfaces et locataires — favorable à la location.',
];

/* ------------------------------------------------------------------ */
/* Contexte local — Cadre de vie                                       */
/* ------------------------------------------------------------------ */

export const CONTEXTE_CADRE_KPIS: LocalContextKpi[] = [
  { id: 'transports', label: 'Desserte transports', value: '9,1 / 10', helper: 'Très bien connecté', status: 'positive', confidence: 'tres_forte' },
  { id: 'commerces', label: 'Commerces & services', value: 'Très dense', helper: 'Offre du quotidien complète', status: 'positive', confidence: 'tres_forte' },
  { id: 'education', label: 'Éducation', value: 'Complète', helper: 'Crèches, écoles, collèges', status: 'positive', confidence: 'forte' },
  { id: 'espaces_verts', label: 'Espaces verts', value: 'Bon niveau', helper: 'Parcs et squares', status: 'positive', confidence: 'forte' },
];

export const CONTEXTE_LIFESTYLE: LifestyleScore = {
  global_score: 82,
  global_grade: 'B',
  dimensions: {
    transports: { score: 91, grade: 'A' },
    commerces: { score: 88, grade: 'A' },
    sante: { score: 78, grade: 'B' },
    education: { score: 76, grade: 'B' },
    services: { score: 81, grade: 'B' },
    vie_quartier: { score: 92, grade: 'A' },
  },
  strengths: [
    'Forte accessibilité',
    'Quotidien facilité',
    'Quartier central et vivant',
  ],
  warnings: [
    'Densité urbaine',
    'Espaces verts limités vs périphérie',
  ],
  transports_detail: [
    { mode: 'Métro', stars: 5, description: '4 stations à moins de 10 min' },
    { mode: 'Bus', stars: 4, description: 'Réseau dense' },
    { mode: 'Vélo', stars: 4, description: 'Pistes et Vélib\' à proximité' },
    { mode: 'Marche', stars: 5, description: 'Quartier très praticable à pied' },
    { mode: 'Stationnement', stars: 2, description: 'Offre limitée' },
    { mode: 'Accès gares', stars: 4, description: 'Connexions rapides via métro' },
  ],
  commerces_detail: [
    { label: 'Alimentation', count: 18, icon: 'food' },
    { label: 'Restaurants & cafés', count: 42, icon: 'restaurant' },
    { label: 'Pharmacies', count: 5, icon: 'pharma' },
    { label: 'Santé', count: 9, icon: 'health' },
    { label: 'Banques', count: 6, icon: 'bank' },
    { label: 'Services publics', count: 4, icon: 'service' },
  ],
  education_detail: [
    { label: 'Crèches', stars: 4, detail: 'Offre abondante' },
    { label: 'Écoles', stars: 5, detail: 'Très bonne couverture' },
    { label: 'Collèges / Lycées', stars: 4, detail: 'Plusieurs établissements' },
    { label: 'Équipements culturels', stars: 4, detail: 'Offre riche et variée' },
    { label: 'Sports & loisirs', stars: 4, detail: 'Nombreuses options' },
  ],
  environnement_detail: [
    { label: 'Niveau de bruit', stars: 3, detail: 'Animé, bruit modéré' },
    { label: 'Propreté', stars: 4, detail: 'Globalement propre' },
    { label: 'Sécurité perçue', stars: 4, detail: 'Bonne perception' },
    { label: 'Animation du quartier', stars: 5, detail: 'Très vivant, dynamique' },
    { label: 'Calme résidentiel', stars: 2, detail: 'Modéré en soirée' },
  ],
};

export const CONTEXTE_CADRE_INSIGHTS: string[] = [
  'Zone très praticable à pied, services du quotidien à moins de 5 minutes.',
  'Bonne desserte transports, adaptée aux jeunes actifs et locataires sans voiture.',
  'Attractivité familiale correcte grâce aux écoles et équipements proches.',
];

/* ------------------------------------------------------------------ */
/* Contexte local — Potentiel                                          */
/* ------------------------------------------------------------------ */

export const CONTEXTE_POTENTIEL_KPIS: LocalContextKpi[] = [
  { id: 'score', label: 'Score potentiel global', value: '68 / 100', helper: 'Modéré à favorable', trend: 'up', trend_label: '+6 pts', confidence: 'forte' },
  { id: 'permis', label: 'Permis récents (500 m)', value: '12', helper: '6 autorisés · 6 déposés', confidence: 'forte' },
  { id: 'dpe_fg', label: 'Part de DPE F / G', value: '18 %', helper: 'vs 2021 : 15,9 %', trend: 'up', trend_label: '+2,1 pts', status: 'warning', confidence: 'forte' },
  { id: 'zonage', label: 'Zonage PLU', value: 'UA', helper: 'Zone urbaine centrale', confidence: 'forte' },
];

export const CONTEXTE_POTENTIEL: UrbanPotential = {
  score: 68,
  grade: 'B',
  verdict: 'favorable',
  verdict_label: 'Modéré à favorable',
  plu_zone: 'UA',
  plu_destination: 'Habitation / Commerce',
  plu_height_max: '18 m',
  plu_emprise_max: '80 %',
  plu_servitudes: 'Aucune connue',
  plu_abf: 'Périmètre éloigné',
  cadastre: {
    reference: '75103 0312 AB 0124',
    surface_parcelle: 156,
    surface_batie: 128,
    surface_libre: 28,
    emprise_au_sol_pct: 82,
    nb_batiments: 1,
  },
  permits_count_500m: 12,
  permits: [
    { type: 'PC', statut: 'Autorisé', date: '03/2024', projet: 'Rénovation + surélévation', logements: 8, distance_m: 120 },
    { type: 'DP', statut: 'Déposé', date: '05/2024', projet: 'Ravalement façade', distance_m: 180 },
    { type: 'PC', statut: 'Autorisé', date: '11/2023', projet: 'Création de 6 logements', logements: 6, distance_m: 220 },
    { type: 'DP', statut: 'Déposé', date: '05/2024', projet: 'Aménagement intérieur', distance_m: 280 },
    { type: 'PD', statut: 'Autorisé', date: '09/2023', projet: 'Démolition partielle', distance_m: 340 },
  ],
  dpe_distribution: [
    { grade: 'A/B', share_pct: 14, color: '#16A34A' },
    { grade: 'C/D', share_pct: 32, color: '#65A30D' },
    { grade: 'E', share_pct: 36, color: '#EAB308' },
    { grade: 'F/G', share_pct: 18, color: '#DC2626' },
  ],
  dpe_f_g_share_pct: 18,
  dpe_evolution_pct: 2.1,
  reglementations: [
    { label: 'Zone tendue', status: 'Oui', impact_level: 'warning' },
    { label: 'Encadrement des loyers', status: 'Oui', impact_level: 'warning' },
    { label: 'Permis de louer', status: 'Non', impact_level: 'ok' },
    { label: 'Changement d\'usage', status: 'Autorisation', impact_level: 'warning' },
    { label: 'Meublé touristique', status: 'Autorisé sous conditions', impact_level: 'warning' },
    { label: 'DPE location minimum', status: 'Classe E minimum', impact_level: 'ok' },
  ],
  transformabilite: [
    { label: 'Rénovation légère', level: 'simple' },
    { label: 'Amélioration DPE', level: 'pertinente' },
    { label: 'Reconfiguration intérieure', level: 'simple' },
    { label: 'Division intérieure', level: 'a_verifier' },
    { label: 'Surélévation', level: 'contraint' },
    { label: 'Changement de destination', level: 'vigilance' },
  ],
  strengths: [
    'Dynamique urbaine en cours avec plusieurs projets à proximité.',
    'Fort potentiel de rénovation énergétique (poche DPE F/G).',
    'PLU favorable pour la rénovation et la reconfiguration intérieure.',
  ],
  warnings: [
    'Vérifier changement d\'usage pour locations saisonnières.',
    'Stationnement limité dans le secteur.',
  ],
  horizon: '3 à 7 ans',
};

export const CONTEXTE_POTENTIEL_INSIGHTS: string[] = [
  'Dynamique urbaine en cours avec plusieurs projets à proximité.',
  'Fort potentiel de rénovation énergétique (poche DPE F/G importante).',
  'PLU favorable pour la rénovation et la reconfiguration intérieure.',
];

/* ------------------------------------------------------------------ */
/* Carte — POI Paris 3e / Le Marais                                    */
/* ------------------------------------------------------------------ */

export const POI_PROFIL: PoiMapItem[] = [
  { id: 'ec1', x: 22, y: 28, kind: 'ecole', label: 'École' },
  { id: 'ec2', x: 45, y: 36, kind: 'ecole', label: 'École' },
  { id: 'ec3', x: 68, y: 54, kind: 'ecole', label: 'École' },
  { id: 't1', x: 20, y: 48, kind: 'transport', label: 'Métro' },
  { id: 't2', x: 38, y: 60, kind: 'transport', label: 'Métro' },
  { id: 't3', x: 72, y: 42, kind: 'transport', label: 'Métro' },
  { id: 't4', x: 82, y: 66, kind: 'transport', label: 'Métro' },
  { id: 'p1', x: 14, y: 42, kind: 'parc', label: 'Parc' },
  { id: 'p2', x: 85, y: 82, kind: 'parc', label: 'Parc' },
  { id: 'c1', x: 30, y: 52, kind: 'commerce', label: 'Commerce' },
  { id: 'c2', x: 50, y: 46, kind: 'commerce', label: 'Commerce' },
  { id: 'c3', x: 58, y: 62, kind: 'commerce', label: 'Commerce' },
];

export const POI_CADRE: PoiMapItem[] = [
  ...POI_PROFIL,
  { id: 'sv1', x: 28, y: 38, kind: 'service', label: 'Service' },
  { id: 'sv2', x: 62, y: 48, kind: 'service', label: 'Service' },
  { id: 'sa1', x: 40, y: 70, kind: 'sante', label: 'Santé' },
  { id: 'sa2', x: 74, y: 30, kind: 'sante', label: 'Santé' },
];

export const POI_POTENTIEL: PoiMapItem[] = [
  { id: 'pc1', x: 28, y: 44, kind: 'permis', label: 'Permis' },
  { id: 'pc2', x: 42, y: 52, kind: 'permis', label: 'Permis' },
  { id: 'pc3', x: 56, y: 38, kind: 'permis', label: 'Permis' },
  { id: 'pc4', x: 64, y: 58, kind: 'permis', label: 'Permis' },
  { id: 'pc5', x: 48, y: 66, kind: 'permis', label: 'Permis' },
  { id: 'pc6', x: 36, y: 34, kind: 'permis', label: 'Permis' },
  { id: 'pr1', x: 22, y: 60, kind: 'projet', label: 'Projet urbain' },
  { id: 'pr2', x: 78, y: 42, kind: 'projet', label: 'Projet urbain' },
  { id: 'dpe1', x: 32, y: 56, kind: 'dpe_fg', label: 'DPE F/G' },
  { id: 'dpe2', x: 60, y: 48, kind: 'dpe_fg', label: 'DPE F/G' },
  { id: 'dpe3', x: 44, y: 60, kind: 'dpe_fg', label: 'DPE F/G' },
];
