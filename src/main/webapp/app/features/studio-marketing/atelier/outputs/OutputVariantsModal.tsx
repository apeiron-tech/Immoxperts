import React, { useMemo, useState } from 'react';
import { Check, RefreshCw, Sparkles, X } from 'lucide-react';
import { useAtelierStore } from '../../store/atelierStore';

const VARIANT_LABELS = ['Variante A — originale', 'Variante B — plus émotion', 'Variante C — plus data'];

const OutputVariantsModal: React.FC = () => {
  const variantsAssetId = useAtelierStore(s => s.variantsModalAssetId);
  const close = useAtelierStore(s => s.closeVariants);
  const outputs = useAtelierStore(s => s.outputs);
  const patch = useAtelierStore(s => s.patchOutput);
  const [selected, setSelected] = useState(0);

  const asset = outputs.find(o => o.asset_id === variantsAssetId);
  const variants = useMemo(() => {
    if (!asset) return [];
    const base = asset.content;
    return [
      base,
      base.split('\n').slice(0, 3).join('\n') + '\n\nUn lieu où l\'on a envie de poser ses valises et d\'écrire la suite. Visite sur RDV — DM ouvert.',
      base + '\n\n📊 Données clés : médiane DVF 11 080 €/m² · 47 ventes 12 m · délai 38 j · profondeur 1 240 foyers solvables.',
    ];
  }, [asset]);

  if (!variantsAssetId || !asset) return null;

  const handleConfirm = () => {
    patch(asset.asset_id, { content: variants[selected] });
    close();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/50 backdrop-blur-sm p-6">
      <div className="bg-white rounded-xl shadow-2xl border border-neutral-200 w-full max-w-6xl max-h-[92vh] flex flex-col overflow-hidden">
        <div className="flex-shrink-0 px-5 py-4 border-b border-neutral-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-propsight-600" />
            <div className="text-[15px] font-semibold text-neutral-900">
              Variantes — {asset.title}
            </div>
          </div>
          <button onClick={close} className="text-neutral-500 hover:text-neutral-800 p-1.5 rounded-md hover:bg-neutral-100">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto p-5">
          <div className="grid grid-cols-3 gap-3">
            {variants.map((content, i) => {
              const isSelected = selected === i;
              return (
                <button
                  key={i}
                  onClick={() => setSelected(i)}
                  className={`text-left rounded-lg border transition-colors flex flex-col overflow-hidden ${
                    isSelected
                      ? 'border-propsight-500 ring-2 ring-propsight-200'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <div className={`px-3 py-2 border-b text-[11.5px] font-semibold flex items-center justify-between ${
                    isSelected ? 'bg-propsight-50 text-propsight-800 border-propsight-200' : 'bg-neutral-50 text-neutral-700 border-neutral-100'
                  }`}>
                    {VARIANT_LABELS[i]}
                    {isSelected && <Check size={12} className="text-propsight-700" />}
                  </div>
                  <div className="p-3 flex-1 min-h-[400px] max-h-[500px] overflow-y-auto">
                    <pre className="whitespace-pre-wrap font-sans text-[12px] leading-relaxed text-neutral-800">
                      {content}
                    </pre>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex-shrink-0 px-5 py-3 border-t border-neutral-200 flex items-center justify-end gap-2 bg-neutral-50">
          <button
            className="h-8 inline-flex items-center gap-1.5 px-3 text-[12px] font-medium text-neutral-700 bg-white border border-neutral-200 rounded-md hover:bg-neutral-50"
          >
            <RefreshCw size={12} />
            Re-générer 3 nouvelles
          </button>
          <button
            onClick={handleConfirm}
            className="h-8 inline-flex items-center gap-1.5 px-3 text-[12px] font-medium text-white bg-propsight-600 rounded-md hover:bg-propsight-700"
          >
            <Check size={12} />
            Confirmer choix
          </button>
        </div>
      </div>
    </div>
  );
};

export default OutputVariantsModal;
