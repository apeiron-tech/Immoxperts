import React from 'react';
import { Opportunity } from '../../types';
import ProfilLocataireCard from '../../shared/ProfilLocataireCard';
import { labelTension } from '../../utils/persona';
import { MOCK_VILLES } from '../../_mocks/villes';

const TabVilleMarche: React.FC<{ opp: Opportunity }> = ({ opp }) => {
  const ville = MOCK_VILLES.find(v => opp.bien.ville.toLowerCase().includes(v.nom.toLowerCase())) ?? MOCK_VILLES[0];
  return (
    <div className="grid grid-cols-3 gap-3">
      <div className="col-span-3 grid grid-cols-4 gap-3 mb-1">
        <Atf label="Prix m² zone" value={`${ville.prix_m2_median.toLocaleString('fr-FR')} €/m²`} />
        <Atf label="Loyer m² zone" value={`${ville.loyer_m2_median.toFixed(1)} €/m²`} />
        <Atf label="Tension locative" value={labelTension(ville.tension)} />
        <div className="rounded-md border border-slate-200 bg-white p-3">
          <div className="text-[10px] uppercase tracking-wide text-slate-500">Verdict marché</div>
          <div className="text-sm font-semibold text-emerald-700 mt-0.5">Très porteur</div>
        </div>
      </div>

      <div className="col-span-3">
        <ProfilLocataireCard profil={opp.profil_cible} />
      </div>

      {/* Snapshot marché */}
      <div className="col-span-2 rounded-md border border-slate-200 bg-white p-4">
        <h3 className="text-xs font-semibold text-slate-900 mb-3">Snapshot marché local</h3>
        <div className="grid grid-cols-3 gap-3 text-xs">
          <MetricBlock label="Prix médian m²" value={`${ville.prix_m2_median.toLocaleString('fr-FR')} €`} evo={`+${ville.evol_prix_5a}% / 5 ans`} />
          <MetricBlock label="Loyer médian m²" value={`${ville.loyer_m2_median.toFixed(1)} €`} evo={`+${ville.evol_loyers_5a}% / 5 ans`} />
          <MetricBlock label="Rendement médian" value={`${ville.rendement_median}%`} evo={`Vacance ${ville.vacance_pct}%`} />
          <MetricBlock label="Part CSP+" value={`${ville.part_csp_plus}%`} evo="IRIS" />
          <MetricBlock label="Avis habitants" value={`${ville.avis_note}/5`} evo="Bon ressenti" />
          <MetricBlock label="Signal PLU" value={ville.signal_plu === 'favorable' ? 'Favorable' : ville.signal_plu} evo="Urbanisme" />
        </div>
      </div>

      {/* Positionnement */}
      <div className="rounded-md border border-slate-200 bg-white p-4">
        <h3 className="text-xs font-semibold text-slate-900 mb-3">Positionnement du bien</h3>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-600">Prix bien vs marché</span>
            <span className="font-semibold text-emerald-600">-2,5% (décote légère)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Loyer cible vs marché</span>
            <span className="font-semibold text-slate-900">+1% (cohérent)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Percentile</span>
            <span className="font-semibold text-slate-900">40e</span>
          </div>
          <div className="pt-2 border-t border-slate-100 flex justify-between">
            <span className="text-slate-600">Liquidité revente</span>
            <span className="font-semibold text-emerald-600">Bonne</span>
          </div>
        </div>
      </div>

      {/* Zones alternatives */}
      <div className="col-span-3 rounded-md border border-slate-200 bg-white p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-semibold text-slate-900">Zones alternatives</h3>
          <button type="button" className="text-xs text-propsight-700 hover:text-propsight-800 font-medium">Comparer ces zones →</button>
        </div>
        <table className="w-full text-xs">
          <thead className="text-[10px] uppercase text-slate-500">
            <tr className="border-b border-slate-100">
              <th className="text-left py-1.5">Zone</th>
              <th className="text-right">Prix m²</th>
              <th className="text-right">Loyer m²</th>
              <th className="text-right">Rendement</th>
              <th className="text-right">Tension</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_VILLES.slice(1, 4).map(v => (
              <tr key={v.id} className="border-b border-slate-50 last:border-0">
                <td className="py-1.5 font-medium text-slate-900">{v.nom}</td>
                <td className="text-right tabular-nums">{v.prix_m2_median.toLocaleString('fr-FR')} €</td>
                <td className="text-right tabular-nums">{v.loyer_m2_median.toFixed(1)} €</td>
                <td className="text-right tabular-nums">{v.rendement_median}%</td>
                <td className="text-right">{labelTension(v.tension)}</td>
              </tr>
            ))}
          </tbody>
        </table>
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

const MetricBlock: React.FC<{ label: string; value: string; evo: string }> = ({ label, value, evo }) => (
  <div className="rounded border border-slate-100 p-2">
    <div className="text-[10px] uppercase tracking-wide text-slate-500">{label}</div>
    <div className="text-sm font-semibold text-slate-900 tabular-nums">{value}</div>
    <div className="text-[10px] text-slate-500">{evo}</div>
  </div>
);

export default TabVilleMarche;
