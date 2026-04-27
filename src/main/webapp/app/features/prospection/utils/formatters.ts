import {
  DPESignalType,
  DVFSignalType,
  AnnonceSignalType,
  SignalStatus,
  SignalPriority,
  ClasseDPE,
  SignalSource,
} from '../types';

export const formatEuro = (n?: number): string => {
  if (n === undefined || n === null) return '—';
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(n);
};

export const formatPrixM2 = (n?: number): string => {
  if (n === undefined || n === null) return '—';
  return `${new Intl.NumberFormat('fr-FR').format(n)} €/m²`;
};

export const formatPct = (n?: number, withSign = true): string => {
  if (n === undefined || n === null) return '—';
  const sign = withSign && n > 0 ? '+' : '';
  return `${sign}${n.toFixed(1).replace('.0', '')}%`;
};

export const formatDate = (iso?: string): string => {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

export const formatDateShort = (iso?: string): string => {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: '2-digit' });
};

export const formatRelativeTime = (iso?: string): string => {
  if (!iso) return '—';
  const d = new Date(iso);
  const now = new Date();
  const diffMin = Math.floor((now.getTime() - d.getTime()) / 60000);
  if (diffMin < 1) return 'à l\'instant';
  if (diffMin < 60) return `il y a ${diffMin} min`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `il y a ${diffH} h`;
  const diffJ = Math.floor(diffH / 24);
  if (diffJ < 7) return `il y a ${diffJ} j`;
  if (diffJ < 30) return `il y a ${Math.floor(diffJ / 7)} sem.`;
  return formatDate(iso);
};

export const formatDureeDetention = (ans?: number, mois?: number): string => {
  if (ans === undefined && mois === undefined) return '—';
  const a = ans || 0;
  const m = mois || 0;
  if (a === 0 && m === 0) return '< 1 mois';
  if (a === 0) return `${m} mois`;
  if (m === 0) return `${a} ans`;
  return `${a} ans ${m} mois`;
};

// ---- Labels ---------------------------------------------------------------
export const labelDvf: Record<DVFSignalType, string> = {
  vente_proche: 'Vente proche',
  detention_longue: 'Détention longue',
  revente_rapide: 'Revente rapide',
  cycle_revente_regulier: 'Cycle régulier',
  zone_rotation_forte: 'Zone rotation forte',
  ecart_marche: 'Écart vs marché',
  comparables_denses: 'Comparables denses',
};

export const labelDpe: Record<DPESignalType, string> = {
  vendeur_probable: 'Vendeur probable',
  bailleur_a_arbitrer: 'Bailleur à arbitrer',
  potentiel_renovation: 'Potentiel rénovation',
  opportunite_investisseur: 'Opportunité investisseur',
  passoire_thermique: 'Passoire thermique',
  risque_locatif: 'Risque locatif',
  poche_passoires: 'Poche de passoires',
  revalorisation_apres_travaux: 'Revalorisation après travaux',
};

export const labelAnnonce: Record<AnnonceSignalType, string> = {
  baisse_prix: 'Baisse de prix',
  remise_en_ligne: 'Remise en ligne',
  annonce_ancienne: 'Annonce ancienne',
  anomalie_prix_m2: 'Prix/m² anormal',
  zone_suivie_active: 'Zone suivie active',
};

export const labelStatus: Record<SignalStatus, string> = {
  nouveau: 'Nouveau',
  vu: 'Vu',
  a_traiter: 'À traiter',
  a_qualifier: 'À qualifier',
  en_cours: 'En cours',
  converti_action: 'Action créée',
  converti_lead: 'Converti lead',
  suivi: 'Suivi',
  ignore: 'Ignoré',
  archive: 'Archivé',
};

export const labelPriority: Record<SignalPriority, string> = {
  haute: 'Élevée',
  moyenne: 'Moyenne',
  basse: 'Faible',
};

export const labelSource: Record<SignalSource, string> = {
  annonce: 'Annonce',
  dvf: 'DVF',
  dpe: 'DPE',
  zone: 'Zone',
};

// Couleurs classes DPE (norme)
export const classeDPEColor: Record<ClasseDPE, { bg: string; text: string; label: string }> = {
  A: { bg: '#00A651', text: '#ffffff', label: 'A' },
  B: { bg: '#50B848', text: '#ffffff', label: 'B' },
  C: { bg: '#AED136', text: '#1a1a1a', label: 'C' },
  D: { bg: '#FFF200', text: '#1a1a1a', label: 'D' },
  E: { bg: '#FDB913', text: '#1a1a1a', label: 'E' },
  F: { bg: '#F37021', text: '#ffffff', label: 'F' },
  G: { bg: '#ED1C24', text: '#ffffff', label: 'G' },
};

export const statusColorClass = (status: SignalStatus): string => {
  switch (status) {
    case 'nouveau':
      return 'bg-emerald-50 text-emerald-700 ring-emerald-200';
    case 'a_traiter':
      return 'bg-amber-50 text-amber-700 ring-amber-200';
    case 'a_qualifier':
      return 'bg-blue-50 text-blue-700 ring-blue-200';
    case 'en_cours':
      return 'bg-propsight-50 text-propsight-700 ring-propsight-200';
    case 'converti_lead':
    case 'converti_action':
      return 'bg-emerald-50 text-emerald-700 ring-emerald-200';
    case 'suivi':
      return 'bg-indigo-50 text-indigo-700 ring-indigo-200';
    case 'ignore':
    case 'archive':
      return 'bg-slate-100 text-slate-500 ring-slate-200';
    case 'vu':
      return 'bg-slate-50 text-slate-600 ring-slate-200';
    default:
      return 'bg-slate-50 text-slate-600 ring-slate-200';
  }
};

export const scoreColorClass = (score: number): string => {
  if (score >= 80) return 'bg-emerald-50 text-emerald-700 ring-emerald-200';
  if (score >= 60) return 'bg-amber-50 text-amber-700 ring-amber-200';
  return 'bg-slate-100 text-slate-500 ring-slate-200';
};

export const priorityColorClass = (p: SignalPriority): string => {
  switch (p) {
    case 'haute':
      return 'bg-rose-50 text-rose-700 ring-rose-200';
    case 'moyenne':
      return 'bg-amber-50 text-amber-700 ring-amber-200';
    case 'basse':
      return 'bg-slate-100 text-slate-500 ring-slate-200';
    default:
      return 'bg-slate-100 text-slate-500 ring-slate-200';
  }
};

export const sourceColorClass = (s: SignalSource): string => {
  switch (s) {
    case 'annonce':
      return 'bg-propsight-50 text-propsight-700 ring-propsight-200';
    case 'dvf':
      return 'bg-blue-50 text-blue-700 ring-blue-200';
    case 'dpe':
      return 'bg-amber-50 text-amber-700 ring-amber-200';
    case 'zone':
      return 'bg-rose-50 text-rose-700 ring-rose-200';
    default:
      return 'bg-slate-100 text-slate-500 ring-slate-200';
  }
};
