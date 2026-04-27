import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { DashboardPulseMarket, PulseIndicator, PulseScope } from '../types';
import PanelCard from './PanelCard';

const SCOPE_LABELS: Record<PulseScope, string> = {
  mon_portefeuille: 'Portefeuille',
  biens_suivis: 'Biens suivis',
  annonces_particuliers: 'Annonces particuliers',
  annonces_agences: 'Annonces agences',
  dvf_vendus: 'DVF vendus',
};

const INDICATOR_LABELS: Record<PulseIndicator, string> = {
  nouveaux: 'Nouv.',
  baisses_prix: 'Baisses',
  expires: 'Exp.',
  vendus: 'Vendus',
};

const SCOPE_ORDER: PulseScope[] = [
  'mon_portefeuille',
  'biens_suivis',
  'annonces_particuliers',
  'annonces_agences',
  'dvf_vendus',
];

const INDICATOR_ORDER: PulseIndicator[] = ['nouveaux', 'baisses_prix', 'expires', 'vendus'];

interface Props {
  pulse: DashboardPulseMarket;
}

const PulseMarketPanel: React.FC<Props> = ({ pulse }) => {
  const navigate = useNavigate();

  const grid = useMemo(() => {
    const map = new Map<string, (typeof pulse.cells)[number]>();
    pulse.cells.forEach(c => map.set(`${c.scope}:${c.indicator}`, c));
    return map;
  }, [pulse.cells]);

  return (
    <PanelCard
      title={`Pouls marché — ${pulse.zone_label}`}
      subtitle={`${pulse.synthese.volume_dvf_12m} DVF / 12m`}
      bodyClassName="flex flex-col overflow-auto"
    >
      <div className="flex-1 min-h-0 overflow-auto">
        <table className="w-full text-[11.5px] table-fixed">
          <thead>
            <tr className="text-left text-[10.5px] font-medium text-slate-500 border-b border-slate-100">
              <th className="pl-2.5 pr-1 py-1.5 w-[40%]"></th>
              {INDICATOR_ORDER.map(ind => (
                <th key={ind} className="px-1 py-1.5 text-right w-[15%]">
                  {INDICATOR_LABELS[ind]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {SCOPE_ORDER.map(scope => (
              <tr key={scope} className="hover:bg-slate-50/40 transition-colors">
                <td className="pl-2.5 pr-1 py-1 text-slate-700 text-[11.5px] font-medium truncate">
                  {SCOPE_LABELS[scope]}
                </td>
                {INDICATOR_ORDER.map(ind => {
                  const cell = grid.get(`${scope}:${ind}`);
                  const value = cell?.value;
                  const href = cell?.href || '';
                  const isClickable = value !== null && value !== undefined && href;
                  return (
                    <td key={ind} className="px-1 py-1 text-right">
                      {isClickable ? (
                        <button
                          type="button"
                          onClick={() => navigate(href)}
                          className="inline-flex items-center justify-end h-5 px-1 rounded text-[11.5px] font-semibold tabular-nums text-slate-900 hover:bg-propsight-50 hover:text-propsight-700 transition-colors"
                        >
                          {value}
                        </button>
                      ) : (
                        <span className="text-slate-300 text-[11.5px] tabular-nums">—</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex-shrink-0 px-2.5 py-1.5 border-t border-slate-100 flex items-center gap-2 text-[11px] flex-wrap">
        <span className="text-slate-900 font-semibold tabular-nums">
          {pulse.synthese.prix_median_m2.toLocaleString('fr-FR')} €/m²
        </span>
        <span className={`font-semibold tabular-nums ${pulse.synthese.evolution_12m_pct >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
          {pulse.synthese.evolution_12m_pct >= 0 ? '+' : ''}{pulse.synthese.evolution_12m_pct.toFixed(1)}%
        </span>
        <span className="inline-flex items-center h-[18px] px-1.5 rounded bg-rose-50 text-rose-700 text-[10.5px] font-medium border border-rose-100 ml-auto">
          {pulse.synthese.tension}
        </span>
      </div>
    </PanelCard>
  );
};

export default PulseMarketPanel;
