import React from 'react';
import {
  ArrowRight,
  CheckCircle2,
  EyeOff,
  Layers,
  Building2,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Bell,
  Home,
  FileText,
  Eye,
  MoreHorizontal,
} from 'lucide-react';
import {
  NotifStatusIcon,
  NotifPriorityBadge,
  NotifStatusBadge,
  FreshnessLabel,
} from '../components/shared/primitives';
import { NotificationVeille, NotificationSourceType } from '../types';

interface Props {
  notification: NotificationVeille;
  active: boolean;
  selected: boolean;
  onSelectChange: (v: boolean) => void;
  onClick: () => void;
  onMarkDone: () => void;
  onIgnore: () => void;
}

const SOURCE_ICON: Record<NotificationSourceType, React.ReactNode> = {
  alerte: <Bell size={13} />,
  bien_suivi: <Home size={13} />,
  observatoire: <Layers size={13} />,
  prospection: <Eye size={13} />,
  investissement: <TrendingUp size={13} />,
  agence_concurrente: <Building2 size={13} />,
  estimation: <FileText size={13} />,
  rapport: <FileText size={13} />,
  system: <AlertTriangle size={13} />,
};

const SOURCE_BG: Record<NotificationSourceType, string> = {
  alerte: 'bg-propsight-100 text-propsight-600',
  bien_suivi: 'bg-rose-100 text-rose-600',
  observatoire: 'bg-sky-100 text-sky-600',
  prospection: 'bg-fuchsia-100 text-fuchsia-600',
  investissement: 'bg-emerald-100 text-emerald-600',
  agence_concurrente: 'bg-amber-100 text-amber-600',
  estimation: 'bg-indigo-100 text-indigo-600',
  rapport: 'bg-indigo-100 text-indigo-600',
  system: 'bg-slate-100 text-slate-600',
};

const NotificationRow: React.FC<Props> = ({
  notification: n,
  active,
  selected,
  onSelectChange,
  onClick,
  onMarkDone,
  onIgnore,
}) => {
  const meta = n.metadata;
  const variationPct = typeof meta.variation_pct === 'number' ? meta.variation_pct : undefined;
  const TrendIcon = variationPct !== undefined ? (variationPct < 0 ? TrendingDown : TrendingUp) : null;
  const unreadTint = n.status === 'unread' ? 'bg-white' : 'bg-white/60';
  const isIgnored = n.status === 'ignored';

  return (
    <button
      onClick={onClick}
      className={`relative w-full text-left rounded-md border px-3 py-2 transition-colors group ${
        active ? 'border-propsight-300 ring-1 ring-propsight-200 bg-propsight-50/40' : 'border-slate-200 hover:border-slate-300'
      } ${unreadTint} ${isIgnored ? 'opacity-60' : ''}`}
    >
      {/* Unread left accent */}
      {n.status === 'unread' && <span className="absolute left-0 top-2 bottom-2 w-0.5 bg-propsight-500 rounded-r" />}

      <div className="flex items-start gap-2.5">
        {/* Checkbox + status */}
        <div className="flex items-center gap-2 flex-shrink-0 pt-0.5">
          <label
            className="inline-flex items-center cursor-pointer"
            onClick={e => e.stopPropagation()}
          >
            <input
              type="checkbox"
              checked={selected}
              onChange={e => onSelectChange(e.target.checked)}
              className="h-3.5 w-3.5 rounded border-slate-300 text-propsight-600 focus:ring-propsight-300"
            />
          </label>
          <NotifStatusIcon status={n.status} />
        </div>

        {/* Source icon */}
        <div
          className={`h-8 w-8 rounded-md flex items-center justify-center flex-shrink-0 ${SOURCE_BG[n.source_type]}`}
        >
          {SOURCE_ICON[n.source_type]}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-1.5 flex-wrap min-w-0">
              <NotifPriorityBadge priority={n.priority} />
              <span className="text-[13px] font-semibold text-slate-900 truncate">{n.title}</span>
              {n.is_aggregated && (
                <span className="text-[10px] font-semibold text-propsight-700 bg-propsight-50 ring-1 ring-propsight-200 px-1.5 py-0.5 rounded">
                  Agrégé ·{n.aggregate_count}
                </span>
              )}
            </div>
            <FreshnessLabel iso={n.event_at} />
          </div>

          <p className="text-[11.5px] text-slate-600 mt-0.5 line-clamp-1">{n.message}</p>

          <div className="mt-1.5 flex items-start justify-between gap-3">
            <div className="flex items-start gap-1 text-[11px] text-slate-500 line-clamp-1 min-w-0">
              <AlertTriangle size={10} className="text-amber-500 mt-0.5 flex-shrink-0" />
              <span className="truncate">
                <span className="text-slate-700 font-medium">Impact : </span>
                {n.business_impact}
              </span>
            </div>
            <NotifStatusBadge status={n.status} />
          </div>

          {/* Actions inline */}
          <div className="mt-2 flex items-center gap-2 flex-wrap">
            {variationPct !== undefined && TrendIcon && (
              <span
                className={`inline-flex items-center gap-0.5 text-[10.5px] font-semibold ${
                  variationPct < 0 ? 'text-rose-600' : 'text-emerald-600'
                }`}
              >
                <TrendIcon size={10} />
                {variationPct > 0 ? '+' : ''}
                {variationPct.toFixed(1)} %
              </span>
            )}
            <button
              onClick={e => {
                e.stopPropagation();
                onClick();
              }}
              className="h-6 px-2 rounded bg-propsight-600 text-white text-[10.5px] font-medium hover:bg-propsight-700 inline-flex items-center gap-1"
            >
              Ouvrir
              <ArrowRight size={10} />
            </button>
            {n.status !== 'done' && (
              <button
                onClick={e => {
                  e.stopPropagation();
                  onMarkDone();
                }}
                className="h-6 px-2 rounded border border-slate-200 bg-white text-[10.5px] text-slate-700 hover:bg-slate-50 inline-flex items-center gap-1"
              >
                <CheckCircle2 size={10} />
                Traité
              </button>
            )}
            {n.status !== 'ignored' && (
              <button
                onClick={e => {
                  e.stopPropagation();
                  onIgnore();
                }}
                className="h-6 px-2 rounded text-[10.5px] text-slate-500 hover:bg-slate-100 inline-flex items-center gap-1"
              >
                <EyeOff size={10} />
                Ignorer
              </button>
            )}
            <button
              onClick={e => e.stopPropagation()}
              className="h-6 w-6 inline-flex items-center justify-center rounded hover:bg-slate-100 text-slate-400 ml-auto"
            >
              <MoreHorizontal size={12} />
            </button>
          </div>
        </div>
      </div>
    </button>
  );
};

export default NotificationRow;
