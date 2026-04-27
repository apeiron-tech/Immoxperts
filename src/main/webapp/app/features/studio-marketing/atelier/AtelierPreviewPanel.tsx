import React from 'react';
import OutputTabs from './outputs/OutputTabs';
import OutputCard from './outputs/OutputCard';
import OutputsList from './outputs/OutputsList';
import EmptyStateNoSource from './empty-states/EmptyStateNoSource';
import EmptyStateGenerating from './empty-states/EmptyStateGenerating';
import EmptyStateError from './empty-states/EmptyStateError';
import EmptyStateConfiguring from './empty-states/EmptyStateConfiguring';
import { useAtelierStore } from '../store/atelierStore';

interface Props {
  onChooseSource: () => void;
}

const AtelierPreviewPanel: React.FC<Props> = ({ onChooseSource }) => {
  const status = useAtelierStore(s => s.status);
  const outputs = useAtelierStore(s => s.outputs);
  const activeAssetType = useAtelierStore(s => s.active_asset_type);
  const active = outputs.find(o => o.asset_type === activeAssetType);

  if (status === 'empty') {
    return (
      <main className="flex-1 min-w-0 bg-neutral-50 overflow-hidden">
        <EmptyStateNoSource onChooseSource={onChooseSource} />
      </main>
    );
  }
  if (status === 'configuring') {
    return (
      <main className="flex-1 min-w-0 bg-neutral-50 overflow-hidden">
        <EmptyStateConfiguring />
      </main>
    );
  }
  if (status === 'error') {
    return (
      <main className="flex-1 min-w-0 bg-neutral-50 overflow-hidden">
        <EmptyStateError />
      </main>
    );
  }
  if (status === 'generating' && outputs.length === 0) {
    return (
      <main className="flex-1 min-w-0 bg-neutral-50 overflow-hidden">
        <EmptyStateGenerating />
      </main>
    );
  }

  return (
    <main className="flex-1 min-w-0 bg-neutral-50 flex flex-col overflow-hidden">
      <OutputTabs />
      {status === 'generating' && (
        <div className="px-4 pt-3">
          <ProgressMini />
        </div>
      )}
      <div className="flex-1 min-h-0 overflow-y-auto p-4">
        <div className="max-w-3xl mx-auto space-y-4">
          {active ? (
            <OutputCard asset={active} />
          ) : (
            <div className="bg-white border border-dashed border-neutral-200 rounded-lg p-8 text-center text-[13px] text-neutral-500">
              Cet output n&apos;a pas encore été généré dans ce kit.
            </div>
          )}
          <OutputsList />
        </div>
      </div>
    </main>
  );
};

const ProgressMini: React.FC = () => {
  const percent = useAtelierStore(s => s.generation_progress);
  const label = useAtelierStore(s => s.generation_step_label);
  return (
    <div className="bg-white border border-propsight-200 rounded-md px-3 py-2 flex items-center gap-3">
      <div className="flex-1">
        <div className="text-[11.5px] text-propsight-700 font-medium">{label}</div>
        <div className="mt-1 h-1 bg-propsight-100 rounded-full overflow-hidden">
          <div className="h-full bg-propsight-600 transition-all duration-300" style={{ width: `${percent}%` }} />
        </div>
      </div>
      <div className="text-[11px] text-propsight-700 font-mono">{percent}%</div>
    </div>
  );
};

export default AtelierPreviewPanel;
