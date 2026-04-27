import React from 'react';
import SliderField from '../SliderField';
import { SimulatorInput } from '../lib/calcInvest';

interface Props {
  state: SimulatorInput;
  update: <K extends keyof SimulatorInput>(key: K, value: SimulatorInput[K]) => void;
}

const DUREE_OPTIONS: SimulatorInput['dureeAnnees'][] = [10, 15, 20, 25];
const TMI_OPTIONS: SimulatorInput['tmi'][] = [0, 11, 30, 41, 45];

const TabFinancement: React.FC<Props> = ({ state, update }) => {
  return (
    <div className="space-y-6">
      <SliderField
        label="Apport"
        value={state.apport}
        onChange={v => update('apport', v)}
        min={0}
        max={500_000}
        step={1_000}
      />

      <SliderField
        label="Taux d'emprunt"
        value={state.tauxPct}
        onChange={v => update('tauxPct', v)}
        min={1}
        max={6}
        step={0.05}
        unit="%"
        decimals={2}
      />

      <div>
        <label className="block text-[14px] font-medium text-slate-700 mb-2">Durée du prêt</label>
        <select
          value={state.dureeAnnees}
          onChange={e => update('dureeAnnees', Number(e.target.value) as SimulatorInput['dureeAnnees'])}
          className="w-full h-10 px-3 text-[13.5px] rounded-md border border-slate-200 focus:border-propsight-500 focus:ring-1 focus:ring-propsight-500 outline-none bg-white"
        >
          {DUREE_OPTIONS.map(o => (
            <option key={o} value={o}>
              {o} ans
            </option>
          ))}
        </select>
      </div>

      <SliderField
        label="Assurance emprunteur"
        value={state.assurancePct}
        onChange={v => update('assurancePct', v)}
        min={0}
        max={1}
        step={0.01}
        unit="%"
        decimals={2}
      />

      <div>
        <label className="block text-[14px] font-medium text-slate-700 mb-2">
          Tranche marginale d&rsquo;imposition (TMI) <span className="text-slate-400 font-normal">+ 17,2 % prélèvements sociaux</span>
        </label>
        <select
          value={state.tmi}
          onChange={e => update('tmi', Number(e.target.value) as SimulatorInput['tmi'])}
          className="w-full h-10 px-3 text-[13.5px] rounded-md border border-slate-200 focus:border-propsight-500 focus:ring-1 focus:ring-propsight-500 outline-none bg-white"
        >
          {TMI_OPTIONS.map(o => (
            <option key={o} value={o}>
              {o} %
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default TabFinancement;
