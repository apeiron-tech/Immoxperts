import React from 'react';
import {
  ChevronDown,
  Check,
  Bell,
  Home,
  MapPin,
  Search as SearchIcon,
  Building2,
  Zap,
  Landmark,
  Activity,
  Users as UsersIcon,
  Circle,
  Clock,
  CircleCheck,
  X as XIcon,
  AlertTriangle,
  Minus,
  TrendingUp,
  TrendingDown,
  Sparkles,
  ArrowRight,
  Calendar,
} from 'lucide-react';
import KpiCardPrimitive from 'app/shared/ui/KpiCard';
import {
  AlerteDomain,
  AlerteFrequency,
  AlertePriority,
  AlerteStatus,
  AlerteTargetType,
  DpeClasse,
  NotificationPriority,
  NotificationStatus,
  PortailSource,
  ScoreInteretLabel,
  UserLite,
} from '../../types';
import { freshnessLabel, absoluteLabel } from '../../utils/freshness';

/* ============== BOUTONS ============== */

export const PrimaryButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
  children,
  className = '',
  ...rest
}) => (
  <button
    {...rest}
    className={`h-8 px-3 rounded-md bg-propsight-600 text-white text-[12px] font-medium hover:bg-propsight-700 inline-flex items-center gap-1.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
  >
    {children}
  </button>
);

export const SecondaryButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
  children,
  className = '',
  ...rest
}) => (
  <button
    {...rest}
    className={`h-8 px-3 rounded-md border border-slate-200 bg-white text-[12px] text-slate-700 hover:bg-slate-50 inline-flex items-center gap-1.5 transition-colors ${className}`}
  >
    {children}
  </button>
);

export const GhostButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
  children,
  className = '',
  ...rest
}) => (
  <button
    {...rest}
    className={`h-7 px-2 rounded-md text-[11.5px] text-slate-600 hover:bg-slate-100 inline-flex items-center gap-1 transition-colors ${className}`}
  >
    {children}
  </button>
);

export const DangerButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
  children,
  className = '',
  ...rest
}) => (
  <button
    {...rest}
    className={`h-8 px-3 rounded-md border border-rose-200 bg-rose-50 text-rose-700 text-[12px] font-medium hover:bg-rose-100 inline-flex items-center gap-1.5 transition-colors ${className}`}
  >
    {children}
  </button>
);

/* ============== FILTRES ============== */

export interface FilterOption {
  value: string;
  label: string;
}

export const FilterDropdown: React.FC<{
  label: string;
  value: string;
  options: FilterOption[];
  onChange: (v: string) => void;
  width?: string;
}> = ({ label, value, options, onChange, width = 'min-w-[160px]' }) => {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const cb = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener('mousedown', cb);
    return () => document.removeEventListener('mousedown', cb);
  }, [open]);

  const current = options.find(o => o.value === value)?.label ?? value;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className="h-8 px-2.5 rounded-md border border-slate-200 bg-white text-[12px] text-slate-700 hover:bg-slate-50 inline-flex items-center gap-1.5 transition-colors whitespace-nowrap"
      >
        <span className="text-slate-400">{label}</span>
        <span className="font-medium text-slate-700">{current}</span>
        <ChevronDown size={11} className="text-slate-400" />
      </button>
      {open && (
        <div className={`absolute top-full left-0 mt-1 ${width} bg-white rounded-md border border-slate-200 shadow-lg z-30 py-1 max-h-[240px] overflow-y-auto`}>
          {options.map(o => (
            <button
              key={o.value}
              onClick={() => {
                onChange(o.value);
                setOpen(false);
              }}
              className={`w-full text-left px-2.5 py-1.5 text-[12px] flex items-center justify-between hover:bg-slate-50 ${
                o.value === value ? 'text-propsight-700 font-medium' : 'text-slate-700'
              }`}
            >
              {o.label}
              {o.value === value && <Check size={12} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export const SearchInput: React.FC<{
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  width?: string;
}> = ({ placeholder, value, onChange, width = 'w-[260px]' }) => (
  <div className={`relative ${width}`}>
    <SearchIcon size={12} className="absolute top-1/2 -translate-y-1/2 left-2.5 text-slate-400" />
    <input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full h-8 pl-7 pr-2.5 rounded-md border border-slate-200 bg-white text-[12px] text-slate-700 placeholder-slate-400 focus:outline-none focus:border-propsight-300 focus:ring-1 focus:ring-propsight-200"
    />
  </div>
);

export const FiltersBar: React.FC<{ children: React.ReactNode; right?: React.ReactNode }> = ({ children, right }) => (
  <div className="px-4 py-2 border-b border-slate-200 bg-white flex items-center gap-1.5 flex-wrap flex-shrink-0">
    <div className="flex items-center gap-1.5 flex-wrap flex-1">{children}</div>
    {right && <div className="flex items-center gap-1.5 flex-shrink-0">{right}</div>}
  </div>
);

/* ============== KPI ROW ============== */

export interface KpiTileConfig {
  id: string;
  icon: React.ReactNode;
  iconBg: string;
  iconFg: string;
  label: string;
  value: string | number;
  delta?: string;
  deltaTone?: 'up' | 'down' | 'flat';
  active?: boolean;
  onClick?: () => void;
}

export const KpiRow: React.FC<{ tiles: KpiTileConfig[] }> = ({ tiles }) => (
  <div className="grid grid-cols-4 gap-2 px-4 py-2 bg-slate-50 flex-shrink-0 border-b border-slate-200">
    {tiles.map(t => (
      <KpiCardPrimitive
        key={t.id}
        label={t.label}
        value={t.value}
        icon={t.icon}
        iconWrapperClassName={`${t.iconBg} ${t.iconFg}`}
        iconLayout="left"
        density="default"
        active={t.active}
        onClick={t.onClick}
        trend={
          t.delta && t.deltaTone
            ? { value: t.delta, direction: t.deltaTone }
            : undefined
        }
      />
    ))}
  </div>
);

/* ============== HEADER ============== */

export const PageHeader: React.FC<{
  title: string;
  count?: number | string;
  subtitle: string;
  actions?: React.ReactNode;
}> = ({ title, count, subtitle, actions }) => (
  <div className="px-4 py-2.5 border-b border-slate-200 bg-white flex-shrink-0">
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <h1 className="text-[18px] font-semibold text-slate-900 leading-tight tracking-tight">
          {title}
          {count !== undefined && <span className="text-slate-400 font-normal ml-2">· {count}</span>}
        </h1>
        <p className="text-[12px] text-slate-500 mt-0.5 leading-snug">{subtitle}</p>
      </div>
      <div className="flex items-center gap-1.5 flex-shrink-0">{actions}</div>
    </div>
  </div>
);

/* ============== TABS ============== */

export interface TabConfig {
  key: string;
  label: string;
  count?: number;
}

export const Tabs: React.FC<{
  tabs: TabConfig[];
  active: string;
  onChange: (k: string) => void;
  right?: React.ReactNode;
}> = ({ tabs, active, onChange, right }) => (
  <div className="px-4 border-b border-slate-200 bg-white flex items-center gap-1 flex-shrink-0">
    <div className="flex items-center gap-0.5 flex-1 overflow-x-auto">
      {tabs.map(t => (
        <button
          key={t.key}
          onClick={() => onChange(t.key)}
          className={`relative h-9 px-3 text-[12px] font-medium transition-colors inline-flex items-center gap-1.5 whitespace-nowrap ${
            t.key === active ? 'text-propsight-700' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {t.label}
          {t.count !== undefined && (
            <span
              className={`inline-flex items-center justify-center h-4 min-w-4 px-1 rounded text-[10px] font-semibold ${
                t.key === active ? 'bg-propsight-100 text-propsight-700' : 'bg-slate-100 text-slate-500'
              }`}
            >
              {t.count}
            </span>
          )}
          {t.key === active && <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-propsight-600 rounded-t" />}
        </button>
      ))}
    </div>
    {right && <div className="flex items-center gap-1.5">{right}</div>}
  </div>
);

