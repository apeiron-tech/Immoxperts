import React, { useCallback } from 'react';
import GeatMap from 'app/features/map/GeatMap';

/**
 * Administrative drill-down map: France → Regions → Departments → Communes.
 * Uses Mapbox vector tilesets. On commune click, code_insee is available for API (e.g. pricing/stats).
 */
const GeatMapPage: React.FC = () => {
  const handleCommuneSelect = useCallback((codeInsee: string, nom: string) => {
    // Ready to plug pricing/statistical API using codeInsee
    void codeInsee;
    void nom;
  }, []);

  return (
    <div className="flex flex-col h-[calc(100vh-80px)]">
      <div className="flex-none px-4 py-2 bg-white border-b border-gray-200">
        <h1 className="text-lg font-semibold text-gray-800">Carte administrative</h1>
        <p className="text-sm text-gray-600">
          Cliquez sur une région, puis un département, puis une commune. Code INSEE disponible pour les communes.
        </p>
      </div>
      <div className="flex-1 min-h-0">
        <GeatMap onCommuneSelect={handleCommuneSelect} className="h-full w-full" />
      </div>
    </div>
  );
};

export default GeatMapPage;
