import React from 'react';
import { X, Sparkles } from 'lucide-react';
import { useAIDrawerStore } from 'app/shared/stores/aiDrawerStore';

const AIDrawer: React.FC = () => {
  const { isOpen, close } = useAIDrawerStore();

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-neutral-900/30" onClick={close} />
      <aside className="fixed right-0 top-0 bottom-0 z-50 w-[420px] max-w-[100vw] bg-white border-l border-neutral-200 shadow-md flex flex-col">
        <div className="h-13 min-h-[52px] border-b border-neutral-200 px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-propsight-600" />
            <div className="text-sm font-semibold text-neutral-900">Assistant Propsight</div>
          </div>
          <button type="button" onClick={close} className="w-8 h-8 rounded-md hover:bg-neutral-100 flex items-center justify-center">
            <X size={16} />
          </button>
        </div>
        <div className="flex-1 overflow-auto p-4 text-sm text-neutral-500">
          Assistant IA contextuel — connecté à la page en cours.
        </div>
        <div className="border-t border-neutral-200 p-3">
          <input
            type="text"
            placeholder="Posez une question…"
            className="w-full h-9 px-3 text-sm rounded-md border border-neutral-200 focus:border-propsight-500 focus:ring-2 focus:ring-propsight-500/20 outline-none"
          />
        </div>
      </aside>
    </>
  );
};

export default AIDrawer;