/* ============== BADGES ============== */

export const Pill: React.FC<{ className?: string; children: React.ReactNode }> = ({ className = '', children }) => (
  <span
    className={`inline-flex items-center gap-1 px-1.5 h-5 rounded text-[10.5px] font-medium ring-1 ring-inset whitespace-nowrap ${className}`}
  >
    {children}
  </span>
);

export const AlerteStatusBadge: React.FC<{ status: AlerteStatus }> = ({ status }) => {
  const cls =
    status === 'active'
      ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
      : status === 'paused'
        ? 'bg-slate-100 text-slate-600 ring-slate-200'
        : 'bg-slate-200 text-slate-600 ring-slate-300';
  const label = status === 'active' ? 'Active' : status === 'paused' ? 'En pause' : 'Archivée';
  return <Pill className={cls}>{label}</Pill>;
};

export const AlertePriorityBadge: React.FC<{ priority: AlertePriority }> = ({ priority }) => {
  const cls =
    priority === 'haute'
      ? 'bg-rose-50 text-rose-700 ring-rose-200'
      : priority === 'moyenne'
        ? 'bg-amber-50 text-amber-700 ring-amber-200'
        : 'bg-slate-50 text-slate-600 ring-slate-200';
  const label = priority === 'haute' ? 'Haute' : priority === 'moyenne' ? 'Moyenne' : 'Info';
  return <Pill className={cls}>{label}</Pill>;
};

