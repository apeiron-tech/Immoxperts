import React from 'react';
import { Route } from 'react-router';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import Local from './local';
import LocalDetail from './local-detail';
import LocalUpdate from './local-update';
import LocalDeleteDialog from './local-delete-dialog';

const LocalRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<Local />} />
    <Route path="new" element={<LocalUpdate />} />
    <Route path=":id">
      <Route index element={<LocalDetail />} />
      <Route path="edit" element={<LocalUpdate />} />
      <Route path="delete" element={<LocalDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default LocalRoutes;
