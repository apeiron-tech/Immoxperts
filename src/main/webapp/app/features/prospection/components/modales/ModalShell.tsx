import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer: React.ReactNode;
  width?: number;
}

const ModalShell: React.FC<Props> = ({ open, onClose, title, subtitle, children, footer, width = 520 }) => {
  useEffect(() => {
    if (!open) return;
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative bg-white rounded-lg shadow-2xl border border-slate-200 flex flex-col max-h-[85vh]"
        style={{ width }}
      >
        <div className="flex items-start justify-between gap-3 px-5 py-4 border-b border-slate-200">
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-slate-900">{title}</h2>
            {subtitle && <p className="text-[12px] text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 inline-flex items-center justify-center rounded hover:bg-slate-100 flex-shrink-0"
            aria-label="Fermer"
          >
            <X size={16} className="text-slate-500" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">{children}</div>
        <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-slate-200 bg-slate-50 rounded-b-lg">
          {footer}
        </div>
      </div>
    </div>
  );
};

export default ModalShell;

export const Field: React.FC<{
  label: string;
  required?: boolean;
  children: React.ReactNode;
  hint?: string;
}> = ({ label, required, children, hint }) => (
  <div className="space-y-1">
    <label className="text-[11px] font-medium text-slate-700">
      {label} {required && <span className="text-rose-500">*</span>}
    </label>
    {children}
    {hint && <p className="text-[10px] text-slate-500">{hint}</p>}
  </div>
);

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = props => (
  <input
    {...props}
    className={`w-full h-9 px-3 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-propsight-500 focus:border-propsight-500 ${
      props.className || ''
    }`}
  />
);

export const Textarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = props => (
  <textarea
    {...props}
    className={`w-full px-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-propsight-500 focus:border-propsight-500 ${
      props.className || ''
    }`}
  />
);

export const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = props => (
  <select
    {...props}
    className={`w-full h-9 px-2.5 text-sm border border-slate-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-propsight-500 focus:border-propsight-500 ${
      props.className || ''
    }`}
  />
);

export const ReadOnlyCell: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div className="px-3 py-2 rounded-md bg-slate-50 border border-slate-200">
    <div className="text-[10px] text-slate-500 uppercase tracking-wide">{label}</div>
    <div className="text-[13px] text-slate-900 font-medium mt-0.5">{value}</div>
  </div>
);