export const FrequencyBadge: React.FC<{ frequency: AlerteFrequency }> = ({ frequency }) => {
  const cls =
    frequency === 'immediate'
      ? 'bg-propsight-50 text-propsight-700 ring-propsight-200'
      : frequency === 'daily'
        ? 'bg-sky-50 text-sky-700 ring-sky-200'
        : 'bg-slate-50 text-slate-700 ring-slate-200';
  const label = frequency === 'immediate' ? 'Immédiat' : frequency === 'daily' ? 'Quotidien' : 'Hebdo';
  return <Pill className={cls}>{label}</Pill>;
};

const DOMAIN_CONF: Record<AlerteDomain, { label: string; icon: React.ReactNode; cls: string }> = {
  prix: { label: 'Prix', icon: <TrendingDown size={10} />, cls: 'bg-rose-50 text-rose-700 ring-rose-200' },
  annonce: { label: 'Annonce', icon: <Bell size={10} />, cls: 'bg-propsight-50 text-propsight-700 ring-propsight-200' },
  dpe: { label: 'DPE', icon: <Zap size={10} />, cls: 'bg-emerald-50 text-emerald-700 ring-emerald-200' },
  urbanisme: { label: 'Urbanisme', icon: <Landmark size={10} />, cls: 'bg-amber-50 text-amber-700 ring-amber-200' },
  marche: { label: 'Marché', icon: <Activity size={10} />, cls: 'bg-sky-50 text-sky-700 ring-sky-200' },
  concurrence: {
    label: 'Concurrent',
    icon: <UsersIcon size={10} />,
    cls: 'bg-fuchsia-50 text-fuchsia-700 ring-fuchsia-200',
  },
};

export const DomainBadge: React.FC<{ domain: AlerteDomain; size?: 'sm' | 'md' }> = ({ domain, size = 'md' }) => {
  const c = DOMAIN_CONF[domain];
  if (size === 'sm') {
    return (
      <span className={`inline-flex items-center justify-center h-5 w-5 rounded ${c.cls.replace('ring-', 'ring-')}`} title={c.label}>
        {c.icon}
      </span>
    );
  }
  return (
    <Pill className={c.cls}>
      {c.icon}
      {c.label}
    </Pill>
  );
};

const TARGET_CONF: Record<AlerteTargetType, { label: string; icon: React.ReactNode }> = {
  bien: { label: 'Bien', icon: <Home size={10} /> },
  zone: { label: 'Zone', icon: <MapPin size={10} /> },
  recherche: { label: 'Recherche', icon: <SearchIcon size={10} /> },
  agence: { label: 'Agence', icon: <Building2 size={10} /> },
};

export const TargetTypeIcon: React.FC<{ type: AlerteTargetType }> = ({ type }) => {
  const c = TARGET_CONF[type];
  return (
    <span className="inline-flex items-center gap-1 text-slate-500 text-[11px]">
      {c.icon}
      {c.label}
    </span>
  );
};

/* ----- Notifications ----- */

