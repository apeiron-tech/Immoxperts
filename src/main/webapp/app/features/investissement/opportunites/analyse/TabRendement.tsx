import React from 'react';
import { ScenarioInvest } from '../../types';
import { formatSigned, formatPct, formatEuro } from '../../utils/finances';
import { MOCK_BENCHMARK } from '../../_mocks/benchmarkPlacements';

const TabRendement: React.FC<{ scenario: ScenarioInvest }> = ({ scenario }) => {
  const r = scenario.results;
  const a = scenario.assumptions;
  return (
    <div className="grid grid-cols-3 gap-3">
      {/* ATF */}
      <div className="col-span-3 grid grid-cols-4 gap-3 mb-1">
        <Atf label="Cash-flow avant impôt" value={formatSigned(r.cashflow_avant_impot_mensuel, '€/mois')} positive={r.cashflow_avant_impot_mensuel >= 0} />
        <Atf label="Rendement net" value={formatPct(r.rendement_net)} />
        <Atf label="Cash-on-cash" value={formatPct(r.cash_on_cash)} />
        <div className="rounded-md border border-slate-200 bg-white p-3">
          <div className="text-[10px] uppercase tracking-wide text-slate-500">Thèse</div>
          <div className="text-sm font-semibold text-emerald-700 mt-0.5">Cash-flow positif</div>
        </div>
      </div>

      {/* Décomposition cashflow */}
      <div className="col-span-2 rounded-md border border-slate-200 bg-white p-4">
        <h3 className="text-xs font-semibold text-slate-900 mb-3">Décomposition mensuelle du cash-flow</h3>
        <div className="space-y-1.5">
          <Line label="Loyers collectés HC" value={`+${a.loyer_mensuel_hc.toLocaleString('fr-FR')} €`} color="text-emerald-600" />
          <Line label="Vacance estimée" value={`−${Math.round((a.loyer_mensuel_hc * a.vacance_mois_par_an) / 12)} €`} color="text-rose-600" />
          <Line label="Charges non récupérables" value={`−${a.charges_non_recup} €`} color="text-rose-600" />
          <Line label="Taxe foncière (mensualisée)" value={`−${Math.round(a.taxe_fonciere / 12)} €`} color="text-rose-600" />
          <Line label="GLI / gestion" value={`−${Math.round((a.loyer_mensuel_hc * (a.gli_pct + a.gestion_locative_pct)) / 100)} €`} color="text-rose-600" />
          <Line label="Mensualité crédit" value={`−${r.mensualite.toLocaleString('fr-FR')} €`} color="text-rose-600" />
          <div className="border-t border-slate-200 pt-2 mt-1 flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-900">Cash-flow avant impôt</span>
            <span className={`text-sm font-bold ${r.cashflow_avant_impot_mensuel >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              {formatSigned(r.cashflow_avant_impot_mensuel, '€/mois')}
            </span>
          </div>
        </div>
      </div>

      {/* Rendements détaillés */}
      <div className="rounded-md border border-slate-200 bg-white p-4">
        <h3 className="text-xs font-semibold text-slate-900 mb-3">Rendements</h3>
        <div className="space-y-2.5 text-xs">
          <Kv label="Brut" value={formatPct(r.rendement_brut)} />
          <Kv label="Net" value={formatPct(r.rendement_net)} />
          <Kv label="Net-net" value={formatPct(r.rendement_net_net)} strong />
          <Kv label="Cash-on-cash" value={formatPct(r.cash_on_cash)} />
          <Kv label="TRI 10 ans" value={formatPct(r.tri_10_ans)} />
          <Kv label="DSCR" value={r.dscr.toFixed(2)} />
        </div>
      </div>

      {/* Paramètres éditables */}
      <div className="col-span-2 rounded-md border border-slate-200 bg-white p-4">
        <h3 className="text-xs font-semibold text-slate-900 mb-3">Paramètres d'exploitation</h3>
        <div className="grid grid-cols-3 gap-3 text-xs">
          <Param label="Loyer mensuel HC" value={`${a.loyer_mensuel_hc} €`} />
          <Param label="Vacance" value={`${a.vacance_mois_par_an} mois/an`} />
          <Param label="Charges non récup." value={`${a.charges_non_recup} €/mois`} />
          <Param label="Taxe foncière" value={`${a.taxe_fonciere} €/an`} />
          <Param label="GLI" value={`${a.gli_pct}%`} />
          <Param label="Gestion" value={`${a.gestion_locative_pct}%`} />
          <Param label="Revalo. loyer" value={`${a.revalorisation_loyer_annuelle}%/an`} />
          <Param label="Revalo. prix" value={`${a.revalorisation_prix_annuelle}%/an`} />
          <Param label="Horizon" value={`${a.horizon_annees} ans`} />
        </div>
        <p className="mt-3 text-[10px] text-slate-400 italic">En démo, les paramètres sont en lecture seule.</p>
      </div>

      {/* Benchmark placements */}
      <div className="rounded-md border border-slate-200 bg-white p-4">
        <h3 className="text-xs font-semibold text-slate-900 mb-3">Benchmark placements</h3>
        <table className="w-full text-xs">
          <thead className="text-[10px] uppercase text-slate-500">
            <tr className="border-b border-slate-100">
              <th className="text-left py-1">Placement</th>
              <th className="text-right">Rendement</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_BENCHMARK.map(b => (
              <tr key={b.placement} className="border-b border-slate-50 last:border-0">
                <td className="py-1 text-slate-700">{b.placement}</td>
                <td className="text-right tabular-nums">{b.rendement}%</td>
              </tr>
            ))}
            <tr className="border-t-2 border-propsight-200 bg-propsight-50/40">
              <td className="py-1.5 font-semibold text-propsight-700">Ce bien (net)</td>
              <td className="text-right font-bold text-propsight-700 tabular-nums">{formatPct(r.rendement_net)}</td>
            </tr>
          </tbody>
        </table>
        <p className="mt-2 text-[10px] text-slate-400 italic">Comparaison pédagogique, non contractuelle.</p>
      </div>

      {/* Projection simple */}
      <div className="col-span-3 rounded-md border border-slate-200 bg-white p-4">
        <h3 className="text-xs font-semibold text-slate-900 mb-3">Projection simple à 10 ans</h3>
        <div className="grid grid-cols-4 gap-3 text-xs">
          <Kpi label="Cash-flow cumulé" value={formatEuro(r.cashflow_apres_impot_mensuel * 12 * 10)} />
          <Kpi label="Valeur à 10 ans" value={formatEuro(a.prix_achat * Math.pow(1 + a.revalorisation_prix_annuelle / 100, 10))} />
          <Kpi label="Capital remboursé" value={formatEuro(scenario.financing.montant_emprunte * 0.35)} />
          <Kpi label="Patrimoine net" value={formatEuro(r.patrimoine_net_10ans)} />
        </div>
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

const Line: React.FC<{ label: string; value: string; color?: string }> = ({ label, value, color = 'text-slate-900' }) => (
  <div className="flex items-center justify-between text-xs">
    <span className="text-slate-600">{label}</span>
    <span className={`tabular-nums font-medium ${color}`}>{value}</span>
  </div>
);

const Kv: React.FC<{ label: string; value: string; strong?: boolean }> = ({ label, value, strong }) => (
  <div className="flex items-center justify-between">
    <span className="text-slate-600">{label}</span>
    <span className={`tabular-nums ${strong ? 'text-base font-semibold text-propsight-700' : 'font-medium text-slate-900'}`}>{value}</span>
  </div>
);

const Param: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div>
    <div className="text-[10px] uppercase tracking-wide text-slate-500">{label}</div>
    <div className="font-medium text-slate-900">{value}</div>
  </div>
);

const Kpi: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="rounded-md bg-slate-50 p-2.5">
    <div className="text-[10px] uppercase tracking-wide text-slate-500">{label}</div>
    <div className="text-sm font-semibold text-slate-900 tabular-nums">{value}</div>
  </div>
);

export default TabRendement;
