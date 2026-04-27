import React, { useMemo } from 'react';
import { Plus, Minus, Maximize2, Navigation } from 'lucide-react';
import { MetaSignalRadar, ZoneRadar } from '../types';

interface Props {
  signals: MetaSignalRadar[];
  zones: ZoneRadar[];
  selectedId?: string | null;
  onPinClick: (id: string) => void;
  onZoneClick?: (zone: ZoneRadar) => void;
}

// Bounds : resserrés sur la zone la plus dense pour une meilleure dispersion des pins
const BOUNDS = {
  latMin: 48.78,
  latMax: 48.96,
  lonMin: 2.22,
  lonMax: 2.5,
};

const project = (lat?: number, lon?: number): { x: number; y: number } | null => {
  if (lat === undefined || lon === undefined) return null;
  const x = ((lon - BOUNDS.lonMin) / (BOUNDS.lonMax - BOUNDS.lonMin)) * 100;
  const y = (1 - (lat - BOUNDS.latMin) / (BOUNDS.latMax - BOUNDS.latMin)) * 100;
  return { x: Math.max(3, Math.min(97, x)), y: Math.max(4, Math.min(96, y)) };
};

// Villes et quartiers à annoter sur la carte (lat, lon, label)
const CITY_LABELS: { lat: number; lon: number; label: string; size?: 'sm' | 'md' }[] = [
  { lat: 48.8566, lon: 2.3522, label: 'Paris', size: 'md' },
  { lat: 48.9362, lon: 2.3574, label: 'Saint-Denis' },
  { lat: 48.9148, lon: 2.3855, label: 'Aubervilliers' },
  { lat: 48.9105, lon: 2.3493, label: 'Saint-Ouen' },
  { lat: 48.8641, lon: 2.4384, label: 'Montreuil' },
  { lat: 48.8351, lon: 2.2412, label: 'Boulogne' },
  { lat: 48.9015, lon: 2.2475, label: 'Clamart' },
  { lat: 48.8198, lon: 2.3832, label: 'Ivry' },
  { lat: 48.7942, lon: 2.2386, label: 'Boulogne-B.' },
  { lat: 48.7787, lon: 2.2131, label: 'Sèvres' },
  { lat: 48.8436, lon: 2.4363, label: 'Vincennes' },
  { lat: 48.8797, lon: 2.4131, label: 'Les Lilas' },
  { lat: 48.9255, lon: 2.4622, label: 'Bobigny' },
  { lat: 48.9422, lon: 2.3481, label: 'La Plaine SD' },
];

// Zones géographiques simulées (polygones simples de quartiers/communes)
const CITY_BLOBS: { cx: number; cy: number; rx: number; ry: number; rotation?: number; fill: string }[] = [
  // Paris centre
  { cx: 48.86, cy: 2.35, rx: 0.05, ry: 0.038, fill: '#F1F5F9' },
  // Saint-Denis
  { cx: 48.935, cy: 2.36, rx: 0.022, ry: 0.018, fill: '#EEF2FF' },
  // Aubervilliers
  { cx: 48.915, cy: 2.385, rx: 0.02, ry: 0.017, fill: '#EEF2FF' },
  // Saint-Ouen
  { cx: 48.91, cy: 2.35, rx: 0.016, ry: 0.013, fill: '#EEF2FF' },
  // Montreuil
  { cx: 48.864, cy: 2.44, rx: 0.022, ry: 0.02, fill: '#EEF2FF' },
  // Boulogne-Billancourt
  { cx: 48.835, cy: 2.24, rx: 0.022, ry: 0.018, fill: '#EEF2FF' },
  // Clamart / sud-ouest
  { cx: 48.8, cy: 2.24, rx: 0.02, ry: 0.018, fill: '#EEF2FF' },
  // Vincennes
  { cx: 48.844, cy: 2.436, rx: 0.015, ry: 0.013, fill: '#EEF2FF' },
  // Ivry
  { cx: 48.82, cy: 2.385, rx: 0.018, ry: 0.016, fill: '#EEF2FF' },
];

const zoneSize = (score: number) => 36 + (score / 100) * 56; // 36-92px diamètre

const zoneColor = (prio: ZoneRadar['priorite']) => {
  if (prio === 'chaude') return { fill: '#EF4444', bg: 'bg-rose-500' };
  if (prio === 'interessante') return { fill: '#A855F7', bg: 'bg-propsight-500' };
  return { fill: '#94A3B8', bg: 'bg-slate-400' };
};

