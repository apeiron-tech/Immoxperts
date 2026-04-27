import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ChevronDown,
  PenTool,
  RefreshCw,
  Save,
  Send,
  Sparkles,
} from 'lucide-react';
import { proRoutes } from 'app/config/proRoutes';
import { useAtelierStore } from '../store/atelierStore';
import { useAtelierGenerate } from '../hooks/useAtelierGenerate';

interface Props {
  onSaveDraft: () => void;
  onSaveKit: () => void;
  onOpenVariants: () => void;
}

const AtelierHeader: React.FC<Props> = ({ onSaveDraft, onSaveKit, onOpenVariants }) => {
  const sourceLabel = useAtelierStore(s => s.source_label);
  const status = useAtelierStore(s => s.status);
  const activeAssetType = useAtelierStore(s => s.active_asset_type);
  const outputs = useAtelierStore(s => s.outputs);
  const { generate } = useAtelierGenerate();

  const canRegenerate = status === 'ready' && outputs.length > 0;
  const canSave = status === 'ready' && outputs.length > 0;
  const canVariants = status === 'ready' && outputs.some(o => o.asset_type === activeAssetType);

  return (
    <div className="flex-shrink-0 h-16 px-5 bg-white border-b border-neutral-200 flex items-center justify-between">
      <div className="flex items-center gap-3 min-w-0">
        <Link
          to={proRoutes.studioMarketing.vueDensemble}
          className="text-neutral-500 hover:text-neutral-700 transition-colors p-1.5 -ml-1.5 rounded"
          title="Retour à Studio Marketing"
        >
          <ArrowLeft size={16} />
        </Link>
        <div className="flex items-center gap-2 min-w-0">
          <PenTool size={16} className="text-propsight-600 flex-shrink-0" />
          <span className="text-[14px] font-semibold text-neutral-900">Atelier</span>
          <span className="text-neutral-400">›</span>
          <span className="text-[13px] text-neutral-600 truncate">
            {sourceLabel ? `Pour : ${sourceLabel}` : 'Aucune source sélectionnée'}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        <button
          onClick={onSaveDraft}
          disabled={status === 'empty'}
          className="h-8 inline-flex items-center gap-1.5 px-2.5 text-[12px] font-medium text-neutral-700 bg-white border border-neutral-200 rounded-md hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <Save size={13} />
          Sauver brouillon
        </button>
        <button
          onClick={() => generate(true)}
          disabled={!canRegenerate}
          className="h-8 inline-flex items-center gap-1.5 px-2.5 text-[12px] font-medium text-neutral-700 bg-white border border-neutral-200 rounded-md hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <RefreshCw size={13} />
          Régénérer tout
        </button>
        <div className="h-5 w-px bg-neutral-200 mx-1" />
        <button
          onClick={onOpenVariants}
          disabled={!canVariants}
          className="h-8 inline-flex items-center gap-1.5 px-2.5 text-[12px] font-medium text-propsight-700 bg-propsight-50 border border-propsight-200 rounded-md hover:bg-propsight-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <Sparkles size={13} />
          Variantes ↻×3
        </button>
        <button
          onClick={onSaveKit}
          disabled={!canSave}
          className="h-8 inline-flex items-center gap-1.5 px-3 text-[12px] font-medium text-white bg-propsight-600 rounded-md hover:bg-propsight-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <Send size={13} />
          Sauver kit
        </button>
        <button
          className="h-8 w-8 inline-flex items-center justify-center text-neutral-600 bg-white border border-neutral-200 rounded-md hover:bg-neutral-50 transition-colors"
          title="Plus d'actions"
        >
          <ChevronDown size={14} />
        </button>
      </div>
    </div>
  );
};

export default AtelierHeader;
