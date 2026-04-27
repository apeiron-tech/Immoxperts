import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Bell, Inbox, Heart, Building2, Eye } from 'lucide-react';
import { ToastProvider } from '../components/shared/Toast';
import BellPopover from '../components/shared/BellPopover';

interface Props {
  children: React.ReactNode;
}

const VeilleLayout: React.FC<Props> = ({ children }) => {
  const navigate = useNavigate();
  return (
    <ToastProvider>
      <div className="flex bg-slate-50 h-screen">
        <aside className="w-[196px] flex-shrink-0 bg-white border-r border-slate-200 flex flex-col">
          <div className="px-3 py-2.5 border-b border-slate-200 flex items-center justify-between">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Veille</span>
            <BellPopover onNavigate={navigate} />
          </div>
          <nav className="flex-1 p-1.5 space-y-0.5">
            <NavLink
              to="/app/veille/notifications"
              className={({ isActive }) =>
                `flex items-center gap-2 px-2.5 py-1.5 text-[12.5px] rounded-md transition-colors ${
                  isActive
                    ? 'bg-propsight-50 text-propsight-700 font-medium'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              <Inbox size={13} />
              Notifications
            </NavLink>
            <NavLink
              to="/app/veille/alertes"
              className={({ isActive }) =>
                `flex items-center gap-2 px-2.5 py-1.5 text-[12.5px] rounded-md transition-colors ${
                  isActive
                    ? 'bg-propsight-50 text-propsight-700 font-medium'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              <Bell size={13} />
              Mes alertes
            </NavLink>
            <NavLink
              to="/app/veille/biens-suivis"
              className={({ isActive }) =>
                `flex items-center gap-2 px-2.5 py-1.5 text-[12.5px] rounded-md transition-colors ${
                  isActive
                    ? 'bg-propsight-50 text-propsight-700 font-medium'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              <Heart size={13} />
              Biens suivis
            </NavLink>
            <NavLink
              to="/app/veille/agences-concurrentes"
              className={({ isActive }) =>
                `flex items-center gap-2 px-2.5 py-1.5 text-[12.5px] rounded-md transition-colors ${
                  isActive
                    ? 'bg-propsight-50 text-propsight-700 font-medium'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              <Building2 size={13} />
              Agences concurrentes
            </NavLink>
          </nav>
          <div className="p-2 border-t border-slate-200">
            <div className="px-2 py-2 rounded-md bg-propsight-50/60 border border-propsight-100">
              <div className="text-[10px] font-semibold text-propsight-700 uppercase tracking-wide flex items-center gap-1">
                <Eye size={10} />
                Règle produit
              </div>
              <p className="text-[10.5px] text-slate-600 mt-1 leading-relaxed">
                Aucune notification sans impact métier. Aucune alerte sans objet surveillé.
              </p>
            </div>
          </div>
        </aside>
        <main className="flex-1 overflow-hidden flex flex-col min-w-0">{children}</main>
      </div>
    </ToastProvider>
  );
};

export default VeilleLayout;
