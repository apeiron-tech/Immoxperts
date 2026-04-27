import React from 'react';
import { Check } from 'lucide-react';

interface Props {
  steps: Array<{ id: string; name: string }>;
  currentIndex: number; // 1-based
  compact?: boolean;
}

// Progress bar 1→N pour les parcours publics (ronds numérotés)
const ProgressBar: React.FC<Props> = ({ steps, currentIndex, compact = false }) => {
  if (compact) {
    return (
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span className="font-medium text-slate-900">
          Étape {currentIndex}/{steps.length}
        </span>
        <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden flex-1 ml-3">
          <div
            className="h-full bg-propsight-500 transition-all"
            style={{ width: `${(currentIndex / steps.length) * 100}%` }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-4">
      {steps.map((s, i) => {
        const idx = i + 1;
        const isActive = idx === currentIndex;
        const isDone = idx < currentIndex;
        return (
          <div key={s.id} className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                  isActive
                    ? 'bg-propsight-600 text-white'
                    : isDone
                      ? 'bg-propsight-600 text-white'
                      : 'bg-white border border-slate-300 text-slate-400'
                }`}
              >
                {isDone ? <Check size={13} /> : idx}
              </div>
              <span
                className={`hidden md:inline text-xs font-medium ${
                  isActive ? 'text-slate-900' : isDone ? 'text-slate-700' : 'text-slate-400'
                }`}
              >
                {s.name}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`h-px w-6 sm:w-10 ${isDone ? 'bg-propsight-400' : 'bg-slate-200'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ProgressBar;
