import React from 'react';
import { NavLink } from 'react-router-dom';
import { TrendingUp, Activity, MapPin } from 'lucide-react';

interface Props {
  children: React.ReactNode;
}

const ObservatoireLayout: React.FC<Props> = ({ children }) => {
  return (
    <div className="flex bg-slate-50 h-screen">
      <aside className="w-[196px] flex-shrink-0 bg-white border-r border-slate-200 flex flex-col">
        <div className="px-3 py-2.5 border-b border-slate-200">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Observatoire</span>
        </div>
        <nav className="flex-1 p-1.5 space-y-0.5">
          <NavLink
            to="/app/observatoire/marche"
            className={({ isActive }) =>
              `flex items-center gap-2 px-2.5 py-1.5 text-[12.5px] rounded-md transition-colors ${
                isActive
                  ? 'bg-propsight-50 text-propsight-700 font-medium'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            <TrendingUp size={13} />
            Marché
          </NavLink>
          <NavLink
            to="/app/observatoire/tension"
            className={({ isActive }) =>
              `flex items-center gap-2 px-2.5 py-1.5 text-[12.5px] rounded-md transition-colors ${
                isActive
                  ? 'bg-propsight-50 text-propsight-700 font-medium'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            <Activity size={13} />
            Tension
          </NavLink>
          <NavLink
            to="/app/observatoire/contexte-local"
            className={({ isActive }) =>
              `flex items-center gap-2 px-2.5 py-1.5 text-[12.5px] rounded-md transition-colors ${
                isActive
                  ? 'bg-propsight-50 text-propsight-700 font-medium'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            <MapPin size={13} />
            Contexte local
          </NavLink>
        </nav>
      </aside>
      <main className="flex-1 overflow-hidden flex flex-col min-w-0">{children}</main>
    </div>
  );
};

export default ObservatoireLayout;
