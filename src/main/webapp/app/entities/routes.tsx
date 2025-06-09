import React from 'react';
import { Route } from 'react-router';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import Mutation from './mutation';
import Adresse from './adresse';
import Local from './local';
import Lot from './lot';
import DispositionParcelle from './disposition-parcelle';
import AdresseLocal from './adresse-local';
import AdresseDispoparc from './adresse-dispoparc';
/* jhipster-needle-add-route-import - JHipster will add routes here */

export default () => {
  return (
    <div>
      <ErrorBoundaryRoutes>
        {/* prettier-ignore */}
        <Route path="mutation/*" element={<Mutation />} />
        <Route path="adresse/*" element={<Adresse />} />
        <Route path="local/*" element={<Local />} />
        <Route path="lot/*" element={<Lot />} />
        <Route path="disposition-parcelle/*" element={<DispositionParcelle />} />
        <Route path="adresse-local/*" element={<AdresseLocal />} />
        <Route path="adresse-dispoparc/*" element={<AdresseDispoparc />} />
        {/* jhipster-needle-add-route-path - JHipster will add routes here */}
      </ErrorBoundaryRoutes>
    </div>
  );
};
