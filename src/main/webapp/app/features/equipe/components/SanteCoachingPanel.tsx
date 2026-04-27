import React, { useState } from 'react';
import { ArrowUpRight, EyeOff, Info, Zap } from 'lucide-react';
import { Chip, ProgressBar, StatusDot, Trend } from './primitives';
import type { AdoptionMetric, CoachingInsight, WatchItem } from '../types';

interface Props {
  watchItems: WatchItem[];
  adoptionMetrics: AdoptionMetric[];
  adoptionScore: number;
  coachingInsights: CoachingInsight[];
}

type Tab = 'surveiller' | 'adoption' | 'coaching';

const TABS: { key: Tab; label: string; badge?: number }[] = [
  { key: 'surveiller', label: 'À surveiller' },
  { key: 'adoption', label: 'Adoption' },
  { key: 'coaching', label: 'Coaching' },
];

const COLOR_DOT = {
  red: 'red' as const,
  orange: 'orange' as const,
  yellow: 'yellow' as const,
  grey: 'slate' as const,
};

const PRIO_TONE = {
  haute: 'red' as const,
  moyenne: 'orange' as const,
  basse: 'slate' as const,
};

const SanteCoachingPanel: React.FC<Props> = ({
  watchItems,
  adoptionMetrics,
  adoptionScore,
  coachingInsights,
}) => {
  const [tab, setTab] = useState<Tab>('surveiller');
  const [hidden, setHidden] = useState<Set<string>>(new Set());

  return (
    <div className="flex flex-col min-h-0 h-full bg-white border border-slate-200 rounded-md overflow-hidden">
      <div className="flex items-center justify-between px-3 pt-2 pb-0 border-b border-slate-200 flex-shrink-0">
        <h3 className="text-[12.5px] font-semibold text-slate-800">Santé & coaching</h3>
      </div>
      <div className="flex border-b border-slate-200 flex-shrink-0 px-2">
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`relative px-2.5 py-1.5 text-[11.5px] font-medium transition-colors ${
              tab === t.key
                ? 'text-propsight-700'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {t.label}
            {tab === t.key && (
              <span className="absolute bottom-0 left-2 right-2 h-[2px] bg-propsight-600 rounded-full" />
            )}
          </button>
        ))}
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto">
        {tab === 'surveiller' && (
          <div className="divide-y divide-slate-100">
            {watchItems
              .filter(w => !hidden.has(w.id))
              .slice(0, 8)
              .map(w => (
                <div key={w.id} className="group px-3 py-2 hover:bg-slate-50">
                  <div className="flex items-start gap-2">
                    <StatusDot tone={COLOR_DOT[w.color]} size={8} className="mt-1" />
                    <div className="flex-1 min-w-0">
                      <div className="text-[11.5px] font-semibold text-slate-800 leading-snug">
                        {w.title}
                      </div>
                      {w.subtitle && (
                        <div className="text-[10.5px] text-slate-500 mt-0.5">{w.subtitle}</div>
                      )}
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <a
                          href={w.cta_target}
                          className="inline-flex items-center gap-0.5 text-[10.5px] font-medium text-propsight-700 hover:text-propsight-800"
                        >
                          {w.cta_label}
                          <ArrowUpRight size={10} />
                        </a>
                        <button
                          onClick={() => setHidden(s => new Set(s).add(w.id))}
                          className="opacity-0 group-hover:opacity-100 text-[10px] text-slate-400 hover:text-slate-600 inline-flex items-center gap-0.5 transition-opacity"
                        >
                          <EyeOff size={9} />
                          Masquer 7 j
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            {watchItems.length > 8 && (
              <div className="px-3 py-2 text-center">
                <button className="text-[11px] text-propsight-700 hover:underline">
                  Voir tous ({watchItems.length})
                </button>
              </div>
            )}
            {watchItems.length === 0 && (
              <div className="p-4 text-center text-[11.5px] text-slate-500">
                Aucun blocage détecté.
                <br />
                Votre équipe est à jour sur les actions prioritaires.
              </div>
            )}
          </div>
        )}

        {tab === 'adoption' && (
          <div className="p-3 space-y-2.5">
            {adoptionMetrics.map(m => (
              <div key={m.id}>
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-[11px] text-slate-600">{m.label}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11.5px] font-semibold text-slate-800 tabular-nums">
                      {m.value}
                      {typeof m.total === 'number' && (
                        <span className="text-slate-400"> / {m.total}</span>
                      )}
                    </span>
                    {m.delta && <Trend trend={m.trend} text={m.delta} />}
                  </div>
                </div>
                {typeof m.pct === 'number' && <ProgressBar value={m.pct} tone="violet" height={4} />}
              </div>
            ))}
            <div className="mt-3 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-[11.5px] font-semibold text-slate-800">
                  Adoption score équipe
                </span>
                <span className="text-[13px] font-bold text-propsight-700 tabular-nums">
                  {adoptionScore} / 100
                </span>
              </div>
              <ProgressBar value={adoptionScore} tone="violet" height={5} className="mt-1" />
              <button className="mt-1.5 inline-flex items-center gap-0.5 text-[10.5px] text-propsight-600 hover:underline">
                <Info size={10} />
                Voir méthodologie
              </button>
            </div>
          </div>
        )}

        {tab === 'coaching' && (
          <div className="divide-y divide-slate-100">
            {coachingInsights.slice(0, 6).map(ins => (
              <div key={ins.insight_id} className="px-3 py-2">
                <div className="flex items-start gap-2">
                  <Zap size={12} className="text-propsight-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1 flex-wrap">
                      <span className="text-[11.5px] font-semibold text-slate-800">{ins.title}</span>
                      <Chip tone={PRIO_TONE[ins.priority]}>{ins.priority}</Chip>
                    </div>
                    <div className="text-[10.5px] text-slate-500 mt-0.5 leading-relaxed">
                      {ins.explanation}
                    </div>
                    <div className="text-[10.5px] text-propsight-600 mt-0.5">
                      → {ins.recommended_action}
                    </div>
                    <a
                      href={ins.cta_target}
                      className="mt-1 inline-flex items-center gap-0.5 text-[10.5px] font-medium text-propsight-700 hover:underline"
                    >
                      {ins.cta_label}
                      <ArrowUpRight size={10} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
            {coachingInsights.length === 0 && (
              <div className="p-4 text-center text-[11.5px] text-slate-500">
                Pas d’insight de coaching cette semaine.
                <br />
                Votre équipe fonctionne dans les normes.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SanteCoachingPanel;
