import {
  ActiviteDay,
  ActiviteTypeMeta,
  CaMonth,
  DonutSlice,
  DossierRow,
  Hypotheses,
  IndicateursMarcheData,
  KpiData,
  MarcheZone,
  PipelineStageStat,
  SourceRow,
} from '../types';

export const KPI_OPERATIONNELLE: KpiData[] = [
  { label: 'Leads entrants',           value: '128',  delta: '+12%',  trend: 'up', compare: 'vs 98 précédemment' },
  { label: 'Taux de qualif',           value: '42 %', delta: '+4 pts', trend: 'up', compare: 'vs 38 % précédemment' },
  { label: 'Taux RDV',                 value: '29 %', delta: '+3 pts', trend: 'up', compare: 'vs 26 % précédemment' },
  { label: 'Taux mandat',              value: '21 %', delta: '+2 pts', trend: 'up', compare: 'vs 19 % précédemment' },
  { label: 'Taux transfo',             value: '16 %', delta: '+2 pts', trend: 'up', compare: 'vs 14 % précédemment' },
  { label: 'Délai lead → mandat',      value: '18 j', delta: '-2 j',   trend: 'up', compare: 'vs 16 j précédemment' },
  { label: 'Délai mandat → signature', value: '46 j', delta: '-4 j',   trend: 'up', compare: 'vs 42 j précédemment' },
];

export const PIPELINE_STATS: PipelineStageStat[] = [
  { stage: 'atraiter',    label: 'À traiter',   volume: 128, taux: 100, delta: null,  deltaLabel: null,  color: '#94a3b8', textColor: 'text-slate-700',  bgColor: 'bg-slate-100' },
  { stage: 'qualifie',    label: 'Qualifié',    volume: 54,  taux: 42,  delta: -4,    deltaLabel: 'pts', color: '#60a5fa', textColor: 'text-blue-700',   bgColor: 'bg-blue-100' },
  { stage: 'estimation',  label: 'Estimation',  volume: 37,  taux: 29,  delta: 3,     deltaLabel: 'pts', color: '#2dd4bf', textColor: 'text-teal-700',   bgColor: 'bg-teal-100' },
  { stage: 'mandat',      label: 'Mandat',      volume: 27,  taux: 21,  delta: 2,     deltaLabel: 'pts', color: '#a78bfa', textColor: 'text-propsight-700', bgColor: 'bg-propsight-100' },
  { stage: 'negociation', label: 'Négociation', volume: 21,  taux: 16,  delta: 2,     deltaLabel: 'pts', color: '#fbbf24', textColor: 'text-amber-700',  bgColor: 'bg-amber-100' },
  { stage: 'signe',       label: 'Signé',       volume: 17,  taux: 13,  delta: 2,     deltaLabel: 'pts', color: '#22c55e', textColor: 'text-green-700',  bgColor: 'bg-green-100' },
];

export const ACTIVITE_TYPES: ActiviteTypeMeta[] = [
  { id: 'appel',   label: 'Appels',   color: '#fb7185' },
  { id: 'email',   label: 'Emails',   color: '#60a5fa' },
  { id: 'rdv',     label: 'RDV',      color: '#a78bfa' },
  { id: 'visite',  label: 'Visites',  color: '#2dd4bf' },
  { id: 'relance', label: 'Relances', color: '#fbbf24' },
];

export const ACTIVITE_DAYS: ActiviteDay[] = [
  { date: '19 mai', appel: 8,  email: 12, rdv: 3, visite: 2, relance: 4 },
  { date: '20 mai', appel: 6,  email: 10, rdv: 2, visite: 1, relance: 3 },
  { date: '21 mai', appel: 10, email: 14, rdv: 4, visite: 3, relance: 5 },
  { date: '22 mai', appel: 9,  email: 11, rdv: 3, visite: 2, relance: 4 },
  { date: '23 mai', appel: 11, email: 13, rdv: 5, visite: 3, relance: 6 },
  { date: '24 mai', appel: 7,  email: 9,  rdv: 2, visite: 1, relance: 3 },
  { date: '25 mai', appel: 8,  email: 10, rdv: 3, visite: 2, relance: 4 },
];

export const SOURCES: SourceRow[] = [
  { source: 'Portails',         leads: 54, tauxConv: 24, caGenere: 426800, delaiMoyen: 21, href: '/app/activite/leads?source=portails' },
  { source: 'Réseau / Apporteur', leads: 18, tauxConv: 33, caGenere: 297600, delaiMoyen: 16, href: '/app/activite/leads?source=reseau' },
  { source: 'Site internet',    leads: 15, tauxConv: 20, caGenere: 168300, delaiMoyen: 18, href: '/app/activite/leads?source=site' },
  { source: 'Réseaux sociaux',  leads: 12, tauxConv: 17, caGenere: 132400, delaiMoyen: 20, href: '/app/activite/leads?source=social' },
  { source: 'Ancien client',    leads: 9,  tauxConv: 44, caGenere: 238900, delaiMoyen: 14, href: '/app/activite/leads?source=ancien' },
  { source: 'Autres',           leads: 20, tauxConv: 15, caGenere: 120600, delaiMoyen: 23, href: '/app/activite/leads?source=autres' },
];

