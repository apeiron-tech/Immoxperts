import React, { useState } from 'react';
import { SignalProspection, MetaSignalRadar } from '../../types';
import { getSignalEvents } from '../../_mocks/events';
import { formatRelativeTime, formatDate } from '../../utils/formatters';

interface Props {
  signal: SignalProspection | MetaSignalRadar;
}

type Filter = 'tous' | 'systeme' | 'utilisateur';

const OngletHistorique: React.FC<Props> = ({ signal }) => {
  const [filter, setFilter] = useState<Filter>('tous');
  const id = 'signal_id' in signal ? signal.signal_id : signal.meta_id;
  const createdAt = 'signal_id' in signal ? signal.created_at : signal.created_at;
  const events = getSignalEvents(id, createdAt);
  const filtered = events.filter(e => {
    if (filter === 'systeme') return !e.actor_id;
    if (filter === 'utilisateur') return !!e.actor_id;
    return true;
  });

  return (
    <div className="space-y-3">
      <div className="inline-flex items-center bg-slate-100 p-0.5 rounded-md text-[11px]">
        {(['tous', 'systeme', 'utilisateur'] as Filter[]).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-2.5 py-1 rounded ${
              filter === f ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
            }`}
          >
            {f === 'tous' ? 'Tous' : f === 'systeme' ? 'Système' : 'Utilisateurs'}
          </button>
        ))}
      </div>

      <div className="relative pl-4">
        <div className="absolute left-[5px] top-2 bottom-2 w-px bg-slate-200" />
        <ul className="space-y-3">
          {filtered.map((e, i) => (
            <li key={e.event_id} className="relative">
              <div
                className={`absolute -left-[14px] top-1 h-2.5 w-2.5 rounded-full ring-2 ring-white ${
                  i === 0 ? 'bg-propsight-600' : 'bg-slate-300'
                }`}
              />
              <div className="text-[12px] text-slate-900 font-medium">{e.label}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                {formatDate(e.timestamp)} · {formatRelativeTime(e.timestamp)}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default OngletHistorique;
