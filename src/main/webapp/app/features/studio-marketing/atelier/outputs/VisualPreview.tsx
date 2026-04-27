import React from 'react';
import { Image as ImageIcon } from 'lucide-react';
import type { MarketingAsset } from '../../types';

interface Props {
  asset: MarketingAsset;
}

const VisualPreview: React.FC<Props> = ({ asset }) => {
  const slides = (asset.metadata?.slides as string[] | undefined) ?? [];

  if (asset.asset_type === 'post_instagram_carousel') {
    const items = slides.length > 0 ? slides : ['Photo principale', 'Datapoint marché', 'CTA visite'];
    return (
      <div>
        <div className="text-[11px] text-neutral-500 mb-1.5">Visuels suggérés</div>
        <div className="grid grid-cols-3 gap-1.5">
          {items.map((label, i) => (
            <VisualThumbnail key={i} label={label} index={i} format="1:1" overlays={asset.visual_overlays} showOverlays={i === 0} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="text-[11px] text-neutral-500 mb-1.5">
        Visuel suggéré · format {asset.visual_format}
      </div>
      <div className={`grid ${asset.visual_format === '9:16' ? 'grid-cols-3' : 'grid-cols-2'} gap-1.5`}>
        <VisualThumbnail label="Photo principale" format={asset.visual_format ?? '1:1'} overlays={asset.visual_overlays} showOverlays />
      </div>
    </div>
  );
};

const VisualThumbnail: React.FC<{
  label: string;
  index?: number;
  format: '1:1' | '9:16' | '4:5' | '16:9';
  overlays?: MarketingAsset['visual_overlays'];
  showOverlays?: boolean;
}> = ({ label, format, overlays, showOverlays }) => {
  const aspectClass =
    format === '1:1' ? 'aspect-square' :
    format === '9:16' ? 'aspect-[9/16]' :
    format === '4:5' ? 'aspect-[4/5]' : 'aspect-video';

  return (
    <div className={`${aspectClass} relative rounded-md overflow-hidden bg-gradient-to-br from-propsight-100 via-neutral-100 to-propsight-50 border border-neutral-200 flex items-center justify-center`}>
      <ImageIcon size={20} className="text-neutral-400/70" />
      <div className="absolute bottom-1 left-1 right-1 text-[10px] text-neutral-700 bg-white/80 backdrop-blur-sm rounded px-1 py-0.5 truncate text-center">
        {label}
      </div>
      {showOverlays && overlays?.map((o, i) => (
        <span
          key={i}
          className={`absolute text-[9px] font-semibold px-1.5 py-0.5 rounded ${
            o.style === 'badge_violet' ? 'bg-propsight-600 text-white' :
            o.style === 'badge_dark' ? 'bg-neutral-900 text-white' :
            'border border-white/80 text-white bg-black/30 backdrop-blur'
          } ${
            o.position === 'top_left' ? 'top-1 left-1' :
            o.position === 'top_right' ? 'top-1 right-1' :
            o.position === 'bottom_left' ? 'bottom-1 left-1' :
            o.position === 'bottom_right' ? 'bottom-1 right-1' :
            'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
          }`}
        >
          {o.value}
        </span>
      ))}
    </div>
  );
};

export default VisualPreview;
