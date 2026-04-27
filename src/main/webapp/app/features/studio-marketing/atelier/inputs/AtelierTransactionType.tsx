import React from 'react';
import { useAtelierStore } from '../../store/atelierStore';
import type { AtelierTransactionType as TType } from '../../types';

const ITEMS: { value: TType; label: string }[] = [
  { value: 'vente', label: 'Vente' },
  { value: 'location', label: 'Location' },
  { value: 'investissement', label: 'Invest.' },
];

const AtelierTransactionType: React.FC = () => {
  const value = useAtelierStore(s => s.transaction_type);
  const setValue = useAtelierStore(s => s.setTransactionType);

  return (
    <div className="grid grid-cols-3 gap-1.5">
      {ITEMS.map(item => (
        <button
          key={item.value}
          onClick={() => setValue(item.value)}
          className={`h-8 rounded-md border text-[11.5px] font-medium transition-colors ${
            value === item.value
              ? 'bg-propsight-600 border-propsight-600 text-white'
              : 'bg-white border-neutral-200 text-neutral-700 hover:border-neutral-300'
          }`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
};

export default AtelierTransactionType;
