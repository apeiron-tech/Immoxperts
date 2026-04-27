import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
import { CheckCircle2, X, AlertCircle, Undo2 } from 'lucide-react';

export interface ToastItem {
  id: string;
  message: string;
  type?: 'success' | 'error' | 'info';
  undoLabel?: string;
  onUndo?: () => void;
  actionLabel?: string;
  onAction?: () => void;
}

interface ToastCtx {
  push: (toast: Omit<ToastItem, 'id'>) => void;
}

const ToastContext = createContext<ToastCtx | null>(null);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timers = useRef<Record<string, number>>({});

  const push = useCallback((t: Omit<ToastItem, 'id'>) => {
    const id = `t_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    setToasts(list => [...list, { ...t, id }]);
    const timeout = t.onUndo ? 5000 : 3500;
    timers.current[id] = window.setTimeout(() => {
      setToasts(list => list.filter(tt => tt.id !== id));
      delete timers.current[id];
    }, timeout);
  }, []);

  const dismiss = (id: string) => {
    if (timers.current[id]) {
      clearTimeout(timers.current[id]);
      delete timers.current[id];
    }
    setToasts(list => list.filter(t => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[10000] flex flex-col gap-2 pointer-events-none">
        {toasts.map(t => {
          const Icon = t.type === 'error' ? AlertCircle : t.onUndo ? Undo2 : CheckCircle2;
          const color =
            t.type === 'error' ? 'text-rose-600' : t.onUndo ? 'text-slate-600' : 'text-emerald-600';
          return (
            <div
              key={t.id}
              className="pointer-events-auto min-w-[320px] max-w-md bg-white rounded-lg shadow-lg border border-slate-200 px-4 py-3 flex items-start gap-3 animate-in slide-in-from-right-4"
            >
              <Icon size={16} className={`${color} flex-shrink-0 mt-0.5`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-900">{t.message}</p>
                <div className="flex gap-3 mt-1">
                  {t.onAction && t.actionLabel && (
                    <button
                      onClick={() => {
                        t.onAction?.();
                        dismiss(t.id);
                      }}
                      className="text-xs font-medium text-propsight-600 hover:underline"
                    >
                      {t.actionLabel}
                    </button>
                  )}
                  {t.onUndo && (
                    <button
                      onClick={() => {
                        t.onUndo?.();
                        dismiss(t.id);
                      }}
                      className="text-xs font-medium text-slate-700 hover:underline"
                    >
                      {t.undoLabel || 'Annuler'}
                    </button>
                  )}
                </div>
              </div>
              <button
                onClick={() => dismiss(t.id)}
                className="text-slate-400 hover:text-slate-600 flex-shrink-0"
                aria-label="Fermer"
              >
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};
