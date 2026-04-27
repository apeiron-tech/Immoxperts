import React, { useState } from 'react';
import { Plus, ChevronDown } from 'lucide-react';

interface Props {
  groups: Array<{ label: string; variables: string[] }>;
  onInsert: (variable: string) => void;
}

const VariableInserter: React.FC<Props> = ({ groups, onInsert }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-slate-200 text-sm text-slate-700 hover:bg-slate-50"
      >
        <Plus size={13} />
        Insérer une variable
        <ChevronDown size={13} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 z-20 bg-white border border-slate-200 rounded-md shadow-lg w-64 max-h-80 overflow-y-auto">
          {groups.map(g => (
            <div key={g.label}>
              <div className="px-3 py-1.5 text-[10px] uppercase tracking-wide font-semibold text-slate-400 bg-slate-50 border-b border-slate-100">
                {g.label}
              </div>
              <div className="p-1">
                {g.variables.map(v => (
                  <button
                    key={v}
                    onClick={() => {
                      onInsert(v);
                      setOpen(false);
                    }}
                    className="w-full text-left px-2 py-1 text-xs font-mono text-slate-700 hover:bg-propsight-50 hover:text-propsight-700 rounded"
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VariableInserter;
