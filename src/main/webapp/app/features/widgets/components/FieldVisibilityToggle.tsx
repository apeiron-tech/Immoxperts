import React from 'react';
import { Eye, EyeOff, Settings2 } from 'lucide-react';
import type { ResultField } from '../types';

interface Props {
  field: ResultField;
  onChange: (next: ResultField) => void;
  agentOnly?: boolean; // si true, champ exclusivement agent (pas de toggle public)
}

// Double toggle Public/Agent (œil ouvert / œil barré) pour l'onglet Contenu résultat
const FieldVisibilityToggle: React.FC<Props> = ({ field, onChange, agentOnly = false }) => {
  return (
    <div className="flex items-center justify-between px-3 py-2.5 border border-slate-200 rounded-md bg-white hover:border-slate-300 transition-colors">
      <span className="text-sm text-slate-800 flex-1 min-w-0 truncate">{field.label}</span>
      <div className="flex items-center gap-1.5 flex-shrink-0">
        {!agentOnly && (
          <button
            type="button"
            title="Visible publiquement"
            onClick={() => onChange({ ...field, visiblePublic: !field.visiblePublic })}
            className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
              field.visiblePublic
                ? 'bg-propsight-50 text-propsight-700 border border-propsight-200'
                : 'bg-slate-50 text-slate-500 border border-slate-200'
            }`}
          >
            <Eye size={12} />
            Public
          </button>
        )}
        <button
          type="button"
          title="Réservé agent"
          onClick={() => onChange({ ...field, visibleAgent: !field.visibleAgent })}
          className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
            field.visibleAgent
              ? 'bg-sky-50 text-sky-700 border border-sky-200'
              : 'bg-slate-50 text-slate-500 border border-slate-200'
          }`}
        >
          <EyeOff size={12} />
          Agent
        </button>
        <button
          type="button"
          className="w-6 h-6 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center"
          title="Paramètres d'affichage"
        >
          <Settings2 size={13} />
        </button>
      </div>
    </div>
  );
};

export default FieldVisibilityToggle;
