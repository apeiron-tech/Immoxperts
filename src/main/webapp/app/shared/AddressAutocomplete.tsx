import React, { useEffect, useRef, useState } from 'react';
import { MapPin, X } from 'lucide-react';

export interface BanAddress {
  label: string;
  postcode: string;
  city: string;
  lat: number;
  lng: number;
}

interface BanFeature {
  geometry: { coordinates: [number, number] };
  properties: { label: string; postcode?: string; city?: string };
}

interface Props {
  value: BanAddress | null;
  onChange: (v: BanAddress | null) => void;
  placeholder?: string;
  invalid?: boolean;
  id?: string;
}

const BAN_ENDPOINT = 'https://api-adresse.data.gouv.fr/search/';

const AddressAutocomplete: React.FC<Props> = ({ value, onChange, placeholder, invalid, id }) => {
  const [query, setQuery] = useState(value?.label ?? '');
  const [results, setResults] = useState<BanAddress[]>([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const debounceRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuery(value?.label ?? '');
  }, [value]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const search = (q: string) => {
    if (q.trim().length < 3) {
      setResults([]);
      return;
    }
    const url = `${BAN_ENDPOINT}?q=${encodeURIComponent(q)}&limit=5&autocomplete=1`;
    fetch(url)
      .then(r => (r.ok ? r.json() : null))
      .then((data: { features?: BanFeature[] } | null) => {
        if (!data?.features) {
          setResults([]);
          return;
        }
        setResults(
          data.features.map(f => ({
            label: f.properties.label,
            postcode: f.properties.postcode ?? '',
            city: f.properties.city ?? '',
            lat: f.geometry.coordinates[1],
            lng: f.geometry.coordinates[0],
          })),
        );
      })
      .catch(() => setResults([]));
  };

  const onInputChange = (v: string) => {
    setQuery(v);
    setOpen(true);
    setActive(0);
    if (value) onChange(null);
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => search(v), 250);
  };

  const select = (a: BanAddress) => {
    setQuery(a.label);
    onChange(a);
    setOpen(false);
  };

  const clear = () => {
    setQuery('');
    onChange(null);
    setResults([]);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open || results.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive(a => Math.min(a + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive(a => Math.max(a - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      select(results[active]);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        <input
          id={id}
          type="text"
          value={query}
          onChange={e => onInputChange(e.target.value)}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          aria-invalid={invalid}
          autoComplete="off"
          className={`w-full h-11 pl-9 pr-9 text-[14px] rounded-md border bg-white outline-none transition-colors ${
            invalid ? 'border-rose-300 focus:border-rose-500 focus:ring-1 focus:ring-rose-500' : 'border-slate-200 focus:border-propsight-500 focus:ring-1 focus:ring-propsight-500'
          }`}
        />
        {value ? (
          <button
            type="button"
            onClick={clear}
            aria-label="Effacer l’adresse"
            className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded hover:bg-slate-100 text-slate-400 flex items-center justify-center"
          >
            <X size={13} />
          </button>
        ) : null}
      </div>
      {open && results.length > 0 ? (
        <ul className="absolute z-20 left-0 right-0 mt-1 bg-white rounded-md border border-slate-200 shadow-lg max-h-72 overflow-auto">
          {results.map((r, i) => (
            <li key={`${r.label}-${i}`}>
              <button
                type="button"
                onMouseEnter={() => setActive(i)}
                onClick={() => select(r)}
                className={`w-full text-left px-3 py-2 text-[13.5px] flex flex-col gap-0.5 ${
                  i === active ? 'bg-propsight-50' : 'hover:bg-slate-50'
                }`}
              >
                <span className="text-slate-900">{r.label}</span>
                {r.postcode || r.city ? (
                  <span className="text-[11.5px] text-slate-500">
                    {r.postcode} {r.city}
                  </span>
                ) : null}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
};

export default AddressAutocomplete;
