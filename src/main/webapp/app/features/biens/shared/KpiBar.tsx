import React from 'react';
import KpiCard, { KpiTrendDirection } from 'app/shared/ui/KpiCard';
import { KpiTile, PeriodeKpi } from '../types';

interface Props {
  items: KpiTile[];
  period?: PeriodeKpi;
  periodOptions?: PeriodeKpi[];
  onPeriodChange?: (p: PeriodeKpi) => void;
}

const ACCENT_COLOR: Record<string, string> = {
  red: 'text-red-600',
  green: 'text-green-600',
  violet: 'text-propsight-600',
  amber: 'text-amber-600',
};

const mapDirection = (d: 'up' | 'down' | 'neutral'): KpiTrendDirection =>
  d === 'neutral' ? 'flat' : d;

const KpiBar: React.FC<Props> = ({ items, period, periodOptions, onPeriodChange }) => {
  return (
    <div className="flex items-stretch gap-3 w-full">
      <div className="grid grid-cols-4 gap-3 flex-1">
        {items.map((item, i) => {
          const accent = (item as KpiTile & { accent?: string }).accent;
          const valueClassName = accent ? ACCENT_COLOR[accent] : undefined;
          return (
            <KpiCard
              key={i}
              label={item.label}
              value={item.value}
              density="default"
              highlight={item.highlight}
              valueClassName={valueClassName}
              trend={
                item.delta
                  ? { value: item.delta.value, direction: mapDirection(item.delta.direction) }
                  : undefined
              }
              subtitle={item.sub}
            />
          );
        })}
      </div>

      {period && periodOptions && onPeriodChange && (
        <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-md px-1 self-center">
          {periodOptions.map(p => (
            <button
              key={p}
              onClick={() => onPeriodChange(p)}
              className={`px-2.5 h-7 text-[12px] font-medium rounded transition-colors ${
                period === p ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default KpiBar;
