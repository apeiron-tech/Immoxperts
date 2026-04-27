import React from 'react';
import { useAtelierStore } from '../../store/atelierStore';
import type { AtelierTone } from '../../types';
import { toneLabel, toneSampleSentence } from '../../utils/helpers';

const TONES: AtelierTone[] = ['professional', 'warm', 'punchy', 'luxury', 'investor'];

const AtelierToneSelector: React.FC = () => {
  const value = useAtelierStore(s => s.tone);
  const setValue = useAtelierStore(s => s.setTone);

  return (
    <div className="space-y-1">
      {TONES.map(t => (
        <button
          key={t}
          onClick={() => setValue(t)}
          className={`w-full text-left px-2.5 py-1.5 rounded-md border transition-colors ${
            value === t
              ? 'bg-propsight-50 border-propsight-300'
              : 'bg-white border-neutral-200 hover:border-neutral-300'
          }`}
        >
          <div className="flex items-start gap-2">
            <span
              className={`mt-0.5 w-3.5 h-3.5 rounded-full border flex-shrink-0 transition-colors ${
                value === t ? 'border-propsight-600 bg-propsight-600' : 'border-neutral-300'
              }`}
            >
              {value === t && (
                <span className="block w-1.5 h-1.5 m-auto mt-[3px] rounded-full bg-white" />
              )}
            </span>
            <div className="min-w-0 flex-1">
              <div
                className={`text-[12px] font-medium ${
                  value === t ? 'text-propsight-800' : 'text-neutral-900'
                }`}
              >
                {toneLabel(t)}
              </div>
              <div className="text-[10.5px] text-neutral-500 italic line-clamp-2">
                « {toneSampleSentence(t)} »
              </div>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};

export default AtelierToneSelector;
