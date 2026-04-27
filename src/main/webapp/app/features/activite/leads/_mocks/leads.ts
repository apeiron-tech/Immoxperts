import { Lead, MembreEquipe, StageMeta } from '../types';

export const STAGES: StageMeta[] = [
  { id: 'atraiter',    label: 'À traiter',   accent: '#94a3b8', headerBg: 'bg-slate-50',  headerBorder: 'border-slate-300',  textColor: 'text-slate-700' },
  { id: 'qualifie',    label: 'Qualifié',    accent: '#60a5fa', headerBg: 'bg-blue-50',   headerBorder: 'border-blue-300',   textColor: 'text-blue-700' },
  { id: 'estimation',  label: 'Estimation',  accent: '#2dd4bf', headerBg: 'bg-teal-50',   headerBorder: 'border-teal-300',   textColor: 'text-teal-700' },
  { id: 'mandat',      label: 'Mandat',      accent: '#a78bfa', headerBg: 'bg-propsight-50', headerBorder: 'border-propsight-300', textColor: 'text-propsight-700' },
  { id: 'negociation', label: 'Négociation', accent: '#fbbf24', headerBg: 'bg-amber-50',  headerBorder: 'border-amber-300',  textColor: 'text-amber-700' },
  { id: 'signe',       label: 'Signé',       accent: '#22c55e', headerBg: 'bg-green-50',  headerBorder: 'border-green-400',  textColor: 'text-green-700' },
  { id: 'perdu',       label: 'Perdu',       accent: '#f87171', headerBg: 'bg-red-50',    headerBorder: 'border-red-300',    textColor: 'text-red-700' },
];

export const MEMBRES: MembreEquipe[] = [
  { id: 'sl', nom: 'Sophie Leroy',   initiales: 'SL' },
  { id: 'tb', nom: 'Thomas Bernard', initiales: 'TB' },
  { id: 'ap', nom: 'Aline Perrin',   initiales: 'AP' },
];

