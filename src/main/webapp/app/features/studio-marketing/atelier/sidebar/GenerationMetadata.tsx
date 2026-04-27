import React from 'react';
import { Info } from 'lucide-react';
import { useAtelierStore } from '../../store/atelierStore';
import { formatRelativeShort } from '../../utils/helpers';

const GenerationMetadata: React.FC = () => {
  const draftId = useAtelierStore(s => s.draft_id);
  const generatedAt = useAtelierStore(s => s.generated_at);
  const autoSavedAt = useAtelierStore(s => s.auto_saved_at);

  if (!draftId) return null;

  return (
    <div className="rounded-md bg-neutral-50 border border-neutral-200 px-2.5 py-2 space-y-1">
      <div className="flex items-center gap-1 text-[10.5px] font-semibold uppercase tracking-wide text-neutral-500">
        <Info size={10} />
        Métadonnées
      </div>
      <ul className="text-[11px] text-neutral-600 space-y-0.5">
        <li>
          Brouillon : <span className="font-mono text-neutral-700">{draftId}</span>
        </li>
        {generatedAt && <li>Généré : {formatRelativeShort(generatedAt)}</li>}
        {autoSavedAt && <li>Auto-save : {formatRelativeShort(autoSavedAt)}</li>}
        <li>Modèle : LLM v2.3</li>
      </ul>
      <button className="text-[10.5px] text-propsight-700 hover:text-propsight-800 mt-0.5">
        Voir le snapshot data
      </button>
    </div>
  );
};

export default GenerationMetadata;
