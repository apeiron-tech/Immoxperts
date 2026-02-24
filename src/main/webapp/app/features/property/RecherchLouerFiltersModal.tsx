import React from 'react';
import { motion } from 'framer-motion';

export interface FiltersState {
  chambres: number[];
  exterieur: string[];
  typeVente: string;
  prixMin: number;
  prixMax: number;
  surfaceMin: number;
  surfaceMax: number;
  etage: string[];
}

interface RecherchLouerFiltersModalProps {
  filters: FiltersState;
  setFilters: React.Dispatch<React.SetStateAction<FiltersState>>;
  onClose: () => void;
  /** Called when user clicks "Appliquer les filtres" with current filters (run new search then close) */
  onApply?: (appliedFilters: FiltersState) => void;
  mode?: 'louer' | 'achat';
  maxPrice?: number;
}

const RangeSlider: React.FC<{
  min: number;
  max: number;
  valueMin: number;
  valueMax: number;
  step: number;
  onMinChange: (v: number) => void;
  onMaxChange: (v: number) => void;
  formatValue: (v: number) => string;
}> = ({ min, max, valueMin, valueMax, step, onMinChange, onMaxChange, formatValue }) => {
  const pct = (v: number) => ((v - min) / (max - min)) * 100;

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs text-gray-500">
        <span>{formatValue(valueMin)}</span>
        <span>{formatValue(valueMax)}</span>
      </div>
      <div className="relative h-6 flex items-center">
        {/* Track */}
        <div className="absolute w-full h-2 bg-gray-200 rounded-full" />
        {/* Active range */}
        <div
          className="absolute h-2 bg-indigo-500 rounded-full"
          style={{ left: `${pct(valueMin)}%`, width: `${pct(valueMax) - pct(valueMin)}%` }}
        />
        {/* Min thumb */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={valueMin}
          onChange={e => {
            const v = Number(e.target.value);
            if (v <= valueMax) onMinChange(v);
          }}
          className="absolute w-full h-2 appearance-none bg-transparent cursor-pointer"
          style={{ zIndex: valueMin > max - step ? 5 : 3 }}
        />
        {/* Max thumb */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={valueMax}
          onChange={e => {
            const v = Number(e.target.value);
            if (v >= valueMin) onMaxChange(v);
          }}
          className="absolute w-full h-2 appearance-none bg-transparent cursor-pointer"
          style={{ zIndex: 4 }}
        />
      </div>
    </div>
  );
};

export const RecherchLouerFiltersModal: React.FC<RecherchLouerFiltersModalProps> = ({
  filters,
  setFilters,
  onClose,
  onApply,
  mode = 'louer',
  maxPrice = 5000,
}) => {
  const handleApply = () => {
    onApply?.(filters);
    onClose();
  };
  const priceStep = mode === 'achat' ? 10000 : 100;
  const priceLabel = mode === 'achat' ? '€' : '€/mois';
  const formatPrice = (v: number) =>
    v === maxPrice ? `${v.toLocaleString('fr-FR')} ${priceLabel} +` : `${v.toLocaleString('fr-FR')} ${priceLabel}`;
  const formatSurface = (v: number) => (v === 500 ? '500 m² +' : `${v} m²`);

  const toggle = <T,>(arr: T[], val: T): T[] =>
    arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val];

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[110]"
      onClick={onClose}
      role="presentation"
    >
      <motion.div
        className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col mx-4"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', duration: 0.3 }}
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-bold text-gray-800">Filtres</h2>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() =>
                setFilters(f => ({
                  ...f,
                  chambres: [],
                  exterieur: [],
                  prixMin: 0,
                  prixMax: maxPrice,
                  surfaceMin: 0,
                  surfaceMax: 500,
                }))
              }
              className="text-xs text-indigo-600 hover:underline"
            >
              Réinitialiser
            </button>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700" type="button" aria-label="Fermer">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Chambres */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Nombre de chambres</h3>
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3, 4].map(n => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setFilters(f => ({ ...f, chambres: toggle(f.chambres, n) }))}
                  className={`py-2 rounded-lg border text-sm font-medium transition-colors ${
                    filters.chambres.includes(n)
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-indigo-300'
                  }`}
                >
                  {n}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setFilters(f => ({ ...f, chambres: toggle(f.chambres, 5) }))}
                className={`py-2 rounded-lg border text-sm font-medium transition-colors ${
                  filters.chambres.includes(5)
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-indigo-300'
                }`}
              >
                5+
              </button>
            </div>
          </div>

          {/* Extérieur */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Extérieur</h3>
            <div className="grid grid-cols-2 gap-2">
              {['Balcon', 'Jardin', 'Terrasse', 'Piscine'].map(opt => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setFilters(f => ({ ...f, exterieur: toggle(f.exterieur, opt) }))}
                  className={`py-2 rounded-lg border text-sm font-medium transition-colors ${
                    filters.exterieur.includes(opt)
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-indigo-300'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Prix */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Prix</h3>
            <RangeSlider
              min={0}
              max={maxPrice}
              step={priceStep}
              valueMin={filters.prixMin}
              valueMax={filters.prixMax}
              onMinChange={v => setFilters(f => ({ ...f, prixMin: v }))}
              onMaxChange={v => setFilters(f => ({ ...f, prixMax: v }))}
              formatValue={formatPrice}
            />
          </div>

          {/* Surface */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Surface</h3>
            <RangeSlider
              min={0}
              max={500}
              step={5}
              valueMin={filters.surfaceMin}
              valueMax={filters.surfaceMax}
              onMinChange={v => setFilters(f => ({ ...f, surfaceMin: v }))}
              onMaxChange={v => setFilters(f => ({ ...f, surfaceMax: v }))}
              formatValue={formatSurface}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50">
          <button
            type="button"
            onClick={handleApply}
            className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
          >
            Appliquer les filtres
          </button>
        </div>
      </motion.div>
    </div>
  );
};
