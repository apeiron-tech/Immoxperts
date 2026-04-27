import React from 'react';
import { AlertTriangle, Check, Pencil, Star } from 'lucide-react';
import { useAtelierStore } from '../../store/atelierStore';
import {
  CHANNEL_GROUP_ICONS,
  OUTPUT_DESCRIPTORS,
  PLAN_MARKETING_DESCRIPTOR,
} from '../../utils/outputCatalog';

const OutputsList: React.FC = () => {
  const outputs = useAtelierStore(s => s.outputs);
  const active = useAtelierStore(s => s.active_asset_type);
  const setActive = useAtelierStore(s => s.setActiveAssetType);
  const specialMode = useAtelierStore(s => s.special_mode);
  const modules = useAtelierStore(s => s.modules);

  const descriptors = specialMode === 'plan_marketing_adv'
    ? [...OUTPUT_DESCRIPTORS, PLAN_MARKETING_DESCRIPTOR]
    : OUTPUT_DESCRIPTORS;

  return (
    <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
      <div className="px-3 py-2.5 border-b border-neutral-100 flex items-center justify-between">
        <h3 className="text-[12px] font-semibold text-neutral-900">Outputs du kit</h3>
        <span className="text-[10.5px] text-neutral-500">
          {outputs.length}/{descriptors.length}
        </span>
      </div>
      <ul className="max-h-[420px] overflow-y-auto">
        {descriptors.map(d => {
          const Icon = CHANNEL_GROUP_ICONS[d.channel_group];
          const out = outputs.find(o => o.asset_type === d.asset_type);
          const isActive = active === d.asset_type;
          const moduleMissing = d.requires_module && modules[d.requires_module] !== 'active';

          return (
            <li key={d.asset_type}>
              <button
                onClick={() => setActive(d.asset_type)}
                disabled={moduleMissing}
                className={`w-full flex items-center gap-2 px-3 py-2 text-left transition-colors border-l-2 ${
                  isActive
                    ? 'bg-propsight-50 border-propsight-600'
                    : 'border-transparent hover:bg-neutral-50'
                } ${moduleMissing ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Icon size={12} className="text-neutral-500 flex-shrink-0" />
                <span className={`text-[12px] flex-1 truncate ${isActive ? 'text-propsight-800 font-medium' : 'text-neutral-800'}`}>
                  {d.short_label}
                </span>
                <StatusIcon out={out} moduleMissing={!!moduleMissing} />
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

const StatusIcon: React.FC<{ out?: { is_edited_by_user: boolean; is_validated: boolean; status: string }; moduleMissing: boolean }> = ({
  out,
  moduleMissing,
}) => {
  if (moduleMissing) {
    return <span className="text-[10px] text-neutral-400 italic">— upsell</span>;
  }
  if (!out) return <span className="text-neutral-300 text-[12px]">—</span>;
  if (out.status === 'error') return <AlertTriangle size={12} className="text-warning-500" />;
  if (out.is_validated) return <Star size={12} className="text-propsight-600" fill="currentColor" />;
  if (out.is_edited_by_user) return (
    <span className="inline-flex items-center gap-0.5 text-success-700">
      <Check size={12} /><Pencil size={9} />
    </span>
  );
  return <Check size={12} className="text-success-700" />;
};

export default OutputsList;
