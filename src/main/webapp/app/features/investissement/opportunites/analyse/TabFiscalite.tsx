import React from 'react';
import { Star } from 'lucide-react';
import { ScenarioInvest, FiscalRegime } from '../../types';
import { formatSigned, formatPct, formatPrice, recomputeScenario } from '../../utils/finances';
import { labelRegime } from '../../utils/persona';

const TabFiscalite: React.FC<{ scenario: ScenarioInvest }> = ({ scenario }) => {
  const REGIMES_REELS: FiscalRegime[] = ['micro_foncier', 'reel_foncier', 'lmnp_micro', 'lmnp_reel'];
  const REGIMES_MOCK: FiscalRegime[] = ['lmp', 'sci_ir', 'sci_is', 'courte_duree'];

  const compute = (regime: FiscalRegime) => recomputeScenario({ ...scenario, fiscal_regime: regime });
  const byRegime = REGIMES_REELS.map(r => ({ r, s: compute(r) }));
  const best = byRegime.reduce((a, b) => (b.s.results.rendement_net_net > a.s.results.rendement_net_net ? b : a));

  const r = scenario.results;

  return (
    <div className="grid grid-cols-3 gap-3">
      {/* ATF */}
      <div className="col-span-3 grid grid-cols-4 gap-3 mb-1">
        <Atf label="Cash-flow après impôt" value={formatSigned(r.cashflow_apres_impot_mensuel, '€/mois')} positive={r.cashflow_apres_impot_mensuel >= 0} />
        <Atf label="Rendement net-net" value={formatPct(r.rendement_net_net)} />
        <Atf label="Impôt annuel estimé" value={formatPrice(r.impot_annuel)} />
        <div className="rounded-md border border-propsight-200 bg-propsight-50 p-3">
          <div className="text-[10px] uppercase tracking-wide text-propsight-600">Recommandation</div>
          <div className="text-sm font-semibold text-propsight-700 mt-0.5">{labelRegime(best.r)}</div>
        </div>
      </div>

      {/* Cadrage fiscal */}
      <div className="col-span-2 rounded-md border border-slate-200 bg-white p-4">
        <h3 className="text-xs font-semibold text-slate-900 mb-3">Cadrage fiscal du projet</h3>
        <div className="grid grid-cols-3 gap-3 text-xs">
          <Kv label="Régime actif" value={labelRegime(scenario.fiscal_regime)} />
          <Kv label="Structure" value={scenario.holding_structure === 'nom_propre' ? 'Nom propre' : scenario.holding_structure.toUpperCase()} />
          <Kv label="TMI" value={`${scenario.tmi}%`} />
          <Kv label="Parts fiscales" value={String(scenario.nombre_parts)} />
          <Kv label="Millésime" value={String(scenario.millesime_fiscal)} />
          <Kv label="Horizon" value={`${scenario.assumptions.horizon_annees} ans`} />
        </div>
      </div>

      {/* Recommandation Propsight */}
      <div className="rounded-md border border-slate-200 bg-white p-4">
        <h3 className="text-xs font-semibold text-slate-900 mb-3">Pourquoi ce régime</h3>
        <p className="text-xs text-slate-700 mb-2">
          <strong>{labelRegime(best.r)}</strong> offre le meilleur compromis rendement/simplicité pour ce scénario.
        </p>
        <ul className="space-y-1 text-xs text-slate-600">
          <li>• Optimisation des amortissements</li>
          <li>• Cash-flow après impôt positif</li>
          <li>• Sortie à 10 ans avec plus-value favorable</li>
        </ul>
      </div>

      {/* Matrice comparative */}
      <div className="col-span-3 rounded-md border border-slate-200 bg-white p-4">
        <h3 className="text-xs font-semibold text-slate-900 mb-3">Matrice des régimes fiscaux V1</h3>
        <table className="w-full text-xs">
          <thead className="text-[10px] uppercase tracking-wider text-slate-500">
            <tr className="border-b border-slate-100">
              <th className="text-left py-2">Régime</th>
              <th className="text-right">Impôt annuel</th>
              <th className="text-right">Cash-flow ATF</th>
              <th className="text-right">Net-net</th>
              <th className="text-right">TRI 10 ans</th>
              <th className="text-center">Complexité</th>
              <th className="text-center">Pertinence</th>
            </tr>
          </thead>
          <tbody>
            {byRegime.map(({ r: regime, s }) => {
              const isBest = regime === best.r;
              return (
                <tr key={regime} className={`border-b border-slate-50 ${isBest ? 'bg-propsight-50/40' : ''}`}>
                  <td className="py-2 font-medium">
                    <div className="flex items-center gap-1.5">
                      {isBest && <Star size={11} className="text-propsight-600 fill-propsight-600" />}
                      {labelRegime(regime)}
                    </div>
                  </td>
                  <td className="text-right tabular-nums">{s.results.impot_annuel.toLocaleString('fr-FR')} €</td>
                  <td className={`text-right tabular-nums font-medium ${s.results.cashflow_apres_impot_mensuel >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {s.results.cashflow_apres_impot_mensuel >= 0 ? '+' : ''}{s.results.cashflow_apres_impot_mensuel} €
                  </td>
                  <td className="text-right tabular-nums font-medium">{formatPct(s.results.rendement_net_net)}</td>
                  <td className="text-right tabular-nums">{formatPct(s.results.tri_10_ans)}</td>
                  <td className="text-center text-[10px]">{regime.includes('reel') ? 'Moyen' : 'Simple'}</td>
                  <td className="text-center text-[10px]">{isBest ? 'Excellent' : 'Bon'}</td>
                </tr>
              );
            })}
            {REGIMES_MOCK.map(regime => (
              <tr key={regime} className="border-b border-slate-50 text-slate-400 italic">
                <td className="py-2 font-medium">{labelRegime(regime)}</td>
                <td colSpan={6} className="text-right text-[10px]">Calcul à venir (V1.1)</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Atf: React.FC<{ label: string; value: string; positive?: boolean }> = ({ label, value, positive }) => (
  <div className="rounded-md border border-slate-200 bg-white p-3">
    <div className="text-[10px] uppercase tracking-wide text-slate-500">{label}</div>
    <div className={`text-base font-semibold tabular-nums mt-0.5 ${positive === true ? 'text-emerald-600' : positive === false ? 'text-rose-600' : 'text-slate-900'}`}>{value}</div>
  </div>
);

const Kv: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div>
    <div className="text-[10px] uppercase tracking-wide text-slate-500">{label}</div>
    <div className="font-medium text-slate-900">{value}</div>
  </div>
);

export default TabFiscalite;
