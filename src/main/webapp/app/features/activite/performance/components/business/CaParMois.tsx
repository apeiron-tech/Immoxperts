import React from 'react';
import { CA_MONTHS, OBJECTIF_MENSUEL } from '../../_mocks/performance';

const CHART_HEIGHT = 100;

const CaParMois: React.FC = () => {
  const max = Math.max(OBJECTIF_MENSUEL, ...CA_MONTHS.map(m => m.ca));
  const objY = ((max - OBJECTIF_MENSUEL) / max) * CHART_HEIGHT;

  return (
    <section className="bg-white border border-slate-200 rounded h-full flex flex-col">
      <header className="flex items-center justify-between px-2 py-1 border-b border-slate-200 flex-shrink-0">
        <h3 className="text-[11px] font-semibold text-slate-900">CA par mois</h3>
        <div className="flex items-center gap-2 text-[9px] text-slate-500">
          <span className="inline-flex items-center gap-0.5">
            <span className="w-1.5 h-1.5 rounded-sm bg-propsight-500" />Réalisé
          </span>
          <span className="inline-flex items-center gap-0.5">
            <span className="w-2.5 border-t border-dashed border-propsight-400" />Objectif
          </span>
        </div>
      </header>

      <div className="px-2 py-2 flex-1">
        <div className="relative grid grid-cols-12 gap-1" style={{ height: CHART_HEIGHT }}>
          <div
            className="absolute left-0 right-0 border-t border-dashed border-propsight-400 z-10 pointer-events-none"
            style={{ top: objY }}
            title={`Objectif ${OBJECTIF_MENSUEL.toLocaleString('fr-FR')} €`}
          />
          {CA_MONTHS.map(m => {
            const h = (m.ca / max) * CHART_HEIGHT;
            return (
              <div key={m.label} className="flex flex-col justify-end items-stretch min-w-0">
                <div
                  className="rounded-sm"
                  style={{ height: h, backgroundColor: m.current ? '#7c3aed' : '#a78bfa' }}
                  title={`${m.label} · ${m.ca.toLocaleString('fr-FR')} €`}
                />
              </div>
            );
          })}
        </div>
        <div className="grid grid-cols-12 gap-1 mt-1">
          {CA_MONTHS.map(m => (
            <span key={m.label} className={`text-[9px] text-center tabular-nums ${m.current ? 'text-propsight-700 font-semibold' : 'text-slate-500'}`}>
              {m.label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CaParMois;
