import React from 'react';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { useAtelierStore } from '../../store/atelierStore';
import { useAtelierGenerate } from '../../hooks/useAtelierGenerate';
import { computeEnrichmentMode, enrichmentModeLabel } from '../../utils/helpers';

const EmptyStateConfiguring: React.FC = () => {
  const { generate } = useAtelierGenerate();
  const sourceLabel = useAtelierStore(s => s.source_label);
  const snapshot = useAtelierStore(s => s.snapshot);
  const modules = useAtelierStore(s => s.modules);
  const { mode, available, total } = computeEnrichmentMode(modules, snapshot);

  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="max-w-lg w-full text-center">
        <div className="inline-flex w-12 h-12 rounded-2xl bg-propsight-50 text-propsight-600 items-center justify-center mb-3">
          <Sparkles size={22} />
        </div>
        <h2 className="text-[18px] font-semibold text-neutral-900 mb-2">Source prête</h2>
        <p className="text-[13px] text-neutral-600 leading-relaxed mb-1">
          <span className="font-medium text-neutral-900">{sourceLabel}</span>
        </p>
        <p className="text-[12.5px] text-neutral-500 mb-5">
          Configurez le ton et le public visé à gauche, puis lancez la génération du kit.
        </p>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-propsight-50 border border-propsight-200 rounded-md text-[11.5px] text-propsight-700 mb-5">
          Mode {enrichmentModeLabel(mode)} — {available}/{total} datapoints disponibles
        </div>
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => generate(false)}
            className="h-10 px-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-white bg-propsight-600 rounded-md hover:bg-propsight-700 shadow-sm"
          >
            <Sparkles size={14} />
            Générer le kit
          </button>
        </div>
        <div className="mt-6 text-[11px] text-neutral-400 inline-flex items-center gap-1">
          <ArrowLeft size={11} /> Tous les inputs restent modifiables après génération.
        </div>
      </div>
    </div>
  );
};

export default EmptyStateConfiguring;
