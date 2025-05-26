import React from 'react';
import { Route } from 'react-router';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import AdresseLocal from './adresse-local';
import AdresseLocalDetail from './adresse-local-detail';
import AdresseLocalUpdate from './adresse-local-update';
import AdresseLocalDeleteDialog from './adresse-local-delete-dialog';

const AdresseLocalRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<AdresseLocal />} />
    <Route path="new" element={<AdresseLocalUpdate />} />
    <Route path=":id">
      <Route index element={<AdresseLocalDetail />} />
      <Route path="edit" element={<AdresseLocalUpdate />} />
      <Route path="delete" element={<AdresseLocalDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default AdresseLocalRoutes;
