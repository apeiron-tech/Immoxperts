import { useCallback, useRef } from 'react';
import { useAtelierStore } from '../store/atelierStore';
import { MOCK_OUTPUTS } from '../_mocks/outputs';
import { OUTPUT_DESCRIPTORS } from '../utils/outputCatalog';
import type { MarketingAsset } from '../types';

const STEPS = [
  { label: 'Récupération des datapoints…', percent: 15 },
  { label: 'Génération des textes courts…', percent: 35 },
  { label: 'Génération des posts sociaux…', percent: 70 },
  { label: 'Génération des visuels et briefs…', percent: 95 },
];

export const useAtelierGenerate = () => {
  const timersRef = useRef<number[]>([]);
  const start = useAtelierStore(s => s.startGeneration);
  const setProgress = useAtelierStore(s => s.setProgress);
  const appendOutput = useAtelierStore(s => s.appendOutput);
  const finish = useAtelierStore(s => s.finishGeneration);
  const modules = useAtelierStore(s => s.modules);

  const cancel = useCallback(() => {
    timersRef.current.forEach(id => window.clearTimeout(id));
    timersRef.current = [];
  }, []);

  const generate = useCallback(
    (forceRegen = false) => {
      cancel();
      const draftId = `drft_${Math.random().toString(36).slice(2, 10)}`;
      start(draftId);

      const allowedTypes = OUTPUT_DESCRIPTORS.filter(d => {
        if (!d.requires_module) return true;
        return modules[d.requires_module] === 'active';
      }).map(d => d.asset_type);

      const outputs: MarketingAsset[] = MOCK_OUTPUTS.filter(o =>
        allowedTypes.includes(o.asset_type),
      ).map(o =>
        forceRegen
          ? { ...o, asset_id: o.asset_id + '_' + Date.now(), version: o.version + 1 }
          : o,
      );

      // schedule progress
      STEPS.forEach((step, idx) => {
        const t = window.setTimeout(() => {
          setProgress(step.percent, step.label);
        }, 250 + idx * 700);
        timersRef.current.push(t);
      });

      // schedule outputs (staggered)
      outputs.forEach((out, idx) => {
        const t = window.setTimeout(() => {
          appendOutput(out);
        }, 350 + idx * 220);
        timersRef.current.push(t);
      });

      const tEnd = window.setTimeout(() => {
        finish();
      }, 350 + outputs.length * 220 + 400);
      timersRef.current.push(tEnd);
    },
    [appendOutput, cancel, finish, modules, setProgress, start],
  );

  return { generate, cancel };
};
