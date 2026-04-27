import React, { useState } from 'react';
import { Copy, RefreshCw } from 'lucide-react';
import { SimulatorInput } from './lib/calcInvest';
import TabAchat from './tabs/TabAchat';
import TabExploitation from './tabs/TabExploitation';
import TabFinancement from './tabs/TabFinancement';

type TabId = 'achat' | 'exploitation' | 'financement';

const TABS: { id: TabId; label: string }[] = [
  { id: 'achat', label: 'Achat' },
  { id: 'exploitation', label: 'Exploitation' },
  { id: 'financement', label: 'Financement' },
];

interface Props {
  state: SimulatorInput;
  update: <K extends keyof SimulatorInput>(key: K, value: SimulatorInput[K]) => void;
  onReset: () => void;
  onCopyLink: () => void;
}

const SimulatorForm: React.FC<Props> = ({ state, update, onReset, onCopyLink }) => {
  const [active, setActive] = useState<TabId>('achat');

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 lg:p-8">
      <div className="border-b border-slate-200 -mx-6 -mt-6 lg:-mx-8 lg:-mt-8 px-6 lg:px-8 mb-6">
        <div role="tablist" aria-label="Étapes du simulateur" className="flex gap-1 overflow-x-auto">
          {TABS.map(tab => {
            const isActive = active === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                type="button"
                onClick={() => setActive(tab.id)}
                className={`relative h-11 px-4 text-[14px] font-medium transition-colors whitespace-nowrap ${
                  isActive ? 'text-propsight-700' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
                {isActive ? <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-propsight-600" /> : null}
              </button>
            );
          })}
        </div>
      </div>

      <div role="tabpanel">
        {active === 'achat' ? <TabAchat state={state} update={update} /> : null}
        {active === 'exploitation' ? <TabExploitation state={state} update={update} /> : null}
        {active === 'financement' ? <TabFinancement state={state} update={update} /> : null}
      </div>

      <div className="mt-8 pt-6 border-t border-slate-200 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 h-10 px-4 rounded-md border border-slate-200 text-[13px] font-medium text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <RefreshCw size={13} />
          Réinitialiser
        </button>
        <button
          type="button"
          onClick={onCopyLink}
          className="inline-flex items-center gap-2 h-10 px-4 rounded-md border border-slate-200 text-[13px] font-medium text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <Copy size={13} />
          Copier le lien
        </button>
      </div>
    </div>
  );
};

export default SimulatorForm;
