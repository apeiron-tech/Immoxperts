import type { ActivityEntry } from '../types';

export const RECENT_ACTIVITY: ActivityEntry[] = [
  { id: 'a1', type: 'lead_created', widget: 'estimation_vendeur', user: 'Camille Durand', date: '2026-04-23T09:41:00' },
  { id: 'a2', type: 'code_copied', widget: 'projet_investisseur', user: 'Thomas Lemoine', date: '2026-04-22T16:32:00' },
  { id: 'a3', type: 'widget_updated', widget: 'estimation_vendeur', user: 'Camille Durand', date: '2026-04-22T11:07:00' },
  { id: 'a4', type: 'lead_created', widget: 'projet_investisseur', user: 'Maxime Robert', date: '2026-04-11T14:22:00' },
  { id: 'a5', type: 'code_copied', widget: 'estimation_vendeur', user: 'Maxime Robert', date: '2026-04-10T10:18:00' },
];

// Exemple : dernières automatisations exécutées (onglet Automatisations)
export const AUTOMATION_TIMELINE: ActivityEntry[] = [
  { id: 't1', type: 'lead_created', widget: 'estimation_vendeur', user: 'Sophie Martin', date: '2026-04-23T10:28:00', label: 'Lead créé' },
  { id: 't2', type: 'whatsapp_prepared', widget: 'estimation_vendeur', user: 'Sophie Martin', date: '2026-04-23T10:29:00', label: 'WhatsApp préparé' },
  { id: 't3', type: 'email_sent', widget: 'estimation_vendeur', user: 'Sophie Martin', date: '2026-04-23T10:30:00', label: 'Email envoyé (avis PDF)' },
  { id: 't4', type: 'rdv_proposed', widget: 'estimation_vendeur', user: 'Sophie Martin', date: '2026-04-23T10:32:00', label: 'RDV proposé (lien WhatsApp)' },
];
