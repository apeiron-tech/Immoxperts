import {
  ActionGroupBlock,
  AgendaItem,
  DossierTypeBlock,
  Entrant,
  KpiTile,
  LeadChaud,
  MandatItem,
  PipeStage,
  SignalItem,
} from '../types';

export const MOCK_KPI: KpiTile[] = [
  { label: 'Leads actifs',     value: '128',       delta: '+12',  deltaLabel: 'vs sem. précédente', trend: 'up',   icon: 'users',        href: '/app/activite/leads' },
  { label: 'Actions du jour',  value: '18',        delta: '+4',   deltaLabel: 'vs hier',             trend: 'up',   icon: 'check-circle' },
  { label: 'RDV semaine',      value: '9',         delta: '-1',   deltaLabel: 'vs sem. précédente', trend: 'down', icon: 'calendar' },
  { label: 'Mandats en cours', value: '17',        delta: '+3',   deltaLabel: 'vs sem. précédente', trend: 'up',   icon: 'file-text',    href: '/app/activite/leads?stage=mandat' },
  { label: 'CA pipe pondéré',  value: '286 450 €', delta: '+18%', deltaLabel: 'vs sem. précédente', trend: 'up',   icon: 'euro',         href: '/app/activite/performance' },
];

export const MOCK_ACTIONS: ActionGroupBlock[] = [
  {
    group: 'En retard',
    items: [
      { id: 'a1', type: 'appel', label: 'Relancer Mme Martin',  target: '45 cours de la Liberté, Lyon 3e',     lead_id: 'L-004',          retard: '2j', priority: 'haute',    cta: 'Appeler' },
      { id: 'a2', type: 'email', label: 'Envoyer estimation',   target: '12 rue Péclet, Paris 15e',            lead_id: 'L-008',          retard: '1j', priority: 'moyenne',  cta: 'Envoyer' },
      { id: 'a3', type: 'rdv',   label: 'RDV suivi',            target: 'M. Durand – 8 avenue Suffren',         lead_id: 'L-011',          retard: '1j', priority: 'haute',    cta: 'Ouvrir RDV' },
      { id: 'a4', type: 'appel', label: 'Relancer M. Bernard',  target: 'Appartement – 75015 Paris',            lead_id: 'L-019',          retard: '3j', priority: 'moyenne',  cta: 'Appeler' },
      { id: 'a5', type: 'file',  label: 'Compléter dossier',    target: 'Mme Dupuis – AVR',                     dossier_id: 'AVR-2025-012', retard: '5j', priority: 'moyenne',  cta: 'Ouvrir' },
    ],
  },
  {
    group: "Aujourd'hui",
    items: [
      { id: 'b1', type: 'rdv',      label: 'RDV estimation',        target: 'M. Collin – 22 rue du Commerce',            lead_id: 'L-023',           heure: '10:00', priority: 'moyenne', cta: 'Voir RDV' },
      { id: 'b2', type: 'location', label: 'Visite bien',           target: 'Appartement – 33 rue Lecourbe',             lead_id: 'L-027',           heure: '14:30', priority: 'moyenne', cta: 'Voir visite' },
      { id: 'b3', type: 'relance',  label: 'Relance annonce',       target: 'Signal DVF – 16 rue Blomet',                signal_id: 'SIG-042',       heure: '16:00', priority: 'basse',   cta: 'Relancer' },
      { id: 'b4', type: 'email',    label: 'Envoyer étude locative',target: '18 avenue Jean Jaurès, Bordeaux',           lead_id: 'L-031',           heure: '17:30', priority: 'moyenne', cta: 'Envoyer' },
      { id: 'b5', type: 'appel',    label: 'Appel découverte',      target: 'M. Moreau – Lead web',                       lead_id: 'L-035',           heure: '18:00', priority: 'moyenne', cta: 'Appeler' },
      { id: 'b6', type: 'email',    label: 'Relance mail',          target: 'Mme Petit – Investissement',                 lead_id: 'L-038',           heure: '18:30', priority: 'basse',   cta: 'Relancer' },
    ],
  },
  {
    group: 'Cette semaine',
    items: [
      { id: 'c1', type: 'rdv',     label: 'Préparer RDV vendeur', target: 'M. Leroy – Appartement Paris 7e', lead_id: 'L-042',           date: '21 mai', priority: 'moyenne', cta: 'Préparer' },
      { id: 'c2', type: 'file',    label: 'Suivi dossier',        target: 'Mme Roche – Étude locative',       dossier_id: 'EL-2025-008', date: '22 mai', priority: 'basse',   cta: 'Ouvrir' },
      { id: 'c3', type: 'relance', label: 'Relance devis',        target: 'M. Nicolas – Estimation',          lead_id: 'L-045',           date: '23 mai', priority: 'moyenne', cta: 'Relancer' },
    ],
  },
];

export const MOCK_AGENDA: AgendaItem[] = [
  { id: 'ag1', heure: '10:00', titre: 'RDV estimation',   sousInfo: 'M. Collin – 22 rue du Commerce', statut: 'Confirmé', lead_id: 'L-023' },
  { id: 'ag2', heure: '11:30', titre: 'Appel découverte', sousInfo: 'Mme Martin – Lead web',           statut: 'À faire',  lead_id: 'L-004' },
  { id: 'ag3', heure: '14:30', titre: 'Visite bien',      sousInfo: 'Appartement – 33 rue Lecourbe',   statut: 'Confirmé', lead_id: 'L-027' },
  { id: 'ag4', heure: '16:00', titre: 'RDV suivi',        sousInfo: 'M. Durand – 8 avenue Suffren',    statut: 'À faire',  lead_id: 'L-011' },
  { id: 'ag5', heure: '17:30', titre: 'Point équipe',     sousInfo: 'Réunion interne',                  statut: 'Interne' },
];

