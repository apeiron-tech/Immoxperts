import React from 'react';
import { BienSuivi } from '../types';
import { fmtEuro } from '../utils/format';
import { ScoreInteretBadge } from '../components/shared/primitives';

interface Props {
  rows: BienSuivi[];
  onRowClick: (id: string) => void;
}

/**
 * Vue carte stylisée sans Mapbox (démo). Les biens sont projetés sur une carte
 * SVG simplifiée en fonction de leur latitude/longitude avec recentrage auto.
 */
const BiensSuivisMap: React.FC<Props> = ({ rows, onRowClick }) => {
  // Bounding box
  const lats = rows.map(r => r.latitude);
  const lngs = rows.map(r => r.longitude);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const latRange = maxLat - minLat || 1;
  const lngRange = maxLng - minLng || 1;

  const project = (lat: number, lng: number) => ({
    x: 40 + ((lng - minLng) / lngRange) * 720,
    y: 40 + (1 - (lat - minLat) / latRange) * 400,
  });

  return (
    <div className="flex-1 flex bg-slate-50 overflow-hidden">
      {/* Liste latérale */}
      <div className="w-[300px] border-r border-slate-200 bg-white overflow-y-auto flex-shrink-0">
        <div className="px-3 py-2 border-b border-slate-200">
          <span className="text-[11px] font-semibold text-slate-700">
            {rows.length} bien{rows.length > 1 ? 's' : ''}
          </span>
        </div>
        {rows.map(b => (
          <button
            key={b.id}
            onClick={() => onRowClick(b.id)}
            className="w-full text-left px-3 py-2 border-b border-slate-100 hover:bg-slate-50"
          >
            <div className="flex items-center justify-between gap-2 mb-0.5">
              <span className="text-[12px] font-medium text-slate-900 truncate">
                {b.type_bien} {b.pieces ? `T${b.pieces}` : ''} · {b.ville}
              </span>
              <ScoreInteretBadge score={b.score_interet} label={b.score_label} compact />
            </div>
            <div className="text-[11px] text-slate-500 truncate">{b.adresse}</div>
            <div className="text-[11.5px] font-semibold text-slate-900 mt-0.5 tabular-nums">{fmtEuro(b.prix_actuel)}</div>
          </button>
        ))}
      </div>

      {/* Carte SVG */}
      <div className="flex-1 relative overflow-hidden">
        <svg viewBox="0 0 800 480" className="w-full h-full bg-slate-100">
          <defs>
            <pattern id="carte-grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#E2E8F0" strokeWidth="0.5" />
            </pattern>
            <radialGradient id="cluster-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#7C3AED" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="800" height="480" fill="url(#carte-grid)" />
          {/* Rivers / roads */}
          <path d="M 0 300 Q 200 280 400 290 T 800 270" stroke="#BFDBFE" strokeWidth="6" fill="none" opacity="0.7" />
          <path d="M 200 0 Q 220 240 230 480" stroke="#CBD5E1" strokeWidth="1" fill="none" opacity="0.5" />
          <path d="M 500 0 Q 480 240 520 480" stroke="#CBD5E1" strokeWidth="1" fill="none" opacity="0.5" />
          {/* Glow clusters */}
          <circle cx="400" cy="240" r="180" fill="url(#cluster-glow)" />

          {/* Pins */}
          {rows.map(b => {
            const { x, y } = project(b.latitude, b.longitude);
            const color = b.score_interet >= 75 ? '#10B981' : b.score_interet >= 50 ? '#7C3AED' : '#94A3B8';
            return (
              <g
                key={b.id}
                onClick={() => onRowClick(b.id)}
                className="cursor-pointer"
                transform={`translate(${x}, ${y})`}
              >
                <circle r="14" fill={color} opacity="0.2" />
                <circle r="8" fill={color} stroke="white" strokeWidth="2" />
                <text y="4" textAnchor="middle" fill="white" fontSize="8" fontWeight="700">
                  {b.score_interet}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Légende */}
        <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur rounded-md border border-slate-200 shadow-sm p-2 text-[10px] space-y-1">
          <div className="font-semibold text-slate-700 uppercase tracking-wide mb-1 text-[9px]">Score intérêt</div>
          <LegendDot color="#10B981" label="≥ 75 (opportunité)" />
          <LegendDot color="#7C3AED" label="50–74 (à surveiller)" />
          <LegendDot color="#94A3B8" label="< 50 (faible priorité)" />
        </div>
      </div>
    </div>
  );
};

const LegendDot: React.FC<{ color: string; label: string }> = ({ color, label }) => (
  <div className="flex items-center gap-1.5 text-slate-600">
    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
    {label}
  </div>
);

export default BiensSuivisMap;
