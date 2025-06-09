import React from 'react';
import { Route } from 'react-router';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import DispositionParcelle from './disposition-parcelle';
import DispositionParcelleDetail from './disposition-parcelle-detail';
import DispositionParcelleUpdate from './disposition-parcelle-update';
import DispositionParcelleDeleteDialog from './disposition-parcelle-delete-dialog';

const DispositionParcelleRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<DispositionParcelle />} />
    <Route path="new" element={<DispositionParcelleUpdate />} />
    <Route path=":id">
      <Route index element={<DispositionParcelleDetail />} />
      <Route path="edit" element={<DispositionParcelleUpdate />} />
      <Route path="delete" element={<DispositionParcelleDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default DispositionParcelleRoutes;
