import React from 'react';
import { Route } from 'react-router';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import Adresse from './adresse';
import AdresseDetail from './adresse-detail';
import AdresseUpdate from './adresse-update';
import AdresseDeleteDialog from './adresse-delete-dialog';

const AdresseRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<Adresse />} />
    <Route path="new" element={<AdresseUpdate />} />
    <Route path=":id">
      <Route index element={<AdresseDetail />} />
      <Route path="edit" element={<AdresseUpdate />} />
      <Route path="delete" element={<AdresseDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default AdresseRoutes;