export const MOCK_LEADS: Lead[] = [
  // À traiter (28 leads — on en cale 6)
  { lead_id: 'L-001', stage: 'atraiter', nom: 'Mme Bertrand',     initiales: 'MB', source: 'widget',     intention: 'vente',   adresse: '45 avenue Roger Ch…, 75015 Paris', prix: 820000,  commission: 14400, age: 'il y a 2 j', proprietaire: 'sl' },
  { lead_id: 'L-002', stage: 'atraiter', nom: 'Jean-Luc Moreau',  initiales: 'JL', source: 'pige',       intention: 'achat',   adresse: '22 rue de l\'Assomption, 75016',     prix: 550000,  commission: 9625,  age: 'il y a 5 h', proprietaire: 'sl' },
  { lead_id: 'L-003', stage: 'atraiter', nom: 'Emma Dubois',      initiales: 'ED', source: 'estimation', intention: 'estim',   adresse: 'Estimation – Appartement',           prix: 600000,  commission: null,  age: 'il y a 1 j', proprietaire: 'tb' },
  { lead_id: 'L-004', stage: 'atraiter', nom: 'Pierre Cornet',    initiales: 'PC', source: 'manuel',     intention: 'vente',   adresse: '12 rue Blomet, 75015',               prix: 1150000, commission: 20700, age: 'il y a 3 j', proprietaire: 'sl' },
  { lead_id: 'L-005', stage: 'atraiter', nom: 'Alexandre Simon',  initiales: 'AS', source: 'import',     intention: 'locatif', adresse: '7 rue de Vouillé, 75015',            prix: 470000,  commission: null,  age: 'il y a 6 j', proprietaire: 'ap' },
  { lead_id: 'L-006', stage: 'atraiter', nom: 'Sophie Renaud',    initiales: 'SR', source: 'pige',       intention: 'achat',   adresse: '34 rue de Vaugirard, 75015',         prix: 690000,  commission: 12420, age: 'il y a 8 h', proprietaire: 'tb' },

  // Qualifié (22 leads — on en cale 5)
  { lead_id: 'L-010', stage: 'qualifie', nom: 'Camille Lefort',   initiales: 'CL', source: 'widget',     intention: 'vente',   adresse: '16 rue Lecourbe, 75015',     prix: 780000,  commission: 14040, age: 'il y a 1 j', proprietaire: 'sl' },
  { lead_id: 'L-011', stage: 'qualifie', nom: 'Mathieu Martin',   initiales: 'MM', source: 'pige',       intention: 'achat',   adresse: '34 rue de Vaugirard, …',     prix: 690000,  commission: 12420, age: 'il y a 1 j', proprietaire: 'sl' },
  { lead_id: 'L-012', stage: 'qualifie', nom: 'Alice Meyer',      initiales: 'AM', source: 'pige',       intention: 'estim',   adresse: 'Estimation – Maison',         prix: 950000,  commission: null,  age: 'il y a 1 j', proprietaire: 'tb' },
  { lead_id: 'L-013', stage: 'qualifie', nom: 'Benoît Durand',    initiales: 'BD', source: 'manuel',     intention: 'vente',   adresse: '3 rue Blomet, 75015',         prix: 1250000, commission: null,  age: 'il y a 4 j', proprietaire: 'ap', badge: 'À relancer' },
  { lead_id: 'L-014', stage: 'qualifie', nom: 'Sophie Renaud',    initiales: 'SR', source: 'import',     intention: 'locatif', adresse: 'Appartement – 40m²',          prix: 1100,    commission: null,  age: 'il y a 1 j', proprietaire: 'sl' },

  // Estimation (16 leads — on en cale 5)
  { lead_id: 'L-020', stage: 'estimation', nom: 'M. Pley',          initiales: 'MP', source: 'widget', intention: 'vente',   adresse: '1 rue de la Ferme Exp…, 15e', prix: 780000,  commission: null,  age: 'il y a 15 j', proprietaire: 'sl' },
  { lead_id: 'L-021', stage: 'estimation', nom: 'Nicolas Bernard',  initiales: 'NB', source: 'pige',   intention: 'achat',   adresse: '16 rue Blomet, 75015',         prix: 690000,  commission: 16020, age: 'il y a 6 h',  proprietaire: 'tb' },
  { lead_id: 'L-022', stage: 'estimation', nom: 'Julie Thomas',     initiales: 'JT', source: 'manuel', intention: 'locatif', adresse: 'Appartement – 70m²',           prix: 1550,    commission: null,  age: 'il y a 1 j',  proprietaire: 'sl' },
  { lead_id: 'L-023', stage: 'estimation', nom: 'François Petit',   initiales: 'FP', source: 'pige',   intention: 'estim',   adresse: 'Estimation – Loft',            prix: 1200000, commission: null,  age: 'il y a 2 j',  proprietaire: 'ap' },
  { lead_id: 'L-024', stage: 'estimation', nom: 'L. Morel',         initiales: 'LM', source: 'import', intention: 'vente',   adresse: '57 rue de Ponthieu, 75008',    prix: 1350000, commission: 24300, age: 'il y a 1 j',  proprietaire: 'sl' },

  // Mandat (10 leads — on en cale 4)
  { lead_id: 'L-030', stage: 'mandat', nom: 'Mme Thauvain',    initiales: 'MT', source: 'widget', intention: 'vente', adresse: '14 rue Emmanuel Frém… 16e', prix: 1650000, commission: 29240, age: 'il y a 1 h', proprietaire: 'sl', badge: 'Exclusif' },
  { lead_id: 'L-031', stage: 'mandat', nom: 'C. Touré',        initiales: 'CT', source: 'manuel', intention: 'vente', adresse: 'Appartement – 85m²',         prix: 1380000, commission: null,  age: 'il y a 1 j', proprietaire: 'tb', sousStatut: 'Manuel' },
  { lead_id: 'L-032', stage: 'mandat', nom: 'Jacques Laurent', initiales: 'JL', source: 'pige',   intention: 'vente', adresse: 'Maison – Marseille 8e',      prix: 1890000, commission: 34020, age: 'il y a 4 j', proprietaire: 'ap', badge: 'Exclusif' },
  { lead_id: 'L-033', stage: 'mandat', nom: 'A. Legrand',      initiales: 'AL', source: 'pige',   intention: 'vente', adresse: 'Estimation – Maison',        prix: 1100000, commission: null,  age: 'il y a 2 j', proprietaire: 'sl' },

  // Négociation (8 leads — on en cale 4)
  { lead_id: 'L-040', stage: 'negociation', nom: 'Famille Bernard', initiales: 'FB', source: 'widget', intention: 'vente', adresse: '22 quai de Saône, 690… Lyon', prix: 1890000, commission: 34000, age: 'il y a 3 h', proprietaire: 'sl', badge: 'Urgent' },
  { lead_id: 'L-041', stage: 'negociation', nom: 'L. Garcé',        initiales: 'LG', source: 'manuel', intention: 'vente', adresse: 'Appartement – 85m²',           prix: 2050000, commission: null,  age: 'il y a 1 j', proprietaire: 'tb' },
  { lead_id: 'L-042', stage: 'negociation', nom: 'D. Robert',       initiales: 'DR', source: 'pige',   intention: 'vente', adresse: 'Maison – Bordeaux Caudéran',   prix: 1250000, commission: 22500, age: 'il y a 2 j', proprietaire: 'ap' },
  { lead_id: 'L-043', stage: 'negociation', nom: 'Sarah Cohen',     initiales: 'SC', source: 'pige',   intention: 'estim', adresse: '17 rue Brancas, 75015',        prix: 795000,  commission: 14310, age: 'il y a 5 h', proprietaire: 'sl' },

  // Signé (12 leads — on en cale 4)
  { lead_id: 'L-050', stage: 'signe', nom: 'Jean Hameau',  initiales: 'JH', source: 'widget',     intention: 'vente',   adresse: '10 rue du Hameau, 75015',          prix: 2450000, commission: 44100, age: 'il y a 2 j', proprietaire: 'sl', badge: 'Exclusif' },
  { lead_id: 'L-051', stage: 'signe', nom: 'Marie Vallet', initiales: 'MV', source: 'manuel',     intention: 'locatif', adresse: 'Appartement – 110m²',              prix: 2600,    commission: null,  age: 'il y a 1 j', proprietaire: 'tb' },
  { lead_id: 'L-052', stage: 'signe', nom: 'P. Robert',    initiales: 'PR', source: 'pige',       intention: 'vente',   adresse: 'Maison – Boulogne-Billancourt',    prix: 1980000, commission: 25640, age: 'il y a 1 j', proprietaire: 'ap' },
  { lead_id: 'L-053', stage: 'signe', nom: 'Julie Dumas',  initiales: 'JD', source: 'estimation', intention: 'estim',   adresse: 'Estimation – Appartement',         prix: 720000,  commission: null,  age: 'il y a 3 j', proprietaire: 'sl' },

  // Perdu (6 leads, colonne collapsed — pas affichés)
];

export const STAGE_TOTALS: Record<string, { count: number; valeur: number }> = {
  atraiter:    { count: 28, valeur: 391255 },
  qualifie:    { count: 22, valeur: 382455 },
  estimation:  { count: 16, valeur: 255650 },
  mandat:      { count: 10, valeur: 417500 },
  negociation: { count: 8,  valeur: 365800 },
  signe:       { count: 12, valeur: 580200 },
  perdu:       { count: 6,  valeur: 0 },
};
