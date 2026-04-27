import React, { useState } from 'react';
import { ChevronDown, ChevronUp, MoreHorizontal } from 'lucide-react';
import { Lead, StageMeta } from '../types';
import { MEMBRES, STAGES } from '../_mocks/leads';

interface Props {
  leads: Lead[];
  onLeadClick: (l: Lead) => void;
}

type SortKey = 'nom' | 'commission' | 'age' | null;
type SortDir = 'asc' | 'desc';

const COLS: { key: string; label: string; sort?: SortKey }[] = [
  { key: 'check',     label: '' },
  { key: 'nom',       label: 'Nom',           sort: 'nom' },
  { key: 'source',    label: 'Source' },
  { key: 'intention', label: 'Intention' },
  { key: 'stage',     label: 'Stage' },
  { key: 'bien',      label: 'Bien' },
  { key: 'commission',label: 'Commission',   sort: 'commission' },
  { key: 'proprio',   label: 'Propriétaire' },
  { key: 'derniere',  label: 'Dernière',     sort: 'age' },
  { key: 'menu',      label: '' },
];

const stageById = (id: string): StageMeta | undefined => STAGES.find(s => s.id === id);

const TableView: React.FC<Props> = ({ leads, onLeadClick }) => {
  const [sortKey, setSortKey] = useState<SortKey>(null);
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const handleSort = (key: SortKey) => {
    if (!key) return;
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key); setSortDir('asc');
    }
  };

  const sorted = [...leads].sort((a, b) => {
    if (!sortKey) return 0;
    let av: string | number = 0; let bv: string | number = 0;
    if (sortKey === 'nom') { av = a.nom; bv = b.nom; }
    if (sortKey === 'commission') { av = a.commission || 0; bv = b.commission || 0; }
    if (sortKey === 'age') { av = a.age; bv = b.age; }
    if (av < bv) return sortDir === 'asc' ? -1 : 1;
    if (av > bv) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  const toggleSelect = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === leads.length) setSelected(new Set());
    else setSelected(new Set(leads.map(l => l.lead_id)));
  };

  return (
    <div className="flex-1 min-h-0 overflow-auto bg-white border border-slate-200 rounded-md mx-3 mb-3">
      <table className="w-full text-[12px]">
        <thead className="sticky top-0 bg-slate-50 border-b border-slate-200">
          <tr>
            {COLS.map(c => (
              <th
                key={c.key}
                onClick={() => c.sort && handleSort(c.sort)}
                className={`text-left px-2.5 py-2 text-[10px] font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap ${c.sort ? 'cursor-pointer hover:text-slate-900' : ''}`}
              >
                {c.key === 'check' ? (
                  <input type="checkbox" checked={selected.size === leads.length && leads.length > 0} onChange={toggleAll} className="accent-propsight-600" />
                ) : (
                  <span className="inline-flex items-center gap-0.5">
                    {c.label}
                    {sortKey === c.sort && (sortDir === 'asc' ? <ChevronUp size={10} /> : <ChevronDown size={10} />)}
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map(lead => {
            const stage = stageById(lead.stage);
            const proprio = MEMBRES.find(m => m.id === lead.proprietaire);
            return (
              <tr
                key={lead.lead_id}
                onClick={() => onLeadClick(lead)}
                className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors"
              >
                <td className="px-2.5 py-1.5" onClick={e => e.stopPropagation()}>
                  <input type="checkbox" checked={selected.has(lead.lead_id)} onChange={() => toggleSelect(lead.lead_id)} className="accent-propsight-600" />
                </td>
                <td className="px-2.5 py-1.5">
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-[9px] font-semibold flex-shrink-0">{lead.initiales}</div>
                    <span className="font-medium text-slate-900">{lead.nom}</span>
                  </div>
                </td>
                <td className="px-2.5 py-1.5 text-slate-600 capitalize">{lead.source}</td>
                <td className="px-2.5 py-1.5">
                  <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 capitalize">{lead.intention}</span>
                </td>
                <td className="px-2.5 py-1.5">
                  {stage && (
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${stage.headerBg} ${stage.textColor}`}>{stage.label}</span>
                  )}
                </td>
                <td className="px-2.5 py-1.5 text-slate-600 truncate max-w-[200px]" title={lead.adresse}>
                  <p className="truncate">{lead.adresse}</p>
                  {lead.prix !== null && <p className="text-[10px] text-slate-400 tabular-nums">{lead.prix.toLocaleString('fr-FR')} €</p>}
                </td>
                <td className="px-2.5 py-1.5 text-slate-900 font-medium tabular-nums">
                  {lead.commission !== null ? `${lead.commission.toLocaleString('fr-FR')} €` : '—'}
                </td>
                <td className="px-2.5 py-1.5 text-slate-600">{proprio?.nom || '—'}</td>
                <td className="px-2.5 py-1.5 text-slate-500 text-[11px]">{lead.age}</td>
                <td className="px-2.5 py-1.5 text-right" onClick={e => e.stopPropagation()}>
                  <button
                    type="button"
                    onClick={() => console.warn('[Leads] Menu ligne', lead.lead_id)}
                    className="p-0.5 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                  >
                    <MoreHorizontal size={13} />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {selected.size > 0 && (
        <div className="sticky bottom-0 left-0 right-0 bg-slate-900 text-white px-3 py-1.5 text-[11px] flex items-center gap-3">
          <span className="font-semibold">{selected.size} sélectionné{selected.size > 1 ? 's' : ''}</span>
          <button className="hover:underline">Changer stage</button>
          <button className="hover:underline">Réassigner</button>
          <button className="hover:underline">Ajouter tag</button>
          <button className="hover:underline">Exporter</button>
          <button className="hover:underline">Archiver</button>
          <button className="hover:underline text-red-300">Supprimer</button>
          <button onClick={() => setSelected(new Set())} className="ml-auto hover:underline">Annuler</button>
        </div>
      )}
    </div>
  );
};

export default TableView;
