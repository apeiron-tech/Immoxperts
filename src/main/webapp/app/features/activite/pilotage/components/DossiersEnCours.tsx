import React from 'react';
import { useNavigate } from 'react-router-dom';
import BlockShell from './BlockShell';
import { MOCK_DOSSIERS } from '../../_mocks/pilotage';

const DossiersEnCours: React.FC = () => {
  const navigate = useNavigate();
  return (
    <BlockShell
      title="Dossiers en cours"
      showMenu
      footer={
        <button type="button" className="w-full text-center text-[11px] text-blue-600 hover:text-blue-700 font-medium">
          Voir tous les dossiers →
        </button>
      }
    >
      <div className="grid grid-cols-3 divide-x divide-slate-100">
        {MOCK_DOSSIERS.map(d => (
          <button
            key={d.type}
            type="button"
            onClick={() => navigate(d.href)}
            className="flex flex-col items-start text-left px-2.5 py-2 hover:bg-slate-50 transition-colors min-w-0"
          >
            <p className="text-[10px] text-slate-500 font-medium leading-tight truncate w-full">{d.label}</p>
            <p className="text-[18px] font-semibold text-slate-900 leading-none my-1 tabular-nums">{d.count}</p>
            <p className="text-[10px] text-slate-500 truncate w-full">{d.ligne1}</p>
            <p className="text-[10px] text-slate-500 truncate w-full">{d.ligne2}</p>
          </button>
        ))}
      </div>
    </BlockShell>
  );
};

export default DossiersEnCours;
