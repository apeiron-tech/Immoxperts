import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

type ToastKind = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  kind: ToastKind;
}

interface ToastCtx {
  push: (t: { message: string; kind?: ToastKind }) => void;
}

const Ctx = createContext<ToastCtx>({ push: () => void 0 });

export const useToast = () => useContext(Ctx);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<Toast[]>([]);

  const push = useCallback((t: { message: string; kind?: ToastKind }) => {
    const id = Math.random().toString(36).slice(2, 9);
    const toast: Toast = { id, message: t.message, kind: t.kind ?? 'info' };
    setItems(prev => [...prev, toast]);
    setTimeout(() => setItems(prev => prev.filter(x => x.id !== id)), 3500);
  }, []);

  return (
    <Ctx.Provider value={{ push }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[300] flex flex-col gap-2 pointer-events-none">
        {items.map(it => (
          <ToastItem key={it.id} item={it} onClose={() => setItems(prev => prev.filter(x => x.id !== it.id))} />
        ))}
      </div>
    </Ctx.Provider>
  );
};

const ToastItem: React.FC<{ item: Toast; onClose: () => void }> = ({ item, onClose }) => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(t);
  }, []);
  const bg =
    item.kind === 'success'
      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
      : item.kind === 'error'
        ? 'bg-rose-50 border-rose-200 text-rose-800'
        : 'bg-white border-slate-200 text-slate-800';
  const Icon = item.kind === 'error' ? AlertCircle : CheckCircle2;
  return (
    <div
      className={`pointer-events-auto rounded-md border shadow-md px-3 py-2 text-[12px] flex items-center gap-2 transition-all ${bg} ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      }`}
    >
      <Icon size={14} className={item.kind === 'error' ? 'text-rose-500' : 'text-emerald-500'} />
      <span>{item.message}</span>
      <button onClick={onClose} className="ml-1 text-slate-400 hover:text-slate-600">
        <X size={12} />
      </button>
    </div>
  );
};
