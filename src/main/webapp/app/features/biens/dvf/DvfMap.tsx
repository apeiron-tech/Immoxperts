import React, { useMemo } from 'react';
import { Plus, Minus, Locate, Layers } from 'lucide-react';
import { VenteDVF } from '../types';
import { formatEuros } from '../utils/format';

interface Props {
  ventes: VenteDVF[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

// Bounding box Paris (approx. pour positionner les points sur notre "carte" stylisée)
const LAT_MIN = 48.815;
const LAT_MAX = 48.9;
const LON_MIN = 2.28;
const LON_MAX = 2.41;

const project = (lat: number, lon: number) => {
  const x = ((lon - LON_MIN) / (LON_MAX - LON_MIN)) * 100;
  const y = ((LAT_MAX - lat) / (LAT_MAX - LAT_MIN)) * 100;
  return { x: Math.max(2, Math.min(98, x)), y: Math.max(2, Math.min(98, y)) };
};

const DvfMap: React.FC<Props> = ({ ventes, selectedId, onSelect }) => {
  const points = useMemo(() => ventes.map(v => ({ v, ...project(v.latitude, v.longitude) })), [ventes]);
  const selected = ventes.find(v => v.id === selectedId);

  return (
    <div className="relative w-full h-full rounded-lg border border-slate-200 overflow-hidden bg-slate-50">
      {/* Fake map canvas */}
      <div className="absolute inset-0">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#E4E4E7" strokeWidth="0.2" />
            </pattern>
            <pattern id="fine-grid" width="2" height="2" patternUnits="userSpaceOnUse">
              <path d="M 2 0 L 0 0 0 2" fill="none" stroke="#F1F5F9" strokeWidth="0.1" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="#F8FAFC" />
          <rect width="100" height="100" fill="url(#fine-grid)" />
          <rect width="100" height="100" fill="url(#grid)" />

          {/* Seine — courbe approximative */}
          <path
            d="M 0 52 Q 20 60, 35 55 T 60 50 T 100 48"
            fill="none"
            stroke="#BAE6FD"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M 0 52 Q 20 60, 35 55 T 60 50 T 100 48"
            fill="none"
            stroke="#7DD3FC"
            strokeWidth="0.6"
            opacity="0.8"
          />

          {/* Quelques "boulevards" */}
          <line x1="0" y1="30" x2="100" y2="32" stroke="#E2E8F0" strokeWidth="0.8" />
          <line x1="50" y1="0" x2="48" y2="100" stroke="#E2E8F0" strokeWidth="0.8" />
          <line x1="30" y1="70" x2="90" y2="40" stroke="#E2E8F0" strokeWidth="0.5" />

          {/* Labels quartiers */}
          <text x="18" y="25" fill="#94A3B8" fontSize="2.5" fontFamily="system-ui" fontWeight="600">MONTMARTRE</text>
          <text x="55" y="20" fill="#94A3B8" fontSize="2.5" fontFamily="system-ui" fontWeight="600">GARE DU NORD</text>
          <text x="15" y="55" fill="#94A3B8" fontSize="2.2" fontFamily="system-ui" fontWeight="600">GRANDS BOULEVARDS</text>
          <text x="62" y="72" fill="#94A3B8" fontSize="2.2" fontFamily="system-ui" fontWeight="600">BASTILLE</text>
          <text x="50" y="85" fill="#94A3B8" fontSize="2.2" fontFamily="system-ui" fontWeight="600">QUINZE-VINGTS</text>
        </svg>

        {/* Clusters sur zone dense */}
        <div className="absolute" style={{ left: '54%', top: '26%' }}>
          <div className="w-9 h-9 rounded-full bg-propsight-500/90 text-white flex items-center justify-center font-bold text-[13px] ring-4 ring-propsight-300/40">38</div>
        </div>
        <div className="absolute" style={{ left: '44%', top: '42%' }}>
          <div className="w-11 h-11 rounded-full bg-propsight-500/90 text-white flex items-center justify-center font-bold text-[14px] ring-4 ring-propsight-300/40">64</div>
        </div>
        <div className="absolute" style={{ left: '72%', top: '54%' }}>
          <div className="w-8 h-8 rounded-full bg-propsight-500/90 text-white flex items-center justify-center font-bold text-[12px] ring-4 ring-propsight-300/40">17</div>
        </div>
        <div className="absolute" style={{ left: '70%', top: '62%' }}>
          <div className="w-9 h-9 rounded-full bg-propsight-500/90 text-white flex items-center justify-center font-bold text-[13px] ring-4 ring-propsight-300/40">33</div>
        </div>
        <div className="absolute" style={{ left: '35%', top: '68%' }}>
          <div className="w-8 h-8 rounded-full bg-propsight-500/90 text-white flex items-center justify-center font-bold text-[12px] ring-4 ring-propsight-300/40">42</div>
        </div>
        <div className="absolute" style={{ left: '62%', top: '88%' }}>
          <div className="w-7 h-7 rounded-full bg-propsight-500/90 text-white flex items-center justify-center font-bold text-[11px] ring-4 ring-propsight-300/40">11</div>
        </div>

        {/* Points individuels (nos ventes) */}
        {points.map(({ v, x, y }) => {
          const isSelected = v.id === selectedId;
          return (
            <button
              key={v.id}
              onClick={() => onSelect(v.id)}
              className="absolute -translate-x-1/2 -translate-y-1/2 group"
              style={{ left: `${x}%`, top: `${y}%` }}
            >
              {isSelected ? (
                <div className="relative">
                  <div className="px-2.5 py-1 rounded-md bg-propsight-600 text-white text-[11px] font-bold shadow-lg whitespace-nowrap">
                    {formatEuros(v.prix_vente, true)}
                  </div>
                  <div className="w-2 h-2 rounded-full bg-propsight-600 ring-4 ring-propsight-200 absolute left-1/2 -translate-x-1/2 -bottom-1" />
                </div>
              ) : (
                <div className="w-2 h-2 rounded-full bg-propsight-500 ring-1 ring-white hover:ring-2 hover:ring-propsight-300 transition-all cursor-pointer" />
              )}
            </button>
          );
        })}
      </div>

      {/* Zoom controls */}
      <div className="absolute top-3 left-3 bg-white rounded-md border border-slate-200 shadow-sm flex flex-col">
        <button className="w-8 h-8 flex items-center justify-center hover:bg-slate-50 border-b border-slate-100 text-slate-600">
          <Locate size={13} />
        </button>
        <button className="w-8 h-8 flex items-center justify-center hover:bg-slate-50 border-b border-slate-100 text-slate-600">
          <Plus size={13} />
        </button>
        <button className="w-8 h-8 flex items-center justify-center hover:bg-slate-50 border-b border-slate-100 text-slate-600">
          <Minus size={13} />
        </button>
        <button className="w-8 h-8 flex items-center justify-center hover:bg-slate-50 text-slate-600">
          <Layers size={13} />
        </button>
      </div>

      {/* Scale */}
      <div className="absolute bottom-3 right-3 text-[10px] text-slate-500 bg-white/90 px-2 py-1 rounded border border-slate-200">
        300 m
      </div>
    </div>
  );
};

export default DvfMap;
