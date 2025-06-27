import React, { useState } from 'react';

interface RangeSliderProps {
  minValue?: number;
  maxValue?: number;
  onChange?: (min: number, max: number) => void;
}

const RangeSlider: React.FC<RangeSliderProps> = ({ minValue = 10, maxValue = 80, onChange }) => {
  const [min, setMin] = useState<number>(minValue);
  const [max, setMax] = useState<number>(maxValue);
  const [dragging, setDragging] = useState<string | null>(null);

  const handleMouseDown = (thumb: string): void => {
    setDragging(thumb);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (!dragging) return;

    const bar = e.currentTarget.closest('.relative');
    if (!bar) return;

    const rect = bar.getBoundingClientRect();
    let newPosition = ((e.clientX - rect.left) / rect.width) * 100;
    newPosition = Math.max(0, Math.min(100, newPosition));

    if (dragging === 'min' && newPosition < max) {
      setMin(newPosition);
      onChange?.(newPosition, max);
    } else if (dragging === 'max' && newPosition > min) {
      setMax(newPosition);
      onChange?.(min, newPosition);
    }
  };

  const handleMouseUp = (): void => {
    setDragging(null);
  };

  return (
    <div className="relative mb-4" onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
      <div className="h-2 bg-gray-200 rounded-full">
        <div className="absolute h-2 rounded-full" style={{ width: `${max - min}%`, left: `${min}%`, backgroundColor: '#43ce9b' }}></div>
        <div
          className="absolute w-4 h-4 bg-white border-2 border-indigo-500 rounded-full -mt-1 cursor-pointer"
          style={{ left: `${min}%` }}
          onMouseDown={() => handleMouseDown('min')}
        ></div>
        <div
          className="absolute w-4 h-4 bg-white border-2 border-indigo-500 rounded-full -mt-1 cursor-pointer"
          style={{ left: `${max}%` }}
          onMouseDown={() => handleMouseDown('max')}
        ></div>
      </div>
    </div>
  );
};

interface FilterPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: () => void;
}

const FilterPopup: React.FC<FilterPopupProps> = ({ isOpen, onClose, onApply }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white md:bg-black md:bg-opacity-50 flex items-start md:items-center justify-center z-50">
      <div className="bg-white w-full max-w-6xl relative h-screen md:h-auto md:max-h-[90vh] md:rounded-3xl overflow-y-auto px-10 py-4">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold">Filtres</h2>
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
        <div className="p-4">
          <div className="flex flex-col md:flex-row">
            {/* Left Column */}
            <div className="md:w-1/2 md:border-r md:pr-8 pb-6">
              {/* Type de bien */}
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-4">Type de bien</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <input type="checkbox" id="maison" className="w-5 h-5 rounded accent-indigo-900" defaultChecked />
                    <label htmlFor="maison" className="ml-2 text-lg">
                      Maison
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="terrain" className="w-5 h-5 rounded accent-indigo-900" />
                    <label htmlFor="terrain" className="ml-2 text-lg">
                      Terrain
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="appartement" className="w-5 h-5 rounded accent-indigo-900" />
                    <label htmlFor="appartement" className="ml-2 text-lg">
                      Appartement
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="biens-multiples" className="w-5 h-5 rounded accent-indigo-900" />
                    <label htmlFor="biens-multiples" className="ml-2 text-lg">
                      Biens multiples
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="local-commercial" className="w-5 h-5 rounded accent-indigo-900" />
                    <label htmlFor="local-commercial" className="ml-2 text-lg">
                      Local commercial
                    </label>
                  </div>
                </div>
              </div>

              {/* Nombre de pièces */}
              <div>
                <h3 className="text-xl font-bold mb-4">Nombre de pièces</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <input type="checkbox" id="studio" className="w-5 h-5 rounded accent-indigo-900" defaultChecked />
                    <label htmlFor="studio" className="ml-2 text-lg">
                      Studio
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="2pieces" className="w-5 h-5 rounded accent-indigo-900" />
                    <label htmlFor="2pieces" className="ml-2 text-lg">
                      2 pièces
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="3pieces" className="w-5 h-5 rounded accent-indigo-900" />
                    <label htmlFor="3pieces" className="ml-2 text-lg">
                      3 pièces
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="4pieces" className="w-5 h-5 rounded accent-indigo-700" />
                    <label htmlFor="4pieces" className="ml-2 text-lg">
                      4 pièces
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="5pieces" className="w-5 h-5 rounded accent-indigo-700" />
                    <label htmlFor="5pieces" className="ml-2 text-lg">
                      5 pièces et +
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="md:w-1/2 md:pl-8 p-10">
              {/* Prix */}
              <div className="mb-4 space-y-2">
                <h3 className="text-xl font-bold">Prix</h3>
                <p className="text-lg">
                  À partir de <span className="font-bold">100 000 €</span>
                </p>
                <RangeSlider />
              </div>

              {/* Surface */}
              <div className="mb-4 space-y-2">
                <h3 className="text-xl font-bold">Surface</h3>
                <p className="text-lg text-gray-600">Toutes les valeurs</p>
                <RangeSlider />
              </div>

              {/* Prix m² */}
              <div className="mb-4 space-y-2">
                <h3 className="text-xl font-bold">Prix m²</h3>
                <p className="text-lg">
                  À partir de <span className="font-bold"></span>
                </p>
                <RangeSlider />
              </div>

              {/* Date de vente */}
              <div className="mb-4 space-y-2">
                <h3 className="text-xl font-bold">Date de vente</h3>
                <p className="text-lg">
                  À partir de <span className="font-bold"></span>
                </p>
                <RangeSlider />
              </div>
            </div>
          </div>
        </div>

        {/* Footer with buttons */}
        <div className="flex justify-end gap-4 p-4 border-t border-gray-200">
          <button onClick={onClose} className="px-8 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-lg">
            Annuler
          </button>
          <button onClick={onApply} className="px-8 py-3 bg-indigo-900 text-white rounded-lg hover:bg-indigo-900 text-lg">
            Appliquer
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterPopup;
