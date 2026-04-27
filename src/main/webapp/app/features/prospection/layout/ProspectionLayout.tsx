import React from 'react';
import { NavLink } from 'react-router-dom';
import { Radar, Receipt, Zap } from 'lucide-react';
import { ToastProvider } from '../components/shared/Toast';

interface Props {
  children: React.ReactNode;
}

const ProspectionLayout: React.FC<Props> = ({ children }) => {
  return (
    <ToastProvider>
      <div className="flex bg-slate-50 h-screen">
        <aside className="w-[220px] flex-shrink-0 bg-white border-r border-slate-200 flex flex-col">
          <div className="p-4 border-b border-slate-200">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Prospection</span>
          </div>
          <nav className="flex-1 p-2 space-y-0.5">
            <NavLink
              to="/app/prospection/radar"
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 text-sm rounded-md transition-colors ${
                  isActive
                    ? 'bg-propsight-50 text-propsight-700 font-medium'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              <Radar size={15} />
              Radar
            </NavLink>
            <NavLink
              to="/app/prospection/signaux-dvf"
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 text-sm rounded-md transition-colors ${
                  isActive
                    ? 'bg-propsight-50 text-propsight-700 font-medium'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              <Receipt size={15} />
              Signaux DVF
            </NavLink>
            <NavLink
              to="/app/prospection/signaux-dpe"
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 text-sm rounded-md transition-colors ${
                  isActive
                    ? 'bg-propsight-50 text-propsight-700 font-medium'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              <Zap size={15} />
              Signaux DPE
            </NavLink>
          </nav>
          <div className="p-3 border-t border-slate-200">
            <div className="px-2 py-2 rounded-md bg-propsight-50/60 border border-propsight-100">
              <div className="text-[10px] font-semibold text-propsight-700 uppercase tracking-wide">Règle produit</div>
              <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                Aucun signal sans sens métier et action suivante.
              </p>
            </div>
          </div>
        </aside>
        <main className="flex-1 overflow-hidden flex flex-col min-w-0">{children}</main>
      </div>
    </ToastProvider>
  );
};

export default ProspectionLayout;
