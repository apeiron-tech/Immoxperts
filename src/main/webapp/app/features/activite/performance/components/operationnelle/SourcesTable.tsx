import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SOURCES } from '../../_mocks/performance';

const SourcesTable: React.FC = () => {
  const navigate = useNavigate();
  return (
    <section className="bg-white border border-slate-200 rounded h-full flex flex-col">
      <header className="px-2 py-1 border-b border-slate-200 flex-shrink-0">
        <h3 className="text-[11px] font-semibold text-slate-900">Sources</h3>
      </header>
      <div className="flex-1 overflow-hidden">
        <table className="w-full text-[10px]">
          <thead>
            <tr className="border-b border-slate-100 text-left bg-slate-50/50">
              <th className="px-2 py-1 text-[9px] font-semibold text-slate-500 uppercase tracking-wider">Source</th>
              <th className="px-2 py-1 text-[9px] font-semibold text-slate-500 uppercase tracking-wider text-right">Leads</th>
              <th className="px-2 py-1 text-[9px] font-semibold text-slate-500 uppercase tracking-wider text-right">Conv.</th>
              <th className="px-2 py-1 text-[9px] font-semibold text-slate-500 uppercase tracking-wider text-right">CA</th>
            </tr>
          </thead>
          <tbody>
            {SOURCES.map(s => (
              <tr
                key={s.source}
                onClick={() => navigate(s.href)}
                className="border-b border-slate-50 last:border-b-0 hover:bg-slate-50 cursor-pointer transition-colors"
              >
                <td className="px-2 py-1 text-slate-900 font-medium truncate">{s.source}</td>
                <td className="px-2 py-1 text-slate-700 text-right tabular-nums">{s.leads}</td>
                <td className="px-2 py-1 text-slate-700 text-right tabular-nums">{s.tauxConv}%</td>
                <td className="px-2 py-1 text-slate-900 font-medium text-right tabular-nums">{(s.caGenere / 1000).toFixed(0)} k€</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default SourcesTable;
