import React, { useState } from 'react';
import SearchBar from 'app/layouts/SearchBar';
import PropertyList from 'app/pages/PropertyList';
import type { FilterState } from 'app/types/filters';

const PrixImmobiliersPage: React.FC = () => {
  const [searchParams, setSearchParams] = useState({
    coordinates: null,
    address: null,
    isCity: false,
  });
  const [filterState, setFilterState] = useState<FilterState | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleFiltersChange = (filters: FilterState | null) => setFilterState(filters);

  const handleSearchParamsChange = (params: any) => {
    const mapped = {
      coordinates: params.coordinates,
      address: params.fullAddress || (params.nomVoie ? `${params.numero || ''} ${params.nomVoie}`.trim() : null),
      isCity: params.isCity || false,
      hasMutations: params.hasMutations,
      isStreet: params.isStreet || false,
    };
    setSearchParams(mapped);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <SearchBar
        onSearch={handleSearchParamsChange}
        onFilterApply={setFilterState}
        currentFilters={filterState}
        onFilterOpenChange={setIsFilterOpen}
        onCloseOtherPopups={() => {}}
      />
      <div className="flex h-full overflow-hidden">
        <div className="block md:hidden w-full h-full">
          <PropertyList
            searchParams={searchParams}
            filterState={filterState}
            onFiltersChange={handleFiltersChange}
            isFilterOpen={isFilterOpen}
          />
        </div>
        <div className="hidden md:flex w-full h-full shadow-lg border border-neutral-200 rounded-lg overflow-hidden bg-white">
          <PropertyList
            searchParams={searchParams}
            filterState={filterState}
            onFiltersChange={handleFiltersChange}
            isFilterOpen={isFilterOpen}
          />
        </div>
      </div>
    </div>
  );
};

export default PrixImmobiliersPage;
