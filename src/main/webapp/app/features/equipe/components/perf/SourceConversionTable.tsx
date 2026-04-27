import React from 'react';
import { formatEuro } from '../primitives';
import type { SourceConversionRow } from '../../types';

interface Props {
  rows: SourceConversionRow[];
}

const SourceConversionTable: React.FC<Props> = ({ rows }) => {
  const total = rows.reduce(
    (acc, r) => ({
      leads: acc.leads + r.leads,
      rapports: acc.rapports + r.rapports,
      mandats: acc.mandats + r.mandats,
      ca: acc.ca + r.ca_genere,
    }),
    { leads: 0, rapports: 0, mandats: 0, ca: 0 },
  );

  return (
    <div className="flex flex-col min-h-0 h-full">
      <div className="flex items-center justify-between mb-1.5">
        <div className="text-[11.5px] font-semibold text-slate-800">Conversion par source (30 j)</div>
        <button className="text-[10.5px] text-propsight-700 hover:underline">Voir tout</button>
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto border border-slate-200 rounded-md">
        <div
          className="grid items-center px-2 py-1 border-b border-slate-200 bg-slate-50 text-[9.5px] font-semibold text-slate-500 uppercase tracking-wider"
          style={{ gridTemplateColumns: 'minmax(120px,1.4fr) 60px 80px 70px 70px 90px' }}
        >
          <span>Source</span>
          <span className="text-right">Leads</span>
          <span className="text-right">Qualif.</span>
          <span className="text-right">Rapports</span>
          <span className="text-right">Mandats</span>
          <span className="text-right">CA généré</span>
        </div>
        {rows.map(r => (
          <div
            key={r.source}
            className="grid items-center px-2 py-1 border-b border-slate-100 text-[11px]"
            style={{ gridTemplateColumns: 'minmax(120px,1.4fr) 60px 80px 70px 70px 90px' }}
          >
            <span className="text-slate-800 font-medium truncate">{r.source}</span>
            <span className="text-right text-slate-700 tabular-nums">{r.leads}</span>
            <span
              className={`text-right tabular-nums ${
                r.qualif_pct >= 50 ? 'text-emerald-600' : 'text-slate-700'
              }`}
            >
              {r.qualif_pct} %
            </span>
            <span className="text-right text-slate-700 tabular-nums">{r.rapports}</span>
            <span className="text-right text-slate-700 tabular-nums">{r.mandats}</span>
            <span className="text-right text-slate-800 tabular-nums font-semibold">
              {formatEuro(r.ca_genere)}
            </span>
          </div>
        ))}
        <div
          className="grid items-center px-2 py-1.5 bg-slate-50 text-[11px] font-semibold"
          style={{ gridTemplateColumns: 'minmax(120px,1.4fr) 60px 80px 70px 70px 90px' }}
        >
          <span className="text-slate-800">Total</span>
          <span className="text-right tabular-nums text-slate-800">{total.leads.toLocaleString('fr-FR')}</span>
          <span className="text-right tabular-nums text-propsight-700">38 %</span>
          <span className="text-right tabular-nums text-slate-800">{total.rapports}</span>
          <span className="text-right tabular-nums text-slate-800">{total.mandats}</span>
          <span className="text-right tabular-nums text-propsight-700">{formatEuro(total.ca)}</span>
        </div>
      </div>
    </div>
  );
};

export default SourceConversionTable;
