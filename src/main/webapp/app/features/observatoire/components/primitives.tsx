import React from 'react';
import { ChevronDown, Download, Check, AlertTriangle, Minus, Bell } from 'lucide-react';
import KpiCardPrimitive, { KpiIconVariant } from 'app/shared/ui/KpiCard';
import { ConfidenceLevel, ConfidenceReason } from '../types';

/* ----------------------------------------------------------------- */
/* Page header                                                        */
/* ----------------------------------------------------------------- */

export const PageHeader: React.FC<{
  title: string;
  zoneLabel: string;
  zoneCode: string;
  subtitle: string;
  actions?: React.ReactNode;
}> = ({ title, zoneLabel, zoneCode, subtitle, actions }) => (
  <div className="px-3 py-2 border-b border-slate-200 bg-white flex-shrink-0">
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <h1 className="text-[14px] font-semibold text-slate-900 leading-tight">
          {title} <span className="text-slate-400 font-normal">—</span>{' '}
          <span className="text-slate-700 font-medium">{zoneLabel}</span>{' '}
          <span className="text-slate-400 font-normal">({zoneCode})</span>
        </h1>
        <p className="text-[11px] text-slate-500 mt-0.5 leading-snug max-w-3xl">{subtitle}</p>
      </div>
      <div className="flex items-center gap-1.5 flex-shrink-0">{actions}</div>
    </div>
  </div>
);

/* ----------------------------------------------------------------- */
/* Buttons                                                            */
/* ----------------------------------------------------------------- */

export const PrimaryButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, className = '', ...rest }) => (
  <button
    {...rest}
    className={`h-7 px-2.5 rounded-md bg-propsight-600 text-white text-[11.5px] font-medium hover:bg-propsight-700 inline-flex items-center gap-1 transition-colors ${className}`}
  >
    {children}
  </button>
);

export const SecondaryButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, className = '', ...rest }) => (
  <button
    {...rest}
    className={`h-7 px-2.5 rounded-md border border-slate-200 bg-white text-[11.5px] text-slate-700 hover:bg-slate-50 inline-flex items-center gap-1 transition-colors ${className}`}
  >
    {children}
  </button>
);

export const GhostButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, className = '', ...rest }) => (
  <button
    {...rest}
    className={`h-7 px-2 rounded-md text-[11.5px] text-slate-600 hover:bg-slate-100 inline-flex items-center gap-1 transition-colors ${className}`}
  >
    {children}
  </button>
);

export const ExportButton: React.FC = () => (
  <SecondaryButton>
    <Download size={11} />
    Exporter
    <ChevronDown size={11} />
  </SecondaryButton>
);

export const CreerAlerteButton: React.FC = () => (
  <SecondaryButton>
    <Bell size={11} />
    Créer une alerte
  </SecondaryButton>
);

/* ----------------------------------------------------------------- */
/* Filter bar                                                         */
/* ----------------------------------------------------------------- */

export interface FilterOption {
  value: string;
  label: string;
}

