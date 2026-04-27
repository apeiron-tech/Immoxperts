import type {
  SourceItemAnnonce,
  SourceItemBien,
  SourceItemEstimation,
  SourceItemLead,
  SourceItemOpportunite,
} from '../types';

export const MOCK_BIENS_SOURCES: SourceItemBien[] = [
  {
    id: 'bien_001',
    type: 'bien',
    label: 'T3 Paris 15e — 8 avenue Suffren',
    sublabel: '65 m² · 4e/8 · DPE D · Mandat exclusif',
    prix: 720000,
    ville: 'Paris 15e',
    mandat_type: 'exclusif',
  },
  {
    id: 'bien_002',
    type: 'bien',
    label: 'Studio Paris 12e — 22 rue Daumesnil',
    sublabel: '24 m² · 2e/6 · DPE E · Mandat simple',
    prix: 320000,
    ville: 'Paris 12e',
    mandat_type: 'simple',
  },
  {
    id: 'bien_003',
    type: 'bien',
    label: 'Loft Bordeaux Chartrons — 14 quai des Chartrons',
    sublabel: '92 m² · DPE C · Mandat exclusif',
    prix: 645000,
    ville: 'Bordeaux',
    mandat_type: 'exclusif',
  },
  {
    id: 'bien_004',
    type: 'bien',
    label: 'Maison Versailles — 8 rue de la Paroisse',
    sublabel: '160 m² · 4 chambres · DPE C',
    prix: 1180000,
    ville: 'Versailles',
    mandat_type: 'exclusif',
  },
  {
    id: 'bien_005',
    type: 'bien',
    label: 'T2 Lyon Croix-Rousse — 11 rue Justin Godart',
    sublabel: '46 m² · 3e/4 · DPE D',
    prix: 285000,
    ville: 'Lyon',
    mandat_type: 'simple',
  },
];

export const MOCK_ANNONCES_SOURCES: SourceItemAnnonce[] = [
  {
    id: 'ann_001',
    type: 'annonce',
    label: 'T4 Paris 17e — Wagram',
    sublabel: 'Annonce SeLoger active depuis 12j',
    source: 'SeLoger',
    prix: 985000,
  },
  {
    id: 'ann_002',
    type: 'annonce',
    label: 'Maison Saint-Germain-en-Laye',
    sublabel: 'Annonce Bien\'ici active depuis 23j',
    source: "Bien'ici",
    prix: 1450000,
  },
];

export const MOCK_LEADS_SOURCES: SourceItemLead[] = [
  {
    id: 'lead_001',
    type: 'lead',
    label: 'Jeanne D. — vendeur Paris 15e',
    sublabel: 'Estimation widget · score 82',
    zone: 'Paris 15e',
  },
  {
    id: 'lead_002',
    type: 'lead',
    label: 'Marc P. — vendeur Versailles',
    sublabel: 'Estimation widget · score 71',
    zone: 'Versailles',
  },
];

export const MOCK_ESTIMATIONS_SOURCES: SourceItemEstimation[] = [
  {
    id: 'est_001',
    type: 'estimation',
    label: 'AdV en cours — T3 Paris 15e',
    sublabel: 'AVM 718 000 € · indice 87 %',
    avm_estimation: 718000,
  },
  {
    id: 'est_002',
    type: 'estimation',
    label: 'AdV en cours — Loft Bordeaux',
    sublabel: 'AVM 638 000 € · indice 84 %',
    avm_estimation: 638000,
  },
];

export const MOCK_OPPORTUNITES_SOURCES: SourceItemOpportunite[] = [
  {
    id: 'opp_001',
    type: 'opportunite',
    label: 'Opportunité Marseille 8e — colocation 5 lots',
    sublabel: 'Rendement brut 6,8 % · TRI 8,2 %',
    rendement: 6.8,
  },
];
