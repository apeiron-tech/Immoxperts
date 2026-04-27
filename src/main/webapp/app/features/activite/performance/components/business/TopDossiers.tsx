import React from 'react';
import { TOP_DOSSIERS } from '../../_mocks/performance';

const TopDossiers: React.FC = () => (
  <section className="bg-white border border-slate-200 rounded h-full flex flex-col">
    <header className="px-2 py-1 border-b border-slate-200 flex-shrink-0">
      <h3 className="text-[11px] font-semibold text-slate-900">Top dossiers en cours</h3>
    </header>
    <div className="flex-1 overflow-hidden">
      <table className="w-full text-[10px]">
        <thead>
          <tr className="border-b border-slate-100 text-left bg-slate-50/50">
            <th className="px-2 py-1 text-[9px] font-semibold text-slate-500 uppercase tracking-wider">Dossier</th>
            <th className="px-2 py-1 text-[9px] font-semibold text-slate-500 uppercase tracking-wider text-right">Proba.</th>
            <th className="px-2 py-1 text-[9px] font-semibold text-slate-500 uppercase tracking-wider text-right">CA pondéré</th>
            <th className="px-2 py-1 text-[9px] font-semibold text-slate-500 uppercase tracking-wider text-right">Échéance</th>
          </tr>
        </thead>
        <tbody>
          {TOP_DOSSIERS.map(d => (
            <tr
              key={d.dossier}
              onClick={() => console.warn('[Performance] Dossier clic', d.dossier)}
              className="border-b border-slate-50 last:border-b-0 hover:bg-slate-50 cursor-pointer transition-colors"
            >
              <td className="px-2 py-1 text-slate-900 font-medium truncate max-w-[100px]">{d.dossier}</td>
              <td className="px-2 py-1 text-slate-700 text-right tabular-nums">{d.probabilite}%</td>
              <td className="px-2 py-1 text-slate-900 font-medium text-right tabular-nums">{(d.caPondere / 1000).toFixed(0)} k€</td>
              <td className="px-2 py-1 text-slate-500 text-right">{d.echeance}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>
);

export default TopDossiers;
