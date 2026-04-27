import React, { useMemo } from 'react';
import { useAtelierStore } from '../../store/atelierStore';
import {
  CHANNEL_GROUP_ICONS,
  CHANNEL_GROUP_LABELS,
  CHANNEL_GROUP_ORDER,
  OUTPUT_DESCRIPTORS,
  PLAN_MARKETING_DESCRIPTOR,
} from '../../utils/outputCatalog';
import type { MarketingChannelGroup } from '../../types';

const OutputTabs: React.FC = () => {
  const outputs = useAtelierStore(s => s.outputs);
  const active = useAtelierStore(s => s.active_asset_type);
  const setActive = useAtelierStore(s => s.setActiveAssetType);
  const specialMode = useAtelierStore(s => s.special_mode);
  const modules = useAtelierStore(s => s.modules);

  const groups = useMemo(() => {
    const allDescriptors = specialMode === 'plan_marketing_adv'
      ? [...OUTPUT_DESCRIPTORS, PLAN_MARKETING_DESCRIPTOR]
      : OUTPUT_DESCRIPTORS;
    return CHANNEL_GROUP_ORDER.map(g => {
      const items = allDescriptors.filter(d => d.channel_group === g);
      const planAdvAllowed = g !== 'plan_adv' || (modules.estimation === 'active' && specialMode === 'plan_marketing_adv');
      return { group: g, items, planAdvAllowed };
    }).filter(x => x.items.length > 0 && x.planAdvAllowed);
  }, [specialMode, modules]);

  const groupOf = (assetType: string): MarketingChannelGroup | undefined =>
    [...OUTPUT_DESCRIPTORS, PLAN_MARKETING_DESCRIPTOR].find(d => d.asset_type === assetType)?.channel_group;

  const activeGroup = groupOf(active);

  return (
    <div className="flex-shrink-0 border-b border-neutral-200 bg-white">
      <div className="flex items-center gap-0.5 px-4 overflow-x-auto">
        {groups.map(g => {
          const Icon = CHANNEL_GROUP_ICONS[g.group];
          const hasReady = g.items.some(it => outputs.some(o => o.asset_type === it.asset_type));
          const isActive = activeGroup === g.group;
          const firstAsset = g.items[0]?.asset_type;
          return (
            <button
              key={g.group}
              onClick={() => firstAsset && setActive(firstAsset)}
              className={`relative flex items-center gap-1.5 h-10 px-3 text-[12px] font-medium whitespace-nowrap transition-colors border-b-2 ${
                isActive
                  ? 'text-propsight-700 border-propsight-600'
                  : 'text-neutral-600 border-transparent hover:text-neutral-900'
              }`}
            >
              <Icon size={13} />
              {CHANNEL_GROUP_LABELS[g.group]}
              {hasReady && (
                <span className="w-1.5 h-1.5 rounded-full bg-success-500" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default OutputTabs;
