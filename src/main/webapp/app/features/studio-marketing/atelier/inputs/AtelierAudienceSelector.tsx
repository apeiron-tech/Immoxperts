import React from 'react';
import { useAtelierStore } from '../../store/atelierStore';
import type { AtelierAudience } from '../../types';

const ITEMS: { value: AtelierAudience; label: string; sub: string }[] = [
  { value: 'acquereur', label: 'Acquéreur particulier', sub: 'Vente classique' },
  { value: 'locataire', label: 'Locataire particulier', sub: 'Mise en location' },
  { value: 'investisseur', label: 'Investisseur', sub: 'Rendement, plus-value, fiscalité' },
  { value: 'mixte', label: 'Mixte', sub: 'Acquéreur + investisseur' },
];

const AtelierAudienceSelector: React.FC = () => {
  const value = useAtelierStore(s => s.audience);
  const setValue = useAtelierStore(s => s.setAudience);

  return (
    <div className="space-y-1">
      {ITEMS.map(item => (
        <button
          key={item.value}
          onClick={() => setValue(item.value)}
          className={`w-full text-left px-2.5 py-2 rounded-md border transition-colors ${
            value === item.value
              ? 'bg-propsight-50 border-propsight-300'
              : 'bg-white border-neutral-200 hover:border-neutral-300'
          }`}
        >
          <div className="flex items-start gap-2">
            <span
              className={`mt-0.5 w-3.5 h-3.5 rounded-full border flex-shrink-0 transition-colors ${
                value === item.value
                  ? 'border-propsight-600 bg-propsight-600'
                  : 'border-neutral-300'
              }`}
            >
              {value === item.value && (
                <span className="block w-1.5 h-1.5 m-auto mt-[3px] rounded-full bg-white" />
              )}
            </span>
            <div className="min-w-0">
              <div
                className={`text-[12px] font-medium ${
                  value === item.value ? 'text-propsight-800' : 'text-neutral-900'
                }`}
              >
                {item.label}
              </div>
              <div className="text-[10.5px] text-neutral-500">{item.sub}</div>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};

export default AtelierAudienceSelector;
