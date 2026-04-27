import React from 'react';
import { SignalSource, SignalStatus, SignalPriority, ClasseDPE } from '../../types';
import {
  sourceColorClass,
  statusColorClass,
  scoreColorClass,
  priorityColorClass,
  classeDPEColor,
  labelStatus,
  labelSource,
  labelPriority,
} from '../../utils/formatters';
import { Home, Receipt, Zap, MapPin } from 'lucide-react';

interface PillProps {
  className?: string;
  children: React.ReactNode;
}

export const Pill: React.FC<PillProps> = ({ className = '', children }) => (
  <span
    className={`inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium rounded-md ring-1 ring-inset whitespace-nowrap ${className}`}
  >
    {children}
  </span>
);

// ---- BadgeSource ---------------------------------------------------------
interface BadgeSourceProps {
  source: SignalSource;
  size?: 'xs' | 'sm' | 'md';
  showLabel?: boolean;
}

export const BadgeSource: React.FC<BadgeSourceProps> = ({ source, size = 'sm', showLabel = true }) => {
  const iconSize = size === 'xs' ? 10 : size === 'sm' ? 12 : 14;
  const icon =
    source === 'annonce' ? (
      <Home size={iconSize} />
    ) : source === 'dvf' ? (
      <Receipt size={iconSize} />
    ) : source === 'dpe' ? (
      <Zap size={iconSize} />
    ) : (
      <MapPin size={iconSize} />
    );
  return (
    <Pill className={sourceColorClass(source)}>
      {icon}
      {showLabel && <span>{labelSource[source]}</span>}
    </Pill>
  );
};

// ---- BadgeScore ----------------------------------------------------------
interface BadgeScoreProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
}

export const BadgeScore: React.FC<BadgeScoreProps> = ({ score, size = 'md' }) => {
  const colorClass =
    score >= 80
      ? 'text-emerald-700 ring-emerald-300 bg-emerald-50'
      : score >= 60
        ? 'text-amber-700 ring-amber-300 bg-amber-50'
        : 'text-slate-500 ring-slate-300 bg-slate-50';
  const sizeClass =
    size === 'sm' ? 'h-6 w-6 text-[10px]' : size === 'lg' ? 'h-12 w-12 text-sm' : 'h-8 w-8 text-xs';
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full ring-1 ring-inset font-semibold ${sizeClass} ${colorClass}`}
    >
      {score}
    </span>
  );
};

// ---- BadgeStatut ---------------------------------------------------------
interface BadgeStatutProps {
  status: SignalStatus;
}
export const BadgeStatut: React.FC<BadgeStatutProps> = ({ status }) => (
  <Pill className={statusColorClass(status)}>
    <span className="h-1.5 w-1.5 rounded-full bg-current" />
    {labelStatus[status]}
  </Pill>
);

// ---- BadgePriorite -------------------------------------------------------
interface BadgePrioriteProps {
  priority: SignalPriority;
}
export const BadgePriorite: React.FC<BadgePrioriteProps> = ({ priority }) => (
  <Pill className={priorityColorClass(priority)}>{labelPriority[priority]}</Pill>
);

// ---- ClasseDPEBadge ------------------------------------------------------
interface ClasseDPEBadgeProps {
  classe: ClasseDPE;
  size?: 'sm' | 'md' | 'lg';
}

export const ClasseDPEBadge: React.FC<ClasseDPEBadgeProps> = ({ classe, size = 'md' }) => {
  const cfg = classeDPEColor[classe];
  const sizeClass =
    size === 'sm' ? 'h-5 w-5 text-[10px]' : size === 'lg' ? 'h-10 w-10 text-base' : 'h-7 w-7 text-xs';
  return (
    <span
      className={`inline-flex items-center justify-center rounded font-bold ${sizeClass}`}
      style={{ backgroundColor: cfg.bg, color: cfg.text }}
    >
      {cfg.label}
    </span>
  );
};

// ---- PotentielDots -------------------------------------------------------
interface PotentielDotsProps {
  niveau: 'faible' | 'modere' | 'eleve' | 'tres_eleve';
}

const NIVEAU_LABEL: Record<PotentielDotsProps['niveau'], string> = {
  faible: 'Faible',
  modere: 'Modéré',
  eleve: 'Élevé',
  tres_eleve: 'Très élevé',
};

export const PotentielDots: React.FC<PotentielDotsProps> = ({ niveau }) => {
  const filled = niveau === 'faible' ? 1 : niveau === 'modere' ? 2 : niveau === 'eleve' ? 3 : 4;
  const color =
    niveau === 'faible'
      ? 'bg-slate-300'
      : niveau === 'modere'
        ? 'bg-amber-400'
        : niveau === 'eleve'
          ? 'bg-emerald-500'
          : 'bg-emerald-600';
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-0.5">
        {[0, 1, 2, 3].map(i => (
          <span key={i} className={`h-1.5 w-3 rounded-sm ${i < filled ? color : 'bg-slate-200'}`} />
        ))}
      </div>
      <span className="text-[11px] text-slate-600">{NIVEAU_LABEL[niveau]}</span>
    </div>
  );
};

export const niveauFromScore = (score: number): PotentielDotsProps['niveau'] => {
  if (score >= 90) return 'tres_eleve';
  if (score >= 75) return 'eleve';
  if (score >= 60) return 'modere';
  return 'faible';
};
