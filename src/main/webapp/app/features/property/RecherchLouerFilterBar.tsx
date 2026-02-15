import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, ChevronDown, ChevronRight, Filter } from 'lucide-react';
import type { FiltersState } from './RecherchLouerFiltersModal';

interface SearchParams {
  location?: string;
  propertyType?: string;
  maxBudget?: string;
}

interface RecherchLouerFilterBarProps {
  searchParams: SearchParams | null;
  filters: FiltersState;
  onFiltersClick: () => void;
}

const getActiveFilterCount = (filters: FiltersState): number =>
  filters.chambres.length +
  filters.exterieur.length +
  (filters.prixMin > 0 || filters.prixMax < 5000 ? 1 : 0) +
  (filters.surfaceMin > 0 || filters.surfaceMax < 500 ? 1 : 0);

export const RecherchLouerFilterBar: React.FC<RecherchLouerFilterBarProps> = ({
  searchParams,
  filters,
  onFiltersClick,
}) => {
  const activeCount = getActiveFilterCount(filters);

  return (
    <header className="mt-10 rounded-2xl">
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <motion.div
          className="flex flex-wrap gap-2 sm:gap-3 items-center bg-white rounded-xl border shadow-sm p-2 sm:p-3"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center gap-2 flex-1 min-w-0 px-3 py-2.5 rounded-lg bg-gray-50 border border-gray-200">
            <MapPin className="h-4 w-4 text-gray-500 flex-shrink-0" />
            <span className="text-sm text-gray-800 truncate">{searchParams?.location || 'Localisation'}</span>
            <ChevronDown className="h-4 w-4 text-gray-400 flex-shrink-0" />
          </div>

          <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-gray-50 border border-gray-200 cursor-pointer hover:bg-gray-100">
            <span className="text-sm font-medium text-gray-800">{searchParams?.propertyType || 'Type'}</span>
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </div>

          <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-gray-50 border border-gray-200 cursor-pointer hover:bg-gray-100">
            <span className="text-sm font-medium text-gray-800">
              {searchParams?.maxBudget ? `${searchParams.maxBudget} €/mois` : 'Prix'}
            </span>
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </div>

          <button
            onClick={onFiltersClick}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors"
            type="button"
          >
            <Filter className="h-4 w-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-800">Filtres</span>
            {activeCount > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {activeCount}
              </span>
            )}
          </button>
        </motion.div>
      </div>
    </header>
  );
};
