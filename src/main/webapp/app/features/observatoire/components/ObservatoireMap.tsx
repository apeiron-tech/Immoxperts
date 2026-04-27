import React from 'react';
import { Plus, Minus, Layers, ChevronDown } from 'lucide-react';
import { PoiMapItem } from '../types';

export interface MapLegendItem {
  color: string;
  label: string;
  shape?: 'dot' | 'square' | 'line';
}

interface Props {
  /** Content rendered inside the map card (legend) */
  legend?: MapLegendItem[];
  /** POIs rendered as icons on the map */
  pois?: PoiMapItem[];
  /** Current layer name shown in the selector */
  layerLabel?: string;
  /** Layer options (just for the dropdown UX) */
  layerOptions?: string[];
  onLayerChange?: (l: string) => void;
  /** Custom overlay (e.g. heatmap dots, markers) */
  children?: React.ReactNode;
  /** Show zone gradient */
  showGradient?: boolean;
  /** Density of dots overlay */
  dotDensity?: 'low' | 'medium' | 'high';
  /** Accent color for dots */
  dotColor?: string;
  /** Title shown in the top-left */
  title?: string;
  /** Extra right-side content in the header legend bar */
  extraLegend?: React.ReactNode;
}

const POI_STYLE: Record<PoiMapItem['kind'], { bg: string; ring: string; emoji: string }> = {
  transport: { bg: '#6366F1', ring: '#C7D2FE', emoji: '🚇' },
  commerce: { bg: '#F59E0B', ring: '#FDE68A', emoji: '🛍' },
  ecole: { bg: '#14B8A6', ring: '#99F6E4', emoji: '🏫' },
  sante: { bg: '#EF4444', ring: '#FECACA', emoji: '➕' },
  service: { bg: '#8B5CF6', ring: '#DDD6FE', emoji: '⚙' },
  parc: { bg: '#16A34A', ring: '#BBF7D0', emoji: '🌳' },
  permis: { bg: '#7C3AED', ring: '#DDD6FE', emoji: '📋' },
  dpe_fg: { bg: '#DC2626', ring: '#FECACA', emoji: '⚡' },
  projet: { bg: '#0EA5E9', ring: '#BAE6FD', emoji: '🏗' },
};

