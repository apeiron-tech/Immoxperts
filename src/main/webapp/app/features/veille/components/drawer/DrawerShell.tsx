import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface Props {
  onClose: () => void;
  children: React.ReactNode;
  width?: number;
}

const DrawerShell: React.FC<Props> = ({ onClose, children, width = 440 }) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <>
      <div className="fixed inset-0 z-[90] bg-slate-900/10" onClick={onClose} />
      <aside
        className="fixed top-0 right-0 bottom-0 z-[100] bg-white border-l border-slate-200 shadow-2xl flex flex-col"
        style={{ width }}
      >
        {children}
      </aside>
    </>
  );
};

export const DrawerCloseButton: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <button
    onClick={onClose}
    className="h-7 w-7 inline-flex items-center justify-center rounded hover:bg-slate-100 text-slate-500"
    aria-label="Fermer"
  >
    <X size={15} />
  </button>
);

export default DrawerShell;
