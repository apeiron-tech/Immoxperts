import React, { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import type { ProNavItem as ProNavItemType } from 'app/config/proNavigation';
import ProNavItem from './ProNavItem';

interface Props {
  item: ProNavItemType;
}

const ProNavGroup: React.FC<Props> = ({ item }) => {
  const location = useLocation();
  const Icon = item.icon;

  const containsActive = useMemo(
    () => Boolean(item.children?.some(c => location.pathname.startsWith(c.to))),
    [item.children, location.pathname],
  );

  const [open, setOpen] = useState(containsActive);

  React.useEffect(() => {
    if (containsActive) setOpen(true);
  }, [containsActive]);

  if (!item.children || item.children.length === 0) {
    return <ProNavItem to={item.to} label={item.label} icon={item.icon} level={1} end={item.to === '/app/tableau-de-bord'} />;
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className={`w-full flex items-center gap-2 h-8 pl-3 pr-2 rounded-md text-[12.5px] transition-colors ${
          containsActive ? 'text-neutral-900 font-medium' : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
        }`}
      >
        {Icon && <Icon size={14} className="flex-shrink-0" />}
        <span className="flex-1 text-left truncate">{item.label}</span>
        <ChevronRight size={12} className={`transition-transform text-neutral-400 ${open ? 'rotate-90' : ''}`} />
      </button>
      {open && (
        <div className="mt-0.5 space-y-0.5">
          {item.children.map(child => (
            <ProNavItem key={child.to} to={child.to} label={child.label} level={2} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProNavGroup;