const sourceColorPin = (sources: MetaSignalRadar['sources']) => {
  if (sources.includes('annonce')) return { bg: '#7C3AED', ring: '#A78BFA' };
  if (sources.includes('dpe')) return { bg: '#F59E0B', ring: '#FCD34D' };
  if (sources.includes('dvf')) return { bg: '#3B82F6', ring: '#93C5FD' };
  return { bg: '#64748B', ring: '#CBD5E1' };
};

const RadarCarte: React.FC<Props> = ({ signals, zones, selectedId, onPinClick, onZoneClick }) => {
  const placed = useMemo(
    () => signals.map(s => ({ s, pos: project(s.lat, s.lon) })).filter(p => p.pos),
    [signals]
  );
  const placedZones = useMemo(
    () => zones.map(z => ({ z, pos: project(z.centroid_lat, z.centroid_lon) })).filter(p => p.pos),
    [zones]
  );
  const placedCities = useMemo(
    () => CITY_LABELS.map(c => ({ ...c, pos: project(c.lat, c.lon) })).filter(c => c.pos),
    []
  );

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden border border-slate-200 bg-[#F8FAFC] select-none">
      {/* Fond carte stylisé */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          <pattern id="grid-map" width="5" height="5" patternUnits="userSpaceOnUse">
            <path d="M 5 0 L 0 0 0 5" fill="none" stroke="#E2E8F0" strokeWidth="0.08" />
          </pattern>
          <radialGradient id="heat-hot" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#EF4444" stopOpacity="0.35" />
            <stop offset="60%" stopColor="#F97316" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#F97316" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="heat-warm" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#A855F7" stopOpacity="0.28" />
            <stop offset="60%" stopColor="#A855F7" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#A855F7" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width="100" height="100" fill="#F8FAFC" />

        {/* "Blobs" simulant les communes/quartiers */}
        {CITY_BLOBS.map((b, i) => {
          const pos = project(b.cx, b.cy);
          if (!pos) return null;
          const rxPct = (b.rx / (BOUNDS.lonMax - BOUNDS.lonMin)) * 100;
          const ryPct = (b.ry / (BOUNDS.latMax - BOUNDS.latMin)) * 100;
          return <ellipse key={`blob_${i}`} cx={pos.x} cy={pos.y} rx={rxPct} ry={ryPct} fill={b.fill} />;
        })}

        {/* Grille légère */}
        <rect width="100" height="100" fill="url(#grid-map)" opacity="0.7" />

        {/* Périphérique stylisé (cercle autour de Paris) */}
        <circle cx="57" cy="42" r="24" fill="none" stroke="#CBD5E1" strokeWidth="0.35" strokeDasharray="0.6 0.4" opacity="0.65" />

        {/* Axes routiers stylisés */}
        <path d="M 0 50 Q 30 46 58 52 T 100 54" stroke="#CBD5E1" strokeWidth="0.4" fill="none" opacity="0.7" />
        <path d="M 48 0 Q 52 30 57 42 T 68 100" stroke="#CBD5E1" strokeWidth="0.35" fill="none" opacity="0.6" />
        <path d="M 0 30 Q 30 36 60 34 T 100 38" stroke="#CBD5E1" strokeWidth="0.3" fill="none" opacity="0.5" />

        {/* Seine */}
        <path
          d="M 0 62 Q 18 58 35 60 Q 48 62 58 56 Q 72 48 86 55 L 100 58"
          stroke="#BFDBFE"
          strokeWidth="1.1"
          fill="none"
          opacity="0.9"
        />

        {/* Heatmap zones */}
        {placedZones.map(({ z, pos }) => {
          if (!pos) return null;
          const color = z.priorite === 'chaude' ? 'url(#heat-hot)' : 'url(#heat-warm)';
          return <circle key={`heat_${z.zone_id}`} cx={pos.x} cy={pos.y} r={10} fill={color} />;
        })}
      </svg>

      {/* Labels de villes (HTML overlay) */}
      {placedCities.map((c, i) => {
        if (!c.pos) return null;
        return (
          <span
            key={`city_${i}`}
            className={`absolute pointer-events-none select-none font-medium text-slate-500/90 ${
              c.size === 'md' ? 'text-[13px]' : 'text-[10px]'
            }`}
            style={{
              left: `${c.pos.x}%`,
              top: `${c.pos.y}%`,
              transform: 'translate(-50%, -50%)',
              textShadow: '0 0 4px rgba(255,255,255,0.9)',
              letterSpacing: c.size === 'md' ? '0.05em' : undefined,
            }}
          >
            {c.label}
          </span>
        );
      })}

      {/* Bulles zones (score zone) */}
      {placedZones.map(({ z, pos }) => {
        if (!pos) return null;
        const color = zoneColor(z.priorite);
        const size = zoneSize(z.score_zone);
        return (
          <button
            key={`zone_${z.zone_id}`}
            onClick={() => onZoneClick?.(z)}
            className={`absolute rounded-full flex items-center justify-center text-white font-semibold shadow-lg ring-4 ring-white/80 transition-transform hover:scale-110 ${color.bg}`}
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              width: size,
              height: size,
              fontSize: size > 60 ? '15px' : '12px',
              transform: 'translate(-50%, -50%)',
              opacity: 0.92,
            }}
          >
            {z.score_zone}
          </button>
        );
      })}

      {/* Pins signaux */}
      {placed.map(({ s, pos }) => {
        if (!pos) return null;
        const color = sourceColorPin(s.sources);
        const isSelected = selectedId === s.meta_id;
        return (
          <button
            key={s.meta_id}
            onClick={() => onPinClick(s.meta_id)}
            className="absolute z-10 h-7 w-7 rounded-full flex items-center justify-center ring-[3px] ring-white shadow-md transition-all hover:scale-125 hover:z-20"
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              backgroundColor: color.bg,
              transform: `translate(-50%, -100%) ${isSelected ? 'scale(1.35)' : ''}`,
              boxShadow: isSelected
                ? `0 0 0 4px ${color.ring}, 0 4px 10px rgba(0,0,0,.18)`
                : '0 2px 6px rgba(0,0,0,.15)',
            }}
            title={s.adresse || s.ville}
          >
            <span className="text-[9px] font-bold text-white">{s.sources.length > 1 ? s.sources.length : ''}</span>
          </button>
        );
      })}

      {/* Contrôles de zoom */}
      <div className="absolute top-3 right-3 flex flex-col gap-1 z-20">
        <button className="h-8 w-8 rounded-md bg-white border border-slate-200 shadow-sm hover:bg-slate-50 inline-flex items-center justify-center">
          <Plus size={13} />
        </button>
        <button className="h-8 w-8 rounded-md bg-white border border-slate-200 shadow-sm hover:bg-slate-50 inline-flex items-center justify-center">
          <Minus size={13} />
        </button>
        <button className="h-8 w-8 rounded-md bg-white border border-slate-200 shadow-sm hover:bg-slate-50 inline-flex items-center justify-center">
          <Navigation size={13} />
        </button>
        <button className="h-8 w-8 rounded-md bg-white border border-slate-200 shadow-sm hover:bg-slate-50 inline-flex items-center justify-center">
          <Maximize2 size={13} />
        </button>
      </div>

      {/* Légende bas-gauche */}
      <div className="absolute bottom-3 left-3 z-20 bg-white/95 backdrop-blur rounded-lg border border-slate-200 shadow-sm p-2.5 text-[10px] space-y-1">
        <div className="font-semibold text-slate-700 uppercase tracking-wide mb-1">Légende</div>
        <div className="flex items-center gap-1.5 text-slate-600">
          <span className="h-2.5 w-2.5 rounded-full bg-propsight-500" />
          Annonce
        </div>
        <div className="flex items-center gap-1.5 text-slate-600">
          <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
          DVF
        </div>
        <div className="flex items-center gap-1.5 text-slate-600">
          <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
          DPE
        </div>
        <div className="flex items-center gap-1.5 text-slate-600">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
          Zone chaude
        </div>
        <div className="flex items-center gap-1.5 text-slate-600">
          <span className="h-2.5 w-2.5 rounded-full bg-propsight-400" />
          Zone intéressante
        </div>
      </div>

      {/* Satellite toggle */}
      <div
        className="absolute bottom-3 right-3 z-20 h-10 w-14 rounded-md overflow-hidden ring-1 ring-slate-300 shadow-sm cursor-pointer"
        title="Bascule satellite"
      >
        <div className="w-full h-full bg-gradient-to-br from-emerald-800 via-teal-700 to-slate-700" />
        <span className="absolute bottom-0.5 left-1 text-[9px] font-semibold text-white drop-shadow">
          Satellite
        </span>
      </div>

      {/* Scale bar */}
      <div className="absolute bottom-16 left-3 z-20 flex items-center gap-1 bg-white/90 rounded px-2 py-0.5 text-[9px] text-slate-600 border border-slate-200">
        <span className="h-[2px] w-8 bg-slate-700 inline-block" />
        1 km
      </div>
    </div>
  );
};

export default RadarCarte;
