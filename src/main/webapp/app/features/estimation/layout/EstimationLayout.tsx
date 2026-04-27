import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Zap, FileText, Home, Code2, ShieldCheck } from 'lucide-react';

interface Props {
  children: React.ReactNode;
}

const EstimationLayout: React.FC<Props> = ({ children }) => {
  return (
    <div className="flex h-screen">
      <aside className="w-[220px] flex-shrink-0 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-4 border-b border-slate-200">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Estimation</span>
        </div>
        <nav className="flex-1 p-2 space-y-0.5">
          <NavLink
            to="/app/estimation/rapide"
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2 text-sm rounded-md transition-colors ${
                isActive ? 'bg-propsight-50 text-propsight-700 font-medium' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            <Zap size={15} />
            Estimation rapide
          </NavLink>
          <NavLink
            to="/app/estimation/avis-valeur"
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2 text-sm rounded-md transition-colors ${
                isActive ? 'bg-propsight-50 text-propsight-700 font-medium' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            <FileText size={15} />
            Avis de valeur
          </NavLink>
          <NavLink
            to="/app/estimation/etude-locative"
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2 text-sm rounded-md transition-colors ${
                isActive ? 'bg-propsight-50 text-propsight-700 font-medium' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            <Home size={15} />
            Étude locative
          </NavLink>
          <NavLink
            to="/app/estimation/expert"
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2 text-sm rounded-md transition-colors ${
                isActive ? 'bg-propsight-50 text-propsight-700 font-medium' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            <ShieldCheck size={15} />
            Expert
            <span className="ml-auto text-[9px] font-semibold text-propsight-700 bg-propsight-100 px-1.5 py-0.5 rounded uppercase tracking-wider">
              RICS · TEGOVA
            </span>
          </NavLink>
        </nav>
        <div className="p-2 border-t border-slate-200">
          <Link
            to="/app/widgets"
            className="flex items-center gap-2.5 px-3 py-2 text-sm rounded-md text-slate-500 hover:bg-slate-50 hover:text-propsight-700 transition-colors"
          >
            <Code2 size={15} />
            Widgets publics
          </Link>
        </div>
      </aside>

      <main className="flex-1 overflow-auto bg-slate-50">
        {children}
      </main>
    </div>
  );
};

export default EstimationLayout;
