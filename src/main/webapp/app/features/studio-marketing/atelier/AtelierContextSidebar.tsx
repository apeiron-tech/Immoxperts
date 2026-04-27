import React from 'react';
import DataAnchorsList from './sidebar/DataAnchorsList';
import ActionsTransversesList from './sidebar/ActionsTransversesList';
import SuggestionPropsightCard from './sidebar/SuggestionPropsightCard';
import GenerationMetadata from './sidebar/GenerationMetadata';
import { useAtelierStore } from '../store/atelierStore';
import { computeEnrichmentMode, enrichmentDots, enrichmentModeLabel } from '../utils/helpers';

const AtelierContextSidebar: React.FC = () => {
  const snapshot = useAtelierStore(s => s.snapshot);
  const modules = useAtelierStore(s => s.modules);
  const { mode, available, total } = computeEnrichmentMode(modules, snapshot);

  return (
    <aside className="w-[380px] flex-shrink-0 border-l border-neutral-200 bg-white overflow-y-auto">
      <div className="p-4 space-y-5">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wide text-neutral-500">
            Datapoints Propsight
          </div>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-[14px] font-semibold text-neutral-900">
              Mode {enrichmentModeLabel(mode)}
            </span>
            <span className="text-[12px] tracking-tighter text-propsight-600">
              {enrichmentDots(mode)}
            </span>
          </div>
          <div className="text-[10.5px] text-neutral-500">
            {available} sur {total} datapoints disponibles
          </div>
        </div>

        <DataAnchorsList />

        <div className="pt-2 border-t border-neutral-100">
          <h3 className="text-[11px] font-semibold uppercase tracking-wide text-neutral-500 mb-2">
            Actions
          </h3>
          <ActionsTransversesList />
        </div>

        <SuggestionPropsightCard />

        <GenerationMetadata />
      </div>
    </aside>
  );
};

export default AtelierContextSidebar;
