import React from 'react';
import { useLocation } from 'react-router-dom';
import { Wrench } from 'lucide-react';
import { findProNavItem, findProNavParent } from 'app/config/proNavigation';

const ProPlaceholderPage: React.FC = () => {
  const location = useLocation();
  const navItem = findProNavItem(location.pathname);
  const parent = findProNavParent(location.pathname);

  const title = navItem?.label ?? 'Module en préparation';
  const parentLabel = parent?.label;
  const description = navItem?.description ?? 'Ce module est en cours de préparation.';

  return (
    <div className="max-w-2xl mx-auto p-8">
      <div className="bg-white border border-neutral-200 rounded-lg p-8 text-center">
        <div className="w-12 h-12 rounded-lg bg-propsight-50 text-propsight-500 flex items-center justify-center mx-auto mb-4">
          <Wrench size={20} />
        </div>
        {parentLabel && (
          <div className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">{parentLabel}</div>
        )}
        <h1 className="text-xl font-semibold text-neutral-900">{title}</h1>
        <p className="mt-2 text-sm text-neutral-600">{description}</p>
        <div className="inline-flex items-center mt-4 px-3 h-7 rounded-md bg-amber-50 border border-amber-200 text-[12px] font-medium text-amber-700">
          Module en préparation
        </div>
      </div>
    </div>
  );
};

export default ProPlaceholderPage;
