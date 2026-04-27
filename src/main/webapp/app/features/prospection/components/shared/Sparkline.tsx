import React from 'react';

interface Props {
  data: number[];
  color?: string;
  width?: number;
  height?: number;
}

const Sparkline: React.FC<Props> = ({ data, color = '#7C3AED', width = 80, height = 28 }) => {
  if (data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const stepX = width / (data.length - 1);
  const points = data
    .map((v, i) => {
      const x = i * stepX;
      const y = height - ((v - min) / range) * height;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <polygon points={`0,${height} ${points} ${width},${height}`} fill={color} opacity={0.08} />
    </svg>
  );
};

export default Sparkline;
