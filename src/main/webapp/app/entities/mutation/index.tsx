import React from 'react';
import { Route } from 'react-router';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import Mutation from './mutation';
import MutationDetail from './mutation-detail';
import MutationUpdate from './mutation-update';
import MutationDeleteDialog from './mutation-delete-dialog';

const MutationRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<Mutation />} />
    <Route path="new" element={<MutationUpdate />} />
    <Route path=":id">
      <Route index element={<MutationDetail />} />
      <Route path="edit" element={<MutationUpdate />} />
      <Route path="delete" element={<MutationDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default MutationRoutes;
