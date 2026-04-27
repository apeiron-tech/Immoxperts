import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, TrendingUp, Home } from 'lucide-react';

interface Marker {
  id: string;
  x: number;
  y: number;
  price: string;
  label?: string;
  highlighted?: boolean;
}

const MARKERS: Marker[] = [
  { id: 'm1', x: 22, y: 30, price: '8 920 €/m²' },
  { id: 'm2', x: 55, y: 22, price: '9 420 €/m²', highlighted: true, label: 'Paris 15e' },
  { id: 'm3', x: 78, y: 40, price: '10 120 €/m²' },
  { id: 'm4', x: 34, y: 62, price: '8 120 €/m²' },
  { id: 'm5', x: 70, y: 72, price: '9 780 €/m²' },
];

const FloatingMapPreview: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
      className="relative w-full"
    >
      {/* Main map card — sober, no glow, no float-slow */}
      <div className="relative rounded-lg border border-neutral-200 bg-white shadow-sm overflow-hidden">
        {/* Card header */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-neutral-100 bg-white">
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-neutral-200" />
              <span className="w-2.5 h-2.5 rounded-full bg-neutral-200" />
              <span className="w-2.5 h-2.5 rounded-full bg-neutral-200" />
            </div>
            <span className="ml-2 text-[11px] text-neutral-400">propsight.fr/prix-immobiliers</span>
          </div>
          <div className="text-[11px] text-neutral-500 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            DVF temps réel
          </div>
        </div>

        {/* Map viewport */}
        <div className="relative h-[340px] md:h-[400px] bg-neutral-50 overflow-hidden">
          {/* SVG street grid background */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 340" preserveAspectRatio="xMidYMid slice">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#E2E0DA" strokeWidth="0.5" />
              </pattern>
              <linearGradient id="river" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#DBEAFE" />
                <stop offset="100%" stopColor="#BFDBFE" />
              </linearGradient>
            </defs>
            <rect width="400" height="340" fill="url(#grid)" />

            {/* Simulated streets */}
            <g stroke="#C9C6BD" strokeWidth="1.2" fill="none" opacity="0.6">
              <path d="M -10 90 Q 120 100 280 70 T 420 100" />
              <path d="M -10 210 Q 140 190 300 220 T 420 210" />
              <path d="M 60 -10 L 110 360" />
              <path d="M 250 -10 Q 230 170 270 360" />
              <path d="M 180 40 L 340 360" />
            </g>

            {/* River */}
            <path
              d="M -10 260 Q 150 240 280 290 T 420 260 L 420 350 L -10 350 Z"
              fill="url(#river)"
              opacity="0.6"
            />

            {/* District polygon highlight — static, no path animation */}
            <path
              d="M 140 80 L 280 90 L 290 200 L 160 210 Z"
              fill="#7A6AF5"
              fillOpacity="0.08"
              stroke="#7A6AF5"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
          </svg>

          {/* Price markers */}
          {MARKERS.map((m, i) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1], delay: 0.5 + i * 0.06 }}
              className="absolute"
              style={{ left: `${m.x}%`, top: `${m.y}%`, transform: 'translate(-50%, -100%)' }}
            >
              <div
                className={`relative flex items-center gap-1.5 rounded-full pl-1.5 pr-3 py-1 border whitespace-nowrap shadow-sm ${
                  m.highlighted
                    ? 'bg-propsight-600 border-propsight-700 text-white'
                    : 'bg-white border-neutral-200 text-neutral-800'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center ${
                    m.highlighted ? 'bg-white/20' : 'bg-propsight-50'
                  }`}
                >
                  <Home size={10} className={m.highlighted ? 'text-white' : 'text-propsight-600'} />
                </span>
                <span className="text-[11.5px] font-semibold tabular-nums">{m.price}</span>
              </div>
              {/* Pin drop */}
              <span
                className={`absolute left-1/2 -bottom-1 -translate-x-1/2 w-2 h-2 rotate-45 ${
                  m.highlighted ? 'bg-propsight-600' : 'bg-white border-r border-b border-neutral-200'
                }`}
              />
            </motion.div>
          ))}

          {/* Floating transaction detail card */}
          <motion.div
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 1.0 }}
            className="absolute right-4 top-4 w-[196px] rounded-lg border border-neutral-200 bg-white shadow-sm p-3"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-semibold text-propsight-600 uppercase tracking-wider">
                Dernière vente
              </span>
              <span className="text-[10px] text-neutral-400">il y a 3j</span>
            </div>
            <div className="flex items-baseline gap-1.5 mb-2">
              <span className="text-[18px] font-semibold text-neutral-900 tabular-nums">632 000 €</span>
              <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-0.5">
                <TrendingUp size={10} />
                +4,2%
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 mb-2">
              <MapPin size={10} className="text-neutral-400" />
              <span>Rue Lecourbe, 75015</span>
            </div>
            <div className="grid grid-cols-3 gap-1 pt-2 border-t border-neutral-100">
              <div>
                <div className="text-[9px] text-neutral-400 uppercase tracking-wide">Surface</div>
                <div className="text-[11px] font-semibold text-neutral-800 tabular-nums">68 m²</div>
              </div>
              <div>
                <div className="text-[9px] text-neutral-400 uppercase tracking-wide">Pièces</div>
                <div className="text-[11px] font-semibold text-neutral-800 tabular-nums">3</div>
              </div>
              <div>
                <div className="text-[9px] text-neutral-400 uppercase tracking-wide">€/m²</div>
                <div className="text-[11px] font-semibold text-neutral-800 tabular-nums">9 294</div>
              </div>
            </div>
          </motion.div>

          {/* Bottom statistic strip */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 1.15 }}
            className="absolute left-4 bottom-4 flex items-center gap-3 rounded-lg border border-neutral-200 bg-white px-3 py-2 shadow-sm"
          >
            <div>
              <div className="text-[9px] text-neutral-400 uppercase tracking-wide">Prix médian</div>
              <div className="text-[13px] font-semibold text-neutral-900 tabular-nums">9 420 €/m²</div>
            </div>
            <div className="w-px h-6 bg-neutral-200" />
            <div>
              <div className="text-[9px] text-neutral-400 uppercase tracking-wide">Ventes 12m</div>
              <div className="text-[13px] font-semibold text-neutral-900 tabular-nums">842</div>
            </div>
            <div className="w-px h-6 bg-neutral-200" />
            <div>
              <div className="text-[9px] text-neutral-400 uppercase tracking-wide">Tension</div>
              <div className="text-[11px] font-semibold text-rose-600">Forte</div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Secondary floating chart card — moved into a static side card, no infinite anim */}
      <motion.div
        initial={{ opacity: 0, y: 12, x: -8 }}
        animate={{ opacity: 1, y: 0, x: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
        className="hidden lg:block absolute -left-10 -bottom-8 w-[220px] rounded-lg border border-neutral-200 bg-white shadow-sm p-3 z-10"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider">
            Évolution 12m
          </span>
          <span className="inline-flex items-center gap-0.5 text-[10px] text-emerald-600 font-semibold">
            <TrendingUp size={9} />
            +2,8%
          </span>
        </div>
        {/* Mini chart */}
        <svg viewBox="0 0 180 52" className="w-full h-[52px]">
          <defs>
            <linearGradient id="miniChart" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#7A6AF5" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#7A6AF5" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M 0 36 L 18 30 L 36 32 L 54 24 L 72 22 L 90 26 L 108 18 L 126 20 L 144 12 L 162 14 L 180 8 L 180 52 L 0 52 Z"
            fill="url(#miniChart)"
          />
          <path
            d="M 0 36 L 18 30 L 36 32 L 54 24 L 72 22 L 90 26 L 108 18 L 126 20 L 144 12 L 162 14 L 180 8"
            fill="none"
            stroke="#7A6AF5"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="180" cy="8" r="3" fill="#7A6AF5" />
        </svg>
        <div className="flex items-baseline gap-1 mt-1.5">
          <span className="text-[16px] font-semibold text-neutral-900 tabular-nums">9 420 €</span>
          <span className="text-[10px] text-neutral-500">/m²</span>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default FloatingMapPreview;
