import React from 'react';
import Donut from './Donut';
import { DONUT_NATURE, DONUT_TYPE_MANDAT } from '../../_mocks/performance';

const RepartitionCA: React.FC = () => (
  <section className="bg-white border border-slate-200 rounded h-full flex flex-col">
    <header className="px-2 py-1 border-b border-slate-200 flex-shrink-0">
      <h3 className="text-[11px] font-semibold text-slate-900">Répartition CA</h3>
    </header>

    <div className="p-2 grid grid-cols-1 gap-2 flex-1 content-start">
      <div>
        <p className="text-[9px] text-slate-500 mb-1">Par type de mandat</p>
        <Donut slices={DONUT_TYPE_MANDAT} />
      </div>
      <div>
        <p className="text-[9px] text-slate-500 mb-1">Par nature</p>
        <Donut slices={DONUT_NATURE} />
      </div>
    </div>
  </section>
);

export default RepartitionCA;
