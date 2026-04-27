import React, { useState } from 'react';
import { Sparkles, Info } from 'lucide-react';
import { AVMResult } from '../types';
import { formatEuros } from '../utils/format';

interface Props {
  avm: AVMResult | null;
  type?: 'prix' | 'loyer';
  compact?: boolean;
}

const AVMBadge: React.FC<Props> = ({ avm, type = 'prix', compact = false }) => {
  const [tooltip, setTooltip] = useState(false);

  if (!avm) {
    return <span className="text-xs text-slate-400">—</span>;
  }

  const value = type === 'prix' ? avm.prix_estime : avm.loyer_estime;
  const low = type === 'prix' ? avm.fourchette_basse : avm.loyer_fourchette?.[0];
  const high = type === 'prix' ? avm.fourchette_haute : avm.loyer_fourchette?.[1];

  if (value == null) return <span className="text-xs text-slate-400">—</span>;

  const score = avm.score_confiance;
  const scoreColor = score >= 80 ? 'text-green-600 bg-green-50' : score >= 60 ? 'text-amber-600 bg-amber-50' : 'text-red-500 bg-red-50';

  if (compact) {
    return (
      <div
        className="relative inline-flex items-center gap-1"
        onMouseEnter={() => setTooltip(true)}
        onMouseLeave={() => setTooltip(false)}
      >
        <span className={`inline-flex items-center gap-1 h-5 px-1.5 rounded text-[11px] font-semibold ${scoreColor}`}>
          <Sparkles size={10} />
          {score}
        </span>
        {tooltip && avm.features_contributives.length > 0 && (
          <div className="absolute bottom-full right-0 mb-2 w-64 bg-slate-900 text-white rounded-md shadow-lg p-3 text-[11px] z-50">
            <div className="font-semibold mb-2 flex items-center gap-1.5">
              <Sparkles size={11} /> AVM — Potentiel {score}%
            </div>
            <div className="text-slate-300 mb-1">Estimation : <span className="text-white font-semibold">{formatEuros(value, true)}</span></div>
            {low && high && <div className="text-slate-400 mb-2">Fourchette : {formatEuros(low, true)} – {formatEuros(high, true)}</div>}
            <div className="border-t border-slate-700 pt-2 space-y-1">
              {avm.features_contributives.map((f, i) => (
                <div key={i} className="flex items-center justify-between gap-2">
                  <span className="text-slate-300 truncate">{f.feature}</span>
                  <span className={f.impact === 'positif' ? 'text-green-400 font-medium' : 'text-red-400 font-medium'}>
                    {f.impact === 'positif' ? '+' : ''}{(f.poids * 100).toFixed(0)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative inline-flex flex-col gap-0.5" onMouseEnter={() => setTooltip(true)} onMouseLeave={() => setTooltip(false)}>
      <div className="flex items-center gap-1.5">
        <span className="text-sm font-semibold text-slate-900 tabular-nums">{formatEuros(value, true)}</span>
        <span className={`inline-flex items-center gap-0.5 h-4 px-1 rounded text-[10px] font-semibold ${scoreColor}`}>
          <Sparkles size={8} />
          {score}
        </span>
        <Info size={10} className="text-slate-300" />
      </div>
      {low && high && (
        <div className="text-[11px] text-slate-500 tabular-nums">{formatEuros(low, true)} – {formatEuros(high, true)}</div>
      )}
      {tooltip && avm.features_contributives.length > 0 && (
        <div className="absolute bottom-full left-0 mb-2 w-72 bg-slate-900 text-white rounded-md shadow-lg p-3 text-[11px] z-50">
          <div className="font-semibold mb-2 flex items-center gap-1.5">
            <Sparkles size={11} /> AVM {type === 'prix' ? 'vente' : 'loyer'} — Confiance {score}%
          </div>
          <div className="border-t border-slate-700 pt-2 space-y-1">
            <div className="text-slate-400 text-[10px] mb-1">Top features contributives</div>
            {avm.features_contributives.map((f, i) => (
              <div key={i} className="flex items-center justify-between gap-2">
                <span className="text-slate-300 truncate">{f.feature}</span>
                <span className={f.impact === 'positif' ? 'text-green-400 font-medium' : 'text-red-400 font-medium'}>
                  {f.impact === 'positif' ? '+' : ''}{(f.poids * 100).toFixed(0)}%
                </span>
              </div>
            ))}
            <div className="text-slate-400 text-[10px] pt-1">Basé sur {avm.comparables_utilises.length} comparables DVF</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AVMBadge;
