import React from 'react';
import { ArrowUpRight, FileBarChart, Info } from 'lucide-react';
import { Card, ProgressBar, PrimaryButton, SecondaryButton } from './primitives';
import type { DeliverableQualityAggregate, PortfolioItem } from '../types';

const CRITERIA_LABELS: Record<string, string> = {
  couverture_personnalisee: 'Couverture personnalisée',
  comparables_selectionnes: 'Comparables sélectionnés (≥ 3)',
  contexte_local_present: 'Contexte local',
  justification_avm: 'Justification écart AVM',
  relance_programmee: 'Relance après ouverture',
  branding_agence: 'Branding agence',
  photos_bien: 'Photos bien (≥ 3)',
};

const TYPE_LABELS: Record<string, string> = {
  avis_valeur: 'Avis de valeur',
  etude_locative: 'Étude locative',
  dossier_invest: 'Dossier invest.',
};

interface Props {
  aggregate: DeliverableQualityAggregate;
  selectedItem?: PortfolioItem | null;
  onViewIncomplete?: () => void;
  onOpenMethodology?: () => void;
}

const DeliverableQualityPanel: React.FC<Props> = ({
  aggregate,
  selectedItem,
  onViewIncomplete,
  onOpenMethodology,
}) => {
  return (
    <div className="flex flex-col min-h-0 h-full bg-white border border-slate-200 rounded-md overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 border-b border-slate-200 flex-shrink-0">
        <div className="flex items-center gap-1.5">
          <FileBarChart size={13} className="text-propsight-600" />
          <h3 className="text-[12.5px] font-semibold text-slate-800">Qualité des livrables</h3>
        </div>
        <button
          onClick={onOpenMethodology}
          className="text-[10.5px] text-propsight-700 hover:underline inline-flex items-center gap-0.5"
        >
          <Info size={10} />
          Voir le détail
        </button>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto p-3">
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] text-slate-600">Rapports complets</span>
            <span className="text-[14px] font-bold text-propsight-700 tabular-nums">
              {aggregate.taux_rapports_complets} %
            </span>
          </div>
          <ProgressBar value={aggregate.taux_rapports_complets} tone="violet" height={5} />
          <div className="text-[10px] text-slate-400 mt-1">
            Sur {aggregate.total_deliverables} rapports produits.
          </div>
        </div>

        <div className="mb-3">
          <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 mb-1.5">
            Taux par critère
          </div>
          {Object.entries(aggregate.by_criterion).map(([k, v]) => {
            const label = CRITERIA_LABELS[k] ?? k;
            const low = v < 50;
            return (
              <div key={k} className="mb-1.5">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-[10.5px] text-slate-600 truncate pr-2">{label}</span>
                  <span
                    className={`text-[11px] font-semibold tabular-nums ${low ? 'text-rose-600' : 'text-slate-700'}`}
                  >
                    {v} %
                  </span>
                </div>
                <ProgressBar
                  value={v}
                  tone={v >= 90 ? 'emerald' : v >= 60 ? 'violet' : low ? 'red' : 'orange'}
                  height={3}
                />
              </div>
            );
          })}
        </div>

        <div className="mb-3 pt-2 border-t border-slate-100">
          <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 mb-1.5">
            Par type
          </div>
          <div className="space-y-1.5">
            {aggregate.by_type.map(t => (
              <div key={t.type} className="flex items-center justify-between">
                <span className="text-[11px] text-slate-700">
                  {TYPE_LABELS[t.type] ?? t.type}{' '}
                  <span className="text-[10px] text-slate-400">({t.count} docs)</span>
                </span>
                <span className="text-[11.5px] font-semibold text-slate-800 tabular-nums">
                  {t.completeness_pct} %
                </span>
              </div>
            ))}
          </div>
        </div>

        {selectedItem && (
          <Card className="mt-3 border-propsight-200 bg-propsight-50/40">
            <div className="text-[10px] uppercase tracking-wider font-semibold text-propsight-700 mb-1">
              Objet sélectionné
            </div>
            <div className="text-[12px] font-semibold text-slate-800 truncate">
              {selectedItem.title}
            </div>
            <div className="text-[10.5px] text-slate-500 truncate">{selectedItem.adresse}</div>
            <div className="mt-2 text-[11px] text-slate-700">
              Complétude :{' '}
              <span className="font-semibold">{selectedItem.quality_score ?? '—'} / 100</span>
            </div>
            <div className="flex gap-1.5 mt-2">
              <PrimaryButton size="sm">Ouvrir</PrimaryButton>
              <SecondaryButton size="sm">Relancer</SecondaryButton>
              <SecondaryButton size="sm">Dupliquer</SecondaryButton>
            </div>
          </Card>
        )}
      </div>

      <div className="px-3 py-2 border-t border-slate-200 bg-slate-50 flex-shrink-0">
        <button
          onClick={onViewIncomplete}
          className="inline-flex items-center gap-1 text-[11px] text-propsight-700 hover:underline font-medium"
        >
          Voir rapports incomplets
          <ArrowUpRight size={11} />
        </button>
      </div>
    </div>
  );
};

export default DeliverableQualityPanel;
