import React from 'react';
import { useNavigate } from 'react-router-dom';
import BlockShell from './BlockShell';
import { MOCK_PIPE, PIPE_TOTAL } from '../../_mocks/pilotage';

const formatEuro = (n: number) =>
  n >= 1000 ? `${(n / 1000).toFixed(1).replace('.0', '')} k€` : `${n} €`;

const SynthesePipe: React.FC = () => {
  const navigate = useNavigate();
  return (
    <BlockShell
      title="Synthèse pipe"
      showMenu={false}
      rightSlot={
        <div className="flex items-baseline gap-1.5 mr-1">
          <span className="text-[10px] text-slate-500">Total pondéré</span>
          <span className="text-[12px] font-semibold text-slate-900 tabular-nums">{PIPE_TOTAL.toLocaleString('fr-FR')} €</span>
        </div>
      }
      footer={
        <button
          type="button"
          onClick={() => navigate('/app/activite/leads')}
          className="w-full text-center text-[11px] text-blue-600 hover:text-blue-700 font-medium"
        >
          Ouvrir les leads →
        </button>
      }
    >
      <div className="px-3 py-2.5">
        <div className="flex h-1.5 rounded-full overflow-hidden bg-slate-100">
          {MOCK_PIPE.map(stage => (
            <button
              key={stage.id}
              type="button"
              onClick={() => navigate(`/app/activite/leads?stage=${stage.id}`)}
              title={`${stage.label} · ${formatEuro(stage.valeur)}`}
              style={{ flex: stage.valeur, backgroundColor: stage.color }}
              className="hover:opacity-80 transition-opacity"
            />
          ))}
        </div>

        <div className="grid grid-cols-3 gap-x-2 gap-y-1 mt-2.5">
          {MOCK_PIPE.map(stage => (
            <div key={stage.id} className="flex items-center gap-1 min-w-0">
              <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: stage.color }} />
              <span className="text-[10px] text-slate-500 truncate flex-1">{stage.label}</span>
              <span className="text-[11px] font-medium text-slate-700 tabular-nums">{formatEuro(stage.valeur)}</span>
            </div>
          ))}
        </div>
      </div>
    </BlockShell>
  );
};

export default SynthesePipe;
