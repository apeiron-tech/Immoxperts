import React from 'react';
import { MapPin, MoreHorizontal } from 'lucide-react';
import { MetaSignalRadar } from '../types';
import { BadgeScore, BadgeSource, BadgeStatut } from '../components/shared/Badges';
import { formatRelativeTime } from '../utils/formatters';

interface Props {
  signal: MetaSignalRadar;
  selected?: boolean;
  onClick: () => void;
}

const CardSignalListe: React.FC<Props> = ({ signal, selected, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-3 rounded-lg border transition-all ${
        selected
          ? 'border-propsight-400 bg-propsight-50/50 ring-1 ring-propsight-200'
          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-1 flex-wrap">
          {signal.sources.map(src => (
            <BadgeSource key={src} source={src} size="xs" showLabel={false} />
          ))}
          {signal.sources.length > 1 && (
            <span className="text-[10px] text-slate-500 font-medium ml-0.5">MÉTA</span>
          )}
        </div>
        <BadgeScore score={signal.score_agrege} size="sm" />
      </div>
      <div className="text-[12px] font-medium text-slate-900 mb-1 truncate">
        {signal.adresse || signal.ville}
      </div>
      <div className="text-[10px] text-slate-500 flex items-center gap-1 mb-1.5">
        <MapPin size={10} />
        {signal.code_postal} {signal.ville}
      </div>
      <ul className="space-y-0.5 mb-2">
        {signal.reasons_short.slice(0, 2).map((r, i) => (
          <li key={i} className="text-[11px] text-slate-600 truncate">
            · {r}
          </li>
        ))}
      </ul>
      <div className="flex items-center justify-between">
        <BadgeStatut status={signal.status_agrege} />
        <span className="text-[10px] text-slate-400">{formatRelativeTime(signal.updated_at)}</span>
      </div>
    </button>
  );
};

export default CardSignalListe;