export const NotifStatusDot: React.FC<{ status: NotificationStatus; size?: number }> = ({ status, size = 8 }) => {
  const cls =
    status === 'unread'
      ? 'bg-propsight-500'
      : status === 'read'
        ? 'bg-slate-300'
        : status === 'todo'
          ? 'bg-amber-500'
          : status === 'done'
            ? 'bg-emerald-500'
            : 'bg-slate-300';
  return <span className={`inline-block rounded-full ${cls}`} style={{ height: size, width: size }} />;
};

export const NotifStatusIcon: React.FC<{ status: NotificationStatus }> = ({ status }) => {
  if (status === 'unread') return <Circle size={11} className="text-propsight-500 fill-propsight-500" />;
  if (status === 'read') return <Circle size={11} className="text-slate-300" />;
  if (status === 'todo') return <Clock size={11} className="text-amber-500" />;
  if (status === 'done') return <CircleCheck size={11} className="text-emerald-500" />;
  return <XIcon size={11} className="text-slate-400" />;
};

export const NotifPriorityBadge: React.FC<{ priority: NotificationPriority }> = ({ priority }) => (
  <AlertePriorityBadge priority={priority} />
);

export const NotifStatusBadge: React.FC<{ status: NotificationStatus }> = ({ status }) => {
  const map: Record<NotificationStatus, { label: string; cls: string }> = {
    unread: { label: 'Nouveau', cls: 'bg-propsight-50 text-propsight-700 ring-propsight-200' },
    read: { label: 'Lu', cls: 'bg-slate-50 text-slate-600 ring-slate-200' },
    todo: { label: 'À traiter', cls: 'bg-amber-50 text-amber-700 ring-amber-200' },
    done: { label: 'Traité', cls: 'bg-emerald-50 text-emerald-700 ring-emerald-200' },
    ignored: { label: 'Ignoré', cls: 'bg-slate-100 text-slate-500 ring-slate-200' },
  };
  const c = map[status];
  return <Pill className={c.cls}>{c.label}</Pill>;
};

/* ----- DPE ----- */

const DPE_COLORS: Record<DpeClasse, { bg: string; fg: string }> = {
  A: { bg: '#00A651', fg: '#FFFFFF' },
  B: { bg: '#50B848', fg: '#FFFFFF' },
  C: { bg: '#AED136', fg: '#1F2937' },
  D: { bg: '#FFF200', fg: '#1F2937' },
  E: { bg: '#FDB913', fg: '#1F2937' },
  F: { bg: '#F47735', fg: '#FFFFFF' },
  G: { bg: '#ED1C24', fg: '#FFFFFF' },
};

export const DpeBadge: React.FC<{ classe: DpeClasse; size?: 'sm' | 'md' }> = ({ classe, size = 'md' }) => {
  const c = DPE_COLORS[classe];
  const cls = size === 'sm' ? 'h-5 w-5 text-[10px]' : 'h-6 w-6 text-[11px]';
  return (
    <span
      className={`inline-flex items-center justify-center rounded font-bold ${cls}`}
      style={{ backgroundColor: c.bg, color: c.fg }}
    >
      {classe}
    </span>
  );
};

/* ----- Score intérêt ----- */

const SCORE_CONF: Record<ScoreInteretLabel, { label: string; cls: string }> = {
  forte_opportunite: { label: 'Forte opportunité', cls: 'bg-emerald-50 text-emerald-700 ring-emerald-200' },
  a_surveiller: { label: 'À surveiller', cls: 'bg-sky-50 text-sky-700 ring-sky-200' },
  faible_priorite: { label: 'Faible priorité', cls: 'bg-slate-50 text-slate-600 ring-slate-200' },
};

export const ScoreInteretBadge: React.FC<{ score: number; label: ScoreInteretLabel; compact?: boolean }> = ({
  score,
  label,
  compact,
}) => {
  const c = SCORE_CONF[label];
  return (
    <span
      className={`inline-flex items-center gap-1.5 h-6 px-2 rounded-md ring-1 ring-inset text-[11px] font-medium ${c.cls}`}
    >
      <span className="font-semibold tabular-nums">{score}</span>
      {!compact && <span>· {c.label}</span>}
    </span>
  );
};

