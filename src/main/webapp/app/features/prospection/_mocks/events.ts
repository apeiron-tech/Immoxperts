import { SignalEvent } from '../types';

// Génère une timeline fictive plausible par signal
export const getSignalEvents = (signalId: string, createdAt: string): SignalEvent[] => {
  const created = new Date(createdAt);
  const events: SignalEvent[] = [
    {
      event_id: `evt_${signalId}_1`,
      signal_id: signalId,
      type: 'signal_detecte',
      timestamp: createdAt,
      label: 'Détecté',
    },
  ];
  const plus = (min: number) => new Date(created.getTime() + min * 60 * 1000).toISOString();

  events.push({
    event_id: `evt_${signalId}_2`,
    signal_id: signalId,
    type: 'signal_vu',
    timestamp: plus(34),
    actor_id: 'user_paul',
    actor_name: 'Paul Martin',
    label: 'Vu par Paul Martin',
  });
  events.push({
    event_id: `evt_${signalId}_3`,
    signal_id: signalId,
    type: 'signal_assigne',
    timestamp: plus(39),
    actor_id: 'user_clara',
    actor_name: 'Clara Dubois',
    label: 'Assigné à Clara Dubois',
  });
  return events;
};
