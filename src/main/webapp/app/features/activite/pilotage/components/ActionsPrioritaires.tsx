import React from 'react';
import { Phone, Mail, Calendar, MapPin, RotateCcw, FileText, MoreHorizontal, ChevronRight, LucideIcon } from 'lucide-react';
import BlockShell from './BlockShell';
import { ActionItem, ActionType, Priority } from '../../types';
import { MOCK_ACTIONS } from '../../_mocks/pilotage';

const TYPE_STYLES: Record<ActionType, { Icon: LucideIcon; bg: string; fg: string }> = {
  appel:    { Icon: Phone,     bg: 'bg-orange-100', fg: 'text-orange-600' },
  email:    { Icon: Mail,      bg: 'bg-blue-100',   fg: 'text-blue-600' },
  rdv:      { Icon: Calendar,  bg: 'bg-propsight-100', fg: 'text-propsight-600' },
  location: { Icon: MapPin,    bg: 'bg-teal-100',   fg: 'text-teal-600' },
  relance:  { Icon: RotateCcw, bg: 'bg-amber-100',  fg: 'text-amber-600' },
  file:     { Icon: FileText,  bg: 'bg-slate-100',  fg: 'text-slate-600' },
};

const PRIORITY_DOTS: Record<Priority, { color: string; label: string }> = {
  haute:   { color: 'bg-red-500',    label: 'Haute' },
  moyenne: { color: 'bg-amber-500',  label: 'Moyenne' },
  basse:   { color: 'bg-slate-400',  label: 'Basse' },
};

const totalCount = MOCK_ACTIONS.reduce((sum, g) => sum + g.items.length, 0);

const handleActionClick = (action: ActionItem) => {
  console.warn('[Pilotage] Action clic', action.id, action.lead_id || action.dossier_id || action.signal_id);
};

const handleCta = (e: React.MouseEvent, action: ActionItem) => {
  e.stopPropagation();
  console.warn('[Pilotage] Action CTA', action.cta, action.id);
};

const ActionsPrioritaires: React.FC = () => {
  return (
    <BlockShell
      title="Actions prioritaires"
      showExpand
      showMenu
      footer={
        <button type="button" className="w-full text-center text-[11px] text-blue-600 hover:text-blue-700 font-medium">
          Voir toutes les actions ({totalCount}) →
        </button>
      }
    >
      <div>
        {MOCK_ACTIONS.map(group => (
          <div key={group.group}>
            <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 border-y border-slate-100 sticky top-0 z-[1]">
              <span className="text-[11px] font-medium text-slate-700">{group.group}</span>
              <span className="text-[10px] text-slate-500 bg-slate-200/70 px-1.5 rounded-full font-medium tabular-nums">{group.items.length}</span>
            </div>
            <ul>
              {group.items.map(item => (
                <ActionRow key={item.id} item={item} onClick={() => handleActionClick(item)} onCta={e => handleCta(e, item)} />
              ))}
            </ul>
          </div>
        ))}
      </div>
    </BlockShell>
  );
};

interface RowProps {
  item: ActionItem;
  onClick: () => void;
  onCta: (e: React.MouseEvent) => void;
}

const ActionRow: React.FC<RowProps> = ({ item, onClick, onCta }) => {
  const { Icon, bg, fg } = TYPE_STYLES[item.type];
  const dot = PRIORITY_DOTS[item.priority];
  return (
    <li
      onClick={onClick}
      className="group flex items-center gap-2 px-3 py-1.5 hover:bg-slate-50 cursor-pointer transition-colors border-b border-slate-50 last:border-b-0"
    >
      <div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 ${bg} ${fg}`}>
        <Icon size={11} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="text-[12px] font-medium text-slate-900 truncate">{item.label}</p>
          {item.retard && (
            <span className="text-[10px] font-medium text-red-700 bg-red-50 px-1 rounded flex-shrink-0">En retard {item.retard}</span>
          )}
          {item.heure && (
            <span className="text-[10px] font-medium text-slate-500 tabular-nums flex-shrink-0">{item.heure}</span>
          )}
          {item.date && !item.heure && (
            <span className="text-[10px] font-medium text-slate-500 flex-shrink-0">{item.date}</span>
          )}
        </div>
        <p className="text-[11px] text-slate-500 truncate">{item.target}</p>
      </div>
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <span className={`w-1.5 h-1.5 rounded-full ${dot.color}`} title={dot.label} />
        <button
          type="button"
          onClick={onCta}
          className="flex items-center gap-0.5 px-1.5 h-6 text-[11px] font-medium text-propsight-700 hover:bg-propsight-50 rounded transition-colors"
        >
          {item.cta}
          <ChevronRight size={11} />
        </button>
        <button
          type="button"
          onClick={e => { e.stopPropagation(); console.warn('[Pilotage] Menu action', item.id); }}
          className="p-0.5 rounded text-slate-300 group-hover:text-slate-500 hover:bg-slate-100 transition-colors"
        >
          <MoreHorizontal size={12} />
        </button>
      </div>
    </li>
  );
};

export default ActionsPrioritaires;
