import React from 'react';
import { Check, Loader2, Sparkles } from 'lucide-react';
import { useAtelierStore } from '../../store/atelierStore';
import { useAtelierGenerate } from '../../hooks/useAtelierGenerate';
import { OUTPUT_DESCRIPTORS } from '../../utils/outputCatalog';

const STEPS = [
  { label: 'Récupération des datapoints', threshold: 15 },
  { label: 'Génération des textes courts', threshold: 35 },
  { label: 'Génération des posts sociaux', threshold: 70 },
  { label: 'Génération des visuels et briefs', threshold: 95 },
];

const EmptyStateGenerating: React.FC = () => {
  const percent = useAtelierStore(s => s.generation_progress);
  const outputs = useAtelierStore(s => s.outputs);
  const { cancel } = useAtelierGenerate();
  const reset = useAtelierStore(s => s.reset);

  return (
    <div className="h-full flex items-center justify-center p-8 overflow-auto">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-6">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-propsight-100 text-propsight-700 items-center justify-center mb-3">
            <Sparkles size={22} />
          </div>
          <h2 className="text-[18px] font-semibold text-neutral-900">Génération en cours…</h2>
          <p className="text-[12px] text-neutral-500 mt-1">
            Vous pouvez commencer à éditer les outputs prêts.
          </p>
        </div>

        <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
          <ul className="divide-y divide-neutral-100">
            {STEPS.map((step, idx) => {
              const done = percent >= step.threshold;
              const inProgress = !done && percent >= (idx > 0 ? STEPS[idx - 1].threshold : 0);
              return (
                <li key={step.label} className="px-4 py-2.5 flex items-center gap-3 text-[13px]">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center">
                    {done ? (
                      <Check size={14} className="text-success-700" />
                    ) : inProgress ? (
                      <Loader2 size={13} className="text-propsight-600 animate-spin" />
                    ) : (
                      <span className="w-2 h-2 rounded-full border border-neutral-300" />
                    )}
                  </span>
                  <span className={done ? 'text-neutral-700' : inProgress ? 'text-neutral-900 font-medium' : 'text-neutral-400'}>
                    Étape {idx + 1}/{STEPS.length} — {step.label}
                  </span>
                </li>
              );
            })}
          </ul>
          <div className="px-4 py-3 border-t border-neutral-100 bg-neutral-50/50">
            <div className="flex items-center justify-between text-[11.5px] text-neutral-600 mb-1.5">
              <span>{percent}%</span>
              <span>{outputs.length} / {OUTPUT_DESCRIPTORS.length} outputs</span>
            </div>
            <div className="h-1.5 bg-neutral-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-propsight-600 transition-all duration-300"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={() => { cancel(); reset(); }}
            className="h-8 px-3 text-[12px] font-medium text-neutral-700 bg-white border border-neutral-200 rounded-md hover:bg-neutral-50"
          >
            Annuler la génération
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmptyStateGenerating;
