import React from 'react';
import { Settings2 } from 'lucide-react';
import { Bien } from '../types';
import { formatEuros, formatEurosM2, formatDate, formatDateTime, typeBienLabel } from '../utils/format';
import StatutBadge from './StatutBadge';
import FavoriteButton from './FavoriteButton';
import SignauxBadge from './SignauxBadge';

interface Props {
  biens: Bien[];
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onToggleAll: () => void;
  onToggleFavorite: (id: string) => void;
  onRowClick: (b: Bien) => void;
  activeId?: string | null;
}

const TableBiens: React.FC<Props> = ({
  biens, selectedIds, onToggleSelect, onToggleAll, onToggleFavorite, onRowClick, activeId,
}) => {
  const allSelected = biens.length > 0 && biens.every(b => selectedIds.has(b.id));

  return (
    <div className="w-full bg-white rounded-lg border border-slate-200 overflow-hidden">
      <div className="overflow-auto max-h-full">
        <table className="w-full text-[12px]">
          <thead className="bg-slate-50 sticky top-0 z-10">
            <tr className="border-b border-slate-200">
              <th className="w-8 px-3 py-2 text-left">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={onToggleAll}
                  className="rounded accent-propsight-600"
                />
              </th>
              <th className="w-8 px-1 py-2"></th>
              <th className="text-left px-2 py-2 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Bien</th>
              <th className="text-left px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Adresse / Localisation</th>
              <th className="text-left px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Type</th>
              <th className="text-left px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">Surface ↓</th>
              <th className="text-left px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">↓ Statut</th>
              <th className="text-left px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">Propriétaire / Lead</th>
              <th className="text-left px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Estimation ↓</th>
              <th className="text-left px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">Prochaine action</th>
              <th className="text-left px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">Responsable ↓</th>
              <th className="text-left px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Signaux</th>
              <th className="text-left px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">Dernière MAJ</th>
              <th className="w-8 px-2 py-2">
                <button className="text-slate-400 hover:text-slate-600">
                  <Settings2 size={12} />
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {biens.map(bien => {
              const isActive = activeId === bien.id;
              const isSelected = selectedIds.has(bien.id);
              return (
                <tr
                  key={bien.id}
                  onClick={() => onRowClick(bien)}
                  className={`cursor-pointer border-b border-slate-100 transition-colors h-[52px] ${
                    isActive ? 'bg-propsight-50/60' : isSelected ? 'bg-propsight-50/30' : 'hover:bg-slate-50'
                  }`}
                >
                  <td className="px-3 py-2" onClick={e => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleSelect(bien.id)}
                      className="rounded accent-propsight-600"
                    />
                  </td>
                  <td className="px-1 py-2" onClick={e => e.stopPropagation()}>
                    <FavoriteButton active={bien.suivi} onToggle={() => onToggleFavorite(bien.id)} size="sm" variant="ghost" />
                  </td>
                  <td className="px-2 py-2">
                    <div className="w-10 h-10 rounded-md bg-slate-100 overflow-hidden flex-shrink-0">
                      <img src={bien.photo_principale} alt="" className="w-full h-full object-cover" />
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <div className="font-medium text-slate-900 truncate max-w-[180px]">{bien.adresse}</div>
                    <div className="text-[11px] text-slate-500">{bien.code_postal} {bien.ville}</div>
                  </td>
                  <td className="px-3 py-2 text-slate-700">{typeBienLabel(bien.type)}</td>
                  <td className="px-3 py-2 tabular-nums text-slate-700">{bien.surface_m2} m²</td>
                  <td className="px-3 py-2"><StatutBadge statut={bien.statut_commercial} /></td>
                  <td className="px-3 py-2">
                    <div className="text-slate-900">{bien.proprietaire_nom || '—'}</div>
                    {bien.proprietaire_lead_ref && (
                      <div className="text-[11px] text-slate-500">{bien.proprietaire_lead_ref}</div>
                    )}
                  </td>
                  <td className="px-3 py-2">
                    {bien.avm ? (
                      <>
                        <div className="text-slate-900 font-semibold tabular-nums">{formatEuros(bien.avm.prix_estime, true)}</div>
                        <div className="text-[11px] text-slate-500 tabular-nums">{formatEurosM2(bien.avm.prix_estime / bien.surface_m2)}</div>
                      </>
                    ) : <span className="text-slate-400">—</span>}
                  </td>
                  <td className="px-3 py-2">
                    {bien.prochaine_action ? (
                      <>
                        <div className="text-slate-900">{bien.prochaine_action.libelle}</div>
                        <div className="text-[11px] text-slate-500 tabular-nums">{formatDate(bien.prochaine_action.date)}</div>
                      </>
                    ) : <span className="text-slate-400">—</span>}
                  </td>
                  <td className="px-3 py-2">
                    {bien.responsable_nom ? (
                      <div className="flex items-center gap-2">
                        <img src={bien.responsable_avatar || ''} alt="" className="w-5 h-5 rounded-full object-cover" />
                        <span className="text-slate-700">{bien.responsable_nom}</span>
                      </div>
                    ) : <span className="text-slate-400">—</span>}
                  </td>
                  <td className="px-3 py-2"><SignauxBadge signaux={bien.signaux} /></td>
                  <td className="px-3 py-2 text-[11px] text-slate-500 tabular-nums whitespace-nowrap">
                    <div>{formatDate(bien.derniere_maj)}</div>
                    <div className="text-slate-400">{new Date(bien.derniere_maj).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</div>
                  </td>
                  <td className="px-2 py-2"></td>
                </tr>
              );
            })}
            {biens.length === 0 && (
              <tr>
                <td colSpan={14} className="px-6 py-16 text-center text-slate-400 text-sm">
                  Aucun bien ne correspond aux filtres.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableBiens;
