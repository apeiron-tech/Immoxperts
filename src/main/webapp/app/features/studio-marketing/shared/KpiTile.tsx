import React from 'react';
import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react';

interface Props {
  label: string;
  value: string;
  delta?: string;
  trend?: 'up' | 'down' | 'flat';
  hint?: string;
  /** Inverse la sémantique des couleurs : la baisse devient positive (ex. CPL). */
  invertTrendSemantics?: boolean;
}

const KpiTile: React.FC<Props> = ({ label, value, delta, trend, hint, invertTrendSemantics }) => {
  const isPositive = invertTrendSemantics ? trend === 'down' : trend === 'up';
  const isNegative = invertTrendSemantics ? trend === 'up' : trend === 'down';
  const tone =
    isPositive ? 'text-success-700' : isNegative ? 'text-danger-700' : 'text-neutral-500';
  const Icon = trend === 'up' ? ArrowUpRight : trend === 'down' ? ArrowDownRight : Minus;
  return (
    <div className="bg-white border border-neutral-200 rounded-lg p-3.5">
      <div className="text-[11px] font-medium uppercase tracking-wide text-neutral-500">{label}</div>
      <div className="mt-1 text-[22px] font-semibold text-neutral-900 leading-none">{value}</div>
      {delta && (
        <div className={`mt-1.5 inline-flex items-center gap-1 text-[11.5px] font-medium ${tone}`}>
          <Icon size={11} />
          {delta}
          {hint && <span className="text-neutral-400 font-normal ml-1">· {hint}</span>}
        </div>
      )}
    </div>
  );
};

export default KpiTile;
