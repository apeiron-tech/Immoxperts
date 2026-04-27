import { MetaSignalRadar, SignalProspection } from '../types';
import { signauxDvf } from './signauxDvf';
import { signauxDpe } from './signauxDpe';
import { signauxAnnonce } from './signauxAnnonce';

// Méta-signaux construits par fusion sur bien_id
// Deux cas illustrés :
// - bien_093_001 (Gabriel Péri) fusionne annonce + DPE
// - Reste de la liste = signaux individuels wrappés (meta à 1 enfant) pour rendu liste
const allSignals: SignalProspection[] = [
  ...signauxAnnonce,
  ...signauxDvf,
  ...signauxDpe,
];

// Signal fictif annonce pour enrichir la fusion 93_001
const annonce93001: SignalProspection = {
  signal_id: 'sgn_ann_93001',
  source: 'annonce',
  type: 'baisse_prix',
  title: 'Baisse de prix',
  subtitle: 'Appartement · 74 m² · 3 pièces',
  geo_precision: 'exacte',
  lat: 48.9362,
  lon: 2.3574,
  adresse: '12 rue Gabriel Péri',
  ville: 'Saint-Denis',
  code_postal: '93200',
  score: 80,
  score_breakdown: [
    { label: 'Fraîcheur du signal', contribution: 24, detail: 'Détecté il y a 3 jours' },
    { label: 'Intérêt du pattern', contribution: 20, detail: 'Baisse -5% en 12 j' },
  ],
  priority: 'haute',
  status: 'nouveau',
  bien_id: 'bien_093_001',
  assignee_id: 'user_paul',
  explanation_short: 'Baisse -5% en 12 j',
  tags: ['nouveau', 'baisse'],
  annonce_payload: {
    prix_actuel: 345000,
    prix_initial: 363000,
    variation_pct: -5,
    date_mise_en_ligne: '2026-04-01',
    age_jours: 23,
    prix_m2: 4662,
    ecart_prix_m2_secteur_pct: -3,
  },
  detected_at: '2026-04-21T09:00:00Z',
  created_at: '2026-04-21T09:00:00Z',
  updated_at: '2026-04-23T09:00:00Z',
};

export const metaSignalsRadar: MetaSignalRadar[] = [
  {
    meta_id: 'meta_093_001',
    bien_id: 'bien_093_001',
    sources: ['annonce', 'dpe'],
    score_agrege: 87,
    priority_agregee: 'haute',
    status_agrege: 'a_traiter',
    reasons_short: [
      'Baisse de -5% en 12 jours',
      'DPE F · usage résidence principale',
      'Zone tendue avec demande soutenue',
    ],
    ville: 'Saint-Denis',
    code_postal: '93200',
    adresse: '12 rue Gabriel Péri',
    lat: 48.9362,
    lon: 2.3574,
    children: [annonce93001, signauxDpe[1]],
    assignee_id: 'user_paul',
    created_at: '2026-04-21T09:00:00Z',
    updated_at: '2026-04-24T09:22:00Z',
  },
  // Tous les autres signaux comme méta-signal à 1 enfant pour uniformiser la liste
  ...allSignals
    .filter(s => s.bien_id && s.bien_id !== 'bien_093_001')
    .slice(0, 20)
    .map<MetaSignalRadar>((s, idx) => ({
      meta_id: `meta_solo_${idx}_${s.signal_id}`,
      bien_id: s.bien_id || '',
      sources: [s.source],
      score_agrege: s.score,
      priority_agregee: s.priority,
      status_agrege: s.status,
      reasons_short: [s.explanation_short],
      ville: s.ville,
      code_postal: s.code_postal,
      adresse: s.adresse,
      lat: s.lat,
      lon: s.lon,
      children: [s],
      assignee_id: s.assignee_id,
      created_at: s.created_at,
      updated_at: s.updated_at,
    })),
];
