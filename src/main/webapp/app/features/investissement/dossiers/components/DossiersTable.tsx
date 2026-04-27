import React from 'react';
import { MoreHorizontal, FolderOpen } from 'lucide-react';
import { DossierInvestissement } from '../../types';
import { formatPrice, formatSigned, formatPct } from '../../utils/finances';
import { StatutDossierBadge } from '../../shared/StatutBadge';
import ScoreCircle from '../../shared/ScoreCircle';
import { labelRegime, labelStrategy } from '../../utils/persona';

interface Props {
  dossiers: DossierInvestissement[];
  onOpen: (id: string) => void;
}

const DossiersTable: React.FC<Props> = ({ dossiers, onOpen }) => {
  return (
    <div className="bg-white rounded-md border border-slate-200 overflow-hidden">
      <table className="w-full text-xs">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr className="text-left text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            <th className="w-8 px-3 py-2"><input type="checkbox" /></th>
            <th className="px-3 py-2">Dossier</th>
            <th className="px-3 py-2">Ville / Bien retenu</th>
            <th className="px-3 py-2">Stratégie</th>
            <th className="px-3 py-2">Régime</th>
            <th className="px-3 py-2 text-right">Cash-flow ATF</th>
            <th className="px-3 py-2 text-right">Net-net</th>
            <th className="px-3 py-2 text-center">Score</th>
            <th className="px-3 py-2">Statut / Activité</th>
            <th className="px-3 py-2 w-20">Actions</th>
          </tr>
        </thead>
        <tbody>
          {dossiers.map(d => (
            <tr key={d.dossier_id} onClick={() => onOpen(d.dossier_id)} className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer">
              <td className="px-3 py-2" onClick={e => e.stopPropagation()}>
                <input type="checkbox" />
              </td>
              <td className="px-3 py-2">
                <div className="flex items-center gap-2.5">
                  <img src={d.photo_url} alt="" className="w-9 h-9 rounded object-cover shrink-0" />
                  <div>
                    <div className="font-medium text-slate-900">{d.title}</div>
                    <div className="text-[11px] text-slate-500">v{d.version} · {d.auteur_nom}</div>
                  </div>
                </div>
              </td>
              <td className="px-3 py-2">
                <div className="text-slate-900">{d.ville}</div>
                <div className="text-[10px] text-slate-500">{d.bien_label}</div>
              </td>
              <td className="px-3 py-2">
                <span className="inline-flex items-center rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px]">
                  {labelStrategy(d.strategy)}
                </span>
              </td>
              <td className="px-3 py-2 text-slate-700">{labelRegime(d.regime_principal)}</td>
              <td className={`px-3 py-2 text-right tabular-nums font-medium ${d.kpis.cashflow_atf >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {formatSigned(d.kpis.cashflow_atf, '€')}
              </td>
              <td className="px-3 py-2 text-right tabular-nums font-medium text-slate-900">{formatPct(d.kpis.rendement_net_net)}</td>
              <td className="px-3 py-2 text-center">
                {d.kpis.score > 0 ? (
                  <div className="inline-flex"><ScoreCircle score={d.kpis.score} size={32} showLabel={false} /></div>
                ) : (
                  <span className="text-slate-400 text-[10px]">—</span>
                )}
              </td>
              <td className="px-3 py-2">
                <StatutDossierBadge status={d.status} />
                <div className="text-[10px] text-slate-500 mt-0.5">MAJ {new Date(d.updated_at).toLocaleDateString('fr-FR')}</div>
              </td>
              <td className="px-3 py-2" onClick={e => e.stopPropagation()}>
                <div className="flex items-center gap-1">
                  <button type="button" onClick={() => onOpen(d.dossier_id)} className="p-1 rounded hover:bg-slate-100 text-slate-500 hover:text-propsight-600">
                    <FolderOpen size={13} />
                  </button>
                  <button type="button" className="p-1 rounded hover:bg-slate-100 text-slate-500">
                    <MoreHorizontal size={13} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {dossiers.length === 0 && (
            <tr>
              <td colSpan={10} className="text-center py-8 text-sm text-slate-500">Aucun dossier ne correspond aux filtres.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DossiersTable;
