import React from 'react';

interface Props {
  score: number;
  size?: number;
  showLabel?: boolean;
  className?: string;
}

const ScoreCircle: React.FC<Props> = ({ score, size = 56, showLabel = true, className = '' }) => {
  const strokeWidth = size < 40 ? 3 : 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const color = score >= 80 ? '#10b981' : score >= 70 ? '#84cc16' : score >= 60 ? '#eab308' : score >= 50 ? '#f59e0b' : '#ef4444';

  return (
    <div className={`inline-flex flex-col items-center ${className}`}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={radius} stroke="#e2e8f0" strokeWidth={strokeWidth} fill="white" />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`font-semibold tabular-nums ${size < 40 ? 'text-[10px]' : size < 56 ? 'text-xs' : 'text-sm'}`} style={{ color }}>
            {score}
          </span>
          {showLabel && size >= 48 && <span className="text-[9px] text-slate-400 leading-none">/100</span>}
        </div>
      </div>
    </div>
  );
};

export default ScoreCircle;
