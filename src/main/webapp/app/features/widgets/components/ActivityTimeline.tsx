import React from 'react';
import { UserPlus, Code2, Settings, Eye, MessageCircle, Mail, CalendarCheck, Check, type LucideIcon } from 'lucide-react';
import type { ActivityEntry } from '../types';

interface Props {
  entries: ActivityEntry[];
  variant?: 'table' | 'timeline';
  showWidget?: boolean;
}

const TYPE_META: Record<ActivityEntry['type'], { label: string; Icon: LucideIcon; color: string }> = {
  lead_created: { label: 'Lead créé', Icon: UserPlus, color: 'text-propsight-600 bg-propsight-50' },
  code_copied: { label: 'Code copié', Icon: Code2, color: 'text-sky-600 bg-sky-50' },
  widget_updated: { label: 'Widget mis à jour', Icon: Settings, color: 'text-amber-600 bg-amber-50' },
  widget_viewed: { label: 'Widget consulté', Icon: Eye, color: 'text-slate-600 bg-slate-100' },
  whatsapp_prepared: { label: 'WhatsApp préparé', Icon: MessageCircle, color: 'text-emerald-600 bg-emerald-50' },
  email_sent: { label: 'Email envoyé', Icon: Mail, color: 'text-propsight-600 bg-propsight-50' },
  rdv_proposed: { label: 'RDV proposé', Icon: CalendarCheck, color: 'text-indigo-600 bg-indigo-50' },
};

const formatDateRelative = (iso: string): string => {
  const d = new Date(iso);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  const isSameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();
  const hh = d.getHours().toString().padStart(2, '0');
  const mm = d.getMinutes().toString().padStart(2, '0');
  if (isSameDay(d, today)) return `Aujourd'hui à ${hh}:${mm}`;
  if (isSameDay(d, yesterday)) return `Hier à ${hh}:${mm}`;
  const dd = d.getDate().toString().padStart(2, '0');
  const mo = (d.getMonth() + 1).toString().padStart(2, '0');
  return `${dd}/${mo} à ${hh}:${mm}`;
};

const formatTimeOnly = (iso: string): string => {
  const d = new Date(iso);
  return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
};

const widgetLabel = (w: ActivityEntry['widget']) =>
  w === 'estimation_vendeur' ? 'Widget estimation vendeur' : 'Widget projet investisseur';

const ActivityTimeline: React.FC<Props> = ({ entries, variant = 'table', showWidget = true }) => {
  if (variant === 'timeline') {
    return (
      <ol className="space-y-3">
        {entries.map(e => {
          const meta = TYPE_META[e.type];
          const Icon = meta.Icon;
          return (
            <li key={e.id} className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                <Check size={14} />
              </div>
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <Icon size={14} className="text-slate-400 flex-shrink-0" />
                <span className="text-sm text-slate-900 truncate">{e.label ?? meta.label}</span>
                <span className="text-xs text-slate-400 ml-auto flex-shrink-0">{e.user}</span>
                <span className="text-xs text-slate-400 tabular-nums flex-shrink-0">{formatTimeOnly(e.date)}</span>
              </div>
            </li>
          );
        })}
      </ol>
    );
  }

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="text-left text-xs text-slate-500 border-b border-slate-200">
          <th className="py-2 px-3 font-medium">Événement</th>
          {showWidget && <th className="py-2 px-3 font-medium">Widget</th>}
          <th className="py-2 px-3 font-medium">Utilisateur</th>
          <th className="py-2 px-3 font-medium">Date</th>
        </tr>
      </thead>
      <tbody>
        {entries.map(e => {
          const meta = TYPE_META[e.type];
          const Icon = meta.Icon;
          return (
            <tr key={e.id} className="border-b border-slate-100 hover:bg-slate-50/50">
              <td className="py-2.5 px-3">
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded flex items-center justify-center ${meta.color}`}>
                    <Icon size={13} />
                  </div>
                  <span className="text-slate-900">{meta.label}</span>
                </div>
              </td>
              {showWidget && <td className="py-2.5 px-3 text-slate-600">{widgetLabel(e.widget)}</td>}
              <td className="py-2.5 px-3 text-slate-600">{e.user}</td>
              <td className="py-2.5 px-3 text-slate-500 tabular-nums">{formatDateRelative(e.date)}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default ActivityTimeline;
