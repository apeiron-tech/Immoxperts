import React from 'react';
import { ChevronDown } from 'lucide-react';

interface Props {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}

const EquipePageHeader: React.FC<Props> = ({ title, subtitle, right }) => (
  <div className="flex items-start justify-between gap-3 px-4 pt-3 pb-2 bg-white border-b border-slate-200 flex-shrink-0">
    <div className="min-w-0">
      <h1 className="text-[17px] font-bold text-slate-900 leading-tight">{title}</h1>
      {subtitle && <p className="text-[11.5px] text-slate-500 mt-0.5">{subtitle}</p>}
    </div>
    <div className="flex items-center gap-1.5 flex-shrink-0">{right}</div>
  </div>
);

export const OrgSwitcher: React.FC = () => (
  <button className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-[11.5px] text-slate-600 font-medium transition-colors">
    <span className="w-1.5 h-1.5 rounded-full bg-propsight-500" />
    Agence Propsight
    <ChevronDown size={11} />
  </button>
);

export default EquipePageHeader;
