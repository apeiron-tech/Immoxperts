import React from 'react';
import { Link } from 'react-router-dom';
import { proNavigation, proSettingsNav } from 'app/config/proNavigation';
import { isFeatureEnabled } from 'app/config/featureFlags';
import { useAuth } from 'app/shared/auth/useAuth';
import ProNavGroup from './ProNavGroup';
import ProNavItem from './ProNavItem';
import logoSrc from '../../../content/assets/propsight-logo.png';

const SidebarPro: React.FC = () => {
  const { role } = useAuth();

  const visibleSections = proNavigation.filter(section => {
    if (section.featureFlag && !isFeatureEnabled(section.featureFlag)) return false;
    if (section.roles && !section.roles.includes(role)) return false;
    return true;
  });

  return (
    <aside className="w-60 flex-shrink-0 border-r border-neutral-200 bg-white flex flex-col">
      <div className="h-14 flex items-center px-4 border-b border-neutral-200">
        <Link to="/app/tableau-de-bord" className="flex items-center gap-2">
          <img src={logoSrc} alt="Propsight" className="h-6 w-auto" />
          <span className="text-[10px] font-semibold text-propsight-600 bg-propsight-50 border border-propsight-200 px-1.5 py-0.5 rounded">PRO</span>
        </Link>
      </div>
      <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
        {visibleSections.map(section =>
          section.children ? <ProNavGroup key={section.to} item={section} /> : (
            <ProNavItem
              key={section.to}
              to={section.to}
              label={section.label}
              icon={section.icon}
              level={1}
              end={section.to === '/app/tableau-de-bord'}
            />
          ),
        )}
      </nav>
      <div className="border-t border-neutral-200 p-3">
        <ProNavItem to={proSettingsNav.to} label={proSettingsNav.label} icon={proSettingsNav.icon} level={1} />
      </div>
    </aside>
  );
};

export default SidebarPro;