export const MOCK_LEADS_CHAUDS: LeadChaud[] = [
  { lead_id: 'L-011', initiales: 'MD', nom: 'M. Durand',       sousInfo: '8 avenue Suffren',     estimation: '1 025 000 €', nextAction: 'RDV suivi',          nextDate: "Aujourd'hui",     priority: 'haute' },
  { lead_id: 'L-004', initiales: 'MM', nom: 'Mme Martin',      sousInfo: '45 cours Liberté',      estimation: '620 000 €',   nextAction: 'Relance appel',      nextDate: 'En retard (2 j)', retard: true, priority: 'haute' },
  { lead_id: 'L-023', initiales: 'MC', nom: 'M. Collin',       sousInfo: '22 rue du Commerce',    estimation: '1 150 000 €', nextAction: 'RDV estimation',     nextDate: "Aujourd'hui",     priority: 'haute' },
  { lead_id: 'L-035', initiales: 'AL', nom: 'Audrey Leroy',    sousInfo: 'Lead web',              estimation: '—',           nextAction: 'Appel découverte',   nextDate: "Aujourd'hui",     priority: 'moyenne' },
  { lead_id: 'L-047', initiales: 'NB', nom: 'Nicolas Bernard', sousInfo: '16 rue Blomet',         estimation: '890 000 €',   nextAction: 'Envoyer étude',      nextDate: 'Demain',          priority: 'moyenne' },
];

export const MOCK_ENTRANTS: Entrant[] = [
  { lead_id: 'L-050', initiales: 'LT', nom: 'Lucas Thomas',   sousInfo: 'Appartement – Paris 15e',   time: 'Il y a 1 h' },
  { lead_id: 'L-051', initiales: 'CG', nom: 'Camille Girard', sousInfo: 'Maison – Boulogne (92)',    time: 'Il y a 2 h' },
  { lead_id: 'L-052', initiales: 'JM', nom: 'Jean Moreau',    sousInfo: 'Investissement – Lyon 3e',  time: 'Il y a 4 h' },
  { lead_id: 'L-053', initiales: 'AP', nom: 'Aline Perrin',   sousInfo: 'Appartement – Bordeaux',    time: 'Il y a 6 h' },
  { lead_id: 'L-054', initiales: 'FB', nom: 'Florian Brun',   sousInfo: 'Appartement – Nantes',      time: 'Il y a 8 h' },
];

export const MOCK_SIGNAUX: SignalItem[] = [
  { type: 'DVF', titre: 'Vente proche – 12 rue Péclet',     loc: 'Paris 15e – Appartement', time: 'Il y a 2 h', signal_id: 'SIG-101' },
  { type: 'DPE', titre: 'DPE F → G – 18 rue Blomet',         loc: 'Paris 15e – Appartement', time: 'Il y a 3 h', signal_id: 'SIG-102' },
  { type: 'ANN', titre: 'Annonce publiée – 22 rue Lecourbe', loc: 'Paris 15e – Appartement', time: 'Il y a 5 h', signal_id: 'SIG-103' },
];

export const MOCK_PIPE: PipeStage[] = [
  { id: 'atraiter',    label: 'À traiter',    color: '#cbd5e1', valeur: 38650 },
  { id: 'qualifie',    label: 'Qualifié',     color: '#60a5fa', valeur: 71200 },
  { id: 'estimation',  label: 'Estimation',   color: '#2dd4bf', valeur: 54300 },
  { id: 'mandat',      label: 'Mandat',       color: '#a78bfa', valeur: 68900 },
  { id: 'negociation', label: 'Négociation',  color: '#fbbf24', valeur: 33400 },
  { id: 'signe',       label: 'Signé',        color: '#22c55e', valeur: 19000 },
];

export const PIPE_TOTAL = MOCK_PIPE.reduce((sum, s) => sum + s.valeur, 0);

export const MOCK_DOSSIERS: DossierTypeBlock[] = [
  { type: 'avis',   label: 'Avis de valeur',    count: 12, ligne1: '6 en brouillon', ligne2: '6 envoyés',  href: '/app/estimation/avis-valeur' },
  { type: 'etude',  label: 'Études locatives',  count: 8,  ligne1: '4 en brouillon', ligne2: '4 en attente', href: '/app/estimation/etude-locative' },
  { type: 'invest', label: 'Investissement',    count: 5,  ligne1: '3 en brouillon', ligne2: '2 envoyés',  href: '/app/investissement/dossiers' },
];

export const MOCK_MANDATS: MandatItem[] = [
  { type: 'Mandat exclusif', adresse: '45 cours de la Liberté, Lyon 3e', expireLe: '31 mai 2025',  jours: 12, mandat_id: 'M-2025-017' },
  { type: 'Mandat simple',   adresse: '8 avenue Suffren, Paris 15e',     expireLe: '15 juin 2025', jours: 27, mandat_id: 'M-2025-014' },
  { type: 'Mandat simple',   adresse: '22 rue du Commerce, Paris 15e',   expireLe: '30 juin 2025', jours: 42, mandat_id: 'M-2025-011' },
];
