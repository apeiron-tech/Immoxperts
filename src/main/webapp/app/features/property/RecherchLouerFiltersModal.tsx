import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

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
}

export const RecherchLouerFiltersModal: React.FC<RecherchLouerFiltersModalProps> = ({
  filters,
  setFilters,
  onClose,
}) => (
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
      onClick={(e) => e.stopPropagation()}
      role="dialog"
      aria-modal
    >
      <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50">
        <h2 className="text-lg font-bold text-gray-800">Filtres</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700" type="button" aria-label="Fermer">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Nombre de chambres</h3>
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((n) => (
              <label key={n} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.chambres.includes(n)}
                  onChange={(e) =>
                    setFilters((f) => ({
                      ...f,
                      chambres: e.target.checked ? [...f.chambres, n] : f.chambres.filter((c) => c !== n),
                    }))
                  }
                  className="w-4 h-4 rounded accent-indigo-600"
                />
                <span className="text-sm text-gray-700">{`${n} chambre${n > 1 ? 's' : ''}`}</span>
              </label>
            ))}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.chambres.includes(5)}
                onChange={(e) =>
                  setFilters((f) => ({
                    ...f,
                    chambres: e.target.checked ? [...f.chambres, 5] : f.chambres.filter((c) => c !== 5),
                  }))
                }
                className="w-4 h-4 rounded accent-indigo-600"
              />
              <span className="text-sm text-gray-700">5 chambres et +</span>
            </label>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Extérieur</h3>
          <div className="grid grid-cols-2 gap-3">
            {['Balcon', 'Jardin', 'Terrasse', 'Piscine'].map((opt) => (
              <label key={opt} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.exterieur.includes(opt)}
                  onChange={(e) =>
                    setFilters((f) => ({
                      ...f,
                      exterieur: e.target.checked ? [...f.exterieur, opt] : f.exterieur.filter((x) => x !== opt),
                    }))
                  }
                  className="w-4 h-4 rounded accent-indigo-600"
                />
                <span className="text-sm text-gray-700">{opt}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-1">Prix</h3>
          <p className="text-xs text-gray-500 mb-3">
            {filters.prixMin > 0 ? `À partir de ${filters.prixMin.toLocaleString('fr-FR')} €` : 'A partir de 100 000 €'}
          </p>
          <div className="relative w-full h-2 bg-gray-200 rounded-full">
            <div
              className="absolute h-full bg-green-500 rounded-full"
              style={{ width: `${(filters.prixMin / 100000) * 100}%` }}
            />
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-1">Surface</h3>
          <p className="text-xs text-gray-500 mb-3">
            {filters.surfaceMin > 0 || filters.surfaceMax < 500
              ? `${filters.surfaceMin} - ${filters.surfaceMax} m²`
              : 'Toutes les valeurs'}
          </p>
          <div className="relative w-full h-2 bg-gray-200 rounded-full">
            <div
              className="absolute h-full bg-green-500 rounded-full"
              style={{
                left: `${(filters.surfaceMin / 500) * 100}%`,
                width: `${((filters.surfaceMax - filters.surfaceMin) / 500) * 100}%`,
              }}
            />
          </div>
        </div>

        <div className="border-t pt-4">
          <button className="flex items-center justify-between w-full text-left" type="button">
            <span className="text-sm text-gray-700">Caractéristiques</span>
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </button>
          <p className="text-xs text-gray-500 mt-1">Baignoire, Plusieurs toilettes, Cave</p>
        </div>
      </div>
    </motion.div>
  </div>
);
