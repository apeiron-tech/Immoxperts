import React, { useMemo, useState } from 'react';
import PageHeaderPerformance from './components/PageHeaderPerformance';
import LayerContainer from './components/LayerContainer';
import KpiSmall from './components/KpiSmall';
import PipelineParEtape from './components/operationnelle/PipelineParEtape';
import ActivitePersonnelle from './components/operationnelle/ActivitePersonnelle';
import SourcesTable from './components/operationnelle/SourcesTable';
import CaParMois from './components/business/CaParMois';
import RepartitionCA from './components/business/RepartitionCA';
import TopDossiers from './components/business/TopDossiers';
import ZoneSelector from './components/marche/ZoneSelector';
import IndicateursMarche from './components/marche/IndicateursMarche';
import MarcheTiles from './components/marche/MarcheTiles';
import HypothesesInline from './components/marche/HypothesesInline';
import ObjectifsModal from './components/ObjectifsModal';
import { ComparisonKey, Hypotheses, MarcheZone, PeriodKey } from './types';
import { HYPOTHESES_DEFAUT, KPI_BUSINESS, KPI_OPERATIONNELLE, PART_CAPTEE_ACTUELLE, ZONES } from './_mocks/performance';
import { computeMarche } from './_utils/calculs';

const PerformancePage: React.FC = () => {
  const [period, setPeriod]                 = useState<PeriodKey>('30j');
  const [comparison, setComparison]         = useState<ComparisonKey>('periode');
  const [zone, setZone]                     = useState<MarcheZone>(ZONES[0]);
  const [hypotheses, setHypotheses]         = useState<Hypotheses>(HYPOTHESES_DEFAUT);
  const [objectifsOpen, setObjectifsOpen]   = useState(false);

  const calcs = useMemo(
    () => computeMarche(zone.transactions, hypotheses, PART_CAPTEE_ACTUELLE),
    [zone, hypotheses],
  );

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden">
      <PageHeaderPerformance
        period={period}
        onPeriodChange={setPeriod}
        comparison={comparison}
        onComparisonChange={setComparison}
        onOpenObjectifs={() => setObjectifsOpen(true)}
      />

      <div className="flex-1 min-h-0 px-2 py-2 grid grid-rows-[1fr_1fr_1fr] gap-2 overflow-hidden">
        <LayerContainer number={1} title="Performance opérationnelle" className="min-h-0 flex flex-col">
          <div className="grid grid-cols-7 gap-1.5 flex-shrink-0">
            {KPI_OPERATIONNELLE.map(k => <KpiSmall key={k.label} data={k} />)}
          </div>
          <div className="grid grid-cols-12 gap-2 flex-1 min-h-0">
            <div className="col-span-5 min-h-0"><PipelineParEtape /></div>
            <div className="col-span-4 min-h-0"><ActivitePersonnelle /></div>
            <div className="col-span-3 min-h-0"><SourcesTable /></div>
          </div>
        </LayerContainer>

        <LayerContainer number={2} title="Performance business" className="min-h-0 flex flex-col">
          <div className="grid grid-cols-6 gap-1.5 flex-shrink-0">
            {KPI_BUSINESS.map(k => <KpiSmall key={k.label} data={k} />)}
          </div>
          <div className="grid grid-cols-12 gap-2 flex-1 min-h-0">
            <div className="col-span-5 min-h-0"><CaParMois /></div>
            <div className="col-span-4 min-h-0"><RepartitionCA /></div>
            <div className="col-span-3 min-h-0"><TopDossiers /></div>
          </div>
        </LayerContainer>

        <LayerContainer number={3} title="Marché & potentiel" className="min-h-0 flex flex-col">
          <div className="grid grid-cols-12 gap-2 flex-shrink-0">
            <div className="col-span-3"><ZoneSelector zone={zone} onZoneChange={setZone} /></div>
            <div className="col-span-9"><IndicateursMarche /></div>
          </div>
          <MarcheTiles zone={zone} hypotheses={hypotheses} calcs={calcs} />
          <HypothesesInline hypotheses={hypotheses} onChange={setHypotheses} />
        </LayerContainer>
      </div>

      <ObjectifsModal isOpen={objectifsOpen} onClose={() => setObjectifsOpen(false)} />
    </div>
  );
};

export default PerformancePage;
