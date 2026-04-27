import React from 'react';
import PageHeaderPilotage from './components/PageHeaderPilotage';
import KpiBandeau from './components/KpiBandeau';
import ActionsPrioritaires from './components/ActionsPrioritaires';
import AgendaDuJour from './components/AgendaDuJour';
import LeadsChauds from './components/LeadsChauds';
import EntrantsRecents from './components/EntrantsRecents';
import SignauxATraiter from './components/SignauxATraiter';
import SynthesePipe from './components/SynthesePipe';
import DossiersEnCours from './components/DossiersEnCours';
import MandatsEcheance from './components/MandatsEcheance';

const PilotageCommercial: React.FC = () => {
  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden">
      <PageHeaderPilotage />

      <div className="flex-1 min-h-0 px-4 py-3 flex flex-col gap-3 overflow-hidden">
        <KpiBandeau />

        <div className="flex-1 min-h-0 grid grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)_minmax(0,1fr)] gap-3">
          <div className="min-h-0 h-full">
            <ActionsPrioritaires />
          </div>

          <div className="flex flex-col gap-3 min-h-0 h-full">
            <div className="flex-[3] min-h-0">
              <AgendaDuJour />
            </div>
            <div className="flex-[2] min-h-0">
              <LeadsChauds />
            </div>
          </div>

          <div className="flex flex-col gap-3 min-h-0 h-full overflow-y-auto">
            <div className="flex-shrink-0"><EntrantsRecents /></div>
            <div className="flex-shrink-0"><SignauxATraiter /></div>
            <div className="flex-shrink-0"><SynthesePipe /></div>
            <div className="flex-shrink-0"><DossiersEnCours /></div>
            <div className="flex-shrink-0"><MandatsEcheance /></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PilotageCommercial;
