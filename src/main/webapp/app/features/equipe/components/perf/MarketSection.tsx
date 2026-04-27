import React from 'react';
import { Info } from 'lucide-react';
import { Chip, formatEuro } from '../primitives';
import type { MarcheZone } from '../../types';

interface Props {
  kpis: {
    marche_adressable: number;
    part_captee_pct: number;
    potentiel_ca_restant: number;
    zones_sous_exploitees: number;
    segments_a_attaquer: number;
  };
  zones: MarcheZone[];
}

const TONE_MAP = {
  violet: 'violet' as const,
  green: 'green' as const,
  orange: 'orange' as const,
  red: 'red' as const,
};

const MarketSection: React.FC<Props> = ({ kpis, zones }) => (
  <div className="flex flex-col gap-2 min-h-0">
    <div className="grid grid-cols-5 gap-2">
      {[
        { label: 'Marché adressable', value: `${kpis.marche_adressable.toFixed(1).replace('.', ',')} M€`, subtitle: '12 mois' },
        { label: 'Part captée', value: `${kpis.part_captee_pct} %`, subtitle: '+1,8 pts vs 1-30 avr.' },
        { label: 'Potentiel CA restant', value: `${kpis.potentiel_ca_restant.toFixed(1).replace('.', ',')} M€` },
        { label: 'Zones sous-exploitées', value: kpis.zones_sous_exploitees },
        { label: 'Segments à attaquer', value: kpis.segments_a_attaquer },
      ].map(k => (
        <div key={k.label} className="bg-white border border-slate-200 rounded-md px-3 py-2">
          <div className="text-[10.5px] text-slate-500">{k.label}</div>
          <div className="text-[17px] font-bold text-slate-900 tabular-nums leading-tight">{k.value}</div>
          {k.subtitle && <div className="text-[10px] text-slate-400">{k.subtitle}</div>}
        </div>
      ))}
    </div>

    <div className="bg-white border border-slate-200 rounded-md p-3 min-h-0">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5">
          <div className="text-[11.5px] font-semibold text-slate-800">Analyse par zone (12 mois)</div>
          <button className="text-slate-400 hover:text-slate-600" title="Méthodologie">
            <Info size={11} />
          </button>
        </div>
        <button className="text-[10.5px] text-propsight-700 hover:underline">Hypothèses</button>
      </div>
      <div
        className="grid items-center px-2 py-1 border-b border-slate-200 bg-slate-50 text-[9.5px] font-semibold text-slate-500 uppercase tracking-wider rounded-t-md"
        style={{
          gridTemplateColumns:
            'minmax(140px,1.4fr) 90px 100px 100px 110px 110px 110px',
        }}
      >
        <span>Zone</span>
        <span className="text-right">Marché 12 m</span>
        <span className="text-right">CA réalisé</span>
        <span className="text-right">Part captée</span>
        <span className="text-right">vs moy. marché</span>
        <span className="text-right">Potentiel</span>
        <span>Signal</span>
      </div>
      {zones.map(z => (
        <div
          key={z.zone_id}
          className="grid items-center px-2 py-1.5 border-b border-slate-100 text-[11px]"
          style={{
            gridTemplateColumns:
              'minmax(140px,1.4fr) 90px 100px 100px 110px 110px 110px',
          }}
        >
          <span className="text-slate-800 font-medium truncate">{z.label}</span>
          <span className="text-right text-slate-700 tabular-nums">
            {(z.volume_dvf_12m * 520 / 1000).toFixed(1).replace('.', ',')} M€
          </span>
          <span className="text-right text-slate-700 tabular-nums">{formatEuro(z.ca_realise_12m)}</span>
          <span className="text-right text-slate-800 font-semibold tabular-nums">
            {z.part_captee_pct.toFixed(1).replace('.', ',')} %
          </span>
          <span
            className={`text-right tabular-nums ${
              z.part_captee_pct < z.part_moyenne_marche_pct ? 'text-rose-600' : 'text-emerald-600'
            }`}
          >
            {(z.part_captee_pct - z.part_moyenne_marche_pct).toFixed(1).replace('.', ',')} pts
          </span>
          <span className="text-right text-slate-800 font-semibold tabular-nums">
            {formatEuro(z.potentiel_ca)}
          </span>
          <Chip tone={TONE_MAP[z.signal_tone]}>{z.signal_label}</Chip>
        </div>
      ))}
      <div
        className="grid items-center px-2 py-1.5 bg-slate-50 text-[11px] font-semibold"
        style={{ gridTemplateColumns: 'minmax(140px,1.4fr) 90px 100px 100px 110px 110px 110px' }}
      >
        <span className="text-slate-800">Total sélection</span>
        <span className="text-right tabular-nums text-slate-800">7,5 M€</span>
        <span className="text-right tabular-nums text-slate-800">1,22 M€</span>
        <span className="text-right tabular-nums text-propsight-700">16,3 %</span>
        <span className="text-right tabular-nums text-emerald-600">+0,7 pts</span>
        <span className="text-right tabular-nums text-propsight-700">6,28 M€</span>
        <span />
      </div>
    </div>
  </div>
);

export default MarketSection;
