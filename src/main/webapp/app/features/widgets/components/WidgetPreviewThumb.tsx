import React from 'react';
import type { WidgetType } from '../types';

interface Props {
  type: WidgetType;
  compact?: boolean;
}

// Faux screenshot miniaturisé façon "aperçu figé"
const WidgetPreviewThumb: React.FC<Props> = ({ type, compact = false }) => {
  const isSeller = type === 'estimation_vendeur';

  return (
    <div className={`rounded-md border border-slate-200 bg-slate-50 overflow-hidden ${compact ? 'h-28' : 'h-36'}`}>
      <div className="px-3 py-2 bg-white border-b border-slate-200 flex items-center justify-between">
        <span className="text-[9px] font-semibold text-slate-900 tracking-tight">
          {isSeller ? 'Estimer votre bien' : 'Évaluez votre projet'}
        </span>
        <span className="text-[8px] text-slate-400">1/7</span>
      </div>
      <div className="p-3 space-y-1.5">
        <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
          <div className="h-full w-1/5 bg-propsight-500" />
        </div>
        <div className="h-1.5 rounded bg-slate-200 w-4/5" />
        <div className="h-1.5 rounded bg-slate-100 w-3/5" />
        <div className="mt-2 h-5 rounded border border-slate-200 bg-white" />
        {!compact && (
          <div className="pt-1 flex items-center justify-between">
            <div className="h-4 w-14 rounded bg-propsight-500" />
            <span className="text-[7px] text-slate-400">Propsight</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default WidgetPreviewThumb;
