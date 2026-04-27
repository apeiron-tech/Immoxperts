import React from 'react';
import {
  Calculator,
  FileText,
  Target,
  FolderOpen,
  Users,
  CheckSquare,
  Bell,
  Bookmark,
  ChevronRight,
  Home,
} from 'lucide-react';
import { Bien } from '../types';

interface Props {
  bien: Bien;
  compact?: boolean;
}

const LINK_COLORS: Record<string, string> = {
  estimations: 'text-blue-600 bg-blue-50',
  avis: 'text-propsight-600 bg-propsight-50',
  etudes: 'text-cyan-600 bg-cyan-50',
  opportunites: 'text-green-600 bg-green-50',
  dossier: 'text-amber-600 bg-amber-50',
  leads: 'text-orange-600 bg-orange-50',
  actions: 'text-red-500 bg-red-50',
  alertes: 'text-pink-600 bg-pink-50',
  suivi: 'text-propsight-600 bg-propsight-50',
};

const BienLinksBlock: React.FC<Props> = ({ bien, compact = false }) => {
  const links = [
    { id: 'estimations', icon: Calculator, label: 'Estimations', value: bien.estimations_count },
    { id: 'avis', icon: FileText, label: 'Avis de valeur', value: bien.avis_valeur_count },
    { id: 'etudes', icon: Home, label: 'Études locatives', value: bien.etudes_locatives_count },
    { id: 'opportunites', icon: Target, label: 'Opportunités', value: bien.opportunites_count },
    { id: 'dossier', icon: FolderOpen, label: 'Dossier', value: bien.dossier_ref ? 1 : 0 },
    { id: 'leads', icon: Users, label: 'Leads', value: bien.leads_count },
    { id: 'actions', icon: CheckSquare, label: 'Actions', value: bien.actions_count },
    { id: 'alertes', icon: Bell, label: 'Alertes', value: bien.alertes_count },
    { id: 'suivi', icon: Bookmark, label: 'Bien suivi', value: bien.suivi ? 'Oui' : 'Non' },
  ];

  return (
    <div className={`grid ${compact ? 'grid-cols-2' : 'grid-cols-3'} gap-1.5`}>
      {links.map(l => {
        const Icon = l.icon;
        const colorClass = LINK_COLORS[l.id] || 'text-slate-500 bg-slate-50';
        const hasValue = typeof l.value === 'number' ? l.value > 0 : l.value === 'Oui';
        return (
          <button
            key={l.id}
            className={`flex items-center justify-between gap-2 p-2 rounded-md border border-slate-200 bg-white hover:border-propsight-300 hover:bg-propsight-50/30 transition-colors text-left group ${!hasValue && 'opacity-70'}`}
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className={`w-6 h-6 rounded flex items-center justify-center flex-shrink-0 ${hasValue ? colorClass : 'text-slate-400 bg-slate-50'}`}>
                <Icon size={11} />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] text-slate-500 leading-tight truncate">{l.label}</div>
                <div className={`text-[12px] font-semibold tabular-nums leading-tight ${hasValue ? 'text-slate-900' : 'text-slate-400'}`}>{l.value}</div>
              </div>
            </div>
            {hasValue && <ChevronRight size={12} className="text-slate-300 group-hover:text-propsight-500 flex-shrink-0" />}
          </button>
        );
      })}
    </div>
  );
};

export default BienLinksBlock;
