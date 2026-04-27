import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Activity, FolderKanban, Calendar, BarChart3, Users } from 'lucide-react';

interface Props {
  children: React.ReactNode;
}

const NAV = [
  { to: '/app/equipe/vue', label: 'Vue équipe', icon: LayoutDashboard },
  { to: '/app/equipe/activite', label: 'Activité commerciale', icon: Activity },
  { to: '/app/equipe/portefeuille', label: 'Portefeuille & dossiers', icon: FolderKanban },
  { to: '/app/equipe/agenda', label: 'Agenda & charge', icon: Calendar },
  { to: '/app/equipe/performance', label: 'Performance business', icon: BarChart3 },
];

const EquipeLayout: React.FC<Props> = ({ children }) => {
  return (
    <div className="flex bg-slate-50 h-screen">
      <aside className="w-[196px] flex-shrink-0 bg-white border-r border-slate-200 flex flex-col">
        <div className="px-3 py-2.5 border-b border-slate-200 flex items-center gap-1.5">
          <Users size={12} className="text-slate-400" />
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Équipe</span>
        </div>
        <nav className="flex-1 p-1.5 space-y-0.5">
          {NAV.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-2 px-2.5 py-1.5 text-[12.5px] rounded-md transition-colors ${
                  isActive
                    ? 'bg-propsight-50 text-propsight-700 font-medium'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              <Icon size={13} />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="p-2 border-t border-slate-200">
          <div className="px-2 py-2 rounded-md bg-propsight-50/60 border border-propsight-100">
            <div className="text-[10px] font-semibold text-propsight-700 uppercase tracking-wide">
              Règle produit
            </div>
            <p className="text-[10.5px] text-slate-600 mt-1 leading-relaxed">
              Surcouche manager, pas de CRM parallèle. Chaque KPI renvoie vers un module source.
            </p>
          </div>
        </div>
      </aside>
      <main className="flex-1 overflow-hidden flex flex-col min-w-0">{children}</main>
    </div>
  );
};

export default EquipeLayout;
