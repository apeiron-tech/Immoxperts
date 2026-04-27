import React from 'react';
import {
  Bookmark,
  CalendarDays,
  ChevronRight,
  ClipboardList,
  Mail,
  Megaphone,
  Lock,
} from 'lucide-react';
import { useAtelierStore } from '../../store/atelierStore';

interface ActionItem {
  icon: React.ReactNode;
  label: string;
  sub: string;
  enabled: boolean;
  reason?: string;
}

const ActionsTransversesList: React.FC = () => {
  const modules = useAtelierStore(s => s.modules);
  const status = useAtelierStore(s => s.status);
  const ready = status === 'ready';

  const actions: ActionItem[] = [
    {
      icon: <CalendarDays size={13} />,
      label: 'Programmer la diffusion',
      sub: 'Multi-canal calendaire',
      enabled: ready,
    },
    {
      icon: <Bookmark size={13} />,
      label: 'Sauver dans Bibliothèque',
      sub: 'Réutilisable plus tard',
      enabled: ready,
    },
    {
      icon: <Megaphone size={13} />,
      label: 'Lancer une campagne pub',
      sub: 'Meta Ads / Google Ads',
      enabled: ready,
    },
    {
      icon: <ClipboardList size={13} />,
      label: 'Ajouter au Plan marketing AdV',
      sub: "Dans l'avis de valeur en cours",
      enabled: ready && modules.estimation === 'active',
      reason: modules.estimation === 'active' ? undefined : 'Module Estimation requis',
    },
    {
      icon: <Mail size={13} />,
      label: 'Envoyer à la base leads',
      sub: 'Email aux leads matchant',
      enabled: ready && modules.leads === 'active',
      reason: modules.leads === 'active' ? undefined : 'Module Leads requis',
    },
  ];

  return (
    <div className="space-y-1">
      {actions.map(a => (
        <button
          key={a.label}
          disabled={!a.enabled}
          title={a.reason}
          className={`w-full flex items-center gap-2 px-2 py-2 rounded-md text-left transition-colors ${
            a.enabled
              ? 'hover:bg-neutral-100 text-neutral-800'
              : 'opacity-55 cursor-not-allowed text-neutral-500'
          }`}
        >
          <span
            className={`w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 ${
              a.enabled ? 'bg-propsight-50 text-propsight-700' : 'bg-neutral-100 text-neutral-400'
            }`}
          >
            {a.enabled ? a.icon : <Lock size={11} />}
          </span>
          <div className="flex-1 min-w-0">
            <div className="text-[12px] font-medium leading-tight">{a.label}</div>
            <div className="text-[10.5px] text-neutral-500 truncate">
              {a.reason ?? a.sub}
            </div>
          </div>
          {a.enabled && <ChevronRight size={12} className="text-neutral-300 flex-shrink-0" />}
        </button>
      ))}
    </div>
  );
};

export default ActionsTransversesList;
