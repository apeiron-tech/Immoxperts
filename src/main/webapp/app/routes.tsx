import React, { useState } from 'react';
import { Route } from 'react-router';

import Loadable from 'react-loadable';

import Login from 'app/modules/login/login';
import Register from 'app/modules/account/register/register';
import Activate from 'app/modules/account/activate/activate';
import PasswordResetInit from 'app/modules/account/password-reset/init/password-reset-init';
import PasswordResetFinish from 'app/modules/account/password-reset/finish/password-reset-finish';
import Logout from 'app/modules/login/logout';
import EntitiesRoutes from 'app/entities/routes';
import PrivateRoute from 'app/shared/auth/private-route';
import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';
import PageNotFound from 'app/shared/error/page-not-found';
import { AUTHORITIES } from 'app/config/constants';
import Home from './pages/Home';
import TrouveAgent from './pages/TrouveAgent';
import VoirLagence from './pages/VoirLagence';

import EstimationRechercher from './features/estimation/EstimationSearch';
import Louer from 'app/pages/Louer';
import Estimation from 'app/features/estimation/Estimation';
import StreetStats from 'app/features/property/StreetStats';
import PropertyList from 'app/pages/PropertyList';
import SearchBar from 'app/layouts/SearchBar';
import { FilterState } from './types/filters';
import RecherchLouer from './features/property/PropertySearch';

const loading = <div>loading ...</div>;

const AppRoutes = () => {
  const [searchParams, setSearchParams] = useState({
    coordinates: null,
    address: null,
    isCity: false,
  });

  // **IMPORTANT**: Start with null filter state instead of default values
  // This allows the map to load without filters initially, then apply them when user chooses
  const [filterState, setFilterState] = useState<FilterState | null>(null);

  // Track if filter popup is open to close other popups
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // **KEY ADDITION**: Handle filter changes from PropertyList component
  const handleFiltersChange = (filters: FilterState | null) => {
    setFilterState(filters);
  };

  // **KEY ADDITION**: Handle search parameter changes
  const handleSearchParamsChange = (params: any) => {
    // Map SearchBar format to PropertyMap format
    const mappedParams = {
      coordinates: params.coordinates,
      address: params.fullAddress || (params.nomVoie ? `${params.numero || ''} ${params.nomVoie}`.trim() : null),
      isCity: params.isCity || false,
    };

    setSearchParams(mappedParams);
  };

  return (
    <div className="view-routes">
      <ErrorBoundaryRoutes>
        <Route index element={<Home />} />

        <Route
          path="/PrixImmobliers"
          element={
            <div className="flex flex-col h-[calc(100vh-80px)]">
              {/* Mobile-first Search Bar */}
              <SearchBar
                onSearch={handleSearchParamsChange}
                onFilterApply={setFilterState}
                currentFilters={filterState}
                onFilterOpenChange={setIsFilterOpen}
                onCloseOtherPopups={() => {}} // Pass empty function to enable popup closing
              />

              {/* Mobile: Full-screen map only, Desktop: Split view */}
              <div className="flex h-full overflow-hidden">
                {/* Mobile Layout - Map Only */}
                <div className="block md:hidden w-full h-full">
                  <PropertyList
                    searchParams={searchParams}
                    filterState={filterState}
                    onFiltersChange={handleFiltersChange}
                    isFilterOpen={isFilterOpen}
                  />
                </div>

                {/* Desktop Layout - Split View */}
                <div className="hidden md:flex w-full h-full shadow-lg border border-gray-200 rounded-lg overflow-hidden bg-white">
                  <PropertyList
                    searchParams={searchParams}
                    filterState={filterState}
                    onFiltersChange={handleFiltersChange}
                    isFilterOpen={isFilterOpen}
                  />
                </div>
              </div>
            </div>
          }
        />

        <Route path="/TrouverAgent" element={<TrouveAgent />} />
        <Route path="/VoirLagence" element={<VoirLagence />} />
        <Route path="/louer" element={<Louer />} />
        <Route path="/RecherchLouer" element={<RecherchLouer />} />
        <Route path="/estimation" element={<Estimation />} />
        <Route path="/streetStats" element={<StreetStats />} />
        <Route path="/EstimationRechercher" element={<EstimationRechercher />} />

        <Route path="*" element={<PageNotFound />} />
      </ErrorBoundaryRoutes>
    </div>
  );
};

export default AppRoutes;
