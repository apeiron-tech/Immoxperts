import React from 'react';
import { ExternalLink, MoreHorizontal } from 'lucide-react';
import { Opportunity } from '../../types';
import { formatPrice } from '../../utils/finances';
import ScoreCircle from '../../shared/ScoreCircle';
import { StatutOppBadge } from '../../shared/StatutBadge';
import { labelLocataire } from '../../utils/persona';
import { niveauCoherence } from '../../utils/scoring';

interface Props {
  opportunites: Opportunity[];
  selected: Set<string>;
  onToggleSelect: (id: string) => void;
  onToggleAll: () => void;
  onOpenAnalyse: (id: string) => void;
  onOpenDrawer: (id: string) => void;
}

const OpportunitesListe: React.FC<Props> = ({ opportunites, selected, onToggleSelect, onToggleAll, onOpenAnalyse, onOpenDrawer }) => {
  const allSelected = opportunites.length > 0 && opportunites.every(o => selected.has(o.opportunity_id));

  return (
    <div className="bg-white rounded-md border border-slate-200 overflow-hidden">
      <table className="w-full text-xs">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr className="text-left text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            <th className="w-8 px-3 py-2">
              <input type="checkbox" checked={allSelected} onChange={onToggleAll} className="rounded" />
            </th>
            <th className="px-3 py-2">Bien</th>
            <th className="px-3 py-2 text-right">Prix</th>
            <th className="px-3 py-2 text-right">Surface</th>
            <th className="px-3 py-2 text-right">Rendement net-net</th>
            <th className="px-3 py-2 text-right">Cash-flow / mois</th>
            <th className="px-3 py-2 text-center">Score</th>
            <th className="px-3 py-2">Profil cible</th>
            <th className="px-3 py-2">Cohérence projet</th>
            <th className="px-3 py-2">Statut</th>
            <th className="px-3 py-2 w-20">Actions</th>
          </tr>
        </thead>
        <tbody>
          {opportunites.map(opp => {
            const coherence = opp.score_breakdown.coherence_projet;
            const cohN = niveauCoherence(coherence);
            const rdtNetNet = ((opp.loyer_estime * 12 * 0.7) / opp.prix_affiche) * 100;
            const cashflow = Math.round(opp.loyer_estime * 0.15);
            return (
              <tr
                key={opp.opportunity_id}
                onClick={() => onOpenDrawer(opp.opportunity_id)}
                className={`border-b border-slate-100 hover:bg-slate-50 cursor-pointer ${selected.has(opp.opportunity_id) ? 'bg-propsight-50/40' : ''}`}
              >
                <td className="px-3 py-2" onClick={e => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={selected.has(opp.opportunity_id)}
                    onChange={() => onToggleSelect(opp.opportunity_id)}
                    className="rounded"
                  />
                </td>
                <td className="px-3 py-2">
                  <div className="flex items-center gap-2.5">
                    <img src={opp.bien.photo_url} alt="" className="w-10 h-10 rounded object-cover shrink-0" />
                    <div className="min-w-0">
                      <div className="font-medium text-slate-900 truncate">{opp.bien.adresse}</div>
                      <div className="text-[11px] text-slate-500">{opp.bien.code_postal} {opp.bien.ville}</div>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-2 text-right">
                  <div className="font-semibold text-slate-900 tabular-nums">{formatPrice(opp.prix_affiche)}</div>
                  <div className="text-[10px] text-slate-500 tabular-nums">{opp.prix_m2.toLocaleString('fr-FR')} €/m²</div>
                </td>
                <td className="px-3 py-2 text-right tabular-nums text-slate-700">{opp.bien.surface} m²</td>
                <td className="px-3 py-2 text-right tabular-nums font-medium text-slate-900">{rdtNetNet.toFixed(1)} %</td>
                <td className="px-3 py-2 text-right tabular-nums font-medium text-emerald-600">+{cashflow} €</td>
                <td className="px-3 py-2 text-center">
                  <div className="inline-flex">
                    <ScoreCircle score={opp.score_overall} size={34} showLabel={false} />
                  </div>
                </td>
                <td className="px-3 py-2">
                  <span className="inline-flex items-center rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] text-slate-700">
                    {labelLocataire(opp.profil_cible.type_dominant)}
                  </span>
                </td>
                <td className="px-3 py-2">
                  <span className={`inline-flex items-center rounded border px-1.5 py-0.5 text-[10px] font-medium ${cohN.color}`}>
                    {cohN.label}
                  </span>
                </td>
                <td className="px-3 py-2">
                  <StatutOppBadge status={opp.status} />
                </td>
                <td className="px-3 py-2" onClick={e => e.stopPropagation()}>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => onOpenAnalyse(opp.opportunity_id)}
                      title="Ouvrir l'analyse"
                      className="p-1 rounded hover:bg-slate-100 text-slate-500 hover:text-propsight-600"
                    >
                      <ExternalLink size={13} />
                    </button>
                    <button type="button" className="p-1 rounded hover:bg-slate-100 text-slate-500">
                      <MoreHorizontal size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {opportunites.length === 0 && (
        <div className="p-8 text-center text-sm text-slate-500">Aucune opportunité ne correspond à vos filtres.</div>
      )}
    </div>
  );
};

export default OpportunitesListe;
