import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  User,
  ChevronDown,
  Plus,
  Calculator,
  UserPlus,
  Home,
  LineChart,
  Bell,
  FolderPlus,
  LucideIcon,
} from 'lucide-react';
import type { DashboardPeriod, DashboardQuickAction, DashboardScope } from '../types';

const PERIOD_LABELS: Record<DashboardPeriod, string> = {
  '7j': '7 jours',
  '30j': '30 jours',
  trim: 'Trimestre',
  '12m': '12 mois',
  custom: 'Personnalisé',
};

const ZONES = [
  { id: 'paris-15', label: 'Paris 15e' },
  { id: 'paris-16', label: 'Paris 16e' },
  { id: 'paris-7', label: 'Paris 7e' },
  { id: 'boulogne', label: 'Boulogne-Billancourt' },
];

const SCOPE_LABELS: Record<DashboardScope, string> = {
  me: 'Moi',
  equipe: 'Équipe',
};

const QA_ICONS: Record<string, LucideIcon> = {
  Calculator,
  UserPlus,
  Home,
  LineChart,
  Bell,
  FolderPlus,
};

interface Props {
  period: DashboardPeriod;
  onPeriodChange: (p: DashboardPeriod) => void;
  zoneId: string;
  zoneLabel: string;
  onZoneChange: (id: string, label: string) => void;
  scope: DashboardScope;
  onScopeChange: (s: DashboardScope) => void;
  quickActions: DashboardQuickAction[];
}

interface DropdownProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  align?: 'left' | 'right';
}

const Dropdown: React.FC<DropdownProps> = ({ open, onClose, children, align = 'left' }) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      ref={ref}
      className={`absolute top-full mt-1 z-50 min-w-[200px] bg-white border border-slate-200 rounded-md shadow-lg py-1 ${
        align === 'right' ? 'right-0' : 'left-0'
      }`}
    >
      {children}
    </div>
  );
};

const DashboardHeader: React.FC<Props> = ({
  period,
  onPeriodChange,
  zoneId,
  zoneLabel,
  onZoneChange,
  scope,
  onScopeChange,
  quickActions,
}) => {
  const navigate = useNavigate();
  const [openPeriod, setOpenPeriod] = useState(false);
  const [openZone, setOpenZone] = useState(false);
  const [openScope, setOpenScope] = useState(false);
  const [openQA, setOpenQA] = useState(false);

  return (
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <h1 className="text-[22px] font-semibold text-slate-900 leading-tight tracking-tight">
          Tableau de bord
        </h1>
        <p className="text-[12.5px] text-slate-500 mt-0.5">
          Vue d'ensemble de votre activité, opportunités et signaux importants.
        </p>
      </div>

      <div className="flex-shrink-0 flex items-center gap-2">
        {/* Période */}
        <div className="relative">
          <button
            type="button"
            onClick={() => { setOpenPeriod(o => !o); setOpenZone(false); setOpenScope(false); setOpenQA(false); }}
            className="h-8 px-2.5 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-[12.5px] text-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <Calendar size={13} className="text-slate-400" />
            {PERIOD_LABELS[period]}
            <ChevronDown size={12} className="text-slate-400" />
          </button>
          <Dropdown open={openPeriod} onClose={() => setOpenPeriod(false)}>
            {(Object.entries(PERIOD_LABELS) as [DashboardPeriod, string][]).map(([k, label]) => (
              <button
                key={k}
                type="button"
                onClick={() => { onPeriodChange(k); setOpenPeriod(false); }}
                className={`w-full text-left px-3 py-1.5 text-[12.5px] hover:bg-slate-50 ${
                  period === k ? 'text-propsight-700 font-medium' : 'text-slate-700'
                }`}
              >
                {label}
              </button>
            ))}
          </Dropdown>
        </div>

        {/* Zone */}
        <div className="relative">
          <button
            type="button"
            onClick={() => { setOpenZone(o => !o); setOpenPeriod(false); setOpenScope(false); setOpenQA(false); }}
            className="h-8 px-2.5 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-[12.5px] text-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <MapPin size={13} className="text-slate-400" />
            {zoneLabel}
            <ChevronDown size={12} className="text-slate-400" />
          </button>
          <Dropdown open={openZone} onClose={() => setOpenZone(false)}>
            {ZONES.map(z => (
              <button
                key={z.id}
                type="button"
                onClick={() => { onZoneChange(z.id, z.label); setOpenZone(false); }}
                className={`w-full text-left px-3 py-1.5 text-[12.5px] hover:bg-slate-50 ${
                  zoneId === z.id ? 'text-propsight-700 font-medium' : 'text-slate-700'
                }`}
              >
                {z.label}
              </button>
            ))}
          </Dropdown>
        </div>

        {/* Scope */}
        <div className="relative">
          <button
            type="button"
            onClick={() => { setOpenScope(o => !o); setOpenPeriod(false); setOpenZone(false); setOpenQA(false); }}
            className="h-8 px-2.5 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-[12.5px] text-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <User size={13} className="text-slate-400" />
            {SCOPE_LABELS[scope]}
            <ChevronDown size={12} className="text-slate-400" />
          </button>
          <Dropdown open={openScope} onClose={() => setOpenScope(false)}>
            {(Object.entries(SCOPE_LABELS) as [DashboardScope, string][]).map(([k, label]) => (
              <button
                key={k}
                type="button"
                onClick={() => { onScopeChange(k); setOpenScope(false); }}
                className={`w-full text-left px-3 py-1.5 text-[12.5px] hover:bg-slate-50 ${
                  scope === k ? 'text-propsight-700 font-medium' : 'text-slate-700'
                }`}
              >
                {label}
              </button>
            ))}
          </Dropdown>
        </div>

        {/* Action rapide */}
        <div className="relative">
          <button
            type="button"
            onClick={() => { setOpenQA(o => !o); setOpenPeriod(false); setOpenZone(false); setOpenScope(false); }}
            className="h-8 px-3 rounded-md bg-propsight-600 hover:bg-propsight-700 text-white text-[12.5px] font-medium flex items-center gap-1.5 transition-colors"
          >
            <Plus size={13} />
            Action rapide
            <ChevronDown size={12} />
          </button>
          <Dropdown open={openQA} onClose={() => setOpenQA(false)} align="right">
            {quickActions.map(qa => {
              const Icon = QA_ICONS[qa.icon] ?? Plus;
              return (
                <button
                  key={qa.id}
                  type="button"
                  onClick={() => { setOpenQA(false); navigate(qa.href); }}
                  className="w-full text-left px-3 py-1.5 text-[12.5px] text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <Icon size={13} className="text-slate-400" />
                  {qa.label}
                </button>
              );
            })}
          </Dropdown>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
