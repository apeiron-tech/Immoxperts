import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, MapPin } from 'lucide-react';
import { MarcheZone } from '../../types';
import { ZONES } from '../../_mocks/performance';

interface Props {
  zone: MarcheZone;
  onZoneChange: (z: MarcheZone) => void;
}

const ZoneSelector: React.FC<Props> = ({ zone, onZoneChange }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  return (
    <section className="bg-white border border-slate-200 rounded p-2 h-full">
      <p className="text-[9px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Zone suivie</p>

      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen(o => !o)}
          className="w-full flex items-center justify-between gap-1 px-2 h-7 text-[11px] font-medium text-slate-900 bg-white border border-slate-200 rounded hover:bg-slate-50 transition-colors"
        >
          <span className="inline-flex items-center gap-1 min-w-0">
            <MapPin size={11} className="text-propsight-600 flex-shrink-0" />
            <span className="truncate">{zone.label} • {zone.sousLabel}</span>
          </span>
          <ChevronDown size={10} className="text-slate-400" />
        </button>
        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <div className="absolute top-full left-0 right-0 mt-1 z-20 bg-white border border-slate-200 rounded shadow-md py-1">
              {ZONES.map(z => (
                <button
                  key={z.id}
                  type="button"
                  onClick={() => { onZoneChange(z); setOpen(false); }}
                  className="w-full text-left px-2 py-1 text-[10px] text-slate-700 hover:bg-slate-50"
                >
                  <p className="font-medium">{z.label}</p>
                  <p className="text-[9px] text-slate-500">{z.sousLabel} · {z.transactions} DVF</p>
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      <p className="text-[9px] text-slate-500 mt-1.5 leading-tight">
        Périmètre : <span className="text-slate-700 font-medium tabular-nums">{zone.transactions} DVF</span> (12 mois)
      </p>

      <button
        type="button"
        onClick={() => navigate(`/app/biens/dvf?zone=${zone.id}`)}
        className="mt-1 text-[10px] text-blue-600 hover:text-blue-700 font-medium"
      >
        Voir sur la carte →
      </button>
    </section>
  );
};

export default ZoneSelector;
