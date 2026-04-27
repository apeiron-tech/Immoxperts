import React from 'react';
import { CHANNEL_META, MarketingChannelKey } from '../_mocks/marketing';

interface Props {
  channel: MarketingChannelKey;
  size?: 'sm' | 'md';
  withLabel?: boolean;
}

const ChannelBadge: React.FC<Props> = ({ channel, size = 'sm', withLabel = false }) => {
  const meta = CHANNEL_META[channel];
  const Icon = meta.icon;
  const px = size === 'md' ? 14 : 12;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded ${meta.tone} ${
        size === 'md' ? 'text-[12px] px-2 py-0.5' : 'text-[11px] px-1.5 py-0.5'
      }`}
      title={meta.label}
    >
      <Icon size={px} />
      {withLabel && <span className="font-medium">{meta.label}</span>}
    </span>
  );
};

export default ChannelBadge;
