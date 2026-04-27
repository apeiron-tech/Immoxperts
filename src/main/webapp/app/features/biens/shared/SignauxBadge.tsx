import React from 'react';
import { Flame, TrendingDown, Clock, Sparkles } from 'lucide-react';
import { SignalBien } from '../types';

interface Props {
  signaux: SignalBien[];
}

const SignauxBadge: React.FC<Props> = ({ signaux }) => {
  if (signaux.length === 0) return <span className="text-xs text-slate-300">—</span>;
  return (
    <div className="inline-flex items-center gap-1">
      {signaux.includes('hot') && (
        <span title="Bien chaud" className="w-5 h-5 rounded bg-orange-50 text-orange-500 flex items-center justify-center">
          <Flame size={11} />
        </span>
      )}
      {signaux.includes('baisse_prix') && (
        <span title="Baisse de prix" className="w-5 h-5 rounded bg-red-50 text-red-500 flex items-center justify-center">
          <TrendingDown size={11} />
        </span>
      )}
      {signaux.includes('echeance') && (
        <span title="Échéance proche" className="w-5 h-5 rounded bg-amber-50 text-amber-600 flex items-center justify-center">
          <Clock size={11} />
        </span>
      )}
      {signaux.includes('nouvelle_annonce') && (
        <span title="Nouvelle annonce" className="w-5 h-5 rounded bg-propsight-50 text-propsight-600 flex items-center justify-center">
          <Sparkles size={11} />
        </span>
      )}
      {signaux.length > 1 && (
        <span className="text-[11px] font-medium text-slate-500 ml-0.5">+{signaux.length}</span>
      )}
    </div>
  );
};

export default SignauxBadge;
