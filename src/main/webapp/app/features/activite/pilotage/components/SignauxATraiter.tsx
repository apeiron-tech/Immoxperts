import React from 'react';
import { useNavigate } from 'react-router-dom';
import BlockShell from './BlockShell';
import { SignalItem, SignalType } from '../../types';
import { MOCK_SIGNAUX } from '../../_mocks/pilotage';

const TAG_STYLES: Record<SignalType, string> = {
  DVF: 'bg-blue-100 text-blue-700',
  DPE: 'bg-green-100 text-green-700',
  ANN: 'bg-propsight-100 text-propsight-700',
};

const SignauxATraiter: React.FC = () => {
  const navigate = useNavigate();
  const handleClick = (s: SignalItem) => {
    console.warn('[Pilotage] Signal clic', s.signal_id);
  };
  return (
    <BlockShell
      title="Signaux à traiter"
      showMenu
      footer={
        <button
          type="button"
          onClick={() => navigate('/app/prospection/radar')}
          className="w-full text-center text-[11px] text-blue-600 hover:text-blue-700 font-medium"
        >
          Voir tous les signaux →
        </button>
      }
    >
      <ul>
        {MOCK_SIGNAUX.map(item => (
          <li
            key={item.signal_id}
            onClick={() => handleClick(item)}
            className="flex items-start gap-2 px-3 py-1.5 hover:bg-slate-50 cursor-pointer transition-colors border-b border-slate-50 last:border-b-0"
          >
            <span className={`text-[9px] font-semibold tracking-wide px-1 py-0.5 rounded flex-shrink-0 mt-px ${TAG_STYLES[item.type]}`}>
              {item.type}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-medium text-slate-900 truncate leading-tight">{item.titre}</p>
              <p className="text-[11px] text-slate-500 truncate">{item.loc}</p>
            </div>
            <span className="text-[10px] text-slate-400 flex-shrink-0 mt-px">{item.time}</span>
          </li>
        ))}
      </ul>
    </BlockShell>
  );
};

export default SignauxATraiter;
