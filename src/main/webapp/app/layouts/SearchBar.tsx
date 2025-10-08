import React, { useState, useEffect, useRef } from 'react';
import FilterPopup from '../features/property/FilterPopup';
import { FilterState } from '../types/filters';
import { API_ENDPOINTS } from 'app/config/api.config';

interface SearchBarProps {
  onSearch: (searchParams: { numero: number; nomVoie: string; coordinates: [number, number]; context?: Array<{ text: string }> }) => void;
  onFilterApply?: (filters: FilterState) => void;
  currentFilters?: FilterState;
  onFilterOpenChange?: (isOpen: boolean) => void;
}

interface LocalAddressFeature {
  commune: string;
  codepostal: string;
  idadresse: number;
  numero: string;
  nomVoie: string;
  longitude: number;
  typeVoie: string;
  latitude: number;
  adresseComplete: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onFilterApply, currentFilters, onFilterOpenChange }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [suggestions, setSuggestions] = useState<LocalAddressFeature[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Notify parent when filter popup opens/closes
  useEffect(() => {
    onFilterOpenChange?.(isFilterOpen);
  }, [isFilterOpen, onFilterOpenChange]);

  // Default filter values for comparison
  const defaultFilters = {
    propertyTypes: { maison: true, terrain: true, appartement: true, biensMultiples: true, localCommercial: true },
    roomCounts: { studio: true, deuxPieces: true, troisPieces: true, quatrePieces: true, cinqPiecesPlus: true },
    priceRange: [0, 20000000] as [number, number],
    surfaceRange: [0, 400] as [number, number],
    terrainRange: [0, 50000] as [number, number],
    pricePerSqmRange: [0, 40000] as [number, number],
    dateRange: [0, 140] as [number, number],
  };

  // Calculate active filter count
  const calculateActiveFilters = (): number => {
    if (!currentFilters) return 0;

    let count = 0;

    // Type de bien: +1 if ANY checkbox is unchecked
    const propertyTypeKeys = Object.keys(currentFilters.propertyTypes) as (keyof typeof currentFilters.propertyTypes)[];
    const hasPropertyTypeFilter = propertyTypeKeys.some(key => !currentFilters.propertyTypes[key]);
    if (hasPropertyTypeFilter) count += 1;

    // Nombre de pièces: +1 if ANY checkbox is unchecked
    const roomCountKeys = Object.keys(currentFilters.roomCounts) as (keyof typeof currentFilters.roomCounts)[];
    const hasRoomCountFilter = roomCountKeys.some(key => !currentFilters.roomCounts[key]);
    if (hasRoomCountFilter) count += 1;

    // Range bars: 5 bars, each can give 0-2 points
    const rangeFilters: Array<{ key: keyof typeof defaultFilters; range: [number, number] }> = [
      { key: 'priceRange', range: currentFilters.priceRange },
      { key: 'surfaceRange', range: currentFilters.surfaceRange },
      { key: 'terrainRange', range: currentFilters.terrainRange },
      { key: 'pricePerSqmRange', range: currentFilters.pricePerSqmRange },
      { key: 'dateRange', range: currentFilters.dateRange },
    ];

    rangeFilters.forEach(({ key, range }) => {
      const defaultRange = defaultFilters[key] as [number, number];
      const minChanged = range[0] !== defaultRange[0];
      const maxChanged = range[1] !== defaultRange[1];

      if (minChanged && maxChanged) {
        count += 2; // Both changed = 2 points
      } else if (minChanged || maxChanged) {
        count += 1; // One changed = 1 point
      }
      // Neither changed = 0 points (do nothing)
    });

    return count;
  };

  const activeFilterCount = calculateActiveFilters();

  // Reset all filters to default values
  const resetFilters = () => {
    if (onFilterApply) {
      onFilterApply(defaultFilters);
    }
  };

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(async () => {
      if (searchQuery.length > 2) {
        try {
          setIsLoading(true);

          const response = await fetch(`${API_ENDPOINTS.adresses.suggestions}?q=${encodeURIComponent(searchQuery)}`);

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          setSuggestions(data);

          // Only show suggestions if the input is focused (user typing)
          if (document.activeElement === inputRef.current) {
            setShowSuggestions(true);
          }
        } catch (error) {
          // Error fetching address suggestions
          setSuggestions([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  const handleAddressSelect = (feature: LocalAddressFeature): void => {
    const numero = parseInt(feature.numero, 10);
    const nomVoie = feature.nomVoie;
    const coordinates: [number, number] = [feature.longitude, feature.latitude];

    setSearchQuery(feature.adresseComplete);
    setShowSuggestions(false); // Close suggestions
    setSuggestions([]); // Clear suggestions after selection

    if (inputRef.current) {
      inputRef.current.blur(); // Blur input to prevent reopening
    }

    onSearch({
      numero,
      nomVoie,
      coordinates,
      context: [{ text: feature.commune }, { text: feature.codepostal }, { text: feature.typeVoie }],
    });
  };

  return (
    <>
      {/* Mobile-first design */}
      <div className="w-full">
        {/* Mobile Search Bar - Full width, clean design like ImmoData */}
        <div className="block md:hidden sticky top-0 z-50">
          <div className="px-4 py-3 bg-white shadow-sm">
            <div className="flex items-center gap-3">
              {/* Search Input Container */}
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-gray-400"
                  >
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                </div>
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Entrez une adresse en France"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border-0 rounded-xl text-base placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all"
                />

                {/* Loading indicator */}
                {isLoading && (
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                  </div>
                )}

                {/* Mobile Suggestions Dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl max-h-80 overflow-y-auto">
                    {suggestions.map((feature, index) => (
                      <button
                        key={feature.idadresse}
                        className="w-full px-5 py-4 text-left hover:bg-gray-50 border-b border-gray-50 last:border-b-0 transition-colors first:rounded-t-2xl last:rounded-b-2xl"
                        onClick={() => handleAddressSelect(feature)}
                      >
                        <div className="text-base font-medium text-gray-900 mb-1">{feature.adresseComplete}</div>
                        <div className="text-sm text-gray-500">
                          {feature.commune} • {feature.codepostal}
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* No results message */}
                {showSuggestions && searchQuery.length > 2 && suggestions.length === 0 && !isLoading && (
                  <div className="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl">
                    <div className="px-5 py-4 text-base text-gray-500 text-center">Aucune adresse trouvée</div>
                  </div>
                )}
              </div>

              {/* Mobile Filter Button - Like ImmoData */}
              <button
                className="relative flex items-center justify-center w-10 h-10 rounded-xl text-white hover:bg-opacity-90 transition-colors duration-200"
                style={{ backgroundColor: '#7069F9' }}
                onClick={() => setIsFilterOpen(true)}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M3.26172 17.2446C3.26172 16.8304 3.59751 16.4946 4.01172 16.4946H10.4842C10.8985 16.4946 11.2342 16.8304 11.2342 17.2446C11.2342 17.6588 10.8985 17.9946 10.4842 17.9946H4.01172C3.59751 17.9946 3.26172 17.6588 3.26172 17.2446Z"
                    fill="white"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M14.6122 14.5885C15.2599 13.9409 16.2067 13.7737 17.2687 13.7737C18.3306 13.7737 19.2774 13.9409 19.9252 14.5885C20.573 15.2361 20.7405 16.183 20.7405 17.2455C20.7405 18.308 20.573 19.2548 19.9252 19.9024C19.2774 20.55 18.3306 20.7173 17.2687 20.7173C16.2067 20.7173 15.2599 20.55 14.6122 19.9024C13.9644 19.2548 13.7969 18.308 13.7969 17.2455C13.7969 16.183 13.9644 15.2361 14.6122 14.5885ZM15.6727 15.6493C15.4698 15.8521 15.2969 16.2662 15.2969 17.2455C15.2969 18.2248 15.4698 18.6388 15.6727 18.8416C15.8756 19.0445 16.2897 19.2173 17.2687 19.2173C18.2476 19.2173 18.6617 19.0445 18.8646 18.8416C19.0675 18.6388 19.2405 18.2248 19.2405 17.2455C19.2405 16.2662 19.0675 15.8521 18.8646 15.6493C18.6617 15.4465 18.2476 15.2737 17.2687 15.2737C16.2897 15.2737 15.8756 15.4465 15.6727 15.6493Z"
                    fill="white"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12.7676 6.75594C12.7676 6.34172 13.1034 6.00594 13.5176 6.00594H19.9892C20.4034 6.00594 20.7392 6.34172 20.7392 6.75594C20.7392 7.17015 20.4034 7.50594 19.9892 7.50594H13.5176C13.1034 7.50594 12.7676 7.17015 12.7676 6.75594Z"
                    fill="white"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M4.07713 4.09797C4.72495 3.45031 5.67188 3.28281 6.7344 3.28281C7.79655 3.28281 8.74326 3.45034 9.39096 4.09804C10.0387 4.74574 10.2062 5.69245 10.2062 6.7546C10.2062 7.81709 10.0387 8.76392 9.39089 9.41156C8.74313 10.0592 7.79635 10.2264 6.7344 10.2264C5.67208 10.2264 4.72509 10.0592 4.0772 9.41163C3.42921 8.76398 3.26172 7.81708 3.26172 6.7546C3.26172 5.69245 3.42924 4.74568 4.07713 4.09797ZM5.13765 5.15877C4.93464 5.36172 4.76172 5.77584 4.76172 6.7546C4.76172 7.7339 4.93468 8.1479 5.13758 8.35069C5.34059 8.55359 5.75494 8.72639 6.7344 8.72639C7.71335 8.72639 8.12747 8.55362 8.33037 8.35076C8.53324 8.14795 8.70619 7.73389 8.70619 6.7546C8.70619 5.77585 8.53328 5.36167 8.3303 5.1587C8.12733 4.95572 7.71315 4.78281 6.7344 4.78281C5.75514 4.78281 5.34072 4.95575 5.13765 5.15877Z"
                    fill="white"
                  />
                </svg>

                {/* Active Filter Counter Badge */}
                {activeFilterCount > 0 && (
                  <span
                    className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md cursor-pointer hover:bg-red-600 transition-colors duration-200 group"
                    onClick={e => {
                      e.stopPropagation();
                      resetFilters();
                    }}
                    title="Réinitialiser les filtres"
                  >
                    <span className="group-hover:hidden text-xs">{activeFilterCount}</span>
                    <span className="hidden group-hover:block text-lg">×</span>
                  </span>
                )}
              </button>
            </div>

            {/* Filter Popup for Mobile */}
            {isFilterOpen && (
              <FilterPopup
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                onApply={filters => {
                  setIsFilterOpen(false);
                  onFilterApply?.(filters);
                }}
                currentFilters={currentFilters}
              />
            )}
          </div>
        </div>

        {/* Desktop Search Bar - Keep existing design for larger screens */}
        <div className="hidden md:block px-4 py-3 sticky top-0 z-40 bg-white shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 max-w-2xl mx-auto w-full">
            {/* Search Input */}
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </div>
              <input
                ref={inputRef}
                type="text"
                placeholder="Entrez une adresse en France"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />

              {/* Loading indicator */}
              {isLoading && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                </div>
              )}

              {/* Desktop Suggestions Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {suggestions.map((feature, index) => (
                    <button
                      key={feature.idadresse}
                      className="w-full px-4 py-3 text-left hover:bg-gray-100 border-b border-gray-100 last:border-b-0 transition-colors"
                      onClick={() => handleAddressSelect(feature)}
                    >
                      <div className="text-sm font-medium text-gray-900">{feature.adresseComplete}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {feature.commune} - {feature.codepostal}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* No results message */}
              {showSuggestions && searchQuery.length > 2 && suggestions.length === 0 && !isLoading && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                  <div className="px-4 py-3 text-sm text-gray-500 text-center">Aucune adresse trouvée</div>
                </div>
              )}
            </div>

            {/* Filter Button - Only on desktop */}
            <button
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-white hover:bg-opacity-90 transition-colors duration-200 font-medium relative"
              style={{ backgroundColor: '#7069F9' }}
              onClick={() => setIsFilterOpen(true)}
            >
              {/* Filter icon */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M3.26172 17.2446C3.26172 16.8304 3.59751 16.4946 4.01172 16.4946H10.4842C10.8985 16.4946 11.2342 16.8304 11.2342 17.2446C11.2342 17.6588 10.8985 17.9946 10.4842 17.9946H4.01172C3.59751 17.9946 3.26172 17.6588 3.26172 17.2446Z"
                  fill="white"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M14.6122 14.5885C15.2599 13.9409 16.2067 13.7737 17.2687 13.7737C18.3306 13.7737 19.2774 13.9409 19.9252 14.5885C20.573 15.2361 20.7405 16.183 20.7405 17.2455C20.7405 18.308 20.573 19.2548 19.9252 19.9024C19.2774 20.55 18.3306 20.7173 17.2687 20.7173C16.2067 20.7173 15.2599 20.55 14.6122 19.9024C13.9644 19.2548 13.7969 18.308 13.7969 17.2455C13.7969 16.183 13.9644 15.2361 14.6122 14.5885ZM15.6727 15.6493C15.4698 15.8521 15.2969 16.2662 15.2969 17.2455C15.2969 18.2248 15.4698 18.6388 15.6727 18.8416C15.8756 19.0445 16.2897 19.2173 17.2687 19.2173C18.2476 19.2173 18.6617 19.0445 18.8646 18.8416C19.0675 18.6388 19.2405 18.2248 19.2405 17.2455C19.2405 16.2662 19.0675 15.8521 18.8646 15.6493C18.6617 15.4465 18.2476 15.2737 17.2687 15.2737C16.2897 15.2737 15.8756 15.4465 15.6727 15.6493Z"
                  fill="white"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12.7676 6.75594C12.7676 6.34172 13.1034 6.00594 13.5176 6.00594H19.9892C20.4034 6.00594 20.7392 6.34172 20.7392 6.75594C20.7392 7.17015 20.4034 7.50594 19.9892 7.50594H13.5176C13.1034 7.50594 12.7676 7.17015 12.7676 6.75594Z"
                  fill="white"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M4.07713 4.09797C4.72495 3.45031 5.67188 3.28281 6.7344 3.28281C7.79655 3.28281 8.74326 3.45034 9.39096 4.09804C10.0387 4.74574 10.2062 5.69245 10.2062 6.7546C10.2062 7.81709 10.0387 8.76392 9.39089 9.41156C8.74313 10.0592 7.79635 10.2264 6.7344 10.2264C5.67208 10.2264 4.72509 10.0592 4.0772 9.41163C3.42921 8.76398 3.26172 7.81708 3.26172 6.7546C3.26172 5.69245 3.42924 4.74568 4.07713 4.09797ZM5.13765 5.15877C4.93464 5.36172 4.76172 5.77584 4.76172 6.7546C4.76172 7.7339 4.93468 8.1479 5.13758 8.35069C5.34059 8.55359 5.75494 8.72639 6.7344 8.72639C7.71335 8.72639 8.12747 8.55362 8.33037 8.35076C8.53324 8.14795 8.70619 7.73389 8.70619 6.7546C8.70619 5.77585 8.53328 5.36167 8.3303 5.1587C8.12733 4.95572 7.71315 4.78281 6.7344 4.78281C5.75514 4.78281 5.34072 4.95575 5.13765 5.15877Z"
                  fill="white"
                />
              </svg>
              <span>Filtres</span>

              {/* Active Filter Counter Badge */}
              {activeFilterCount > 0 && (
                <span
                  className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-md cursor-pointer hover:bg-red-600 transition-colors duration-200 group"
                  onClick={e => {
                    e.stopPropagation();
                    resetFilters();
                  }}
                  title="Réinitialiser les filtres"
                >
                  <span className="group-hover:hidden">{activeFilterCount}</span>
                  <span className="hidden group-hover:block text-lg">×</span>
                </span>
              )}
            </button>

            {isFilterOpen && (
              <FilterPopup
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                onApply={filters => {
                  setIsFilterOpen(false);
                  onFilterApply?.(filters);
                }}
                currentFilters={currentFilters}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchBar;
