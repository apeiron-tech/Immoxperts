import type { WidgetLead, WebhookHistoryEntry } from '../types';

export const MOCK_WIDGET_LEAD: WidgetLead = {
  id: 'lead_sophie_martin',
  firstName: 'Sophie',
  lastName: 'Martin',
  email: 'sophie.martin@example.com',
  phone: '+33 6 12 34 56 78',
  source: 'estimation_vendeur',
  createdAt: '2026-04-23T10:28:00',
  property: {
    address: '22 rue de la Pompe, 75116 Paris',
    type: 'Maison',
    surface: 120,
    rooms: 4,
  },
  insights: {
    medianPricePerSqm: 8650,
    trend6m: 2.3,
    daysOnMarket: 43,
    comparablesCount: 12,
    mainStrength: 'Très bonne exposition, proche des commodités',
    mainWarning: 'DPE à vérifier — normes énergétiques à anticiper',
    nextBestAction: 'Proposer un RDV de conseil',
  },
};

export const MOCK_WEBHOOK_HISTORY: WebhookHistoryEntry[] = [
  { event: 'lead.created', status: 200, timestamp: '2026-04-23T10:28:12' },
  { event: 'widget.completed', status: 200, timestamp: '2026-04-23T10:28:07' },
  { event: 'widget.started', status: 200, timestamp: '2026-04-23T10:24:18' },
  { event: 'widget.viewed', status: 200, timestamp: '2026-04-23T10:24:05' },
  { event: 'lead.created', status: 200, timestamp: '2026-04-22T16:11:44' },
  { event: 'lead.created', status: 502, timestamp: '2026-04-22T09:02:31' },
  { event: 'widget.completed', status: 200, timestamp: '2026-04-22T09:02:17' },
  { event: 'lead.created', status: 200, timestamp: '2026-04-21T18:47:20' },
  { event: 'widget.started', status: 200, timestamp: '2026-04-21T14:03:59' },
  { event: 'widget.viewed', status: 200, timestamp: '2026-04-21T14:03:41' },
];

export const OBJECTIONS = [
  "Le prix n'est-il pas un peu élevé ?",
  'Quels travaux prévoir ?',
  'Combien de temps pour vendre ?',
];
