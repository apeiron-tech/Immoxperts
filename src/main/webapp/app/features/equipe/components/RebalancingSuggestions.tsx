import React from 'react';
import { Sparkles, Users, Calendar, AlertTriangle } from 'lucide-react';
import { SecondaryButton } from './primitives';
import type { RebalancingSuggestion, AgendaOverdueAction } from '../types';

const ICON_BY_TYPE = {
  charge: Users,
  creneaux: Calendar,
  leads_unassigned: Users,
  retards: AlertTriangle,
};

const TONE_BG = {
  violet: 'bg-propsight-50 text-propsight-600',
  blue: 'bg-blue-50 text-blue-600',
  orange: 'bg-amber-50 text-amber-600',
  red: 'bg-rose-50 text-rose-600',
};

interface Props {
  suggestions: RebalancingSuggestion[];
  overdue: AgendaOverdueAction[];
}

const RebalancingSuggestions: React.FC<Props> = ({ suggestions, overdue }) => (
  <div className="flex flex-col min-h-0 h-full bg-white border border-slate-200 rounded-md overflow-hidden">
    <div className="flex items-center justify-between px-3 py-2 border-b border-slate-200 flex-shrink-0">
      <div className="flex items-center gap-1.5">
        <Sparkles size={12} className="text-propsight-600" />
        <h3 className="text-[12.5px] font-semibold text-slate-800">Actions en retard</h3>
      </div>
      <button className="text-[10.5px] text-propsight-700 hover:underline">Voir tout</button>
    </div>

    <div className="border-b border-slate-200">
      {overdue.map(a => (
        <div key={a.id} className="flex items-center gap-2 px-3 py-1.5 hover:bg-slate-50">
          <div className="flex-shrink-0 w-5 h-5 rounded-md bg-rose-50 flex items-center justify-center">
            <AlertTriangle size={11} className="text-rose-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[11.5px] font-semibold text-slate-800 truncate">{a.label}</div>
            <div className="text-[10px] text-slate-500">
              {a.collaborator_label} · Depuis {a.retard_days} j
            </div>
          </div>
          <SecondaryButton size="sm">{a.cta_label}</SecondaryButton>
        </div>
      ))}
    </div>

    <div className="flex items-center justify-between px-3 py-2 border-b border-slate-200 flex-shrink-0">
      <h3 className="text-[12.5px] font-semibold text-slate-800">Suggestions de rééquilibrage</h3>
      <button className="text-[10.5px] text-propsight-700 hover:underline">Voir tout</button>
    </div>

    <div className="flex-1 min-h-0 overflow-y-auto">
      {suggestions.map(s => {
        const Icon = ICON_BY_TYPE[s.type];
        return (
          <div key={s.id} className="flex items-start gap-2 px-3 py-2 border-b border-slate-100 hover:bg-slate-50">
            <div className={`flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center ${TONE_BG[s.tone]}`}>
              <Icon size={12} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[11.5px] font-semibold text-slate-800 leading-snug">{s.title}</div>
              <div className="text-[10.5px] text-slate-500 mt-0.5">{s.explanation}</div>
            </div>
            <SecondaryButton size="sm">{s.cta_label}</SecondaryButton>
          </div>
        );
      })}
    </div>
  </div>
);

export default RebalancingSuggestions;