/* ----- Portail ----- */

const PORTAIL_CONF: Record<PortailSource, { fg: string; bg: string; short: string }> = {
  SeLoger: { fg: '#FFFFFF', bg: '#E30613', short: 'S' },
  Leboncoin: { fg: '#FFFFFF', bg: '#EC5A13', short: 'LB' },
  "Bien'ici": { fg: '#FFFFFF', bg: '#0081C7', short: 'B' },
  PAP: { fg: '#FFFFFF', bg: '#1F2937', short: 'P' },
  'Logic Immo': { fg: '#FFFFFF', bg: '#7C3AED', short: 'L' },
};

export const PortailBadge: React.FC<{ portail: PortailSource }> = ({ portail }) => {
  const c = PORTAIL_CONF[portail];
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] text-slate-700">
      <span
        className="inline-flex items-center justify-center h-4 w-4 rounded text-[9px] font-bold"
        style={{ color: c.fg, backgroundColor: c.bg }}
      >
        {c.short}
      </span>
      {portail}
    </span>
  );
};

/* ============== AVATAR ============== */

export const AssigneeAvatar: React.FC<{ user?: UserLite; size?: number }> = ({ user, size = 22 }) => {
  if (!user) {
    return (
      <span
        className="inline-flex items-center justify-center rounded-full border border-dashed border-slate-300 text-slate-400 text-[9px]"
        style={{ height: size, width: size }}
      >
        ?
      </span>
    );
  }
  return (
    <span
      className="inline-flex items-center justify-center rounded-full text-white font-semibold"
      style={{ height: size, width: size, backgroundColor: user.color, fontSize: Math.round(size * 0.4) }}
      title={user.name}
    >
      {user.initials}
    </span>
  );
};

/* ============== FRESHNESS LABEL ============== */

export const FreshnessLabel: React.FC<{ iso: string; className?: string; bold?: boolean }> = ({
  iso,
  className = '',
  bold,
}) => (
  <span className={`text-[11px] ${bold ? 'font-medium text-slate-700' : 'text-slate-500'} ${className}`} title={absoluteLabel(iso)}>
    {freshnessLabel(iso)}
  </span>
);

/* ============== INTER-MODULE CHIP ============== */

export const InterModuleChip: React.FC<{
  label: string;
  count?: number;
  icon?: React.ReactNode;
  variant?: 'default' | 'danger' | 'warning' | 'success';
  onClick?: () => void;
}> = ({ label, count, icon, variant = 'default', onClick }) => {
  const cls =
    variant === 'danger'
      ? 'border-rose-200 text-rose-700 hover:bg-rose-50'
      : variant === 'warning'
        ? 'border-amber-200 text-amber-700 hover:bg-amber-50'
        : variant === 'success'
          ? 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
          : 'border-slate-200 text-slate-700 hover:bg-slate-50';
  return (
    <button
      onClick={onClick}
      className={`h-7 px-2.5 rounded-md border bg-white text-[11.5px] inline-flex items-center gap-1.5 transition-colors ${cls}`}
    >
      {icon}
      {label}
      {count !== undefined && (
        <span className={`inline-flex items-center justify-center h-4 min-w-4 px-1 rounded bg-slate-100 text-slate-600 text-[10px] font-semibold ${
          variant === 'danger' ? 'bg-rose-100 text-rose-700' : ''
        }`}>
          {count}
        </span>
      )}
    </button>
  );
};

/* ============== AI SUGGESTION BLOC ============== */

export const AiSuggestionBloc: React.FC<{
  insight: string;
  cta?: string;
  onCtaClick?: () => void;
}> = ({ insight, cta = 'Voir suggestion détaillée', onCtaClick }) => (
  <div className="rounded-md border border-propsight-200 bg-propsight-50/60 p-3">
    <div className="flex items-center gap-1.5 mb-1.5">
      <Sparkles size={12} className="text-propsight-600" />
      <span className="text-[11px] font-semibold text-propsight-900">Suggestion Propsight IA</span>
      <span className="text-[9px] font-bold text-propsight-700 bg-propsight-200 px-1.5 py-0.5 rounded uppercase tracking-wide">
        Beta
      </span>
    </div>
    <p className="text-[11.5px] text-slate-700 leading-relaxed mb-2">{insight}</p>
    <button
      onClick={onCtaClick}
      className="text-[11px] font-medium text-propsight-700 hover:text-propsight-900 inline-flex items-center gap-1 transition-colors"
    >
      {cta}
      <ArrowRight size={11} />
    </button>
  </div>
);

