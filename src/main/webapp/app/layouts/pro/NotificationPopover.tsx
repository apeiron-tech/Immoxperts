import React, { useState, useRef, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { proRoutes } from 'app/config/proRoutes';

const MOCK_NOTIFICATIONS = [
  { id: '1', title: 'Nouveau lead qualifié', meta: 'il y a 12 min', href: proRoutes.activite.leads },
  { id: '2', title: 'Rapport ouvert par un client', meta: 'il y a 1h', href: proRoutes.activite.pilotage },
  { id: '3', title: 'Signal DVF détecté sur Paris 15e', meta: 'il y a 2h', href: proRoutes.prospection.signauxDvf },
  { id: '4', title: 'Baisse de prix sur bien suivi', meta: 'hier', href: proRoutes.veille.biensSuivis },
];

const NotificationPopover: React.FC = () => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const unread = MOCK_NOTIFICATIONS.length;

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="relative w-9 h-9 rounded-md border border-neutral-200 hover:bg-neutral-50 flex items-center justify-center transition-colors"
      >
        <Bell size={15} className="text-neutral-600" />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-red-500 text-white text-[10px] font-semibold flex items-center justify-center">
            {unread}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 w-80 bg-white border border-neutral-200 rounded-md shadow-md z-50">
          <div className="px-3 py-2 border-b border-neutral-200 text-xs font-semibold text-neutral-700">
            Notifications récentes
          </div>
          <div className="max-h-80 overflow-auto">
            {MOCK_NOTIFICATIONS.slice(0, 5).map(n => (
              <Link
                key={n.id}
                to={n.href}
                onClick={() => setOpen(false)}
                className="block px-3 py-2 hover:bg-neutral-50 border-b border-neutral-100 last:border-b-0"
              >
                <div className="text-sm text-neutral-900">{n.title}</div>
                <div className="text-[11px] text-neutral-500 mt-0.5">{n.meta}</div>
              </Link>
            ))}
          </div>
          <Link
            to={proRoutes.veille.notifications}
            onClick={() => setOpen(false)}
            className="block px-3 py-2 text-center text-xs font-medium text-propsight-600 hover:bg-propsight-50 border-t border-neutral-200"
          >
            Voir toutes les notifications
          </Link>
        </div>
      )}
    </div>
  );
};

export default NotificationPopover;
