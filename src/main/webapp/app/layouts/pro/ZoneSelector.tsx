import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, X } from 'lucide-react';
import { useZoneStore } from 'app/shared/stores/zoneStore';

const DEFAULT_ZONES = [
  { id: 'paris-15', label: 'Paris 15e', type: 'district' as const },
  { id: 'lyon', label: 'Lyon', type: 'city' as const },
  { id: 'bordeaux', label: 'Bordeaux', type: 'city' as const },
  { id: 'nantes', label: 'Nantes', type: 'city' as const },
];

const ZoneSelector: React.FC = () => {
  const { current, recents, setZone, clearZone } = useZoneStore();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const results = DEFAULT_ZONES.filter(z => z.label.toLowerCase().includes(query.toLowerCase()));

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="h-9 px-3 rounded-md border border-neutral-200 bg-white hover:bg-neutral-50 text-[13px] text-neutral-700 flex items-center gap-2 transition-colors"
      >
        <Globe size={13} className="text-neutral-400" />
        <span>
          Zone :{' '}
          <span className="font-medium">{current ? current.label : 'France'}</span>
        </span>
        {current && (
          <span
            role="button"
            onClick={e => {
              e.stopPropagation();
              clearZone();
            }}
            className="text-neutral-400 hover:text-neutral-700"
          >
            <X size={12} />
          </span>
        )}
        <ChevronDown size={13} className="text-neutral-400" />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 w-64 bg-white border border-neutral-200 rounded-md shadow-md z-50 p-2">
          <input
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Rechercher une zone…"
            className="w-full h-8 px-2 mb-2 text-sm rounded border border-neutral-200 focus:border-propsight-500 outline-none"
          />
          {recents.length > 0 && !query && (
            <div className="mb-2">
              <div className="text-[10px] font-semibold text-neutral-400 uppercase px-2 mb-1">Récentes</div>
              {recents.map(z => (
                <button
                  key={z.id}
                  type="button"
                  onClick={() => {
                    setZone(z);
                    setOpen(false);
                  }}
                  className="w-full text-left px-2 py-1.5 text-sm rounded hover:bg-neutral-100 text-neutral-700"
                >
                  {z.label}
                </button>
              ))}
            </div>
          )}
          <div className="text-[10px] font-semibold text-neutral-400 uppercase px-2 mb-1">Suggestions</div>
          {results.map(z => (
            <button
              key={z.id}
              type="button"
              onClick={() => {
                setZone(z);
                setOpen(false);
              }}
              className="w-full text-left px-2 py-1.5 text-sm rounded hover:bg-neutral-100 text-neutral-700"
            >
              {z.label}
            </button>
          ))}
          {results.length === 0 && <div className="px-2 py-2 text-xs text-neutral-400">Aucun résultat.</div>}
        </div>
      )}
    </div>
  );
};

export default ZoneSelector;
