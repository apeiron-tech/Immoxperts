import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, ChevronDown, ChevronRight, Filter, X } from 'lucide-react';
import type { FiltersState } from './RecherchLouerFiltersModal';

interface SearchParams {
  location?: string;
  propertyType?: string;
  maxBudget?: string;
}

export interface LocationSuggestion {
  value: string;
  adresse: string;
  type: 'commune' | 'postal_code' | 'search_postal_code' | 'department' | 'adresse';
  count: number;
}

export interface RecherchLouerFilterBarProps {
  searchParams: SearchParams | null;
  filters: FiltersState;
  onFiltersClick: () => void;
  /** Inline address input (like Achat): no redirect, suggestions in bar */
  locationInputValue?: string;
  onLocationInputChange?: (value: string) => void;
  onLocationFocus?: () => void;
  showLocationDropdown?: boolean;
  locationSuggestions?: LocationSuggestion[];
  locationSuggestionsLoading?: boolean;
  onSelectLocationSuggestion?: (suggestion: LocationSuggestion) => void;
  locationInputContainerRef?: React.RefObject<HTMLDivElement | null>;
  /** When user selects a new property type (Maison / Appartement) */
  onPropertyTypeChange?: (propertyType: 'Maison' | 'Appartement') => void;
  maxPrice?: number;
  setFilters?: React.Dispatch<React.SetStateAction<FiltersState>>;
  onFiltersChange?: (newFilters: FiltersState) => void;
  mode?: 'louer' | 'achat';
}

const getActiveFilterCount = (filters: FiltersState, maxPrice: number): number =>
  filters.chambres.length +
  filters.exterieur.length +
  (filters.prixMin > 0 || filters.prixMax < maxPrice ? 1 : 0) +
  (filters.surfaceMin > 0 || filters.surfaceMax < 500 ? 1 : 0);

interface SkillTag {
  id: string;
  label: string;
  onRemove: () => void;
}

function buildSkillTags(
  filters: FiltersState,
  maxPrice: number,
  mode: 'louer' | 'achat',
  setFilters: React.Dispatch<React.SetStateAction<FiltersState>> | undefined,
  onFiltersChange: ((f: FiltersState) => void) | undefined,
): SkillTag[] {
  const tags: SkillTag[] = [];
  const priceLabel = mode === 'achat' ? ' €' : ' €/mois';

  if (filters.chambres.length > 0) {
    const label =
      filters.chambres.length === 1 && filters.chambres[0] === 5
        ? 'Pièces: 5+'
        : `Pièces: ${filters.chambres.map(c => (c === 5 ? '5+' : c)).join(', ')}`;
    tags.push({
      id: 'chambres',
      label,
      onRemove() {
        const next = { ...filters, chambres: [] };
        setFilters?.(next);
        onFiltersChange?.(next);
      },
    });
  }

  filters.exterieur.forEach(opt => {
    tags.push({
      id: `exterieur-${opt}`,
      label: opt,
      onRemove() {
        const next = { ...filters, exterieur: filters.exterieur.filter(x => x !== opt) };
        setFilters?.(next);
        onFiltersChange?.(next);
      },
    });
  });

  if (filters.prixMin > 0 || filters.prixMax < maxPrice) {
    const minStr = filters.prixMin > 0 ? filters.prixMin.toLocaleString('fr-FR') : '0';
    const maxStr =
      filters.prixMax >= maxPrice ? `${maxPrice.toLocaleString('fr-FR')}+` : filters.prixMax.toLocaleString('fr-FR');
    tags.push({
      id: 'prix',
      label: `Prix: ${minStr} - ${maxStr}${priceLabel}`,
      onRemove() {
        const next = { ...filters, prixMin: 0, prixMax: maxPrice };
        setFilters?.(next);
        onFiltersChange?.(next);
      },
    });
  }

  if (filters.surfaceMin > 0 || filters.surfaceMax < 500) {
    const minStr = filters.surfaceMin > 0 ? `${filters.surfaceMin} m²` : '0';
    const maxStr = filters.surfaceMax >= 500 ? '500 m²+' : `${filters.surfaceMax} m²`;
    tags.push({
      id: 'surface',
      label: `Surface: ${minStr} - ${maxStr}`,
      onRemove() {
        const next = { ...filters, surfaceMin: 0, surfaceMax: 500 };
        setFilters?.(next);
        onFiltersChange?.(next);
      },
    });
  }

  return tags;
}

