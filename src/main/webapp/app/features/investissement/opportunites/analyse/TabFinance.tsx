import React from 'react';
import { ScenarioInvest } from '../../types';
import { formatPrice, formatPct, computeMensualite, recomputeScenario } from '../../utils/finances';

const TabFinance: React.FC<{ scenario: ScenarioInvest }> = ({ scenario }) => {
  const r = scenario.results;
  const f = scenario.financing;

  // Scénarios comparatifs 10%/20%/30% apport
  const variantes = [0.1, 0.2, 0.3].map(apportPct => {
    const apport = scenario.assumptions.prix_achat * apportPct;
    const emprunte = scenario.assumptions.prix_achat + scenario.assumptions.frais_acquisition - apport;
    const mens = computeMensualite(emprunte, f.taux, f.duree_annees, f.assurance_taux);
    const variant = recomputeScenario({
      ...scenario,
      financing: { ...f, apport, montant_emprunte: emprunte },
    });
    return { apportPct, apport, mens, variant };
  });

  const verdict = r.dscr >= 1.2 ? { label: 'Finançable confort', color: 'text-emerald-700' } : r.dscr >= 1 ? { label: 'Tendu', color: 'text-amber-700' } : { label: 'À revoir', color: 'text-rose-700' };

  return (
    <div className="grid grid-cols-3 gap-3">
      {/* ATF */}
      <div className="col-span-3 grid grid-cols-4 gap-3 mb-1">
        <Atf label="Apport requis" value={formatPrice(f.apport)} />
        <Atf label="Mensualité" value={`${r.mensualite.toLocaleString('fr-FR')} €/mois`} />
        <Atf label="DSCR" value={r.dscr.toFixed(2)} />
        <div className="rounded-md border border-slate-200 bg-white p-3">
          <div className="text-[10px] uppercase tracking-wide text-slate-500">Verdict bancabilité</div>
          <div className={`text-sm font-semibold mt-0.5 ${verdict.color}`}>{verdict.label}</div>
        </div>
      </div>

      {/* Structure coût total */}
      <div className="col-span-2 rounded-md border border-slate-200 bg-white p-4">
        <h3 className="text-xs font-semibold text-slate-900 mb-3">Structure du projet</h3>
        <div className="space-y-1.5 text-xs">
          <Line label="Prix d'acquisition" value={formatPrice(scenario.assumptions.prix_achat)} />
          <Line label="Frais de notaire & acquisition" value={formatPrice(scenario.assumptions.frais_acquisition)} />
          <Line label="Travaux" value={formatPrice(scenario.assumptions.travaux)} />
          <Line label="Ameublement" value={formatPrice(scenario.assumptions.ameublement)} />
          <Line label="Frais bancaires" value={formatPrice(f.frais_bancaires)} />
          <div className="border-t border-slate-200 pt-2 mt-1">
            <Line label="Coût total projet" value={formatPrice(r.prix_total_projet)} strong />
          </div>
        </div>
      </div>

      {/* Paramètres financement */}
      <div className="rounded-md border border-slate-200 bg-white p-4">
        <h3 className="text-xs font-semibold text-slate-900 mb-3">Paramètres de financement</h3>
        <div className="space-y-1.5 text-xs">
          <Kv label="Apport" value={formatPrice(f.apport)} />
          <Kv label="Montant emprunté" value={formatPrice(f.montant_emprunte)} />
          <Kv label="Taux" value={`${f.taux}%`} />
          <Kv label="Durée" value={`${f.duree_annees} ans`} />
          <Kv label="Assurance" value={`${f.assurance_taux}%`} />
          <Kv label="Différé" value={`${f.differe_mois} mois`} />
        </div>
      </div>

      {/* Scénarios de financement */}
      <div className="col-span-3 rounded-md border border-slate-200 bg-white p-4">
        <h3 className="text-xs font-semibold text-slate-900 mb-3">Comparaison 3 montages financiers</h3>
        <div className="grid grid-cols-3 gap-3">
          {variantes.map((v, i) => (
            <div key={i} className={`rounded-md border p-3 ${i === 1 ? 'border-propsight-300 bg-propsight-50/30' : 'border-slate-200'}`}>
              <div className="text-[10px] uppercase tracking-wide text-slate-500">Apport {Math.round(v.apportPct * 100)}%</div>
              <div className="text-sm font-semibold text-slate-900 mt-1">{formatPrice(v.apport)}</div>
              <div className="mt-3 space-y-1 text-xs">
                <Kv label="Mensualité" value={`${Math.round(v.mens)} €`} />
                <Kv label="DSCR" value={v.variant.results.dscr.toFixed(2)} />
                <Kv label="Cash-flow" value={`${v.variant.results.cashflow_apres_impot_mensuel >= 0 ? '+' : ''}${v.variant.results.cashflow_apres_impot_mensuel} €`} />
                <Kv label="Cash-on-cash" value={formatPct(v.variant.results.cash_on_cash)} />
                <Kv label="TRI 10 ans" value={formatPct(v.variant.results.tri_10_ans)} />
              </div>
              <button type="button" className="mt-3 w-full text-xs font-medium rounded-md border border-slate-200 py-1.5 hover:bg-slate-50">
                Appliquer
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Atf: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="rounded-md border border-slate-200 bg-white p-3">
    <div className="text-[10px] uppercase tracking-wide text-slate-500">{label}</div>
    <div className="text-base font-semibold text-slate-900 tabular-nums mt-0.5">{value}</div>
  </div>
);

const Line: React.FC<{ label: string; value: string; strong?: boolean }> = ({ label, value, strong }) => (
  <div className="flex items-center justify-between">
    <span className={strong ? 'text-sm font-semibold text-slate-900' : 'text-slate-600'}>{label}</span>
    <span className={`tabular-nums ${strong ? 'text-sm font-bold text-propsight-700' : 'font-medium text-slate-900'}`}>{value}</span>
  </div>
);

const Kv: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex items-center justify-between">
    <span className="text-slate-600">{label}</span>
    <span className="tabular-nums font-medium text-slate-900">{value}</span>
  </div>
);

export default TabFinance;
