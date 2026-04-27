import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MOCK_ESTIMATIONS } from '../../_mocks/estimations';
import { StatusBadge } from '../../components/shared/StatusBadge';

interface Props {
  currentId: string;
  onSelect: (id: string) => void;
}

const HistoriqueRecent: React.FC<Props> = ({ currentId, onSelect }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const recent = MOCK_ESTIMATIONS.slice(0, 8);

  const scroll = (dir: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === 'left' ? -200 : 200, behavior: 'smooth' });
    }
  };

  return (
    <div className="border-t border-slate-200 bg-white px-5 py-3">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Historique récent</p>
        <div className="flex gap-1">
          <button onClick={() => scroll('left')} className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-700 border border-slate-200 rounded transition-colors">
            <ChevronLeft size={12} />
          </button>
          <button onClick={() => scroll('right')} className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-700 border border-slate-200 rounded transition-colors">
            <ChevronRight size={12} />
          </button>
        </div>
      </div>
      <div ref={scrollRef} className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
        {recent.map(est => {
          const isCurrent = est.id === currentId;
          return (
            <button
              key={est.id}
              onClick={() => onSelect(est.id)}
              className={`flex-shrink-0 w-40 border rounded-md overflow-hidden text-left transition-all hover:shadow-sm ${
                isCurrent ? 'border-propsight-400 ring-1 ring-propsight-300' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {est.photo_url ? (
                <img src={est.photo_url} alt="" className="w-full h-16 object-cover" />
              ) : (
                <div className="w-full h-16 bg-slate-100 flex items-center justify-center">
                  <span className="text-slate-300 text-xs">Pas de photo</span>
                </div>
              )}
              <div className="p-2">
                <p className="text-xs font-medium text-slate-800 truncate">{est.bien.adresse}</p>
                <p className="text-xs text-slate-400 truncate">{est.bien.ville}</p>
                <div className="mt-1">
                  <StatusBadge statut={est.statut} />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default HistoriqueRecent;