const ObservatoireMap: React.FC<Props> = ({
  legend,
  pois = [],
  layerLabel,
  layerOptions,
  onLayerChange,
  children,
  showGradient = true,
  dotDensity,
  dotColor = '#7C3AED',
  title,
  extraLegend,
}) => {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  const dots = React.useMemo(() => {
    if (!dotDensity) return [];
    const count = dotDensity === 'low' ? 20 : dotDensity === 'medium' ? 45 : 80;
    const arr: { x: number; y: number; r: number; op: number }[] = [];
    let seed = 42;
    const rand = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
    for (let i = 0; i < count; i++) {
      arr.push({
        x: 10 + rand() * 80,
        y: 15 + rand() * 75,
        r: 0.6 + rand() * 0.9,
        op: 0.3 + rand() * 0.6,
      });
    }
    return arr;
  }, [dotDensity]);

  return (
    <div className="relative w-full h-full rounded-md overflow-hidden border border-slate-200 bg-white">
      {/* Title (centered, does not conflict with zoom controls) */}
      {title && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
          <h4 className="text-[10.5px] font-semibold text-slate-600 bg-white/90 backdrop-blur px-2 py-0.5 rounded border border-slate-200 pointer-events-auto whitespace-nowrap">
            {title}
          </h4>
        </div>
      )}
      {extraLegend && (
        <div className="absolute top-10 right-2 z-20 pointer-events-auto">{extraLegend}</div>
      )}

      {/* Map canvas (stylized) */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <pattern id="obs-grid" width="4" height="4" patternUnits="userSpaceOnUse">
            <path d="M 4 0 L 0 0 0 4" fill="none" stroke="#E2E8F0" strokeWidth="0.08" />
          </pattern>
          <radialGradient id="obs-zone" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.22" />
            <stop offset="55%" stopColor="#A78BFA" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#A78BFA" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="obs-zone-tension" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.2" />
            <stop offset="60%" stopColor="#F59E0B" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width="100" height="100" fill="#F8FAFC" />
        <rect width="100" height="100" fill="url(#obs-grid)" opacity="0.7" />

        {/* Seine-like river */}
        <path
          d="M 0 72 Q 12 68 22 70 Q 35 72 45 66 Q 58 58 68 62 Q 82 66 100 62"
          stroke="#BFDBFE"
          strokeWidth="2.4"
          fill="none"
          opacity="0.8"
        />
        <path
          d="M 0 72 Q 12 68 22 70 Q 35 72 45 66 Q 58 58 68 62 Q 82 66 100 62"
          stroke="#93C5FD"
          strokeWidth="0.3"
          fill="none"
          opacity="0.6"
        />

        {/* Streets */}
        <path d="M 0 30 Q 30 34 52 30 T 100 38" stroke="#CBD5E1" strokeWidth="0.35" fill="none" opacity="0.6" />
        <path d="M 0 50 Q 25 48 50 52 T 100 48" stroke="#CBD5E1" strokeWidth="0.3" fill="none" opacity="0.5" />
        <path d="M 20 0 Q 24 30 28 50 T 34 100" stroke="#CBD5E1" strokeWidth="0.3" fill="none" opacity="0.5" />
        <path d="M 60 0 Q 56 30 58 55 T 64 100" stroke="#CBD5E1" strokeWidth="0.35" fill="none" opacity="0.6" />
        <path d="M 80 0 Q 82 30 78 55 T 80 100" stroke="#CBD5E1" strokeWidth="0.3" fill="none" opacity="0.5" />

        {/* Central neighborhood "Le Marais" */}
        {showGradient && (
          <>
            <ellipse cx="50" cy="45" rx="32" ry="22" fill="url(#obs-zone)" />
            <path
              d="M 22 30 L 80 28 L 82 58 L 24 62 Z"
              fill="none"
              stroke="#8B5CF6"
              strokeWidth="0.6"
              strokeDasharray="1.5 1"
              opacity="0.8"
            />
          </>
        )}

        {/* Density dots */}
        {dots.map((d, i) => (
          <circle key={i} cx={d.x} cy={d.y} r={d.r} fill={dotColor} opacity={d.op} />
        ))}
      </svg>

      {/* Neighborhood label */}
      <span
        className="absolute text-[13px] font-semibold text-slate-600 tracking-wider pointer-events-none select-none"
        style={{ top: '40%', left: '50%', transform: 'translate(-50%, -50%)', letterSpacing: '0.15em' }}
      >
        LE MARAIS
      </span>
      <span
        className="absolute text-[9px] text-slate-400 pointer-events-none select-none"
        style={{ top: '20%', left: '15%' }}
      >
        Arts-et-Métiers
      </span>
      <span
        className="absolute text-[9px] text-slate-400 pointer-events-none select-none"
        style={{ top: '20%', right: '15%' }}
      >
        République
      </span>
      <span
        className="absolute text-[9px] text-slate-400 pointer-events-none select-none"
        style={{ top: '80%', left: '50%', transform: 'translateX(-50%)' }}
      >
        Place des Vosges
      </span>
      <span
        className="absolute text-[9px] text-slate-400 pointer-events-none select-none"
        style={{ top: '32%', left: '12%' }}
      >
        Temple
      </span>
      <span
        className="absolute text-[9px] text-slate-400 pointer-events-none select-none"
        style={{ top: '55%', left: '20%' }}
      >
        Archives
      </span>

      {/* POIs */}
      {pois.map(poi => {
        const s = POI_STYLE[poi.kind];
        return (
          <div
            key={poi.id}
            className="absolute h-6 w-6 rounded-md border shadow-sm flex items-center justify-center pointer-events-none"
            style={{
              left: `${poi.x}%`,
              top: `${poi.y}%`,
              transform: 'translate(-50%, -50%)',
              backgroundColor: s.bg,
              borderColor: s.ring,
              color: 'white',
              fontSize: '11px',
            }}
            title={poi.label}
          >
            {s.emoji}
          </div>
        );
      })}

      {children}

      {/* Zoom controls */}
      <div className="absolute top-3 left-3 flex flex-col gap-1 z-20">
        <button className="h-7 w-7 rounded-md bg-white border border-slate-200 shadow-sm hover:bg-slate-50 inline-flex items-center justify-center">
          <Plus size={12} className="text-slate-600" />
        </button>
        <button className="h-7 w-7 rounded-md bg-white border border-slate-200 shadow-sm hover:bg-slate-50 inline-flex items-center justify-center">
          <Minus size={12} className="text-slate-600" />
        </button>
        <button className="h-7 w-7 rounded-md bg-white border border-slate-200 shadow-sm hover:bg-slate-50 inline-flex items-center justify-center">
          <Layers size={12} className="text-slate-600" />
        </button>
      </div>

      {/* Layer selector */}
      {layerLabel && (
        <div className="absolute top-3 right-3 z-20" ref={ref}>
          <button
            onClick={() => setOpen(o => !o)}
            className="h-7 px-2.5 rounded-md bg-white/95 backdrop-blur border border-slate-200 shadow-sm hover:bg-slate-50 text-[11px] text-slate-700 inline-flex items-center gap-1.5"
          >
            <span className="text-slate-400">Couche :</span>
            <span className="font-medium">{layerLabel}</span>
            <ChevronDown size={10} className="text-slate-400" />
          </button>
          {open && layerOptions && (
            <div className="absolute top-full right-0 mt-1 min-w-[180px] bg-white rounded-md border border-slate-200 shadow-md py-1">
              {layerOptions.map(o => (
                <button
                  key={o}
                  onClick={() => {
                    onLayerChange?.(o);
                    setOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 text-[12px] hover:bg-slate-50 ${
                    o === layerLabel ? 'text-propsight-700 font-medium' : 'text-slate-700'
                  }`}
                >
                  {o}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Legend */}
      {legend && legend.length > 0 && (
        <div className="absolute bottom-3 right-3 z-20 bg-white/95 backdrop-blur rounded-md border border-slate-200 shadow-sm p-2 text-[10px] space-y-1 min-w-[150px]">
          <div className="font-semibold text-slate-700 uppercase tracking-wide mb-1 text-[9px]">Légende</div>
          {legend.map(l => (
            <div key={l.label} className="flex items-center gap-1.5 text-slate-600">
              {l.shape === 'square' ? (
                <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: l.color }} />
              ) : l.shape === 'line' ? (
                <span className="h-0.5 w-3" style={{ backgroundColor: l.color }} />
              ) : (
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: l.color }} />
              )}
              {l.label}
            </div>
          ))}
        </div>
      )}

      {/* Scale */}
      <div className="absolute bottom-3 left-3 z-20 flex items-center gap-1 bg-white/90 rounded px-2 py-0.5 text-[9px] text-slate-600 border border-slate-200">
        <span className="h-[2px] w-8 bg-slate-700 inline-block" />
        200 m
      </div>
    </div>
  );
};

export default ObservatoireMap;
