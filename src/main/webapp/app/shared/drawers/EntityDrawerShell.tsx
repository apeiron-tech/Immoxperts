import React from 'react';
import { X } from 'lucide-react';
import { useEntityDrawer } from './useEntityDrawer';

const LABELS: Record<string, string> = {
  lead: 'Lead',
  bien: 'Bien',
  action: 'Action',
  estimation: 'Estimation',
  rapport: 'Rapport',
  signal: 'Signal',
  opportunite: 'Opportunité',
  dossier: 'Dossier',
  alerte: 'Alerte',
  notification: 'Notification',
  zone: 'Zone',
  collaborateur: 'Collaborateur',
  rdv: 'Rendez-vous',
};

const EntityDrawerShell: React.FC = () => {
  const { openType, openId, close } = useEntityDrawer();

  if (!openType || !openId) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-neutral-900/30" onClick={close} />
      <aside className="fixed right-0 top-0 bottom-0 z-50 w-[480px] max-w-[100vw] bg-white border-l border-neutral-200 shadow-md flex flex-col">
        <div className="h-13 min-h-[52px] border-b border-neutral-200 px-4 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wide">{LABELS[openType] ?? openType}</div>
            <div className="text-sm font-medium text-neutral-900">{openId}</div>
          </div>
          <button type="button" onClick={close} className="w-8 h-8 rounded-md hover:bg-neutral-100 flex items-center justify-center">
            <X size={16} />
          </button>
        </div>
        <div className="flex-1 overflow-auto p-4 space-y-3">
          <div className="text-sm text-neutral-500">
            Détails de l'entité à venir — drawer contextuel standardisé.
          </div>
        </div>
      </aside>
    </>
  );
};

export default EntityDrawerShell;
