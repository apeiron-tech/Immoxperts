import React from 'react';

interface Props {
  count: number;
}

const OpensDots: React.FC<Props> = ({ count }) => {
  if (count <= 0) {
    return <span className="text-[11.5px] text-slate-400">pas ouvert</span>;
  }

  const max = 4;
  const dots = Math.min(count, max);
  const tone =
    count >= 4 ? 'bg-rose-500' : count >= 3 ? 'bg-amber-500' : 'bg-propsight-500';

  return (
    <span className="inline-flex items-center gap-1.5" title={`${count} ouverture${count > 1 ? 's' : ''}`}>
      <span className="flex items-center gap-0.5">
        {Array.from({ length: max }).map((_, i) => (
          <span
            key={i}
            className={`w-[5px] h-[5px] rounded-full ${i < dots ? tone : 'bg-slate-200'}`}
          />
        ))}
      </span>
      <span className="text-[11.5px] text-slate-600">
        {count} fois
      </span>
    </span>
  );
};

export default OpensDots;
