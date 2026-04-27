import React from 'react';
import { NavLink } from 'react-router-dom';
import { Target, FolderOpen, Briefcase } from 'lucide-react';

interface Props {
  children: React.ReactNode;
}

const InvestissementLayout: React.FC<Props> = ({ children }) => {
  return (
    <div className="flex h-screen">
      <aside className="w-[220px] flex-shrink-0 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-4 border-b border-slate-200 flex items-center gap-2">
          <Briefcase size={14} className="text-propsight-600" />
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Investissement</span>
        </div>
        <nav className="flex-1 p-2 space-y-0.5">
          <NavLink
            to="/app/investissement/opportunites"
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2 text-sm rounded-md transition-colors ${
                isActive ? 'bg-propsight-50 text-propsight-700 font-medium' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            <Target size={15} />
            Opportunités
          </NavLink>
          <NavLink
            to="/app/investissement/dossiers"
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2 text-sm rounded-md transition-colors ${
                isActive ? 'bg-propsight-50 text-propsight-700 font-medium' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            <FolderOpen size={15} />
            Dossiers
          </NavLink>
        </nav>
      </aside>

      <main className="flex-1 overflow-auto bg-slate-50">{children}</main>
    </div>
  );
};

export default InvestissementLayout;
