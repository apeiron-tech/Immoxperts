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
import RecherchLouer from 'app/features/property/PropertySearch';
import EstimationRechercher from './features/estimation/EstimationSearch';
import Louer from 'app/pages/Louer';
import Estimation from 'app/features/estimation/Estimation';
import StreetStats from 'app/features/property/StreetStats';
import PropertyList from 'app/pages/PropertyList';
import SearchBar from 'app/layouts/SearchBar';

// Filter state interface
interface FilterState {
  propertyTypes: {
    maison: boolean;
    terrain: boolean;
    appartement: boolean;
    biensMultiples: boolean;
    localCommercial: boolean;
  };
  roomCounts: {
    studio: boolean;
    deuxPieces: boolean;
    troisPieces: boolean;
    quatrePieces: boolean;
    cinqPiecesPlus: boolean;
  };
  priceRange: [number, number];
  surfaceRange: [number, number];
  pricePerSqmRange: [number, number];
  dateRange: [number, number];
}

const loading = <div>loading ...</div>;

// const Account = Loadable({
//   loader: () => import(/* webpackChunkName: "account" */ 'app/modules/account'),
//   loading: () => loading,
// });
//
// const Admin = Loadable({
//   loader: () => import(/* webpackChunkName: "administration" */ 'app/modules/administration'),
//   loading: () => loading,
// });

const AppRoutes = () => {
  const [searchParams, setSearchParams] = useState({
    numero: null,
    nomVoie: null,
    coordinates: null,
  });

  // Default filter state
  const [filterState, setFilterState] = useState<FilterState>({
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
    pricePerSqmRange: [0, 40000], // 0 to 40k €/m²
    dateRange: [0, 130], // January 2014 to December 2024 (months)
  });
  return (
    <div className="view-routes">
      <ErrorBoundaryRoutes>
        <Route index element={<Home />} />
        {/* <Route path="login" element={<Login />} />*/}
        {/* <Route path="logout" element={<Logout />} />*/}
        <Route
          path="/PrixImmobliers"
          element={
            <div className="flex flex-col h-full">
              <SearchBar onSearch={setSearchParams} onFilterApply={setFilterState} currentFilters={filterState} />
              <div className="flex h-full shadow-lg border border-gray-200 rounded-lg overflow-hidden bg-white">
                <PropertyList searchParams={searchParams} filterState={filterState} />
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
        {/* <Route path="account">
          <Route
            path="*"
            element={
              <PrivateRoute hasAnyAuthorities={[AUTHORITIES.ADMIN, AUTHORITIES.USER]}>
                <Account />
              </PrivateRoute>
            }
          />
          <Route path="register" element={<Register />} />
          <Route path="activate" element={<Activate />} />
          <Route path="reset">
            <Route path="request" element={<PasswordResetInit />} />
            <Route path="finish" element={<PasswordResetFinish />} />
          </Route>
        </Route>
        <Route
          path="admin/*"
          element={
            <PrivateRoute hasAnyAuthorities={[AUTHORITIES.ADMIN]}>
              <Admin />
            </PrivateRoute>
          }
        />
        <Route
          path="*"
          element={
            <PrivateRoute hasAnyAuthorities={[AUTHORITIES.USER]}>
              <EntitiesRoutes />
            </PrivateRoute>
          }
        /> */}
        <Route path="*" element={<PageNotFound />} />
      </ErrorBoundaryRoutes>
    </div>
  );
};

export default AppRoutes;
