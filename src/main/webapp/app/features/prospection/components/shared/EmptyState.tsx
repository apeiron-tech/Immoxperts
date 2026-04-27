import React from 'react';
import { SearchX, MapPinOff, AlertTriangle, Inbox } from 'lucide-react';

type Kind = 'no_territory' | 'no_filter_result' | 'low_activity' | 'error';

interface Props {
  kind: Kind;
  onPrimary?: () => void;
  onSecondary?: () => void;
}

const CONFIG: Record<Kind, { icon: React.ComponentType<any>; title: string; desc: string; primary: string; secondary?: string }> = {
  no_territory: {
    icon: MapPinOff,
    title: 'Configurez vos zones de prospection',
    desc: 'Pour que les signaux remontent, définissez les territoires où vous êtes actif. Vous pouvez aussi explorer toute la France en mode découverte.',
    primary: 'Définir mes zones',
    secondary: 'Explorer toute la France',
  },
  no_filter_result: {
    icon: SearchX,
    title: 'Aucun signal ne remonte sur cette sélection.',
    desc: 'Essayez d\'élargir votre période ou de retirer certains filtres.',
    primary: 'Réinitialiser les filtres',
    secondary: 'Élargir la période',
  },
  low_activity: {
    icon: Inbox,
    title: 'Peu d\'activité détectée sur ce secteur.',
    desc: 'Ce secteur enregistre peu de transactions récentes. Essayez d\'étendre le rayon ou d\'allonger la période.',
    primary: 'Étendre le rayon',
    secondary: 'Période 12 mois',
  },
  error: {
    icon: AlertTriangle,
    title: 'Impossible de charger les signaux.',
    desc: 'Un problème technique est survenu. Veuillez réessayer.',
    primary: 'Réessayer',
  },
};

const EmptyState: React.FC<Props> = ({ kind, onPrimary, onSecondary }) => {
  const cfg = CONFIG[kind];
  const Icon = cfg.icon;
  const iconColor = kind === 'error' ? 'text-amber-500' : 'text-slate-400';
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      <Icon size={42} className={iconColor} strokeWidth={1.25} />
      <h3 className="mt-4 text-sm font-semibold text-slate-900">{cfg.title}</h3>
      <p className="mt-1.5 max-w-md text-[12px] text-slate-500 leading-relaxed">{cfg.desc}</p>
      <div className="mt-4 flex items-center gap-2">
        {cfg.primary && (
          <button
            onClick={onPrimary}
            className="h-9 px-4 rounded-md bg-propsight-600 text-white text-sm font-medium hover:bg-propsight-700"
          >
            {cfg.primary}
          </button>
        )}
        {cfg.secondary && (
          <button
            onClick={onSecondary}
            className="h-9 px-4 rounded-md border border-slate-200 text-sm text-slate-700 hover:bg-slate-50"
          >
            {cfg.secondary}
          </button>
        )}
      </div>
    </div>
  );
};

export default EmptyState;
