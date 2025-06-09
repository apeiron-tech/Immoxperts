import React from 'react';
import { Route } from 'react-router';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import AdresseDispoparc from './adresse-dispoparc';
import AdresseDispoparcDetail from './adresse-dispoparc-detail';
import AdresseDispoparcUpdate from './adresse-dispoparc-update';
import AdresseDispoparcDeleteDialog from './adresse-dispoparc-delete-dialog';

const AdresseDispoparcRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<AdresseDispoparc />} />
    <Route path="new" element={<AdresseDispoparcUpdate />} />
    <Route path=":id">
      <Route index element={<AdresseDispoparcDetail />} />
      <Route path="edit" element={<AdresseDispoparcUpdate />} />
      <Route path="delete" element={<AdresseDispoparcDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default AdresseDispoparcRoutes;
