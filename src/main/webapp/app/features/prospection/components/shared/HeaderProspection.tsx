import React from 'react';
import { ChevronRight, Bell } from 'lucide-react';

interface Props {
  breadcrumb: string;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

const HeaderProspection: React.FC<Props> = ({ breadcrumb, title, subtitle, actions }) => {
  return (
    <div className="px-5 pt-4 pb-3 border-b border-slate-200 bg-white">
      <div className="flex items-center text-[11px] text-slate-500 gap-1 mb-1">
        <span>Prospection</span>
        <ChevronRight size={12} />
        <span className="font-medium text-slate-700">{breadcrumb}</span>
      </div>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-xl font-semibold text-slate-900 tracking-tight">{title}</h1>
          {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {actions}
          <button
            type="button"
            className="relative h-8 w-8 inline-flex items-center justify-center rounded-md border border-slate-200 hover:bg-slate-50"
            aria-label="Notifications"
          >
            <Bell size={14} className="text-slate-600" />
            <span className="absolute -top-1 -right-1 h-4 min-w-4 px-1 flex items-center justify-center text-[9px] font-semibold text-white bg-rose-500 rounded-full">
              3
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeaderProspection;
