import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { LayoutGrid, Home, TrendingUp, ArrowRight } from 'lucide-react';

interface Props {
  children: React.ReactNode;
}

const navItemClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-2.5 px-3 py-2 text-sm rounded-md transition-colors ${
    isActive ? 'bg-propsight-50 text-propsight-700 font-medium' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
  }`;

const WidgetsLayout: React.FC<Props> = ({ children }) => {
  return (
    <div className="flex h-screen">
      <aside className="w-[220px] flex-shrink-0 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-4 border-b border-slate-200">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Widgets publics</span>
        </div>
        <nav className="flex-1 p-2 space-y-0.5">
          <NavLink to="/app/widgets" end className={navItemClass}>
            <LayoutGrid size={15} />
            Vue d'ensemble
          </NavLink>
          <NavLink to="/app/widgets/estimation-vendeur" className={navItemClass}>
            <Home size={15} />
            Estimation vendeur
          </NavLink>
          <NavLink to="/app/widgets/projet-investisseur" className={navItemClass}>
            <TrendingUp size={15} />
            Projet investisseur
          </NavLink>
        </nav>
        <div className="p-3 border-t border-slate-200 space-y-2">
          <div className="rounded-md bg-propsight-50 border border-propsight-100 px-3 py-2.5">
            <div className="text-xs font-semibold text-propsight-900">Plan Widgets actif</div>
            <div className="text-[11px] text-propsight-700 mt-0.5">2 instances · jusqu'au 31/12/2026</div>
          </div>
          <div className="space-y-0.5">
            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-2 py-1">Raccourcis</div>
            <Link
              to="/app/estimation/rapide"
              className="flex items-center justify-between px-2 py-1.5 text-xs text-slate-600 hover:text-propsight-700 hover:bg-slate-50 rounded"
            >
              Estimation
              <ArrowRight size={11} />
            </Link>
            <Link
              to="/app/activite/leads"
              className="flex items-center justify-between px-2 py-1.5 text-xs text-slate-600 hover:text-propsight-700 hover:bg-slate-50 rounded"
            >
              Leads
              <ArrowRight size={11} />
            </Link>
            <Link
              to="/app/activite/leads/lead_sophie_martin"
              className="flex items-center justify-between px-2 py-1.5 text-xs text-slate-600 hover:text-propsight-700 hover:bg-slate-50 rounded"
            >
              Fiche lead widget
              <ArrowRight size={11} />
            </Link>
          </div>
        </div>
      </aside>
      <main className="flex-1 overflow-auto bg-slate-50">{children}</main>
    </div>
  );
};

export default WidgetsLayout;
