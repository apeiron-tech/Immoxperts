import React from 'react';
import { AlertTriangle, X, VolumeX, Volume2, Bug } from 'lucide-react';
import DrawerShell, { DrawerCloseButton } from '../components/drawer/DrawerShell';
import { SecondaryButton } from '../components/shared/primitives';
import { Alerte } from '../types';

interface Props {
  alertes: Alerte[];
  onClose: () => void;
  onOpenAlerte: (id: string) => void;
}

const SanteAlertesDrawer: React.FC<Props> = ({ alertes, onClose, onOpenAlerte }) => {
  const silent = alertes.filter(a => a.health_status === 'silent');
  const noisy = alertes.filter(a => a.health_status === 'noisy');
  const error = alertes.filter(a => a.health_status === 'error');

  return (
    <DrawerShell onClose={onClose} width={420}>
      <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
        <div>
          <h3 className="text-[14px] font-semibold text-slate-900 flex items-center gap-1.5">
            <AlertTriangle size={14} className="text-amber-500" />
            Santé des alertes
          </h3>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Ces alertes méritent votre attention. Elles sont isolées du feed principal.
          </p>
        </div>
        <DrawerCloseButton onClose={onClose} />
      </div>

      <div className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-4">
        <Section
          icon={<VolumeX size={13} className="text-slate-500" />}
          title="Silencieuses"
          count={silent.length}
          desc="Aucun déclenchement récent."
        >
          {silent.map(a => (
            <ItemRow
              key={a.id}
              name={a.name}
              detail={`Aucun déclenchement depuis ${daysSince(a.last_triggered_at)} jours`}
              advice="Élargir la zone ou le seuil."
              onOpen={() => onOpenAlerte(a.id)}
            />
          ))}
        </Section>

        <Section
          icon={<Volume2 size={13} className="text-amber-600" />}
          title="Bruyantes"
          count={noisy.length}
          desc="Volume de déclenchements trop élevé."
        >
          {noisy.map(a => (
            <ItemRow
              key={a.id}
              name={a.name}
              detail={`${a.triggers_count_7d} déclenchements en 7 jours`}
              advice="Augmenter le seuil."
              onOpen={() => onOpenAlerte(a.id)}
              tone="amber"
            />
          ))}
        </Section>

        <Section
          icon={<Bug size={13} className="text-rose-600" />}
          title="En erreur"
          count={error.length}
          desc="Pipeline de détection en erreur."
        >
          {error.map(a => (
            <ItemRow
              key={a.id}
              name={a.name}
              detail="Erreur pipeline · équipe Propsight notifiée"
              advice="Vérifier à nouveau demain."
              onOpen={() => onOpenAlerte(a.id)}
              tone="rose"
            />
          ))}
        </Section>
      </div>

      <div className="px-4 py-3 border-t border-slate-200 bg-white">
        <SecondaryButton className="w-full justify-center" onClick={onClose}>
          Fermer
        </SecondaryButton>
      </div>
    </DrawerShell>
  );
};

const Section: React.FC<{
  icon: React.ReactNode;
  title: string;
  count: number;
  desc: string;
  children: React.ReactNode;
}> = ({ icon, title, count, desc, children }) => (
  <div>
    <div className="flex items-center gap-1.5 mb-1.5">
      {icon}
      <span className="text-[11px] font-semibold text-slate-700 uppercase tracking-wider">
        {title} <span className="text-slate-400">· {count}</span>
      </span>
    </div>
    {count === 0 ? (
      <p className="text-[11px] text-slate-400 italic pl-5">Aucune alerte dans cet état.</p>
    ) : (
      <>
        <p className="text-[10.5px] text-slate-500 mb-2 pl-5">{desc}</p>
        <div className="space-y-1.5">{children}</div>
      </>
    )}
  </div>
);

const ItemRow: React.FC<{
  name: string;
  detail: string;
  advice: string;
  onOpen: () => void;
  tone?: 'amber' | 'rose' | 'default';
}> = ({ name, detail, advice, onOpen, tone = 'default' }) => {
  const border =
    tone === 'amber' ? 'border-amber-200' : tone === 'rose' ? 'border-rose-200' : 'border-slate-200';
  return (
    <div className={`bg-white rounded-md border ${border} p-2.5`}>
      <div className="flex items-start justify-between gap-2 mb-1">
        <span className="text-[12px] font-medium text-slate-900">{name}</span>
        <button onClick={onOpen} className="text-[11px] font-medium text-propsight-700 hover:text-propsight-900 flex-shrink-0">
          Modifier
        </button>
      </div>
      <p className="text-[10.5px] text-slate-500">{detail}</p>
      <p className="text-[10.5px] text-slate-600 mt-1 italic">💡 {advice}</p>
    </div>
  );
};

const daysSince = (iso?: string) => {
  if (!iso) return '∞';
  return Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
};

export default SanteAlertesDrawer;
