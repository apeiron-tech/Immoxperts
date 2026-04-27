import React from 'react';
import { X, Download, UserPlus, Plus, Layers, Trash2 } from 'lucide-react';

interface Props {
  count: number;
  onClear: () => void;
  onExport?: () => void;
  onAssign?: () => void;
  onCompare?: () => void;
  onCreateAction?: () => void;
  onDelete?: () => void;
}

const MultiSelectBar: React.FC<Props> = ({ count, onClear, onExport, onAssign, onCompare, onCreateAction, onDelete }) => {
  if (count === 0) return null;
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900 text-white rounded-lg shadow-xl flex items-center gap-1 py-2 px-3 animate-in slide-in-from-bottom-4">
      <span className="text-[13px] font-medium px-2">{count} sélectionné{count > 1 ? 's' : ''}</span>
      <div className="w-px h-5 bg-slate-700 mx-1" />
      {onExport && (
        <button onClick={onExport} className="flex items-center gap-1.5 px-2.5 h-8 rounded hover:bg-slate-800 text-[12px]">
          <Download size={12} /> Exporter
        </button>
      )}
      {onAssign && (
        <button onClick={onAssign} className="flex items-center gap-1.5 px-2.5 h-8 rounded hover:bg-slate-800 text-[12px]">
          <UserPlus size={12} /> Assigner
        </button>
      )}
      {onCreateAction && (
        <button onClick={onCreateAction} className="flex items-center gap-1.5 px-2.5 h-8 rounded hover:bg-slate-800 text-[12px]">
          <Plus size={12} /> Créer action
        </button>
      )}
      {onCompare && (
        <button onClick={onCompare} className="flex items-center gap-1.5 px-2.5 h-8 rounded hover:bg-slate-800 text-[12px]">
          <Layers size={12} /> Comparer
        </button>
      )}
      {onDelete && (
        <button onClick={onDelete} className="flex items-center gap-1.5 px-2.5 h-8 rounded hover:bg-red-600 text-[12px] text-red-300 hover:text-white">
          <Trash2 size={12} /> Supprimer
        </button>
      )}
      <div className="w-px h-5 bg-slate-700 mx-1" />
      <button onClick={onClear} className="w-8 h-8 rounded hover:bg-slate-800 flex items-center justify-center">
        <X size={13} />
      </button>
    </div>
  );
};

export default MultiSelectBar;
