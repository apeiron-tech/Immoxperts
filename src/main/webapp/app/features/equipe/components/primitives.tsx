import React from 'react';

type Tone =
  | 'violet'
  | 'blue'
  | 'orange'
  | 'green'
  | 'red'
  | 'slate'
  | 'yellow'
  | 'neutral'
  | 'success'
  | 'warning'
  | 'info'
  | 'danger';

// ── Avatar ────────────────────────────────────────────────────────────
export const Avatar: React.FC<{
  initials: string;
  color: string;
  size?: number;
  className?: string;
}> = ({ initials, color, size = 22, className = '' }) => (
  <span
    className={`inline-flex items-center justify-center rounded-full text-white font-semibold ${className}`}
    style={{
      width: size,
      height: size,
      backgroundColor: color,
      fontSize: Math.max(9, Math.floor(size * 0.4)),
    }}
  >
    {initials}
  </span>
);

// ── Chip ──────────────────────────────────────────────────────────────
export const Chip: React.FC<{
  tone?: Tone;
  children: React.ReactNode;
  className?: string;
}> = ({ tone = 'neutral', children, className = '' }) => {
  const tones: Record<Tone, string> = {
    violet: 'bg-propsight-50 text-propsight-700 border-propsight-200',
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    orange: 'bg-orange-50 text-orange-700 border-orange-200',
    green: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    red: 'bg-rose-50 text-rose-700 border-rose-200',
    slate: 'bg-slate-50 text-slate-600 border-slate-200',
    yellow: 'bg-amber-50 text-amber-700 border-amber-200',
    neutral: 'bg-slate-50 text-slate-600 border-slate-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    info: 'bg-blue-50 text-blue-700 border-blue-200',
    danger: 'bg-rose-50 text-rose-700 border-rose-200',
  };
  return (
    <span
      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded border text-[10.5px] font-medium ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
};

// ── Card ──────────────────────────────────────────────────────────────
export const Card: React.FC<{
  children: React.ReactNode;
  className?: string;
  padding?: boolean;
}> = ({ children, className = '', padding = true }) => (
  <div
    className={`bg-white border border-slate-200 rounded-md ${padding ? 'p-3' : ''} ${className}`}
  >
    {children}
  </div>
);

export const CardHeader: React.FC<{
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  right?: React.ReactNode;
  className?: string;
}> = ({ title, subtitle, right, className = '' }) => (
  <div className={`flex items-start justify-between gap-2 ${className}`}>
    <div className="min-w-0">
      <div className="text-[12px] font-semibold text-slate-800">{title}</div>
      {subtitle && <div className="text-[10.5px] text-slate-500 mt-0.5">{subtitle}</div>}
    </div>
    {right && <div className="flex-shrink-0">{right}</div>}
  </div>
);

// ── Button primitives ─────────────────────────────────────────────────
export const PrimaryButton: React.FC<{
  onClick?: () => void;
  children: React.ReactNode;
  icon?: React.ReactNode;
  size?: 'sm' | 'md';
  className?: string;
  disabled?: boolean;
}> = ({ onClick, children, icon, size = 'md', className = '', disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`inline-flex items-center gap-1.5 rounded-md bg-propsight-600 hover:bg-propsight-700 disabled:opacity-50 text-white font-medium transition-colors ${
      size === 'sm' ? 'px-2.5 py-1 text-[11.5px]' : 'px-3 py-1.5 text-xs'
    } ${className}`}
  >
    {icon}
    {children}
  </button>
);

export const SecondaryButton: React.FC<{
  onClick?: () => void;
  children: React.ReactNode;
  icon?: React.ReactNode;
  size?: 'sm' | 'md';
  className?: string;
  tone?: 'neutral' | 'violet' | 'danger';
}> = ({ onClick, children, icon, size = 'md', className = '', tone = 'neutral' }) => {
  const tones = {
    neutral: 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700',
    violet: 'bg-white hover:bg-propsight-50 border-propsight-200 text-propsight-700',
    danger: 'bg-white hover:bg-rose-50 border-rose-200 text-rose-700',
  };
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-md border font-medium transition-colors ${tones[tone]} ${
        size === 'sm' ? 'px-2.5 py-1 text-[11.5px]' : 'px-3 py-1.5 text-xs'
      } ${className}`}
    >
      {icon}
      {children}
    </button>
  );
};

// ── Select compact ────────────────────────────────────────────────────
export interface SelectOption {
  value: string;
  label: string;
}

export const Select: React.FC<{
  value: string;
  onChange: (v: string) => void;
  options: SelectOption[];
  label?: string;
  compact?: boolean;
}> = ({ value, onChange, options, label, compact = true }) => (
  <label className="inline-flex items-center gap-1.5">
    {label && <span className="text-[10.5px] text-slate-500 whitespace-nowrap">{label}</span>}
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className={`border border-slate-200 rounded-md bg-white text-[11.5px] text-slate-700 ${
        compact ? 'px-2 py-1' : 'px-2.5 py-1.5'
      } focus:outline-none focus:ring-1 focus:ring-propsight-400`}
    >
      {options.map(o => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  </label>
);

// ── Segmented control ─────────────────────────────────────────────────
export const Segmented: React.FC<{
  value: string;
  onChange: (v: string) => void;
  options: SelectOption[];
}> = ({ value, onChange, options }) => (
  <div className="inline-flex items-center bg-slate-100 rounded-md p-0.5">
    {options.map(o => (
      <button
        key={o.value}
        onClick={() => onChange(o.value)}
        className={`px-2 py-0.5 text-[11px] font-medium rounded transition-colors ${
          value === o.value ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
        }`}
      >
        {o.label}
      </button>
    ))}
  </div>
);

// ── Progress bar ──────────────────────────────────────────────────────
export const ProgressBar: React.FC<{
  value: number;
  max?: number;
  tone?: 'violet' | 'emerald' | 'orange' | 'red' | 'slate';
  height?: number;
  className?: string;
}> = ({ value, max = 100, tone = 'violet', height = 5, className = '' }) => {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const colors = {
    violet: 'bg-propsight-500',
    emerald: 'bg-emerald-500',
    orange: 'bg-amber-500',
    red: 'bg-rose-500',
    slate: 'bg-slate-400',
  };
  return (
    <div
      className={`w-full bg-slate-100 rounded-full overflow-hidden ${className}`}
      style={{ height }}
    >
      <div className={`h-full ${colors[tone]} rounded-full transition-all`} style={{ width: `${pct}%` }} />
    </div>
  );
};

// ── Status dot ────────────────────────────────────────────────────────
export const StatusDot: React.FC<{ tone: Tone; size?: number; className?: string }> = ({
  tone,
  size = 6,
  className = '',
}) => {
  const colors: Record<Tone, string> = {
    violet: 'bg-propsight-500',
    blue: 'bg-blue-500',
    orange: 'bg-amber-500',
    green: 'bg-emerald-500',
    red: 'bg-rose-500',
    slate: 'bg-slate-400',
    yellow: 'bg-amber-400',
    neutral: 'bg-slate-400',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    info: 'bg-blue-500',
    danger: 'bg-rose-500',
  };
  return (
    <span
      className={`inline-block rounded-full ${colors[tone]} ${className}`}
      style={{ width: size, height: size }}
    />
  );
};

// ── Workload badge ────────────────────────────────────────────────────
export const WorkloadBadge: React.FC<{
  score: number;
  status: 'disponible' | 'normal' | 'charge' | 'surcharge';
  compact?: boolean;
}> = ({ score, status, compact }) => {
  const palette = {
    disponible: { tone: 'emerald' as const, label: 'Disponible' },
    normal: { tone: 'slate' as const, label: 'Normal' },
    charge: { tone: 'orange' as const, label: 'Chargé' },
    surcharge: { tone: 'red' as const, label: 'Surcharge' },
  }[status];
  const barTones = { emerald: 'emerald', slate: 'slate', orange: 'orange', red: 'red' } as const;
  const textColors = {
    disponible: 'text-emerald-600',
    normal: 'text-slate-600',
    charge: 'text-amber-600',
    surcharge: 'text-rose-600',
  };
  if (compact) {
    return (
      <div className="flex items-center gap-1.5">
        <span className={`text-[11px] font-semibold tabular-nums ${textColors[status]}`}>
          {score}/100
        </span>
        <span className={`text-[10px] ${textColors[status]}`}>•</span>
        <span className={`text-[10.5px] ${textColors[status]}`}>{palette.label}</span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2 min-w-0">
      <div className="flex-1 min-w-[60px]">
        <ProgressBar value={score} tone={barTones[palette.tone]} height={4} />
      </div>
      <span className={`text-[11px] font-semibold tabular-nums whitespace-nowrap ${textColors[status]}`}>
        {score}/100
      </span>
    </div>
  );
};

// ── Trend arrow ───────────────────────────────────────────────────────
export const Trend: React.FC<{ trend: 'up' | 'down' | 'flat'; text?: string }> = ({ trend, text }) => {
  const colors = {
    up: 'text-emerald-600',
    down: 'text-rose-600',
    flat: 'text-slate-500',
  };
  const arrow = { up: '▲', down: '▼', flat: '=' }[trend];
  return (
    <span className={`inline-flex items-center gap-1 text-[10.5px] ${colors[trend]}`}>
      <span>{arrow}</span>
      {text && <span>{text}</span>}
    </span>
  );
};

// ── Sparkline SVG ─────────────────────────────────────────────────────
export const Sparkline: React.FC<{
  values: number[];
  width?: number;
  height?: number;
  color?: string;
}> = ({ values, width = 60, height = 16, color = '#8B5CF6' }) => {
  if (!values.length) return null;
  const max = Math.max(...values, 1);
  const min = Math.min(...values);
  const step = values.length > 1 ? width / (values.length - 1) : width;
  const points = values
    .map((v, i) => {
      const x = i * step;
      const y = height - ((v - min) / Math.max(1, max - min)) * height;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline fill="none" stroke={color} strokeWidth={1.5} points={points} strokeLinejoin="round" />
    </svg>
  );
};

// ── Empty state ───────────────────────────────────────────────────────
export const EmptyState: React.FC<{
  title: string;
  description?: string;
  cta?: React.ReactNode;
}> = ({ title, description, cta }) => (
  <div className="flex flex-col items-center justify-center text-center py-8 px-4">
    <div className="text-[13px] font-semibold text-slate-700">{title}</div>
    {description && <div className="text-[11.5px] text-slate-500 mt-1 max-w-sm">{description}</div>}
    {cta && <div className="mt-3">{cta}</div>}
  </div>
);

// ── Icon button ───────────────────────────────────────────────────────
export const IconButton: React.FC<{
  onClick?: (e: React.MouseEvent) => void;
  children: React.ReactNode;
  title?: string;
  className?: string;
}> = ({ onClick, children, title, className = '' }) => (
  <button
    onClick={onClick}
    title={title}
    className={`inline-flex items-center justify-center w-6 h-6 rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors ${className}`}
  >
    {children}
  </button>
);

// ── Formatters ────────────────────────────────────────────────────────
export const formatEuro = (value: number): string => {
  if (value >= 1000000) return (value / 1000000).toFixed(2).replace('.', ',') + ' M€';
  if (value >= 1000) return Math.round(value / 1000).toLocaleString('fr-FR') + ' k€';
  return value.toLocaleString('fr-FR') + ' €';
};

export const formatEuroFull = (value: number): string =>
  value.toLocaleString('fr-FR') + ' €';

export const formatPct = (value: number, decimals = 0): string =>
  value.toFixed(decimals).replace('.', ',') + ' %';

export const formatRelativeDate = (iso: string, now = new Date()): string => {
  const d = new Date(iso);
  const diffMs = now.getTime() - d.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 60) return `${diffMin} min`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `${diffH} h`;
  const diffJ = Math.floor(diffH / 24);
  if (diffJ < 7) return `${diffJ} j`;
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
};
