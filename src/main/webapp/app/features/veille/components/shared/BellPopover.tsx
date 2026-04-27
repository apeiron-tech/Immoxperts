import React, { useEffect, useRef, useState } from 'react';
import { Bell } from 'lucide-react';
import { NotifPriorityBadge } from './primitives';
import { NOTIFICATIONS } from '../../_mocks/notifications';
import { freshnessLabel } from '../../utils/freshness';

interface Props {
  onNavigate: (p: string) => void;
}

const BellPopover: React.FC<Props> = ({ onNavigate }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const unread = NOTIFICATIONS.filter(n => n.status === 'unread');
  const top5 = unread.slice(0, 5);

  useEffect(() => {
    const cb = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener('mousedown', cb);
    return () => document.removeEventListener('mousedown', cb);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className="relative h-6 w-6 inline-flex items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-700"
        aria-label="Notifications"
      >
        <Bell size={12} />
        {unread.length > 0 && (
          <span className="absolute -top-0.5 -right-0.5 inline-flex items-center justify-center h-3.5 min-w-3.5 px-0.5 rounded-full bg-rose-500 text-white text-[8px] font-bold">
            {unread.length}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 w-[340px] bg-white rounded-md border border-slate-200 shadow-xl z-[80]">
          <div className="px-3 py-2 border-b border-slate-200 flex items-center justify-between">
            <span className="text-[12px] font-semibold text-slate-900">
              Notifications <span className="text-slate-400 font-normal">· {unread.length} non lues</span>
            </span>
          </div>
          <div className="max-h-[340px] overflow-y-auto">
            {top5.length === 0 ? (
              <div className="px-3 py-6 text-center text-[11.5px] text-slate-500">Aucune notification non lue.</div>
            ) : (
              top5.map(n => (
                <button
                  key={n.id}
                  onClick={() => {
                    onNavigate(`/app/veille/notifications?notification=${n.id}`);
                    setOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 border-b border-slate-100 last:border-0 hover:bg-slate-50"
                >
                  <div className="flex items-start gap-2">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-propsight-500 mt-1.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <NotifPriorityBadge priority={n.priority} />
                        <span className="text-[11px] font-medium text-slate-900 truncate">{n.title}</span>
                      </div>
                      <p className="text-[10.5px] text-slate-500 mt-0.5 line-clamp-1">{n.message}</p>
                      <span className="text-[10px] text-slate-400">{freshnessLabel(n.event_at)}</span>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
          <div className="px-3 py-2 border-t border-slate-200">
            <button
              onClick={() => {
                onNavigate('/app/veille/notifications');
                setOpen(false);
              }}
              className="w-full text-[11.5px] font-medium text-propsight-700 hover:text-propsight-900"
            >
              Voir toutes les notifications →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BellPopover;