export const KPI_BUSINESS: KpiData[] = [
  { label: 'CA réalisé',                value: '368 450 €', delta: '+18%',   trend: 'up', compare: 'vs 312 350 €' },
  { label: 'CA pipe pondéré',           value: '286 450 €', delta: '+18%',   trend: 'up', compare: 'vs 242 800 €' },
  { label: 'Mandats signés',            value: '17',        delta: '+3',     trend: 'up', compare: 'vs 14' },
  { label: 'Panier moyen',              value: '24 585 €',  delta: '+7%',    trend: 'up', compare: 'vs 22 980 €' },
  { label: 'Délai moyen transaction',   value: '64 j',      delta: '-4 j',   trend: 'up', compare: 'vs 68 j' },
  { label: 'Taux fidélisation / rachat', value: '32 %',     delta: '+6 pts', trend: 'up', compare: 'vs 26 %' },
];

export const OBJECTIF_MENSUEL = 300000;

export const CA_MONTHS: CaMonth[] = [
  { label: 'Jan', ca: 215000 },
  { label: 'Fév', ca: 248000 },
  { label: 'Mar', ca: 322000 },
  { label: 'Avr', ca: 298000 },
  { label: 'Mai', ca: 368450, current: true },
  { label: 'Jun', ca: 0 },
  { label: 'Jul', ca: 0 },
  { label: 'Aoû', ca: 0 },
  { label: 'Sep', ca: 0 },
  { label: 'Oct', ca: 0 },
  { label: 'Nov', ca: 0 },
  { label: 'Déc', ca: 0 },
];

export const DONUT_TYPE_MANDAT: DonutSlice[] = [
  { label: 'Exclusif',  value: 228439, percent: 62, color: '#7c3aed' },
  { label: 'Simple',    value: 92113,  percent: 25, color: '#a78bfa' },
  { label: 'Co-mandat', value: 47898,  percent: 13, color: '#ddd6fe' },
];

export const DONUT_NATURE: DonutSlice[] = [
  { label: 'Vente',   value: 250546, percent: 68, color: '#0d9488' },
  { label: 'Achat',   value: 73690,  percent: 20, color: '#3b82f6' },
  { label: 'Locatif', value: 44214,  percent: 12, color: '#f59e0b' },
];

export const TOP_DOSSIERS: DossierRow[] = [
  { dossier: 'Lucas Thomas',   type: 'Vente', probabilite: 90, caPondere: 86500, echeance: '31 mai' },
  { dossier: 'Camille Girard', type: 'Vente', probabilite: 80, caPondere: 64200, echeance: '12 juin' },
  { dossier: 'Jean Moreau',    type: 'Vente', probabilite: 75, caPondere: 53800, echeance: '18 juin' },
  { dossier: 'Aline Perrin',   type: 'Achat', probabilite: 70, caPondere: 41600, echeance: '25 juin' },
  { dossier: 'Florian Brun',   type: 'Vente', probabilite: 65, caPondere: 40900, echeance: '2 juil.' },
];

export const ZONES: MarcheZone[] = [
  { id: 'paris15-vaugirard', label: 'Paris 15e',  sousLabel: 'Vaugirard / Necker',  transactions: 980 },
  { id: 'paris16',           label: 'Paris 16e',  sousLabel: 'Auteuil',             transactions: 720 },
  { id: 'lyon3',             label: 'Lyon 3e',    sousLabel: 'Part-Dieu',           transactions: 540 },
  { id: 'bordeaux-centre',   label: 'Bordeaux',   sousLabel: 'Centre',              transactions: 420 },
];

export const INDICATEURS_MARCHE: IndicateursMarcheData = {
  volumeDvf:  { value: 980,    delta: '+6%', compare: '922' },
  prixMedian: { value: '8 210', unite: '€/m²', delta: '+3%', compare: '7 980 €/m²' },
  tension:    { value: 'Élevée', delta: 'vs modérée', level: 'high' },
};

export const HYPOTHESES_DEFAUT: Hypotheses = {
  commissionMoyenne: 2.6,
  partCaptableCible: 2.5,
  objectifMandatsAnnuel: 28,
  panierMoyen: 420000,
};

export const PART_CAPTEE_ACTUELLE = 0.87;
