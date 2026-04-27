import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { proRoutes } from 'app/config/proRoutes';

interface Props {
  children: React.ReactNode;
  title: string;
  breadcrumbCurrent: string;
  headerRight?: React.ReactNode;
}

const BiensLayout: React.FC<Props> = ({ children, title, breadcrumbCurrent, headerRight }) => (
  <div className="flex flex-col h-full min-h-0">
    <div className="flex-shrink-0 px-6 pt-5 pb-3 bg-white border-b border-neutral-200">
      <div className="flex items-center text-[12px] text-neutral-500 mb-1">
        <Link to={proRoutes.biens.portefeuille} className="hover:text-neutral-700 transition-colors">
          Biens immobiliers
        </Link>
        <ChevronRight size={11} className="mx-1 text-neutral-300" />
        <span className="text-neutral-700">{breadcrumbCurrent}</span>
      </div>
      <div className="flex items-center justify-between">
        <h1 className="text-[22px] font-semibold text-neutral-900">{title}</h1>
        {headerRight}
      </div>
    </div>
    <div className="flex-1 min-h-0 overflow-hidden">{children}</div>
  </div>
);

export default BiensLayout;
