import React, { useState, useEffect } from 'react';
import { FilterState } from '../../types/filters';

interface RangeSliderProps {
  minValue?: number;
  maxValue?: number;
  onChange?: (min: number, max: number) => void;
  step?: number;
  type?: 'price' | 'surface' | 'terrain' | 'pricePerSqm' | 'date';
}

const RangeSlider: React.FC<RangeSliderProps> = ({ minValue = 0, maxValue = 100, onChange, step = 1, type = 'price' }) => {
  const [min, setMin] = useState<number>(minValue);
  const [max, setMax] = useState<number>(maxValue);
  const [dragging, setDragging] = useState<string | null>(null);
  const sliderRef = React.useRef<HTMLDivElement>(null);

  // Update local state when props change
  useEffect(() => {
    setMin(minValue);
    setMax(maxValue);
  }, [minValue, maxValue]);

  const handleMouseDown = (thumb: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setDragging(thumb);

    // Add global mouse event listeners
    const handleGlobalMouseMove = (event: MouseEvent) => {
      handleMouseMove(event, thumb);
    };

    const handleGlobalMouseUp = () => {
      setDragging(null);
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };

    document.addEventListener('mousemove', handleGlobalMouseMove);
    document.addEventListener('mouseup', handleGlobalMouseUp);
  };

  const handleMouseMove = (e: MouseEvent, thumb: string) => {
    if (!sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const percentage = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));

    let currentStep: number;
    let rangeMin: number;
    let rangeMax: number;

    if (isPriceSlider) {
      rangeMin = priceMinValue;
      rangeMax = priceMaxValue;
      currentStep = priceStep;
    } else if (isSurfaceSlider) {
      rangeMin = surfaceMinValue;
      rangeMax = surfaceMaxValue;
      currentStep = surfaceStep;
    } else if (isTerrainSlider) {
      rangeMin = terrainMinValue;
      rangeMax = terrainMaxValue;
      currentStep = terrainStep;
    } else if (isPricePerSqmSlider) {
      rangeMin = pricePerSqmMinValue;
      rangeMax = pricePerSqmMaxValue;
      currentStep = pricePerSqmStep;
    } else if (isDateSlider) {
      rangeMin = dateMinValue;
      rangeMax = dateMaxValue;
      currentStep = dateStep;
    } else {
      rangeMin = 0;
      rangeMax = 100;
      currentStep = step;
    }

    // Convert percentage to actual value using the full range
    const valueRange = rangeMax - rangeMin;
    const newValue = rangeMin + (percentage / 100) * valueRange;

    // Round to nearest step
    const steppedValue = Math.round(newValue / currentStep) * currentStep;

    if (thumb === 'min') {
      // Ensure min doesn't go above max and stays within bounds
      const newMin = Math.max(rangeMin, Math.min(steppedValue, max - currentStep));
      if (newMin !== min) {
        setMin(newMin);
        onChange?.(newMin, max);
      }
    } else if (thumb === 'max') {
      // Ensure max doesn't go below min and stays within bounds
      const newMax = Math.min(rangeMax, Math.max(steppedValue, min + currentStep));
      if (newMax !== max) {
        setMax(newMax);
        onChange?.(min, newMax);
      }
    }
  };

  // Slider-specific logic
  const isPriceSlider = type === 'price';
  const isSurfaceSlider = type === 'surface';
  const isTerrainSlider = type === 'terrain';
  const isPricePerSqmSlider = type === 'pricePerSqm';
  const isDateSlider = type === 'date';

  // Price-specific values
  const priceMinValue = 0;
  const priceMaxValue = 20000000; // 20M €
  const priceStep = 25000; // 25k € steps

  // Surface-specific values
  const surfaceMinValue = 0;
  const surfaceMaxValue = 400; // 400m²
  const surfaceStep = 10; // 10m² steps

  // Terrain-specific values
  const terrainMinValue = 0;
  const terrainMaxValue = 50000; // 50,000m²
  const terrainStep = 50; // 50m² steps (changes to 1000m² after 1000m²)

  // Price per m² specific values
  const pricePerSqmMinValue = 0;
  const pricePerSqmMaxValue = 40000; // 40k €/m²
  const pricePerSqmStep = 100; // 100€/m² steps

  // Date-specific values (months since 2014)
  const dateMinValue = 0; // January 2014
  const dateMaxValue = 140; // September 2025 (11 years * 12 months + 8 months)
  const dateStep = 1; // 1 month steps

  // Calculate positions as percentages
  const getMinPosition = () => {
    if (isPriceSlider) {
      return ((min - priceMinValue) / (priceMaxValue - priceMinValue)) * 100;
    } else if (isSurfaceSlider) {
      return ((min - surfaceMinValue) / (surfaceMaxValue - surfaceMinValue)) * 100;
    } else if (isTerrainSlider) {
      return ((min - terrainMinValue) / (terrainMaxValue - terrainMinValue)) * 100;
    } else if (isPricePerSqmSlider) {
      return ((min - pricePerSqmMinValue) / (pricePerSqmMaxValue - pricePerSqmMinValue)) * 100;
    } else if (isDateSlider) {
      return ((min - dateMinValue) / (dateMaxValue - dateMinValue)) * 100;
    }
    return ((min - minValue) / (maxValue - minValue)) * 100;
  };

  const getMaxPosition = () => {
    if (isPriceSlider) {
      return ((max - priceMinValue) / (priceMaxValue - priceMinValue)) * 100;
    } else if (isSurfaceSlider) {
      return ((max - surfaceMinValue) / (surfaceMaxValue - surfaceMinValue)) * 100;
    } else if (isTerrainSlider) {
      return ((max - terrainMinValue) / (terrainMaxValue - terrainMinValue)) * 100;
    } else if (isPricePerSqmSlider) {
      return ((max - pricePerSqmMinValue) / (pricePerSqmMaxValue - pricePerSqmMinValue)) * 100;
    } else if (isDateSlider) {
      return ((max - dateMinValue) / (dateMaxValue - dateMinValue)) * 100;
    }
    return ((max - minValue) / (maxValue - minValue)) * 100;
  };

  const minPosition = getMinPosition();
  const maxPosition = getMaxPosition();
  const connectWidth = maxPosition - minPosition;

  // Generate text based on slider type and values
  const getSliderText = () => {
    if (isPriceSlider) {
      const minPrice = Math.round(min);
      const maxPrice = Math.round(max);

      // Full range selected
      if (minPrice === priceMinValue && maxPrice === priceMaxValue) {
        return 'Toutes les valeurs';
      }

      // Only min selected (from min to max)
      if (minPrice > priceMinValue && maxPrice === priceMaxValue) {
        return `À partir de ${formatPrice(minPrice)}`;
      }

      // Only max selected (from min to max)
      if (minPrice === priceMinValue && maxPrice < priceMaxValue) {
        return `Jusqu'à ${formatPrice(maxPrice)}`;
      }

      // Range selected
      return `De ${formatPrice(minPrice)} à ${formatPrice(maxPrice)}`;
    } else if (isSurfaceSlider) {
      const minSurface = Math.round(min);
      const maxSurface = Math.round(max);

      // Full range selected
      if (minSurface === surfaceMinValue && maxSurface === surfaceMaxValue) {
        return 'Toutes les valeurs';
      }

      // Only min selected (from min to max)
      if (minSurface > surfaceMinValue && maxSurface === surfaceMaxValue) {
        return `À partir de ${minSurface}m²`;
      }

      // Only max selected (from min to max)
      if (minSurface === surfaceMinValue && maxSurface < surfaceMaxValue) {
        return `Jusqu'à ${maxSurface}m²`;
      }

      // Range selected
      return `De ${minSurface}m² à ${maxSurface}m²`;
    } else if (isTerrainSlider) {
      const minTerrain = Math.round(min);
      const maxTerrain = Math.round(max);

      // Full range selected
      if (minTerrain === terrainMinValue && maxTerrain === terrainMaxValue) {
        return 'Tous terrains';
      }

      // Only min selected (from min to max)
      if (minTerrain > terrainMinValue && maxTerrain === terrainMaxValue) {
        return `À partir de ${minTerrain.toLocaleString('fr-FR')}m²`;
      }

      // Only max selected (from min to max)
      if (minTerrain === terrainMinValue && maxTerrain < terrainMaxValue) {
        return `Jusqu'à ${maxTerrain.toLocaleString('fr-FR')}m²`;
      }

      // Range selected
      return `De ${minTerrain.toLocaleString('fr-FR')}m² à ${maxTerrain.toLocaleString('fr-FR')}m²`;
    } else if (isPricePerSqmSlider) {
      const minPricePerSqm = Math.round(min);
      const maxPricePerSqm = Math.round(max);

      // Full range selected
      if (minPricePerSqm === pricePerSqmMinValue && maxPricePerSqm === pricePerSqmMaxValue) {
        return 'Toutes les valeurs';
      }

      // Only min selected (from min to max)
      if (minPricePerSqm > pricePerSqmMinValue && maxPricePerSqm === pricePerSqmMaxValue) {
        return `À partir de ${formatPricePerSqm(minPricePerSqm)}`;
      }

      // Only max selected (from min to max)
      if (minPricePerSqm === pricePerSqmMinValue && maxPricePerSqm < pricePerSqmMaxValue) {
        return `Jusqu'à ${formatPricePerSqm(maxPricePerSqm)}`;
      }

      // Range selected
      return `De ${formatPricePerSqm(minPricePerSqm)} à ${formatPricePerSqm(maxPricePerSqm)}`;
    } else if (isDateSlider) {
      const minDate = Math.round(min);
      const maxDate = Math.round(max);

      // Full range selected
      if (minDate === dateMinValue && maxDate === dateMaxValue) {
        return 'Toutes les valeurs';
      }

      // Only min selected (from min to max)
      if (minDate > dateMinValue && maxDate === dateMaxValue) {
        return `À partir de ${formatDate(minDate)}`;
      }

      // Only max selected (from min to max)
      if (minDate === dateMinValue && maxDate < dateMaxValue) {
        return `Jusqu'à ${formatDate(maxDate)}`;
      }

      // Range selected
      return `De ${formatDate(minDate)} à ${formatDate(maxDate)}`;
    }
    return null;
  };

  const formatPrice = (price: number) => {
    return `${price.toLocaleString('fr-FR')} €`;
  };

  const formatPricePerSqm = (price: number) => {
    return `${price.toLocaleString('fr-FR')}€/m²`;
  };

  const formatDate = (months: number) => {
    const startDate = new Date(2014, 0, 1); // January 2014
    const targetDate = new Date(startDate.getTime() + months * 30 * 24 * 60 * 60 * 1000);

    const monthsNames = [
      'janvier',
      'février',
      'mars',
      'avril',
      'mai',
      'juin',
      'juillet',
      'août',
      'septembre',
      'octobre',
      'novembre',
      'décembre',
    ];

    const monthName = monthsNames[targetDate.getMonth()];
    const year = targetDate.getFullYear();

    return `${monthName} ${year}`;
  };

  return (
    <div ref={sliderRef} className="range-slider-container relative w-full h-6 flex items-center mb-4">
      {/* Track */}
      <div className="absolute w-full h-1.5 bg-gray-300 rounded-full" style={{ top: '50%', transform: 'translateY(-50%)' }} />

      {/* Connect (filled area between handles) */}
      <div
        className="absolute h-1.5 bg-green-500 rounded-full"
        style={{
          left: `${minPosition}%`,
          width: `${connectWidth}%`,
          top: '50%',
          transform: 'translateY(-50%)',
        }}
      />

      {/* Min handle */}
      <div
        className="absolute w-4 h-4 bg-white border-2 border-green-500 rounded-full cursor-pointer hover:shadow-lg transition-shadow z-10"
        style={{
          left: `${minPosition}%`,
          top: '50%',
          transform: 'translate(-50%, -50%)',
        }}
        onMouseDown={handleMouseDown('min')}
      />

      {/* Max handle */}
      <div
        className="absolute w-4 h-4 bg-white border-2 border-green-500 rounded-full cursor-pointer hover:shadow-lg transition-shadow z-10"
        style={{
          left: `${maxPosition}%`,
          top: '50%',
          transform: 'translate(-50%, -50%)',
        }}
        onMouseDown={handleMouseDown('max')}
      />
    </div>
  );
};

