import React from 'react';
import { Info, Sparkles } from 'lucide-react';
import { useAtelierStore } from '../../store/atelierStore';
import { useAtelierGenerate } from '../../hooks/useAtelierGenerate';
import { computeEnrichmentMode, enrichmentDots, enrichmentModeLabel } from '../../utils/helpers';

const AtelierGenerateButton: React.FC = () => {
  const source = useAtelierStore(s => s.source);
  const status = useAtelierStore(s => s.status);
  const snapshot = useAtelierStore(s => s.snapshot);
  const modules = useAtelierStore(s => s.modules);
  const { generate } = useAtelierGenerate();

  const { mode, available, total } = computeEnrichmentMode(modules, snapshot);
  const disabled = !source || status === 'generating';

  return (
    <div className="space-y-2">
      <button
        onClick={() => generate(false)}
        disabled={disabled}
        className="w-full h-12 inline-flex items-center justify-center gap-2 text-[14px] font-semibold text-white bg-propsight-600 rounded-lg hover:bg-propsight-700 disabled:bg-neutral-300 disabled:cursor-not-allowed transition-colors shadow-sm"
        title={!source ? 'Sélectionnez une source pour générer' : undefined}
      >
        <Sparkles size={16} />
        {status === 'generating' ? 'Génération en cours…' : 'Générer le kit'}
      </button>

      <div className="px-2.5 py-2 bg-neutral-50 border border-neutral-200 rounded-md space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-neutral-600">Mode</span>
          <span className="text-[11.5px] font-medium text-propsight-700">
            {enrichmentModeLabel(mode)}{' '}
            <span className="text-propsight-500 tracking-tighter">{enrichmentDots(mode)}</span>
          </span>
        </div>
        <div className="text-[10.5px] text-neutral-500">
          {available} datapoint{available > 1 ? 's' : ''} sur {total} disponible
          {available > 1 ? 's' : ''}
        </div>
        <button className="w-full inline-flex items-center justify-center gap-1 text-[10.5px] text-neutral-500 hover:text-neutral-700 pt-0.5">
          <Info size={10} />
          Voir les datapoints
        </button>
      </div>
    </div>
  );
};

export default AtelierGenerateButton;
