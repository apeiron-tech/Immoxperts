import React from 'react';
import { BlocComponentProps } from '../types';

const BlocPhotos: React.FC<BlocComponentProps> = ({ data, blocConfig }) => {
  const { estimation } = data;
  const photos =
    (blocConfig.customContent?.photos as string[]) ||
    Array.from({ length: 6 }, (_, i) => `https://picsum.photos/seed/${estimation.id}_p${i}/600/450`);

  return (
    <div className="rapport-bloc rapport-photos px-10 py-8">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-propsight-600 mb-4">Photos du bien</h2>

      <div className="grid grid-cols-3 gap-3">
        {photos.map((src, i) => (
          <div key={i} className={`rounded-lg overflow-hidden bg-slate-100 ${i === 0 ? 'col-span-2 row-span-2 aspect-[4/3]' : 'aspect-[4/3]'}`}>
            <img src={src} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlocPhotos;
