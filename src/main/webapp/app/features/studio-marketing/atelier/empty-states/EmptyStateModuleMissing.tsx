import React from 'react';
import { Lock } from 'lucide-react';

interface Props {
  module: string;
  feature: string;
  benefits: string[];
  pricing?: string;
}

const EmptyStateModuleMissing: React.FC<Props> = ({ module, feature, benefits, pricing }) => (
  <div className="h-full flex items-center justify-center p-8">
    <div className="max-w-lg w-full bg-white border border-neutral-200 rounded-lg p-6">
      <div className="flex items-start gap-3">
        <span className="flex-shrink-0 w-10 h-10 rounded-md bg-propsight-50 text-propsight-700 flex items-center justify-center">
          <Lock size={20} />
        </span>
        <div className="flex-1">
          <h2 className="text-[15px] font-semibold text-neutral-900 mb-1">
            Cette fonctionnalité nécessite un module Propsight
          </h2>
          <p className="text-[12.5px] text-neutral-600 leading-relaxed">
            Pour utiliser {feature}, vous avez besoin du module {module}.
          </p>
          <ul className="mt-3 text-[12px] text-neutral-700 space-y-1">
            {benefits.map(b => (
              <li key={b} className="flex items-start gap-2">
                <span className="text-success-700">✓</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
          {pricing && (
            <div className="text-[11.5px] text-neutral-500 mt-3">À partir de {pricing}.</div>
          )}
          <div className="mt-4 flex items-center gap-2">
            <button className="h-8 px-3 text-[12px] font-medium text-neutral-700 bg-white border border-neutral-200 rounded-md hover:bg-neutral-50">
              En savoir plus
            </button>
            <button className="h-8 px-3 text-[12px] font-medium text-white bg-propsight-600 rounded-md hover:bg-propsight-700">
              Demander une démo
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default EmptyStateModuleMissing;
