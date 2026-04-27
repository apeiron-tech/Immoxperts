import React from 'react';
import SliderField from '../SliderField';
import { SimulatorInput } from '../lib/calcInvest';

interface Props {
  state: SimulatorInput;
  update: <K extends keyof SimulatorInput>(key: K, value: SimulatorInput[K]) => void;
}

const TabAchat: React.FC<Props> = ({ state, update }) => {
  return (
    <div className="space-y-6">
      <SliderField
        label="Prix d'achat"
        value={state.prix}
        onChange={v => update('prix', v)}
        min={50_000}
        max={1_500_000}
        step={5_000}
      />

      <div>
        <label className="block text-[14px] font-medium text-slate-700 mb-2">Frais d&rsquo;acquisition</label>
        <select
          value={state.fraisAcquisitionPct}
          onChange={e => update('fraisAcquisitionPct', Number(e.target.value) as 0.075 | 0.03)}
          className="w-full h-10 px-3 text-[13.5px] rounded-md border border-slate-200 focus:border-propsight-500 focus:ring-1 focus:ring-propsight-500 outline-none bg-white"
        >
          <option value={0.075}>Ancien (7,5 %)</option>
          <option value={0.03}>Neuf ou VEFA (3 %)</option>
        </select>
      </div>

      <SliderField
        label="Travaux"
        value={state.travaux}
        onChange={v => update('travaux', v)}
        min={0}
        max={300_000}
        step={1_000}
      />

      <div>
        <label className="block text-[14px] font-medium text-slate-700 mb-2">Ville (optionnel)</label>
        <input
          type="text"
          value={state.ville ?? ''}
          onChange={e => update('ville', e.target.value || null)}
          placeholder="Ex. Lyon, Bordeaux, Paris 15e"
          className="w-full h-10 px-3 text-[13.5px] rounded-md border border-slate-200 focus:border-propsight-500 focus:ring-1 focus:ring-propsight-500 outline-none bg-white"
        />
        <p className="mt-1 text-[12px] text-slate-500">Sert uniquement de label dans le récap.</p>
      </div>
    </div>
  );
};

export default TabAchat;