export function RecherchLouerFilterBar({
  searchParams,
  filters,
  onFiltersClick,
  locationInputValue = '',
  onLocationInputChange,
  onLocationFocus,
  showLocationDropdown = false,
  locationSuggestions = [],
  locationSuggestionsLoading = false,
  onSelectLocationSuggestion,
  locationInputContainerRef,
  onPropertyTypeChange,
  maxPrice = 5000,
  setFilters,
  onFiltersChange,
  mode = 'louer',
}: RecherchLouerFilterBarProps) {
  const activeCount = getActiveFilterCount(filters, maxPrice);
  const skillTags = buildSkillTags(filters, maxPrice, mode, setFilters, onFiltersChange);

  const [propertyTypeDropdownOpen, setPropertyTypeDropdownOpen] = useState(false);
  const propertyTypeDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!propertyTypeDropdownOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (propertyTypeDropdownRef.current && !propertyTypeDropdownRef.current.contains(e.target as Node)) {
        setPropertyTypeDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [propertyTypeDropdownOpen]);

  const currentType = searchParams?.propertyType?.trim();
  const displayType =
    currentType?.toLowerCase() === 'appartement'
      ? 'Appartement'
      : currentType?.toLowerCase() === 'maison'
        ? 'Maison'
        : null;

  const hasLocationInput =
    onLocationInputChange != null &&
    onLocationFocus != null &&
    onSelectLocationSuggestion != null &&
    searchParams != null;

  return (
    <header className="mt-10 rounded-2xl">
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-2">
        {/* Top row: search bar + primary filters */}
        <motion.div
          className="flex flex-wrap gap-2 sm:gap-3 items-center bg-white rounded-xl border border-gray-200 shadow-sm p-2 sm:p-3"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Address input with suggestions (like Achat) - no redirect */}
          {hasLocationInput ? (
            <div
              ref={locationInputContainerRef}
              className="relative flex-1 min-w-[140px]"
            >
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-gray-50 border border-gray-200 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500">
                <MapPin className="h-4 w-4 text-gray-500 flex-shrink-0" />
                <input
                  type="text"
                  value={locationInputValue}
                  onChange={e => onLocationInputChange(e.target.value)}
                  onFocus={onLocationFocus}
                  placeholder="Ville, code postal, département..."
                  className="flex-1 min-w-0 bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none border-0 p-0"
                  aria-label="Localisation"
                />
                {locationSuggestionsLoading && (
                  <span className="text-gray-400 text-xs flex-shrink-0">…</span>
                )}
                <ChevronDown className="h-4 w-4 text-gray-400 flex-shrink-0" />
              </div>
              {showLocationDropdown && (
                <div className="absolute z-50 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {locationSuggestionsLoading ? (
                    <div className="px-4 py-3 text-gray-500 text-sm">Recherche…</div>
                  ) : locationSuggestions.length > 0 ? (
                    locationSuggestions.map((suggestion, index) => (
                      <button
                        key={`${suggestion.value}-${suggestion.type}-${index}`}
                        type="button"
                        onClick={() => onSelectLocationSuggestion(suggestion)}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center justify-between border-b border-gray-100 last:border-b-0"
                      >
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{suggestion.adresse}</div>
                            <div className="text-xs text-gray-500 capitalize">
                              {suggestion.type === 'commune' && 'Commune'}
                              {(suggestion.type === 'postal_code' || suggestion.type === 'search_postal_code') && 'Code postal'}
                              {suggestion.type === 'department' && 'Département'}
                              {suggestion.type === 'adresse' && 'Adresse'}
                            </div>
                          </div>
                        </div>
                        {suggestion.count > 0 && (
                          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">{suggestion.count}</span>
                        )}
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-gray-500 text-sm">Aucune suggestion</div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 flex-1 min-w-0 px-3 py-2.5 rounded-lg bg-gray-50 border border-gray-200">
              <MapPin className="h-4 w-4 text-gray-500 flex-shrink-0" />
              <span className="text-sm text-gray-800 truncate">{searchParams?.location || 'Localisation'}</span>
            </div>
          )}

          {/* Property type: Maison / Appartement - selectable */}
          <div className="relative" ref={propertyTypeDropdownRef}>
            <button
              type="button"
              onClick={() => onPropertyTypeChange && setPropertyTypeDropdownOpen(o => !o)}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border transition-colors min-w-[120px] justify-between ${
                onPropertyTypeChange
                  ? 'bg-gray-50 border-gray-200 hover:bg-indigo-50 hover:border-indigo-200 cursor-pointer'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <span className="text-sm font-medium text-gray-800">{displayType || 'Type'}</span>
              {onPropertyTypeChange && (
                <ChevronDown
                  className={`h-4 w-4 text-gray-400 flex-shrink-0 transition-transform ${propertyTypeDropdownOpen ? 'rotate-180' : ''}`}
                />
              )}
            </button>
            {onPropertyTypeChange && propertyTypeDropdownOpen && (
              <div className="absolute z-50 left-0 mt-1 w-full min-w-[160px] bg-white border border-gray-200 rounded-lg shadow-lg py-1">
                <button
                  type="button"
                  onClick={() => {
                    onPropertyTypeChange('Maison');
                    setPropertyTypeDropdownOpen(false);
                  }}
                  className={`w-full px-4 py-2.5 text-left text-sm font-medium hover:bg-gray-50 flex items-center justify-between ${
                    displayType === 'Maison' ? 'bg-indigo-50 text-indigo-800' : 'text-gray-800'
                  }`}
                >
                  Maison
                  {displayType === 'Maison' && <span className="text-indigo-600">✓</span>}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onPropertyTypeChange('Appartement');
                    setPropertyTypeDropdownOpen(false);
                  }}
                  className={`w-full px-4 py-2.5 text-left text-sm font-medium hover:bg-gray-50 flex items-center justify-between ${
                    displayType === 'Appartement' ? 'bg-indigo-50 text-indigo-800' : 'text-gray-800'
                  }`}
                >
                  Appartement
                  {displayType === 'Appartement' && <span className="text-indigo-600">✓</span>}
                </button>
              </div>
            )}
          </div>

          <button
            type="button"
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-gray-50 border border-gray-200 hover:bg-indigo-50 hover:border-indigo-200 transition-colors"
          >
            <span className="text-sm font-medium text-gray-800">
              {searchParams?.maxBudget ? searchParams.maxBudget : 'Prix'}
            </span>
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </button>

          <button
            onClick={onFiltersClick}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-800 hover:bg-indigo-100 transition-colors"
            type="button"
          >
            <Filter className="h-4 w-4 text-indigo-600" />
            <span className="text-sm font-medium">Filtres</span>
            {activeCount > 0 && (
              <span className="bg-indigo-600 text-white text-xs font-bold rounded-full min-w-[20px] h-5 px-1.5 flex items-center justify-center">
                {activeCount}
              </span>
            )}
          </button>
        </motion.div>

        {/* Second row: applied filter skills (tags) */}
        {skillTags.length > 0 && (
          <motion.div
            className="flex flex-wrap gap-2 items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {skillTags.map(tag => (
              <span
                key={tag.id}
                className="inline-flex items-center gap-1.5 pl-3 pr-1.5 py-1.5 rounded-lg bg-indigo-100 text-indigo-900 text-sm font-medium border border-indigo-200"
              >
                <span>{tag.label}</span>
                <button
                  type="button"
                  onClick={tag.onRemove}
                  className="p-0.5 rounded hover:bg-indigo-200/80 transition-colors"
                  aria-label={`Retirer ${tag.label}`}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </span>
            ))}
          </motion.div>
        )}
      </div>
    </header>
  );
}