export const FilterChip: React.FC<{
  label: string;
  value: string;
  options: FilterOption[];
  onChange: (v: string) => void;
}> = ({ label, value, options, onChange }) => {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  const current = options.find(o => o.value === value)?.label ?? value;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className="h-7 px-2 rounded-md border border-slate-200 bg-white text-[11px] text-slate-700 hover:bg-slate-50 inline-flex items-center gap-1 transition-colors"
      >
        <span className="text-slate-400">{label} :</span>
        <span className="font-medium">{current}</span>
        <ChevronDown size={10} className="text-slate-400" />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 min-w-[160px] bg-white rounded-md border border-slate-200 shadow-md z-30 py-1 max-h-60 overflow-y-auto">
          {options.map(o => (
            <button
              key={o.value}
              onClick={() => {
                onChange(o.value);
                setOpen(false);
              }}
              className={`w-full text-left px-2 py-1 text-[11.5px] flex items-center justify-between hover:bg-slate-50 ${
                o.value === value ? 'text-propsight-700 font-medium' : 'text-slate-700'
              }`}
            >
              {o.label}
              {o.value === value && <Check size={11} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export const FilterBar: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="px-3 py-1.5 border-b border-slate-200 bg-white flex items-center gap-1 flex-wrap flex-shrink-0">
    {children}
  </div>
);

/* ----------------------------------------------------------------- */
/* Confidence dots                                                    */
/* ----------------------------------------------------------------- */

export const ConfidenceDots: React.FC<{ level: ConfidenceLevel; size?: 'sm' | 'md' }> = ({ level, size = 'sm' }) => {
  const filled = level === 'tres_forte' ? 5 : level === 'forte' ? 4 : level === 'moyenne' ? 3 : 2;
  const dotSize = size === 'sm' ? 'h-1 w-1' : 'h-1.5 w-1.5';
  return (
    <div className="inline-flex items-center gap-0.5">
      {[0, 1, 2, 3, 4].map(i => (
        <span key={i} className={`${dotSize} rounded-full ${i < filled ? 'bg-propsight-500' : 'bg-slate-200'}`} />
      ))}
    </div>
  );
};

export const ConfidenceLabel: React.FC<{ level: ConfidenceLevel }> = ({ level }) => {
  const map: Record<ConfidenceLevel, string> = {
    faible: 'Confiance faible',
    moyenne: 'Confiance moyenne',
    forte: 'Confiance élevée',
    tres_forte: 'Confiance élevée',
  };
  return (
    <span className="inline-flex items-center gap-1 text-[9.5px] text-slate-500">
      {map[level]}
      <ConfidenceDots level={level} />
    </span>
  );
};

/* ----------------------------------------------------------------- */
/* KPI strip — compact                                                */
/* ----------------------------------------------------------------- */

export interface KpiItem {
  id: string;
  label: string;
  value: string;
  helper: string;
  trend?: 'up' | 'down' | 'flat';
  trend_label?: string;
  status?: 'positive' | 'neutral' | 'warning' | 'critical';
  confidence?: ConfidenceLevel;
  icon?: React.ReactNode;
  accent?: 'violet' | 'rose' | 'emerald' | 'amber';
}

const ACCENT_TO_VARIANT: Record<NonNullable<KpiItem['accent']>, KpiIconVariant> = {
  violet: 'violet',
  rose: 'rose',
  emerald: 'emerald',
  amber: 'amber',
};

export const KpiStrip: React.FC<{ kpis: KpiItem[] }> = ({ kpis }) => (
  <div className="grid grid-cols-4 gap-1.5 px-3 py-1.5 bg-slate-50 flex-shrink-0 border-b border-slate-200">
    {kpis.slice(0, 4).map(k => (
      <KpiCardPrimitive
        key={k.id}
        label={k.label}
        value={k.value}
        density="compact"
        icon={k.icon}
        iconVariant={ACCENT_TO_VARIANT[k.accent ?? 'violet']}
        iconLayout="left"
        labelSuffix={k.confidence ? <ConfidenceDots level={k.confidence} /> : undefined}
        trend={
          k.trend && k.trend_label
            ? { value: k.trend_label, direction: k.trend }
            : undefined
        }
        subtitle={k.helper}
      />
    ))}
  </div>
);

/* ----------------------------------------------------------------- */
/* Insight strip — À retenir                                          */
/* ----------------------------------------------------------------- */

export const InsightStrip: React.FC<{ items: string[]; title?: string }> = ({ items, title = 'À retenir' }) => (
  <Card>
    <div className="flex items-center gap-1.5 mb-1">
      <span className="inline-flex items-center justify-center h-3.5 w-3.5 rounded-full bg-propsight-100 text-propsight-600">
        <Check size={9} />
      </span>
      <h3 className="text-[11.5px] font-semibold text-slate-900">{title}</h3>
    </div>
    <ul className="space-y-0.5">
      {items.slice(0, 3).map((item, i) => (
        <li key={i} className="flex items-start gap-1.5 text-[11px] text-slate-700 leading-snug">
          <Check size={10} className="text-propsight-500 mt-0.5 flex-shrink-0" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  </Card>
);

/* ----------------------------------------------------------------- */
/* Card wrapper                                                       */
/* ----------------------------------------------------------------- */

export const Card: React.FC<{
  children: React.ReactNode;
  className?: string;
  title?: React.ReactNode;
  sources?: string;
  action?: React.ReactNode;
}> = ({ children, className = '', title, sources, action }) => (
  <div className={`bg-white rounded-md border border-slate-200 p-2 ${className}`}>
    {(title || sources || action) && (
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <div className="min-w-0">
          {title && <h3 className="text-[11.5px] font-semibold text-slate-900 leading-tight">{title}</h3>}
          {sources && <p className="text-[9.5px] text-slate-400 mt-0.5">Sources : {sources}</p>}
        </div>
        {action && <div className="flex-shrink-0">{action}</div>}
      </div>
    )}
    {children}
  </div>
);

/* ----------------------------------------------------------------- */
/* Tags / chips                                                       */
/* ----------------------------------------------------------------- */

export const Chip: React.FC<{
  children: React.ReactNode;
  color?: 'violet' | 'emerald' | 'amber' | 'rose' | 'slate' | 'sky';
}> = ({ children, color = 'slate' }) => {
  const map: Record<string, string> = {
    violet: 'bg-propsight-50 text-propsight-700 border-propsight-100',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    amber: 'bg-amber-50 text-amber-700 border-amber-100',
    rose: 'bg-rose-50 text-rose-700 border-rose-100',
    sky: 'bg-sky-50 text-sky-700 border-sky-100',
    slate: 'bg-slate-50 text-slate-700 border-slate-200',
  };
  return (
    <span className={`inline-flex items-center gap-1 h-[18px] px-1.5 rounded border text-[10px] font-medium ${map[color]}`}>
      {children}
    </span>
  );
};

/* ----------------------------------------------------------------- */
/* Source & confidence block                                          */
/* ----------------------------------------------------------------- */

export const SourceConfidence: React.FC<{
  items: { label: string; value: string }[];
  reasons: ConfidenceReason[];
  level: ConfidenceLevel;
}> = ({ items, reasons, level }) => (
  <Card title="Sources & fiabilité" action={<ConfidenceLabel level={level} />}>
    <div className="grid grid-cols-6 gap-1.5 mb-1.5">
      {items.map(it => (
        <div key={it.label} className="min-w-0">
          <div className="text-[9.5px] text-slate-400 truncate">{it.label}</div>
          <div className="text-[11px] font-medium text-slate-800 truncate">{it.value}</div>
        </div>
      ))}
    </div>
    <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 pt-1.5 border-t border-slate-100">
      {reasons.map(r => (
        <div key={r.label} className="flex items-start gap-1 text-[10.5px]">
          {r.status === 'positive' ? (
            <Check size={10} className="text-emerald-600 mt-0.5 flex-shrink-0" />
          ) : r.status === 'warning' ? (
            <AlertTriangle size={10} className="text-amber-600 mt-0.5 flex-shrink-0" />
          ) : (
            <Minus size={10} className="text-slate-400 mt-0.5 flex-shrink-0" />
          )}
          <span className="text-slate-600">
            <span className="font-medium text-slate-800">{r.label}</span>
            {r.detail && <span className="text-slate-500"> — {r.detail}</span>}
          </span>
        </div>
      ))}
    </div>
  </Card>
);

/* ----------------------------------------------------------------- */
/* Actions footer                                                     */
/* ----------------------------------------------------------------- */

export const ActionsFooter: React.FC<{ actions: { label: string; icon?: React.ReactNode }[] }> = ({ actions }) => (
  <div className="flex items-center gap-1 px-3 py-1.5 border-t border-slate-200 bg-white flex-shrink-0 overflow-x-auto">
    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mr-1.5 flex-shrink-0">Actions</span>
    {actions.map(a => (
      <button
        key={a.label}
        onClick={() => {
          // eslint-disable-next-line no-console
          console.log('Action :', a.label);
        }}
        className="h-6 px-2 rounded border border-slate-200 bg-white text-[10.5px] text-slate-700 hover:bg-propsight-50 hover:text-propsight-700 hover:border-propsight-200 inline-flex items-center gap-1 flex-shrink-0 transition-colors"
      >
        {a.icon}
        {a.label}
      </button>
    ))}
  </div>
);
