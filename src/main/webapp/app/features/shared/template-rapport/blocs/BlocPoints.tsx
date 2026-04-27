import React from 'react';
import { Plus, Minus } from 'lucide-react';
import { BlocComponentProps } from '../types';

const BlocPoints: React.FC<BlocComponentProps> = ({ data, blocConfig }) => {
  const { estimation } = data;
  const forts = (blocConfig.customContent?.points_forts as string[]) || estimation.bien.points_forts || [];
  const defendre = (blocConfig.customContent?.points_defendre as string[]) || estimation.bien.points_defendre || [];

  return (
    <div className="rapport-bloc rapport-points px-10 py-8">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-propsight-600 mb-4">Points forts et points à défendre</h2>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-lg border border-emerald-200 bg-emerald-50/40 p-4">
          <h3 className="text-sm font-semibold text-emerald-700 mb-3 flex items-center gap-2">
            <Plus size={14} className="text-emerald-600" /> Points forts
          </h3>
          {forts.length === 0 ? (
            <p className="text-xs text-emerald-600/60 italic">Aucun point fort identifié</p>
          ) : (
            <ul className="space-y-2">
              {forts.map((p, i) => (
                <li key={i} className="text-sm text-slate-700 flex gap-2">
                  <span className="text-emerald-600 mt-0.5">✓</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-lg border border-amber-200 bg-amber-50/40 p-4">
          <h3 className="text-sm font-semibold text-amber-700 mb-3 flex items-center gap-2">
            <Minus size={14} className="text-amber-600" /> Points à défendre
          </h3>
          {defendre.length === 0 ? (
            <p className="text-xs text-amber-600/60 italic">Aucun point à défendre</p>
          ) : (
            <ul className="space-y-2">
              {defendre.map((p, i) => (
                <li key={i} className="text-sm text-slate-700 flex gap-2">
                  <span className="text-amber-600 mt-0.5">!</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlocPoints;
