import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { useAtelierStore } from '../../store/atelierStore';
import { useAtelierGenerate } from '../../hooks/useAtelierGenerate';

const EmptyStateError: React.FC = () => {
  const error = useAtelierStore(s => s.generation_error);
  const { generate } = useAtelierGenerate();

  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="max-w-lg w-full bg-white border border-warning-100 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <span className="flex-shrink-0 w-10 h-10 rounded-md bg-warning-50 text-warning-700 flex items-center justify-center">
            <AlertTriangle size={20} />
          </span>
          <div className="flex-1">
            <h2 className="text-[15px] font-semibold text-neutral-900 mb-1">
              La génération a échoué
            </h2>
            <p className="text-[12.5px] text-neutral-600 leading-relaxed">
              {error ?? "Le service de génération est temporairement indisponible."}
            </p>
            <p className="text-[12px] text-neutral-500 mt-3">Vous pouvez :</p>
            <ul className="text-[12px] text-neutral-600 list-disc pl-5 mt-1 space-y-0.5">
              <li>Réessayer la génération</li>
              <li>Ajouter des informations complémentaires sur le bien</li>
              <li>Activer un module pour enrichir le snapshot</li>
            </ul>
            <div className="mt-4 flex items-center gap-2">
              <button
                onClick={() => generate(true)}
                className="h-8 px-3 text-[12px] font-medium text-white bg-propsight-600 rounded-md hover:bg-propsight-700"
              >
                Réessayer
              </button>
              <button className="h-8 px-3 text-[12px] font-medium text-neutral-700 bg-white border border-neutral-200 rounded-md hover:bg-neutral-50">
                Modifier le bien
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmptyStateError;
