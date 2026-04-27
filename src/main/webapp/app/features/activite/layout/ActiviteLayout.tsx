import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, Users, BarChart3, Code2 } from 'lucide-react';

interface Props {
  children: React.ReactNode;
}

const ActiviteLayout: React.FC<Props> = ({ children }) => {
  return (
    <div className="flex h-screen">
      <aside className="w-[220px] flex-shrink-0 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-4 border-b border-slate-200">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Mon activité</span>
        </div>
        <nav className="flex-1 p-2 space-y-0.5">
          <NavLink
            to="/app/activite/pilotage"
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2 text-sm rounded-md transition-colors ${
                isActive ? 'bg-propsight-50 text-propsight-700 font-medium' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            <LayoutDashboard size={15} />
            Pilotage commercial
          </NavLink>
          <NavLink
            to="/app/activite/leads"
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2 text-sm rounded-md transition-colors ${
                isActive ? 'bg-propsight-50 text-propsight-700 font-medium' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            <Users size={15} />
            Leads
          </NavLink>
          <NavLink
            to="/app/activite/performance"
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2 text-sm rounded-md transition-colors ${
                isActive ? 'bg-propsight-50 text-propsight-700 font-medium' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            <BarChart3 size={15} />
            Performance
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

export default ActiviteLayout;
