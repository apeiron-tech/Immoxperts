import React, { useState, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import FilterPopup from '../features/property/FilterPopup';

mapboxgl.accessToken = 'pk.eyJ1Ijoic2FiZXI1MTgwIiwiYSI6ImNtOGhqcWs4cTAybnEycXNiaHl6eWgwcjAifQ.8C8bv3cwz9skLXv-y6U3FA';

interface SearchBarProps {
  onSearch: (searchParams: { numero: number; nomVoie: string; coordinates: [number, number]; context?: Array<{ text: string }> }) => void;
}

interface MapboxFeature {
  properties: {
    address?: string;
  };
  text: string;
  center: [number, number];
  context?: Array<{ text: string }>;
  place_name: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [suggestions, setSuggestions] = useState<MapboxFeature[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(async () => {
      if (searchQuery.length > 2) {
        try {
          const response = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
              searchQuery,
            )}.json?access_token=${mapboxgl.accessToken}&country=FR&types=address&limit=5`,
          );
          const data = await response.json();
          setSuggestions(data.features);
          setShowSuggestions(true);
        } catch (error) {
          console.error('Error fetching suggestions:', error);
        }
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  const handleAddressSelect = (feature: MapboxFeature): void => {
    const numero = normalizeSearchParams(feature.properties.address || '');
    const nomVoie = normalizeSearchParams(feature.text || '');
    const coordinates = feature.center;

    onSearch({
      numero: parseInt(numero, 10),
      nomVoie,
      coordinates,
      context: feature.context,
    });
  };

  const normalizeSearchParams = (str: string): string => {
    return typeof str === 'string'
      ? str
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[œæ]/gi, 'oe')
          .replace(/[ç]/gi, 'c')
          .toUpperCase()
          .replace(/[^A-Z0-9]/g, ' ')
          .replace(/\s+/g, ' ')
          .trim()
      : '';
  };

  return (
    <div className="w-full px-4 py-3">
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
            type="text"
            placeholder="Entrez une adresse en France"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />

          {/* Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
              {suggestions.map((feature, index) => (
                <button
                  key={index}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100"
                  onMouseDown={() => handleAddressSelect(feature)}
                >
                  <div className="text-sm font-medium">{feature.place_name}</div>
                  <div className="text-xs text-gray-500">{feature.context?.map(ctx => ctx.text).join(', ')}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Filter Button */}
        <button
          className="w-full sm:w-auto flex items-center justify-center gap-2 border px-6 py-3 rounded-lg hover:bg-opacity-10 transition-colors"
          style={{ borderColor: '#7069F9', color: '#7069F9', backgroundColor: 'transparent' }}
          onClick={() => setIsFilterOpen(true)}
        >
          {/* Filter icon */}

          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M3.26172 17.2446C3.26172 16.8304 3.59751 16.4946 4.01172 16.4946H10.4842C10.8985 16.4946 11.2342 16.8304 11.2342 17.2446C11.2342 17.6588 10.8985 17.9946 10.4842 17.9946H4.01172C3.59751 17.9946 3.26172 17.6588 3.26172 17.2446Z"
                fill="#7069F9"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M14.6122 14.5885C15.2599 13.9409 16.2067 13.7737 17.2687 13.7737C18.3306 13.7737 19.2774 13.9409 19.9252 14.5885C20.573 15.2361 20.7405 16.183 20.7405 17.2455C20.7405 18.308 20.573 19.2548 19.9252 19.9024C19.2774 20.55 18.3306 20.7173 17.2687 20.7173C16.2067 20.7173 15.2599 20.55 14.6122 19.9024C13.9644 19.2548 13.7969 18.308 13.7969 17.2455C13.7969 16.183 13.9644 15.2361 14.6122 14.5885ZM15.6727 15.6493C15.4698 15.8521 15.2969 16.2662 15.2969 17.2455C15.2969 18.2248 15.4698 18.6388 15.6727 18.8416C15.8756 19.0445 16.2897 19.2173 17.2687 19.2173C18.2476 19.2173 18.6617 19.0445 18.8646 18.8416C19.0675 18.6388 19.2405 18.2248 19.2405 17.2455C19.2405 16.2662 19.0675 15.8521 18.8646 15.6493C18.6617 15.4465 18.2476 15.2737 17.2687 15.2737C16.2897 15.2737 15.8756 15.4465 15.6727 15.6493Z"
                fill="#7069F9"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12.7676 6.75594C12.7676 6.34172 13.1034 6.00594 13.5176 6.00594H19.9892C20.4034 6.00594 20.7392 6.34172 20.7392 6.75594C20.7392 7.17015 20.4034 7.50594 19.9892 7.50594H13.5176C13.1034 7.50594 12.7676 7.17015 12.7676 6.75594Z"
                fill="#7069F9"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M4.07713 4.09797C4.72495 3.45031 5.67188 3.28281 6.7344 3.28281C7.79655 3.28281 8.74326 3.45034 9.39096 4.09804C10.0387 4.74574 10.2062 5.69245 10.2062 6.7546C10.2062 7.81709 10.0387 8.76392 9.39089 9.41156C8.74313 10.0592 7.79635 10.2264 6.7344 10.2264C5.67208 10.2264 4.72509 10.0592 4.0772 9.41163C3.42921 8.76398 3.26172 7.81708 3.26172 6.7546C3.26172 5.69245 3.42924 4.74568 4.07713 4.09797ZM5.13765 5.15877C4.93464 5.36172 4.76172 5.77584 4.76172 6.7546C4.76172 7.7339 4.93468 8.1479 5.13758 8.35069C5.34059 8.55359 5.75494 8.72639 6.7344 8.72639C7.71335 8.72639 8.12747 8.55362 8.33037 8.35076C8.53324 8.14795 8.70619 7.73389 8.70619 6.7546C8.70619 5.77585 8.53328 5.36167 8.3303 5.1587C8.12733 4.95572 7.71315 4.78281 6.7344 4.78281C5.75514 4.78281 5.34072 4.95575 5.13765 5.15877Z"
                fill="#7069F9"
              />
            </svg>
          </svg>
          <span>Filtres</span>
        </button>

        {isFilterOpen && (
          <FilterPopup
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
            onApply={() => {
              setIsFilterOpen(false);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default SearchBar;
