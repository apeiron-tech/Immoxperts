import React, { useEffect, useState } from 'react';

type Unit = '€' | '€/mois' | '€/an' | '%';

interface Props {
  label: string;
  hint?: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
  unit?: Unit;
  decimals?: number;
}

const formatValue = (n: number, unit: Unit, decimals: number): string => {
  if (unit === '%') return `${n.toFixed(decimals).replace('.', ',')} %`;
  const v = decimals === 0 ? Math.round(n) : n;
  const formatted = v.toLocaleString('fr-FR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return unit === '€' ? `${formatted} €` : unit === '€/mois' ? `${formatted} €/mois` : `${formatted} €/an`;
};

const SliderField: React.FC<Props> = ({ label, hint, value, onChange, min, max, step, unit = '€', decimals = 0 }) => {
  const [focused, setFocused] = useState(false);
  const [draft, setDraft] = useState(String(value));

  useEffect(() => {
    if (!focused) setDraft(String(value));
  }, [value, focused]);

  const commit = () => {
    const cleaned = draft.replace(',', '.').replace(/[^0-9.]/g, '');
    const parsed = parseFloat(cleaned);
    if (Number.isFinite(parsed)) {
      const clamped = Math.max(min, Math.min(max, parsed));
      onChange(clamped);
      setDraft(String(clamped));
    } else {
      setDraft(String(value));
    }
    setFocused(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <label className="text-[14px] font-medium text-slate-700">{label}</label>
        <input
          type="text"
          inputMode="decimal"
          value={focused ? draft : formatValue(value, unit, decimals)}
          onChange={e => setDraft(e.target.value)}
          onFocus={() => {
            setFocused(true);
            setDraft(String(value));
          }}
          onBlur={commit}
          onKeyDown={e => {
            if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
          }}
          className="w-32 h-9 px-3 text-right text-[13.5px] tabular-nums rounded-md border border-slate-200 focus:border-propsight-500 focus:ring-1 focus:ring-propsight-500 outline-none bg-white"
          aria-label={label}
        />
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full mt-2 h-2 rounded-full appearance-none bg-slate-200 cursor-pointer accent-propsight-600"
      />
      {hint ? <p className="mt-1 text-[12px] text-slate-500">{hint}</p> : null}
    </div>
  );
};

export default SliderField;
