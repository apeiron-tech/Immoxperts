import React from 'react';
import { ArrowUpRight, Users, FileText, Send, Mail, Zap } from 'lucide-react';
import { Chip, ProgressBar, SecondaryButton } from '../primitives';
import type { AdoptionCollaboratorRow, AdoptionMetric } from '../../types';

const TONE_MAP = {
  violet: 'violet' as const,
  green: 'green' as const,
  orange: 'orange' as const,
  red: 'red' as const,
  slate: 'slate' as const,
};

interface Props {
  metrics: AdoptionMetric[];
  rows: AdoptionCollaboratorRow[];
  objective?: {
    ca: { value: number; target: number };
    mandats: { value: number; target: number };
    mandats_exclusifs: { value: number; target: number };
    avis: { value: number; target: number };
    etudes: { value: number; target: number };
  };
}

const AdoptionSection: React.FC<Props> = ({ metrics, rows, objective }) => (
  <div className="grid grid-cols-[minmax(0,1.2fr)_minmax(320px,1fr)] gap-2 min-h-0">
    <div className="bg-white border border-slate-200 rounded-md p-3 min-h-0 flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <div className="text-[11.5px] font-semibold text-slate-800">Adoption équipe (30 j)</div>
        <a href="#" className="text-[10.5px] text-propsight-700 hover:underline flex items-center gap-0.5">
          Voir détail
          <ArrowUpRight size={11} />
        </a>
      </div>
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="bg-slate-50 rounded-md p-2 flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-propsight-100 text-propsight-600 flex items-center justify-center">
            <Users size={13} />
          </div>
          <div>
            <div className="text-[10px] text-slate-500">Utilisateurs actifs (30 j)</div>
            <div className="text-[13px] font-bold text-slate-800">75 %</div>
          </div>
        </div>
        {[
          { label: 'Estimations créées', val: 126, delta: '+16 %', Icon: FileText },
          { label: 'Rapports envoyés', val: 68, delta: '+21 %', Icon: Send },
          { label: 'Mandats créés', val: 32, delta: '+14 %', Icon: Mail },
        ].map(m => (
          <div key={m.label} className="bg-slate-50 rounded-md p-2 flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-slate-200 text-slate-600 flex items-center justify-center">
              <m.Icon size={13} />
            </div>
            <div>
              <div className="text-[10px] text-slate-500">{m.label}</div>
              <div className="text-[13px] font-bold text-slate-800 leading-tight">
                {m.val} <span className="text-[9.5px] font-normal text-emerald-600">{m.delta}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {objective && (
        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between mb-1.5">
            <div className="text-[10.5px] uppercase tracking-wider font-semibold text-slate-500">
              Objectif Q2 2026
            </div>
            <a href="#" className="text-[10.5px] text-propsight-700 hover:underline">
              Éditer
            </a>
          </div>
          <div className="space-y-1.5">
            {[
              {
                label: 'CA',
                val: objective.ca.value,
                tgt: objective.ca.target,
                fmt: (v: number) => `${(v / 1000).toFixed(0)} k€`,
              },
              {
                label: 'Mandats signés',
                val: objective.mandats.value,
                tgt: objective.mandats.target,
                fmt: (v: number) => v.toString(),
              },
              {
                label: 'Mandats exclusifs',
                val: objective.mandats_exclusifs.value,
                tgt: objective.mandats_exclusifs.target,
                fmt: (v: number) => v.toString(),
              },
              {
                label: 'AdV envoyés',
                val: objective.avis.value,
                tgt: objective.avis.target,
                fmt: (v: number) => v.toString(),
              },
              {
                label: 'Études locatives',
                val: objective.etudes.value,
                tgt: objective.etudes.target,
                fmt: (v: number) => v.toString(),
              },
            ].map(o => {
              const pct = Math.round((o.val / o.tgt) * 100);
              return (
                <div key={o.label}>
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[10.5px] text-slate-600">{o.label}</span>
                    <span className="text-[10.5px] text-slate-700 tabular-nums">
                      {o.fmt(o.val)} / {o.fmt(o.tgt)}
                      <span className="ml-1 font-semibold text-propsight-700">{pct} %</span>
                    </span>
                  </div>
                  <ProgressBar value={pct} tone="violet" height={3} />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>

    <div className="bg-white border border-slate-200 rounded-md p-3 min-h-0 flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <div className="text-[11.5px] font-semibold text-slate-800">Adoption → business (30 j)</div>
        <button className="text-[10.5px] text-propsight-700 hover:underline">Voir tout</button>
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto">
        <div
          className="grid items-center px-2 py-1 border-b border-slate-200 bg-slate-50 text-[9.5px] font-semibold text-slate-500 uppercase tracking-wider"
          style={{ gridTemplateColumns: 'minmax(110px,1.2fr) 60px 70px 60px 60px 60px minmax(100px,1.1fr)' }}
        >
          <span>Collab.</span>
          <span className="text-right">Estim.</span>
          <span className="text-right">Env.</span>
          <span className="text-right">Ouv.</span>
          <span className="text-right">Rel.</span>
          <span className="text-right">Mand.</span>
          <span>Signal</span>
        </div>
        {rows.map(r => (
          <div
            key={r.collaborator_id}
            className="grid items-center px-2 py-1.5 border-b border-slate-100 text-[11px] hover:bg-slate-50"
            style={{ gridTemplateColumns: 'minmax(110px,1.2fr) 60px 70px 60px 60px 60px minmax(100px,1.1fr)' }}
          >
            <span className="text-slate-800 font-medium truncate">{r.collaborator_label}</span>
            <span className="text-right text-slate-700 tabular-nums">{r.estimations}</span>
            <span className="text-right text-slate-700 tabular-nums">{r.rapports_envoyes}</span>
            <span className="text-right text-slate-700 tabular-nums">{r.rapports_ouverts}</span>
            <span className="text-right text-slate-700 tabular-nums">{r.relances}</span>
            <span className="text-right text-slate-800 font-semibold tabular-nums">{r.mandats}</span>
            <Chip tone={TONE_MAP[r.signal_tone]}>{r.signal_label}</Chip>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default AdoptionSection;
