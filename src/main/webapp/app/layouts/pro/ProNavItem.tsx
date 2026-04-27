import React from 'react';
import { NavLink } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';

interface Props {
  to: string;
  label: string;
  icon?: LucideIcon;
  level?: 1 | 2;
  end?: boolean;
}

const ProNavItem: React.FC<Props> = ({ to, label, icon: Icon, level = 2, end = false }) => {
  const heightClass = level === 1 ? 'h-8' : 'h-7';
  const paddingClass = level === 1 ? 'pl-3 pr-2' : 'pl-8 pr-2';
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex items-center gap-2 ${heightClass} ${paddingClass} rounded-md text-[12.5px] transition-colors ${
          isActive
            ? 'bg-propsight-50 text-propsight-700 font-medium'
            : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
        }`
      }
    >
      {Icon && <Icon size={14} className="flex-shrink-0" />}
      <span className="truncate">{label}</span>
    </NavLink>
  );
};

export default ProNavItem;
