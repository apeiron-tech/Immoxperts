import React from 'react';
import { ACTIVITE_DAYS, ACTIVITE_TYPES } from '../../_mocks/performance';

const CHART_HEIGHT = 90;

const ActivitePersonnelle: React.FC = () => {
  const totals = ACTIVITE_DAYS.map(d => d.appel + d.email + d.rdv + d.visite + d.relance);
  const max = Math.max(...totals);

  return (
    <section className="bg-white border border-slate-200 rounded h-full flex flex-col">
      <header className="flex items-center justify-between px-2 py-1 border-b border-slate-200 flex-shrink-0 gap-2">
        <h3 className="text-[11px] font-semibold text-slate-900 flex-shrink-0">Activité personnelle</h3>
        <div className="flex items-center gap-1.5 flex-wrap min-w-0">
          {ACTIVITE_TYPES.map(t => (
            <span key={t.id} className="inline-flex items-center gap-0.5 text-[9px] text-slate-600">
              <span className="w-1.5 h-1.5 rounded-sm" style={{ backgroundColor: t.color }} />
              {t.label}
            </span>
          ))}
        </div>
      </header>

      <div className="px-2 py-2 flex-1">
        <div className="grid grid-cols-7 gap-1" style={{ height: CHART_HEIGHT }}>
          {ACTIVITE_DAYS.map(day => (
            <div key={day.date} className="flex flex-col-reverse items-center gap-px">
              {ACTIVITE_TYPES.map(type => {
                const value = day[type.id];
                const h = (value / max) * (CHART_HEIGHT - 2);
                return (
                  <div
                    key={type.id}
                    title={`${type.label}: ${value}`}
                    style={{ height: h, backgroundColor: type.color }}
                    className="w-full rounded-sm"
                  />
                );
              })}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1 mt-1">
          {ACTIVITE_DAYS.map(d => (
            <span key={d.date} className="text-[9px] text-slate-500 text-center tabular-nums">{d.date}</span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ActivitePersonnelle;