interface FilterPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: FilterState) => void;
  currentFilters?: FilterState;
}

const FilterPopup: React.FC<FilterPopupProps> = ({ isOpen, onClose, onApply, currentFilters }) => {
  // Default filter state
  const defaultFilters: FilterState = {
    propertyTypes: {
      maison: true,
      terrain: true,
      appartement: true,
      biensMultiples: true,
      localCommercial: true,
    },
    roomCounts: {
      studio: true,
      deuxPieces: true,
      troisPieces: true,
      quatrePieces: true,
      cinqPiecesPlus: true,
    },
    priceRange: [0, 20000000], // 0 to 20M €
    surfaceRange: [0, 400], // 0 to 400m²
    terrainRange: [0, 50000], // 0 to 50,000m²
    pricePerSqmRange: [0, 40000], // 0 to 40k €/m²
    dateRange: [0, 140], // January 2014 to September 2025 (months)
  };

  const [filters, setFilters] = useState<FilterState>(currentFilters || defaultFilters);

  // Update local state when currentFilters prop changes
  useEffect(() => {
    if (currentFilters) {
      setFilters(currentFilters);
    }
  }, [currentFilters]);

  const handlePropertyTypeChange = (type: keyof FilterState['propertyTypes']) => {
    setFilters(prev => ({
      ...prev,
      propertyTypes: {
        ...prev.propertyTypes,
        [type]: !prev.propertyTypes[type],
      },
    }));
  };

  const handleRoomCountChange = (room: keyof FilterState['roomCounts']) => {
    setFilters(prev => ({
      ...prev,
      roomCounts: {
        ...prev.roomCounts,
        [room]: !prev.roomCounts[room],
      },
    }));
  };

  const handleRangeChange = (
    rangeType: keyof Pick<FilterState, 'priceRange' | 'surfaceRange' | 'terrainRange' | 'pricePerSqmRange' | 'dateRange'>,
    min: number,
    max: number,
  ) => {
    setFilters(prev => ({
      ...prev,
      [rangeType]: [min, max],
    }));
  };

  // Formatting helpers
  const formatPrice = (price: number) => {
    return `${price.toLocaleString('fr-FR')} €`;
  };

  const formatPricePerSqm = (price: number) => {
    return `${price.toLocaleString('fr-FR')}€/m²`;
  };

  const formatDate = (months: number) => {
    const startDate = new Date(2014, 0, 1); // January 2014
    const targetDate = new Date(startDate.getTime() + months * 30 * 24 * 60 * 60 * 1000);

    const monthsNames = [
      'janvier',
      'février',
      'mars',
      'avril',
      'mai',
      'juin',
      'juillet',
      'août',
      'septembre',
      'octobre',
      'novembre',
      'décembre',
    ];

    const monthName = monthsNames[targetDate.getMonth()];
    const year = targetDate.getFullYear();

    return `${monthName} ${year}`;
  };

  // Generate text for each slider type
  const getPriceText = () => {
    const minPrice = Math.round(filters.priceRange[0]);
    const maxPrice = Math.round(filters.priceRange[1]);
    const priceMinValue = 0;
    const priceMaxValue = 20000000;

    if (minPrice === priceMinValue && maxPrice === priceMaxValue) {
      return 'Toutes les valeurs';
    } else if (minPrice > priceMinValue && maxPrice === priceMaxValue) {
      return `À partir de ${formatPrice(minPrice)}`;
    } else if (minPrice === priceMinValue && maxPrice < priceMaxValue) {
      return `Jusqu'à ${formatPrice(maxPrice)}`;
    } else {
      return `De ${formatPrice(minPrice)} à ${formatPrice(maxPrice)}`;
    }
  };

  const getSurfaceText = () => {
    const minSurface = Math.round(filters.surfaceRange[0]);
    const maxSurface = Math.round(filters.surfaceRange[1]);
    const surfaceMinValue = 0;
    const surfaceMaxValue = 400;

    if (minSurface === surfaceMinValue && maxSurface === surfaceMaxValue) {
      return 'Toutes les valeurs';
    } else if (minSurface > surfaceMinValue && maxSurface === surfaceMaxValue) {
      return `À partir de ${minSurface}m²`;
    } else if (minSurface === surfaceMinValue && maxSurface < surfaceMaxValue) {
      return `Jusqu'à ${maxSurface}m²`;
    } else {
      return `De ${minSurface}m² à ${maxSurface}m²`;
    }
  };

  const getTerrainText = () => {
    const minTerrain = Math.round(filters.terrainRange[0]);
    const maxTerrain = Math.round(filters.terrainRange[1]);
    const terrainMinValue = 0;
    const terrainMaxValue = 50000;

    if (minTerrain === terrainMinValue && maxTerrain === terrainMaxValue) {
      return 'Tous terrains';
    } else if (minTerrain > terrainMinValue && maxTerrain === terrainMaxValue) {
      return `À partir de ${minTerrain.toLocaleString('fr-FR')}m²`;
    } else if (minTerrain === terrainMinValue && maxTerrain < terrainMaxValue) {
      return `Jusqu'à ${maxTerrain.toLocaleString('fr-FR')}m²`;
    } else {
      return `De ${minTerrain.toLocaleString('fr-FR')}m² à ${maxTerrain.toLocaleString('fr-FR')}m²`;
    }
  };

  const getPricePerSqmText = () => {
    const minPricePerSqm = Math.round(filters.pricePerSqmRange[0]);
    const maxPricePerSqm = Math.round(filters.pricePerSqmRange[1]);
    const pricePerSqmMinValue = 0;
    const pricePerSqmMaxValue = 40000;

    if (minPricePerSqm === pricePerSqmMinValue && maxPricePerSqm === pricePerSqmMaxValue) {
      return 'Toutes les valeurs';
    } else if (minPricePerSqm > pricePerSqmMinValue && maxPricePerSqm === pricePerSqmMaxValue) {
      return `À partir de ${formatPricePerSqm(minPricePerSqm)}`;
    } else if (minPricePerSqm === pricePerSqmMinValue && maxPricePerSqm < pricePerSqmMaxValue) {
      return `Jusqu'à ${formatPricePerSqm(maxPricePerSqm)}`;
    } else {
      return `De ${formatPricePerSqm(minPricePerSqm)} à ${formatPricePerSqm(maxPricePerSqm)}`;
    }
  };

  const getDateText = () => {
    const minDate = Math.round(filters.dateRange[0]);
    const maxDate = Math.round(filters.dateRange[1]);
    const dateMinValue = 0;
    const dateMaxValue = 140;

    if (minDate === dateMinValue && maxDate === dateMaxValue) {
      return 'Toutes les valeurs';
    } else if (minDate > dateMinValue && maxDate === dateMaxValue) {
      return `À partir de ${formatDate(minDate)}`;
    } else if (minDate === dateMinValue && maxDate < dateMaxValue) {
      return `Jusqu'à ${formatDate(maxDate)}`;
    } else {
      return `De ${formatDate(minDate)} à ${formatDate(maxDate)}`;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white md:bg-black md:bg-opacity-50 flex items-start md:items-center justify-center z-50">
      <div className="bg-white w-full max-w-5xl relative h-screen md:h-auto md:max-h-[95vh] md:rounded-2xl flex flex-col px-4 py-2">
        <div className="flex-1 overflow-y-auto">
          {/* Header */}
          <div className="flex justify-between items-center p-2 border-b border-gray-200">
            <h2 className="text-lg font-bold">Filtres</h2>
            <button onClick={onClose} className="text-black hover:text-gray-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-2">
            <div className="flex flex-col md:flex-row">
              {/* Left Column */}
              <div className="md:w-1/2 md:border-r md:pr-4 pb-3">
                {/* Type de bien */}
                <div className="mb-4">
                  <h3 className="text-base font-bold mb-2">Type de bien</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="maison"
                        className="w-4 h-4 rounded"
                        style={{ accentColor: '#7069F9' }}
                        checked={filters.propertyTypes.maison}
                        onChange={() => handlePropertyTypeChange('maison')}
                      />
                      <label htmlFor="maison" className="ml-1 text-sm">
                        Maison
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="terrain"
                        className="w-4 h-4 rounded"
                        style={{ accentColor: '#7069F9' }}
                        checked={filters.propertyTypes.terrain}
                        onChange={() => handlePropertyTypeChange('terrain')}
                      />
                      <label htmlFor="terrain" className="ml-1 text-sm">
                        Terrain
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="appartement"
                        className="w-4 h-4 rounded"
                        style={{ accentColor: '#7069F9' }}
                        checked={filters.propertyTypes.appartement}
                        onChange={() => handlePropertyTypeChange('appartement')}
                      />
                      <label htmlFor="appartement" className="ml-1 text-sm">
                        Appartement
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="biens-multiples"
                        className="w-4 h-4 rounded"
                        style={{ accentColor: '#7069F9' }}
                        checked={filters.propertyTypes.biensMultiples}
                        onChange={() => handlePropertyTypeChange('biensMultiples')}
                      />
                      <label htmlFor="biens-multiples" className="ml-1 text-sm">
                        Biens multiples
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="local-commercial"
                        className="w-4 h-4 rounded"
                        style={{ accentColor: '#7069F9' }}
                        checked={filters.propertyTypes.localCommercial}
                        onChange={() => handlePropertyTypeChange('localCommercial')}
                      />
                      <label htmlFor="local-commercial" className="ml-1 text-sm">
                        Local commercial
                      </label>
                    </div>
                  </div>
                </div>

                {/* Nombre de pièces */}
                <div>
                  <h3 className="text-base font-bold mb-4">Nombre de pièces</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="studio"
                        className="w-4 h-4 rounded"
                        style={{ accentColor: '#7069F9' }}
                        checked={filters.roomCounts.studio}
                        onChange={() => handleRoomCountChange('studio')}
                      />
                      <label htmlFor="studio" className="ml-1 text-sm">
                        Studio
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="2pieces"
                        className="w-4 h-4 rounded"
                        style={{ accentColor: '#7069F9' }}
                        checked={filters.roomCounts.deuxPieces}
                        onChange={() => handleRoomCountChange('deuxPieces')}
                      />
                      <label htmlFor="2pieces" className="ml-1 text-sm">
                        2 pièces
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="3pieces"
                        className="w-4 h-4 rounded"
                        style={{ accentColor: '#7069F9' }}
                        checked={filters.roomCounts.troisPieces}
                        onChange={() => handleRoomCountChange('troisPieces')}
                      />
                      <label htmlFor="3pieces" className="ml-1 text-sm">
                        3 pièces
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="4pieces"
                        className="w-4 h-4 rounded"
                        style={{ accentColor: '#7069F9' }}
                        checked={filters.roomCounts.quatrePieces}
                        onChange={() => handleRoomCountChange('quatrePieces')}
                      />
                      <label htmlFor="4pieces" className="ml-1 text-sm">
                        4 pièces
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="5pieces"
                        className="w-4 h-4 rounded"
                        style={{ accentColor: '#7069F9' }}
                        checked={filters.roomCounts.cinqPiecesPlus}
                        onChange={() => handleRoomCountChange('cinqPiecesPlus')}
                      />
                      <label htmlFor="5pieces" className="ml-1 text-sm">
                        5 pièces et +
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="md:w-1/2 md:pl-8 p-10">
                {/* Prix */}
                <div className="mb-3 space-y-1">
                  <h3 className="text-base font-bold">Prix</h3>
                  <p className="text-lg">{getPriceText()}</p>
                  <RangeSlider
                    type="price"
                    minValue={filters.priceRange[0]}
                    maxValue={filters.priceRange[1]}
                    step={25000}
                    onChange={(min, max) => handleRangeChange('priceRange', min, max)}
                  />
                </div>

                {/* Surface */}
                <div className="mb-3 space-y-1">
                  <h3 className="text-base font-bold">Surface</h3>
                  <p className="text-lg">{getSurfaceText()}</p>
                  <RangeSlider
                    type="surface"
                    minValue={filters.surfaceRange[0]}
                    maxValue={filters.surfaceRange[1]}
                    step={10}
                    onChange={(min, max) => handleRangeChange('surfaceRange', min, max)}
                  />
                </div>

                {/* Terrain */}
                <div className="mb-3 space-y-1">
                  <h3 className="text-base font-bold">Terrain</h3>
                  <p className="text-lg">{getTerrainText()}</p>
                  <RangeSlider
                    type="terrain"
                    minValue={filters.terrainRange[0]}
                    maxValue={filters.terrainRange[1]}
                    step={50}
                    onChange={(min, max) => handleRangeChange('terrainRange', min, max)}
                  />
                </div>

                {/* Prix m² */}
                <div className="mb-3 space-y-1">
                  <h3 className="text-base font-bold">Prix m²</h3>
                  <p className="text-lg">{getPricePerSqmText()}</p>
                  <RangeSlider
                    type="pricePerSqm"
                    minValue={filters.pricePerSqmRange[0]}
                    maxValue={filters.pricePerSqmRange[1]}
                    step={100}
                    onChange={(min, max) => handleRangeChange('pricePerSqmRange', min, max)}
                  />
                </div>

                {/* Date de vente */}
                <div className="mb-3 space-y-1">
                  <h3 className="text-base font-bold">Date de vente</h3>
                  <p className="text-lg">{getDateText()}</p>
                  <RangeSlider
                    type="date"
                    minValue={filters.dateRange[0]}
                    maxValue={filters.dateRange[1]}
                    step={1}
                    onChange={(min, max) => handleRangeChange('dateRange', min, max)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer with buttons - Fixed at bottom */}
        <div className="flex justify-end gap-2 p-2 border-t border-gray-200 flex-shrink-0">
          <button onClick={onClose} className="px-3 py-1 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 text-sm">
            Annuler
          </button>
          <button
            onClick={() => onApply(filters)}
            className="px-3 py-1 text-white rounded hover:bg-opacity-90 text-sm transition-colors duration-200"
            style={{ backgroundColor: '#7069F9' }}
          >
            Appliquer
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterPopup;
