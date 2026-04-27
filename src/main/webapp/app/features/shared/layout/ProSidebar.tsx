import React, { useMemo, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Activity,
  Home,
  Radar,
  Calculator,
  TrendingUp,
  LineChart,
  Eye,
  Users,
  Code2,
  Settings,
  HelpCircle,
  ChevronRight,
  LucideIcon,
} from 'lucide-react';
import logoSrc from '../../../../content/assets/propsight-logo.png';

interface SubItem {
  label: string;
  to: string;
}

interface SectionItem {
  label: string;
  icon: LucideIcon;
  to?: string;
  children?: SubItem[];
}

const SECTIONS: SectionItem[] = [
  { label: 'Tableau de bord', icon: LayoutDashboard, to: '/app' },
  {
    label: 'Mon activité',
    icon: Activity,
    children: [
      { label: 'Pilotage commercial', to: '/app/activite/pilotage' },
      { label: 'Leads', to: '/app/activite/leads' },
      { label: 'Performance', to: '/app/activite/performance' },
    ],
  },
  {
    label: 'Biens immobiliers',
    icon: Home,
    children: [
      { label: 'Portefeuille', to: '/app/biens/portefeuille' },
      { label: 'Annonces', to: '/app/biens/annonces' },
      { label: 'Biens vendus (DVF)', to: '/app/biens/dvf' },
    ],
  },
  {
    label: 'Prospection',
    icon: Radar,
    children: [
      { label: 'Radar', to: '/app/prospection/radar' },
      { label: 'Signaux DVF', to: '/app/prospection/signaux-dvf' },
      { label: 'Signaux DPE', to: '/app/prospection/signaux-dpe' },
    ],
  },
  {
    label: 'Estimation',
    icon: Calculator,
    children: [
      { label: 'Estimation rapide', to: '/app/estimation/rapide' },
      { label: 'Avis de valeur', to: '/app/estimation/avis-valeur' },
      { label: 'Étude locative', to: '/app/estimation/etude-locative' },
    ],
  },
  {
    label: 'Investissement',
    icon: TrendingUp,
    children: [
      { label: 'Opportunités', to: '/app/investissement/opportunites' },
      { label: 'Dossiers', to: '/app/investissement/dossiers' },
    ],
  },
  {
    label: 'Observatoire',
    icon: LineChart,
    children: [
      { label: 'Marché', to: '/app/observatoire/marche' },
      { label: 'Tension', to: '/app/observatoire/tension' },
      { label: 'Contexte local', to: '/app/observatoire/contexte' },
    ],
  },
  {
    label: 'Veille',
    icon: Eye,
    children: [
      { label: 'Alertes', to: '/app/veille/alertes' },
      { label: 'Notifications', to: '/app/veille/notifications' },
      { label: 'Biens suivis', to: '/app/veille/biens-suivis' },
      { label: 'Agences concurrentes', to: '/app/veille/agences-concurrentes' },
    ],
  },
  {
    label: 'Équipe',
    icon: Users,
    children: [
      { label: 'Vue équipe', to: '/app/equipe/vue' },
      { label: 'Activité', to: '/app/equipe/activite' },
      { label: 'Portefeuille', to: '/app/equipe/portefeuille' },
      { label: 'Agenda', to: '/app/equipe/agenda' },
      { label: 'Performance', to: '/app/equipe/performance' },
    ],
  },
  {
    label: 'Widgets',
    icon: Code2,
    children: [
      { label: "Vue d'ensemble", to: '/app/widgets' },
      { label: 'Estimation vendeur', to: '/app/widgets/estimation-vendeur' },
      { label: 'Projet investisseur', to: '/app/widgets/projet-investisseur' },
    ],
  },
];

const ProSidebar: React.FC = () => {
  const location = useLocation();

  const activeSectionLabel = useMemo(() => {
    for (const s of SECTIONS) {
      if (s.children?.some(c => location.pathname.startsWith(c.to))) return s.label;
      if (s.to && location.pathname === s.to) return s.label;
    }
    return null;
  }, [location.pathname]);

  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const isOpen = (label: string) => expanded[label] ?? (activeSectionLabel === label);

  const toggle = (label: string) =>
    setExpanded(prev => ({ ...prev, [label]: !(prev[label] ?? (activeSectionLabel === label)) }));

  return (
    <aside className="w-[236px] flex-shrink-0 bg-white border-r border-slate-200 flex flex-col h-full">
      {/* Logo */}
      <div className="h-14 flex items-center gap-2 px-4 border-b border-slate-200 flex-shrink-0">
        <img src={logoSrc} alt="Propsight" className="h-7 w-auto" />
        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-propsight-500 text-white tracking-wide">PRO</span>
      </div>

      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {SECTIONS.map(section => {
          const Icon = section.icon;
          const open = section.children ? isOpen(section.label) : false;
          const isActiveTop = section.to && location.pathname === section.to;
          const sectionActive = activeSectionLabel === section.label;

          if (!section.children) {
            return (
              <NavLink
                key={section.label}
                to={section.to || '#'}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-2.5 h-8 rounded-md text-[13px] transition-colors ${
                    isActive
                      ? 'bg-slate-100 text-slate-900 font-medium'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`
                }
              >
                <Icon size={15} className={isActiveTop ? 'text-propsight-600' : 'text-slate-400'} />
                {section.label}
              </NavLink>
            );
          }

          return (
            <div key={section.label} className={open ? 'pb-1' : ''}>
              <button
                onClick={() => toggle(section.label)}
                className={`w-full flex items-center gap-2.5 px-2.5 h-8 rounded-md text-[13px] transition-colors ${
                  sectionActive
                    ? 'text-slate-900 font-medium'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Icon size={15} className={sectionActive ? 'text-propsight-600' : 'text-slate-400'} />
                <span className="flex-1 text-left">{section.label}</span>
                <ChevronRight
                  size={13}
                  className={`text-slate-300 transition-transform ${open ? 'rotate-90' : ''}`}
                />
              </button>
              {open && (
                <div className="mt-0.5 ml-2 pl-4 border-l border-slate-100 space-y-0.5">
                  {section.children.map(child => (
                    <NavLink
                      key={child.to}
                      to={child.to}
                      className={({ isActive }) =>
                        `flex items-center justify-between pl-2.5 pr-2 h-7 rounded-md text-[13px] transition-colors ${
                          isActive
                            ? 'bg-propsight-50 text-propsight-700 font-medium'
                            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <span>{child.label}</span>
                          {isActive && <span className="w-1.5 h-1.5 rounded-full bg-propsight-500" />}
                        </>
                      )}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="border-t border-slate-200 p-2 space-y-0.5 flex-shrink-0">
        <NavLink
          to="/app/parametres"
          className={({ isActive }) =>
            `flex items-center gap-2.5 px-2.5 h-8 rounded-md text-[13px] transition-colors ${
              isActive ? 'bg-slate-100 text-slate-900 font-medium' : 'text-slate-600 hover:bg-slate-50'
            }`
          }
        >
          <Settings size={15} className="text-slate-400" />
          Paramètres
        </NavLink>
        <a
          href="#"
          className="flex items-center gap-2.5 px-2.5 h-8 rounded-md text-[13px] text-slate-600 hover:bg-slate-50 transition-colors"
        >
          <HelpCircle size={15} className="text-slate-400" />
          Aide & support
        </a>
      </div>
    </aside>
  );
};

export default ProSidebar;
