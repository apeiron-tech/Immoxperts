import React from 'react';
import { Sparkles } from 'lucide-react';
import { BlocComponentProps } from '../types';
import { BLOCS_REGISTRY } from '../BlocsRegistry';

const BlocPlaceholder: React.FC<BlocComponentProps> = ({ blocConfig }) => {
  const def = BLOCS_REGISTRY[blocConfig.id];
  return (
    <div className="rapport-bloc rapport-placeholder px-10 py-8">
      <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center">
        <Sparkles size={20} className="text-slate-400 mx-auto mb-2" />
        <h2 className="text-sm font-semibold text-slate-700 mb-1">{def.label}</h2>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Bloc actif dans la configuration. Le contenu réel sera disponible après branchement des sources de données. Mode démo : aperçu non rendu.
        </p>
      </div>
    </div>
  );
};

export default BlocPlaceholder;
