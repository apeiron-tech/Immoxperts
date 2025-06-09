import React, { useState } from 'react';

type PriceEstimateProps = Record<string, never>;

const PriceEstimate: React.FC<PriceEstimateProps> = () => {
  const [duration, setDuration] = useState<number>(25);

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex flex-col items-center">
      <div className="w-full max-w-4xl rounded-2xl p-6">
        {/* Estimation Section */}
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h2 className="text-xl font-semibold">Votre estimation</h2>
          <p className="text-gray-600">151 Grande-rue Saint Michel, 31400 Toulouse</p>
          <div className="mt-4 flex justify-center">
            <div className="w-full max-w-xs bg-orange-400 text-white text-xl font-bold py-4 rounded-lg text-center">
              254 000 € ~ 287 000 €
            </div>
          </div>
        </div>

        {/* Financing Simulation Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mt-6">
          <h3 className="text-lg font-semibold text-center mb-10">Bénéficiez d'une simulation de financement sur-mesure, gratuitement</h3>
          <div className="flex flex-col gap-6 mb-4 md:flex-row md:justify-between">
            <div className="w-full md:w-2/3 space-y-4 p-6 shadow-lg rounded-lg">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium">Prix du bien</label>
                  <input type="text" value="271000€" readOnly className="w-full p-2 border rounded-lg bg-gray-100" />
                </div>
                <div>
                  <label className="block font-medium">Votre apport</label>
                  <input type="text" value="54000€" readOnly className="w-full p-2 border rounded-lg bg-gray-100" />
                </div>
              </div>

              <div>
                <label className="block font-medium">Frais de notaire (8% dans l'ancien)</label>
                <input type="text" value="21680€" readOnly className="w-full p-2 border rounded-lg bg-gray-100" />
              </div>

              {/* Credit Duration Selection */}
              <div className="mt-4">
                <label className="block font-medium">Durée du crédit</label>
                <div className="flex flex-wrap gap-4 mt-2">
                  {[10, 15, 20, 25].map((year: number) => (
                    <button
                      key={year}
                      className={`px-5 py-4 rounded-lg text-sm sm:text-base ${duration === year ? 'bg-blue-100 text-blue-700' : 'bg-gray-100'}`}
                      onClick={() => setDuration(year)}
                    >
                      {year} ans
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="w-full md:w-1/3 shadow-lg p-6 rounded-lg flex flex-col h-min">
              <p className="text-sm font-medium">Mensualités estimées</p>
              <p className="text-3xl font-bold text-indigo-600">1 188€</p>
              <p className="text-xs text-gray-500">taux du crédit 3.45%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceEstimate;