/* ============== EMPTY STATE ============== */

export const EmptyState: React.FC<{
  icon: React.ReactNode;
  title: string;
  description?: string;
  primary?: { label: string; onClick: () => void };
  secondary?: { label: string; onClick: () => void };
  hints?: string[];
}> = ({ icon, title, description, primary, secondary, hints }) => (
  <div className="flex-1 flex items-center justify-center p-8">
    <div className="max-w-md text-center">
      <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-propsight-50 text-propsight-600 mb-4">
        {icon}
      </div>
      <h3 className="text-[15px] font-semibold text-slate-900 mb-1">{title}</h3>
      {description && <p className="text-[12.5px] text-slate-500 mb-4 leading-relaxed">{description}</p>}
      <div className="flex items-center justify-center gap-2">
        {primary && <PrimaryButton onClick={primary.onClick}>{primary.label}</PrimaryButton>}
        {secondary && <SecondaryButton onClick={secondary.onClick}>{secondary.label}</SecondaryButton>}
      </div>
      {hints && hints.length > 0 && (
        <div className="mt-6 pt-4 border-t border-slate-100">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-2">Idées rapides</div>
          <ul className="space-y-1">
            {hints.map(h => (
              <li key={h} className="text-[11.5px] text-slate-600">
                • {h}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  </div>
);

/* ============== VIEW TOGGLE ============== */

export const ViewToggle: React.FC<{
  options: { value: string; label: string; icon?: React.ReactNode }[];
  value: string;
  onChange: (v: string) => void;
}> = ({ options, value, onChange }) => (
  <div className="inline-flex items-center gap-0 rounded-md border border-slate-200 bg-white overflow-hidden">
    {options.map(o => (
      <button
        key={o.value}
        onClick={() => onChange(o.value)}
        className={`h-7 px-2.5 text-[11.5px] inline-flex items-center gap-1.5 transition-colors ${
          o.value === value ? 'bg-propsight-50 text-propsight-700 font-medium' : 'text-slate-600 hover:bg-slate-50'
        }`}
      >
        {o.icon}
        {o.label}
      </button>
    ))}
  </div>
);

/* ============== SPARKLINE ============== */

export const Sparkline: React.FC<{ data: number[]; color?: string; height?: number; width?: number }> = ({
  data,
  color = '#7C3AED',
  height = 18,
  width = 56,
}) => {
  if (data.length === 0) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((v - min) / range) * height;
      return `${x},${y}`;
    })
    .join(' ');
  return (
    <svg width={width} height={height} className="inline-block">
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

/* ============== SECTION TITLE ============== */

export const SectionTitle: React.FC<{ children: React.ReactNode; action?: React.ReactNode }> = ({ children, action }) => (
  <div className="flex items-center justify-between gap-2 mb-1.5">
    <h4 className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{children}</h4>
    {action}
  </div>
);

/* ============== STATUS BADGE ANNONCE ============== */

export const AnnonceStatusBadge: React.FC<{ status: 'Actif' | 'Baisse' | 'Remis en ligne' | 'Expiré' }> = ({ status }) => {
  const cls =
    status === 'Baisse'
      ? 'bg-rose-50 text-rose-700 ring-rose-200'
      : status === 'Actif'
        ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
        : status === 'Remis en ligne'
          ? 'bg-sky-50 text-sky-700 ring-sky-200'
          : 'bg-slate-100 text-slate-500 ring-slate-200';
  return <Pill className={cls}>{status}</Pill>;
};

/* ============== ICONS EXPORT ============== */

export const Icons = {
  Bell,
  Home,
  MapPin,
  Search: SearchIcon,
  Building2,
  Zap,
  Landmark,
  Activity,
  Users: UsersIcon,
  Alert: AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus,
  Calendar,
  Sparkles,
  ArrowRight,
};
