import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { PIPELINE_STATS } from '../../_mocks/performance';

const PipelineParEtape: React.FC = () => {
  const navigate = useNavigate();
  return (
    <section className="bg-white border border-slate-200 rounded h-full flex flex-col">
      <header className="px-2 py-1 border-b border-slate-200 flex-shrink-0">
        <h3 className="text-[11px] font-semibold text-slate-900">Pipeline par étape</h3>
      </header>
      <div className="grid grid-cols-6 divide-x divide-slate-100 flex-1">
        {PIPELINE_STATS.map(s => {
          const positive = (s.delta ?? 0) >= 0;
          const TrendIcon = positive ? ArrowUp : ArrowDown;
          return (
            <button
              key={s.stage}
              type="button"
              onClick={() => navigate(`/app/activite/leads?stage=${s.stage}`)}
              className="flex flex-col items-stretch text-left hover:bg-slate-50 transition-colors min-w-0"
            >
              <div className={`px-1.5 py-0.5 ${s.bgColor} border-b border-slate-100`}>
                <p className={`text-[9px] font-semibold ${s.textColor} truncate`}>{s.label}</p>
              </div>
              <div className="px-1.5 py-1 flex-1">
                <p className="text-[16px] font-semibold text-slate-900 leading-none tabular-nums">{s.volume}</p>
                <p className="text-[9px] text-slate-500 mt-0.5">{s.taux}%</p>
                {s.delta !== null && (
                  <p className={`flex items-center gap-0.5 text-[9px] font-medium mt-0.5 ${positive ? 'text-green-600' : 'text-red-500'}`}>
                    <TrendIcon size={8} />
                    {Math.abs(s.delta)} {s.deltaLabel}
                  </p>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default PipelineParEtape;
